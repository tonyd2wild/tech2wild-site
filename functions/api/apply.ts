// Cloudflare Pages Function: POST /api/apply
// Receives "Join the Lab" applications, verifies Turnstile, vets the GitHub account,
// stores the row in D1 and (optionally) posts a card to Discord.

interface Env {
  DB: D1Database
  TURNSTILE_SECRET: string
  DISCORD_WEBHOOK?: string
  GITHUB_TOKEN?: string
}

interface Application {
  name: string
  email: string
  x: string
  github: string
  hardware: string[]
  hardwareNotes: string
  lanes: string[]
  link: string
  hours: string
  why: string
  consent: boolean
  website?: string // honeypot
  turnstile: string
}

const HARDWARE = ['DGX Spark', 'RTX 3090', 'RTX 4090', 'RTX 5090', 'Other NVIDIA', 'Apple Silicon', 'None yet']
const LANES = ['Spark recipes', '3090 recipes', 'Tools & dashboards', 'Agents & harness', 'Eval & benchmarks', 'Video & content']
const HOURS = ['<5', '5-10', '10-20', '20+']
const KEYWORDS = ['vllm', 'sglang', 'llama', 'gguf', 'cuda', 'triton', 'dgx', 'spark', 'quant', 'nvfp4', 'awq', 'gptq', 'inference', 'agent', 'mcp', 'lora', 'transformers', 'pytorch', 'tensorrt', 'exllama', 'mlx', 'openclaw', 'harness']

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const pick = (arr: unknown, allowed: string[]) => (Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string' && allowed.includes(x)) : [])

async function ensureSchema(db: D1Database) {
  await db.exec(`CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    x_handle TEXT NOT NULL,
    github TEXT NOT NULL,
    hardware TEXT NOT NULL,
    hardware_notes TEXT,
    lanes TEXT NOT NULL,
    link TEXT,
    hours TEXT,
    why TEXT,
    gh_score INTEGER,
    gh_summary TEXT,
    gh_json TEXT,
    ip TEXT,
    country TEXT,
    user_agent TEXT
  )`.replace(/\n\s*/g, ' '))
}

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  const data = (await r.json()) as { success: boolean; 'error-codes'?: string[] }
  return data
}

interface GhVet { ok: boolean; score: number; summary: string; data?: Record<string, unknown> }

async function vetGithub(login: string, token?: string): Promise<GhVet> {
  const headers: Record<string, string> = { 'user-agent': 'tech2wild-join/1.0', accept: 'application/vnd.github+json' }
  if (token) headers.authorization = `Bearer ${token}`
  try {
    const u = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, { headers })
    if (u.status === 404) return { ok: false, score: 0, summary: 'GitHub account not found' }
    if (!u.ok) return { ok: false, score: 0, summary: `GitHub lookup failed (${u.status})` }
    const user = (await u.json()) as Record<string, unknown>
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100&sort=pushed&type=owner`, { headers })
    const repos = r.ok ? ((await r.json()) as Record<string, unknown>[]) : []

    const created = new Date(String(user.created_at))
    const ageDays = Math.max(0, Math.round((Date.now() - created.getTime()) / 86400000))
    const followers = Number(user.followers ?? 0)
    const publicRepos = Number(user.public_repos ?? 0)
    const own = repos.filter((x) => !x.fork)
    const stars = own.reduce((a, x) => a + Number(x.stargazers_count ?? 0), 0)
    const langs = new Map<string, number>()
    for (const x of own) if (typeof x.language === 'string') langs.set(x.language, (langs.get(x.language) ?? 0) + 1)
    const topLangs = [...langs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l)
    const lastPush = repos.length ? String(repos[0].pushed_at) : null
    const daysSincePush = lastPush ? Math.round((Date.now() - new Date(lastPush).getTime()) / 86400000) : null
    const hits = new Set<string>()
    for (const x of own) {
      const hay = `${x.name} ${x.description ?? ''} ${(x.topics as string[] | undefined)?.join(' ') ?? ''}`.toLowerCase()
      for (const k of KEYWORDS) if (hay.includes(k)) hits.add(k)
    }

    let score = 0
    score += Math.min(20, ageDays / 36.5)                  // up to 20 for a 2-year-old account
    score += Math.min(15, own.length * 1.5)                // up to 15 for 10+ original repos
    score += Math.min(20, Math.log2(stars + 1) * 3)        // ~20 at 100 stars
    score += Math.min(10, Math.log2(followers + 1) * 2)    // ~10 at 32 followers
    score += daysSincePush == null ? 0 : daysSincePush < 30 ? 15 : daysSincePush < 120 ? 8 : 2
    score += Math.min(20, hits.size * 4)                   // local-AI relevance
    score = Math.round(Math.min(100, score))

    const summary = [
      `${ageDays}d old`, `${own.length} repos`, `${stars}★`, `${followers} followers`,
      daysSincePush == null ? 'no pushes' : `last push ${daysSincePush}d ago`,
      topLangs.length ? topLangs.join('/') : 'no langs',
      hits.size ? `relevance: ${[...hits].slice(0, 6).join(', ')}` : 'no local-AI signals',
    ].join(' · ')

    return { ok: true, score, summary, data: { login: user.login, name: user.name, bio: user.bio, company: user.company, location: user.location, blog: user.blog, twitter: user.twitter_username, avatar: user.avatar_url, created_at: user.created_at, public_repos: publicRepos, followers, stars, topLangs, lastPush, hits: [...hits], topRepos: own.slice(0, 8).map((x) => ({ name: x.name, stars: x.stargazers_count, lang: x.language, desc: x.description })) } }
  } catch (e) {
    return { ok: false, score: 0, summary: `GitHub lookup error: ${(e as Error).message}` }
  }
}

async function postDiscord(webhook: string, id: string, a: Application, vet: GhVet, meta: { ip: string | null; country: string | null }) {
  const gh = a.github
  const color = vet.score >= 60 ? 0xc8ff3d : vet.score >= 30 ? 0xffb03b : 0xff5c2a
  const embed = {
    title: `New lab application: ${a.name}`,
    color,
    fields: [
      { name: 'GitHub', value: `[${gh}](https://github.com/${gh})`, inline: true },
      { name: 'X', value: `[@${a.x}](https://x.com/${a.x})`, inline: true },
      { name: 'Email', value: a.email, inline: true },
      { name: 'Hardware', value: [a.hardware.join(', ') || '—', a.hardwareNotes].filter(Boolean).join('\n'), inline: false },
      { name: 'Lanes', value: a.lanes.join(', ') || '—', inline: true },
      { name: 'Hours / week', value: a.hours || '—', inline: true },
      { name: 'Link', value: a.link || '—', inline: false },
      { name: 'Why', value: a.why.slice(0, 1000) || '—', inline: false },
      { name: `GitHub vet score: ${vet.score}/100`, value: vet.summary, inline: false },
      { name: 'Meta', value: `id \`${id}\` · ${meta.country ?? '?'} · ${meta.ip ?? '?'}`, inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'tech2wild.com/join · react ✅ to approve, ❌ to pass' },
  }
  await fetch(webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'Tech2Wild Lab', embeds: [embed] }) }).catch(() => {})
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ ok: false, error: 'Expected JSON' }, 415)
  let body: Partial<Application>
  try { body = (await request.json()) as Partial<Application> } catch { return json({ ok: false, error: 'Bad JSON' }, 400) }

  // Honeypot: bots fill every field. Pretend success, store nothing.
  if (clean(body.website, 10)) return json({ ok: true, id: 'ok' })

  const a: Application = {
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    x: clean(body.x, 40).replace(/^@/, '').replace(/^https?:\/\/(x|twitter)\.com\//i, ''),
    github: clean(body.github, 60).replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, ''),
    hardware: pick(body.hardware, HARDWARE),
    hardwareNotes: clean(body.hardwareNotes, 300),
    lanes: pick(body.lanes, LANES),
    link: clean(body.link, 300),
    hours: HOURS.includes(String(body.hours)) ? String(body.hours) : '',
    why: clean(body.why, 1200),
    consent: body.consent === true,
    turnstile: clean(body.turnstile, 3000),
  }

  const errors: string[] = []
  if (a.name.length < 2) errors.push('name')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email)) errors.push('email')
  if (!/^[A-Za-z0-9_]{1,15}$/.test(a.x)) errors.push('x')
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(a.github)) errors.push('github')
  if (a.lanes.length === 0) errors.push('lanes')
  if (a.why.length < 20) errors.push('why')
  if (!a.consent) errors.push('consent')
  if (a.link && !/^https?:\/\//i.test(a.link)) errors.push('link')
  if (!a.turnstile) errors.push('turnstile')
  if (errors.length) return json({ ok: false, error: 'Please check the highlighted fields.', fields: errors }, 422)

  const ip = request.headers.get('cf-connecting-ip')
  const country = request.headers.get('cf-ipcountry')
  const ua = request.headers.get('user-agent')?.slice(0, 300) ?? null

  if (!env.TURNSTILE_SECRET) return json({ ok: false, error: 'Form is not configured yet (missing Turnstile secret).' }, 500)
  const ts = await verifyTurnstile(env.TURNSTILE_SECRET, a.turnstile, ip)
  if (!ts.success) return json({ ok: false, error: 'Bot check failed. Reload and try again.', fields: ['turnstile'] }, 403)

  await ensureSchema(env.DB)

  const dup = await env.DB.prepare(`SELECT id FROM applications WHERE email = ?1 OR lower(github) = lower(?2) LIMIT 1`).bind(a.email, a.github).first<{ id: string }>()
  if (dup) return json({ ok: false, error: 'We already have an application for that email or GitHub account. We will be in touch.' }, 409)

  const vet = await vetGithub(a.github, env.GITHUB_TOKEN)
  const id = crypto.randomUUID().slice(0, 8)
  const now = new Date().toISOString()

  await env.DB.prepare(`INSERT INTO applications (id, created_at, status, name, email, x_handle, github, hardware, hardware_notes, lanes, link, hours, why, gh_score, gh_summary, gh_json, ip, country, user_agent)
    VALUES (?1, ?2, 'new', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)`)
    .bind(id, now, a.name, a.email, a.x, a.github, JSON.stringify(a.hardware), a.hardwareNotes, JSON.stringify(a.lanes), a.link, a.hours, a.why, vet.score, vet.summary, vet.data ? JSON.stringify(vet.data) : null, ip, country, ua)
    .run()

  if (env.DISCORD_WEBHOOK) await postDiscord(env.DISCORD_WEBHOOK, id, a, vet, { ip, country })

  return json({ ok: true, id })
}

export const onRequest = async ({ request }: { request: Request }) =>
  request.method === 'POST' ? undefined : json({ ok: false, error: 'POST only' }, 405)
