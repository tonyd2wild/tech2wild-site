#!/usr/bin/env node
/**
 * tech2wild.com content sweep.
 *
 *   npm run sweep            dry run: prints what changed, writes .sweep/report.md
 *   npm run sweep -- --apply also rewrites star counts / push dates / channel stats in src/data
 *
 * Sources (no keys needed):
 *   - GitHub REST API  (repos, stars, descriptions, push dates)      -> src/data/repos.ts, src/data/models.ts
 *   - YouTube RSS feed (latest 15 uploads: id, title, date)           -> src/data/videos.ts (new videos listed for review)
 * Optional keys (set in env or .env):
 *   - GITHUB_TOKEN       raises GitHub rate limit from 60/h to 5000/h
 *   - YOUTUBE_API_KEY    adds duration + view counts + channel stats (YouTube Data API v3)
 *   - CF_API_TOKEN, CF_ACCOUNT_ID   lets the report include new "Join the Lab" applications from D1
 *
 * The script never invents numbers. Anything it cannot fetch is listed in the report as TODO for the agent.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')
const today = new Date().toISOString().slice(0, 10)
const GH_USER = 'tonyd2wild'
const YT_CHANNEL = 'UCOJIGngtr4zcPuuZX6dO8aQ'
const D1_ID = '4a79850c-b517-420a-8e28-7a9a3209574d'

loadDotEnv()
const report = []
const log = (s = '') => { report.push(s); console.log(s) }
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s)

// ---------------------------------------------------------------- GitHub
async function gh(url) {
  const headers = { 'user-agent': 'tech2wild-sweep', accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const r = await fetch(url, { headers })
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${url}`)
  return r.json()
}

async function sweepGithub() {
  log(`## GitHub (@${GH_USER})`)
  const user = await gh(`https://api.github.com/users/${GH_USER}`)
  const repos = []
  for (let page = 1; page <= 3; page++) {
    const batch = await gh(`https://api.github.com/users/${GH_USER}/repos?per_page=100&page=${page}`)
    repos.push(...batch)
    if (batch.length < 100) break
  }
  log(`- public repos: ${user.public_repos} · followers: ${user.followers} · fetched: ${repos.length}`)

  let reposTs = read('src/data/repos.ts')
  let modelsTs = read('src/data/models.ts')
  const known = new Set([...reposTs.matchAll(/\{ name: '([^']+)'/g)].map((m) => m[1]))
  const byName = new Map(repos.map((r) => [r.name, r]))
  // Repos reviewed and intentionally left off the site (superseded lanes, scratch, unrelated). Add to this list
  // instead of deleting the report line, so the next sweep stays quiet about them.
  const SKIP = new Set(read('scripts/sweep-ignore.txt').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#')))

  // 1) refresh stars + pushed for known repos (repos.ts) and stars in models.ts
  let starChanges = 0
  for (const name of known) {
    const r = byName.get(name)
    if (!r) { log(`- ⚠ ${name} is in repos.ts but no longer on GitHub (renamed/deleted?)`); continue }
    const pushed = r.pushed_at.slice(0, 10)
    const lineRe = new RegExp(`(\\{ name: '${escapeRe(name)}'[^\\n]*?stars: )(\\d+)([^\\n]*?pushed: ')([^']*)(')`)
    reposTs = reposTs.replace(lineRe, (_, a, stars, b, oldPushed, c) => {
      if (Number(stars) !== r.stargazers_count || oldPushed !== pushed) starChanges++
      return `${a}${r.stargazers_count}${b}${pushed}${c}`
    })
    const modelRe = new RegExp(`(repo: '${escapeRe(name)}', stars: )(\\d+)`, 'g')
    modelsTs = modelsTs.replace(modelRe, (_, a) => `${a}${r.stargazers_count}`)
  }
  reposTs = reposTs
    .replace(/publicRepos: \d+/, `publicRepos: ${user.public_repos}`)
    .replace(/followers: \d+/, `followers: ${user.followers}`)
    .replace(/asOf: '[^']*'/, `asOf: '${today}'`)
    .replace(/\/\/ Snapshot: [0-9-]+ \(GitHub API\)/, `// Snapshot: ${today} (GitHub API)`)
  log(`- star/push-date changes on known repos: ${starChanges}${APPLY ? ' (applied)' : ' (dry run, pass --apply)'}`)

  // 2) new repos not yet in repos.ts
  const fresh = repos.filter((r) => !known.has(r.name) && !SKIP.has(r.name) && !r.fork).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
  if (fresh.length) {
    log(`- NEW repos not in src/data/repos.ts (${fresh.length}) — add the relevant ones, or list them in scripts/sweep-ignore.txt:`)
    for (const r of fresh) log(`  - ${r.name} · ★${r.stargazers_count} · ${r.language ?? '—'} · pushed ${r.pushed_at.slice(0, 10)}\n    ${r.description ?? '(no description)'}`)
  } else log('- no new repos')

  // 3) repos whose description changed (often means new numbers in the README)
  const changedDesc = []
  for (const m of reposTs.matchAll(/\{ name: '([^']+)', desc: '((?:[^'\\]|\\.)*)'/g)) {
    const r = byName.get(m[1])
    if (!r?.description) continue
    const a = norm(r.description), b = norm(m[2])
    const overlap = jaccard(a, b)
    if (overlap < 0.35) changedDesc.push({ name: m[1], gh: r.description })
  }
  if (changedDesc.length) {
    log(`- repos whose GitHub description drifted from the site copy (${changedDesc.length}) — re-read the README, numbers may have changed:`)
    for (const c of changedDesc) log(`  - ${c.name}\n    GitHub: ${c.gh}`)
  }

  // 4) recently pushed repos that back a deployment card (numbers may have moved)
  const recent = repos.filter((r) => Date.now() - new Date(r.pushed_at).getTime() < 8 * 86400000 && modelsTs.includes(`repo: '${r.name}'`))
  if (recent.length) {
    log(`- deployment repos pushed in the last 8 days — verify tok/s, context, KV against the README:`)
    for (const r of recent) log(`  - ${r.name} (${r.pushed_at.slice(0, 10)})`)
  }

  if (APPLY) { write('src/data/repos.ts', reposTs); write('src/data/models.ts', modelsTs) }
  log()
}

// ---------------------------------------------------------------- YouTube
async function sweepYoutube() {
  log('## YouTube (Tech2WiLD)')
  const xml = await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`)).text()
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => ({
    id: m[1].match(/<yt:videoId>([^<]+)/)?.[1],
    title: decode(m[1].match(/<title>([^<]*)/)?.[1] ?? ''),
    published: m[1].match(/<published>([^<]+)/)?.[1]?.slice(0, 10),
  })).filter((e) => e.id)
  let videosTs = read('src/data/videos.ts')
  const known = new Set([...videosTs.matchAll(/id: '([^']+)'/g)].map((m) => m[1]))
  const fresh = entries.filter((e) => !known.has(e.id))

  let stats = null
  if (process.env.YOUTUBE_API_KEY) {
    const key = process.env.YOUTUBE_API_KEY
    const ch = await (await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YT_CHANNEL}&key=${key}`)).json()
    stats = ch.items?.[0]?.statistics
    if (stats) {
      log(`- channel: ${Number(stats.subscriberCount).toLocaleString()} subs · ${Number(stats.viewCount).toLocaleString()} views · ${stats.videoCount} videos`)
      videosTs = videosTs
        .replace(/subscribers: \d+/, `subscribers: ${stats.subscriberCount}`)
        .replace(/views: (\d+),\n  videoCount/, `views: ${stats.viewCount},\n  videoCount`)
        .replace(/videoCount: \d+/, `videoCount: ${stats.videoCount}`)
        .replace(/asOf: '[^']*'/, `asOf: '${today}'`)
    }
    if (fresh.length) {
      const ids = fresh.map((f) => f.id).join(',')
      const v = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${key}`)).json()
      for (const item of v.items ?? []) {
        const f = fresh.find((x) => x.id === item.id)
        if (f) { f.duration = isoDur(item.contentDetails.duration); f.views = Number(item.statistics.viewCount) }
      }
    }
  } else log('- (no YOUTUBE_API_KEY: channel stats and view counts/durations not refreshed — RSS gives id/title/date only)')

  if (fresh.length) {
    log(`- NEW videos not in src/data/videos.ts (${fresh.length}) — add at the top of the array, newest first:`)
    for (const f of fresh) {
      const cat = guessCategory(f.title)
      log(`  { id: '${f.id}', title: ${JSON.stringify(f.title)}, date: '${f.published}', category: '${cat}', duration: '${f.duration ?? 'TODO'}'${f.views ? `, views: ${f.views}` : ''} },`)
    }
    log('  → Shorts (under 60 s) do not belong on the site; skip them. Mark 1–2 strong new ones featured: true.')
  } else log('- no new videos')
  if (APPLY && stats) write('src/data/videos.ts', videosTs)
  log()
}

// ---------------------------------------------------------------- X
function sweepX() {
  log('## X (@Tech2Wild)')
  const postsTs = read('src/data/posts.ts')
  const dates = [...postsTs.matchAll(/date: '([^']+)'/g)].map((m) => m[1]).sort()
  log(`- newest post on the site: ${dates.at(-1)} · ${dates.length} posts total`)
  log('- X has no free read API. Open https://x.com/Tech2Wild (browser or ask Tony), pick posts since that date about')
  log('  benchmarks / launches / hardware / releases, and add them to src/data/posts.ts. Date = snowflake:')
  log('  new Date(Number((BigInt(id) >> 22n) + 1288834974657n)).toISOString().slice(0,10)')
  log()
}

// ---------------------------------------------------------------- Applications (D1)
async function sweepApplications() {
  log('## Join the Lab applications (D1)')
  const { CF_API_TOKEN, CF_ACCOUNT_ID } = process.env
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) { log('- (no CF_API_TOKEN / CF_ACCOUNT_ID: check the D1 console in the Cloudflare dashboard instead)\n'); return }
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${D1_ID}/query`, {
    method: 'POST', headers: { authorization: `Bearer ${CF_API_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ sql: "SELECT id, created_at, status, name, x_handle, github, gh_score, gh_summary, lanes FROM applications WHERE status = 'new' ORDER BY created_at DESC LIMIT 25" }),
  })
  const data = await r.json()
  const rows = data.result?.[0]?.results ?? []
  log(`- new applications awaiting review: ${rows.length}`)
  for (const a of rows) log(`  - ${a.id} · ${a.created_at.slice(0, 10)} · ${a.name} · gh:${a.github} · x:@${a.x_handle} · score ${a.gh_score} · ${a.lanes}\n    ${a.gh_summary}`)
  log()
}

// ---------------------------------------------------------------- helpers
function loadDotEnv() {
  const p = path.join(ROOT, '.env')
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const norm = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3))
const jaccard = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / (a.size + b.size - i || 1) }
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
function isoDur(d) { const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/); const [h, mi, s] = [m[1], m[2], m[3]].map((x) => Number(x ?? 0)); return h ? `${h}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${mi}:${String(s).padStart(2, '0')}` }
function guessCategory(t) {
  const s = t.toLowerCase()
  if (/deepseek/.test(s)) return 'DeepSeek'
  if (/glm/.test(s)) return 'GLM'
  if (/qwen/.test(s)) return 'Qwen'
  if (/vs\.?|benchmark|tested|beat/.test(s)) return 'Benchmarks'
  if (/3090|spark|nvidia|rig|nvlink|m5|gpu|cluster|hardware/.test(s)) return 'Hardware'
  if (/agent|harness|openclaw|hermes|mcp/.test(s)) return 'Agents'
  if (/video|minimax h3|image/.test(s)) return 'Video Gen'
  if (/live|launch day/.test(s)) return 'Live'
  return 'Opinion'
}

// ---------------------------------------------------------------- run
log(`# tech2wild.com sweep — ${today}${APPLY ? ' (apply)' : ' (dry run)'}\n`)
try { await sweepGithub() } catch (e) { log(`- GitHub sweep failed: ${e.message}\n`) }
try { await sweepYoutube() } catch (e) { log(`- YouTube sweep failed: ${e.message}\n`) }
sweepX()
try { await sweepApplications() } catch (e) { log(`- D1 check failed: ${e.message}\n`) }
log('## Next steps for the agent\n- Read skills/tech2wild-site-sweep/SKILL.md and work through the report above.\n- Then: npm run build → commit → push → verify https://tech2wild.com.')
fs.mkdirSync(path.join(ROOT, '.sweep'), { recursive: true })
write('.sweep/report.md', report.join('\n') + '\n')
console.log(`\nreport written to .sweep/report.md`)
