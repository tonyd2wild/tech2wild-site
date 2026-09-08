---
name: tech2wild-site-sweep
description: Keep tech2wild.com current. Pull new GitHub repos/stars, YouTube uploads/stats, X posts and Join-the-Lab applications, update the site's data files with real numbers only, verify, deploy, and report. Use when Tony says "update the site", "run a sweep", "add the new video/repo", or on a schedule.
---

# tech2wild.com sweep

You are updating a live, public website for Tony (Tech2Wild). The site is a Vite + React app whose content lives in plain TypeScript data files. **Everything on the page must be traceable to a public source** (a repo README, a YouTube upload, a post on X). Never invent or round-trip numbers from memory.

## Where things are

| Thing | Path |
|---|---|
| Repo (local) | `C:\Users\tonyd\tech2wild-site` — remote `github.com/tonyd2wild/tech2wild-site`, branch `main` |
| Live site | https://tech2wild.com (Cloudflare Pages; every push to `main` deploys in 1–6 min) |
| Repos index | `src/data/repos.ts` |
| Deployment cards (models, tok/s, ctx, KV) | `src/data/models.ts` |
| Videos + channel stats | `src/data/videos.ts` |
| X posts | `src/data/posts.ts` |
| Featured experiments (editorial) | `src/data/experiments.ts` |
| Lab map nodes | `src/data/lab.ts` |
| Ticker strip | `src/sections/Ticker.tsx` (`stats` array) |
| Join form + API | `src/sections/Join.tsx`, `functions/api/apply.ts`, D1 `tech2wild-lab` |
| Deploy/infra notes | `DEPLOY.md` |
| Sweep script | `scripts/sweep.mjs` (`npm run sweep`, `npm run sweep -- --apply`) |

Do **not** edit: `wrangler.toml` IDs, `src/data/config.ts` keys, `public/og.jpg`, anything under `functions/` unless the task is about the form.

## Keys (all optional)

Put them in `C:\Users\tonyd\tech2wild-site\.env` (gitignored). See `.env.example`.

| Key | Used for | Without it |
|---|---|---|
| `GITHUB_TOKEN` | GitHub API rate limit 5000/h | 60/h unauthenticated, fine for one sweep |
| `YOUTUBE_API_KEY` | durations, view counts, channel stats | RSS still gives new video ids/titles/dates; fill duration by opening the video |
| `CF_API_TOKEN`, `CF_ACCOUNT_ID` | list new applications from D1 | read them in the Cloudflare dashboard D1 console |

There is no free X read API. X posts are gathered by looking at https://x.com/Tech2Wild or by Tony pasting them.

## Procedure

### 1. Pull

```bash
cd C:\Users\tonyd\tech2wild-site
git pull --ff-only
npm install
npm run sweep -- --apply
```

`--apply` rewrites star counts, push dates, profile counts (and channel stats if a YouTube key is set). Read `.sweep/report.md`. Everything else in the report is for you to apply by hand.

### 2. Repos (`src/data/repos.ts`)

For each **NEW repo** in the report, decide:
- Skip forks, empty repos, superseded lanes and unrelated scratch. When you skip one, add its name to `scripts/sweep-ignore.txt` so the next sweep is quiet about it.
- Add one object, newest-first among similar stars is fine (the section sorts by array order). Fields:
  - `name` exact; `desc` one or two sentences from the GitHub description (trim marketing, keep numbers);
  - `model`, `hardware` (e.g. `2x DGX Spark`, `4x RTX 3090`, `Any`), `type` (e.g. `vLLM TP2 recipe`, `Eval harness`, `Agent plugin`);
  - `lane`: `DGX Spark` | `RTX 3090` | `Tools` | `Agents`;
  - `stars`, `lang`, `pushed` from the report.

For repos flagged **description drifted** or **pushed recently**, open the README (`https://raw.githubusercontent.com/tonyd2wild/<repo>/main/README.md`) and check whether the headline numbers changed. If they did, update the matching deployment (step 3).

### 3. Deployments (`src/data/models.ts`)

A repo deserves a deployment card when it serves a model on lab hardware with measured numbers. One card per (model, hardware, engine) lane. Fields to fill from the README, verbatim units:
- `tps` = the single-stream number the README leads with (prefer a "median over real prompts" or "code prompt" figure); `tpsPeak` only if the README states a peak; `tpsNote` says exactly what the numbers are.
- `aggregate` + `aggregateNote` only if a concurrency table exists (e.g. `c6 aggregate`).
- `context` in tokens, `kvPool` in tokens if stated.
- `quant`, `engine`, `params`/`active`, `spec` (one line on the technique), `status`: `LIVE` if the README/Tony says it's currently serving, `RECIPE` if reproducible but not running, `ARCHIVED` if superseded.
- `stars` and `repo` exact. `video` = YouTube id if a video covers it.
- `hardware` must be one of the `Hardware` union values; add a value (and a `hardwareColors` entry) if a new configuration appears.
- `family` must be one of the `familyAccent` keys; add a key + color for a new model family.

If a number in the README is a range, use the low end and say so in `tpsNote`. If you cannot find a number, leave the field out rather than guessing.

### 4. Videos (`src/data/videos.ts`)

Paste the suggested lines from the report at the **top** of the `videos` array (newest first). Rules:
- Skip Shorts (< 60 s) and anything not about AI/hardware (unboxings of unrelated gear).
- `category` from the title; `duration` as `m:ss` or `h:mm:ss`; `views` if known (round numbers are fine).
- `featured: true` on at most two of the new ones (launch-day deployments, big benchmarks, hardware builds). Keep 6–8 featured total; un-feature older ones if needed.
- Update `channel` stats if you have them (`subscribers`, `views`, `videoCount`, `subsGained30d`, `viewsGained30d`, `asOf`).

### 5. X posts (`src/data/posts.ts`)

Add posts newer than the newest date in the file that are about benchmarks, launches, hardware fixes, releases or opinions on local AI. Keep the text as posted (fix nothing but obvious truncation). `tag`: `BENCH` | `LAUNCH` | `HARDWARE` | `OPINION` | `RELEASE` | `EXPERIMENT`. `url` = `https://x.com/Tech2Wild/status/<id>`. `date` from the snowflake id:

```js
new Date(Number((BigInt(id) >> 22n) + 1288834974657n)).toISOString().slice(0, 10)
```

Keep the list to the best ~10–14; drop the oldest low-signal ones.

### 6. Experiments, lab map, ticker (only when something notable happened)

- `src/data/experiments.ts`: add a card for a world-first, a big quant, a same-day deploy or a fix that others hit. Four `results` tiles with real values, `body` 3–5 sentences from the README, links (`repo`, `video`, `post`, `hf`). Number it next in sequence.
- `src/data/lab.ts`: adjust a node's `deployed` / `speed` / `project` text when the fleet's current model changes.
- `src/sections/Ticker.tsx`: keep ~10 items, swap in the newest headline numbers.

### 7. Verify

```bash
npx tsc -p tsconfig.json --noEmit
npm run build
```

Both must pass. Then a visual smoke test (headless Chrome, no dev server needed after build):

```bash
node scripts/smoke.mjs
```

It starts `vite preview`, screenshots the hero, models, videos and join sections at desktop and mobile widths into `.sweep/shots/`, and fails on console errors. Look at the screenshots.

### 8. Commit and deploy

```bash
git add -A
git commit -m "Sweep YYYY-MM-DD: <what changed in one line>"
git push
```

Then confirm the deploy (the CSS bundle hash changes when the deploy lands):

```bash
curl -s https://tech2wild.com/ | grep -o 'assets/index-[^"]*\.css'
```

If it hasn't changed after 8 minutes, check the Pages project's Deployments tab in the Cloudflare dashboard for a failed build and fix the error.

### 9. Applications

If the report lists new Join-the-Lab applications (or Tony asks), summarize each: name, GitHub + X links, vet score and summary, lanes, hardware. Tony decides. On approve: invite the GitHub login to the right team in https://github.com/Tech2wild, give the Discord role, then in the D1 console `UPDATE applications SET status='approved' WHERE id='<id>'`. On pass: `status='passed'`. Never delete rows.

### 10. Report back

One short message: what was added (repos / videos / posts / deployments), which numbers changed, the commit hash, the live URL, and anything you could not verify (say so plainly). If nothing changed, say "sweep clean" and the date.

## Guardrails

- Real numbers only. If it isn't in a README, a post, or the YouTube page, it doesn't go on the site.
- Keep Tony's voice: direct, technical, no buzzwords. Titles come from the videos as published.
- Don't restyle components or touch the 3D scene during a content sweep.
- Don't commit `.env`, `.sweep/`, or anything with a key in it.
- If `npm run build` fails on a type error in a data file, it is almost always a missing comma, an unknown `Hardware`/`family` value, or an unescaped apostrophe in a single-quoted string. Fix the data, not the types.
