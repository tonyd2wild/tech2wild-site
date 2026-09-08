# Deploying tech2wild.com

The site is a static Vite build (`npm run build` → `dist/`). The domain stays registered at GoDaddy; hosting and DNS are on Cloudflare (free plan). Every push to `main` rebuilds and deploys.

## Current state (2026-09-08)

| Piece | Status |
|---|---|
| GitHub repo | `tonyd2wild/tech2wild-site` (public), branch `main` |
| Cloudflare Pages project | `tech2wild-site` → live at <https://tech2wild-site.pages.dev> |
| Build settings | command `npm run build`, output `dist`, production branch `main` |
| Cloudflare DNS zone | `tech2wild.com` **active** (Free plan); nameservers switched at GoDaddy 2026-09-08 |
| Cloudflare nameservers | `dimitris.ns.cloudflare.com`, `karina.ns.cloudflare.com` (registration stays at GoDaddy) |
| Zone records | `@` CNAME → tech2wild-site.pages.dev, `www` CNAME → tech2wild-site.pages.dev (both proxied), `pay` CNAME → GoDaddy paylinks, `_domainconnect` CNAME, `_dmarc` TXT |
| Pages custom domains | `tech2wild.com` and `www.tech2wild.com` **Active, SSL enabled** |
| Live check | <https://tech2wild.com> and <https://www.tech2wild.com> → 200; `http://` → 301 to https |

## Join the Lab form (collaborator applications)

| Piece | Where |
|---|---|
| Public link | <https://tech2wild.com/join> (lands on the `#join` section) |
| Front end | `src/sections/Join.tsx` — fields, chips, Turnstile widget, honeypot |
| API | `functions/api/apply.ts` → `POST /api/apply` (Cloudflare Pages Function) |
| Bot check | Cloudflare Turnstile widget `tech2wild-join` (hostnames tech2wild.com + tech2wild-site.pages.dev). Site key in `src/data/config.ts`; secret in Pages → Settings → Variables as `TURNSTILE_SECRET` |
| Storage | D1 database `tech2wild-lab` (id `4a79850c-b517-420a-8e28-7a9a3209574d`), table `applications`, bound as `DB` via `wrangler.toml`. Schema auto-creates on first request |
| Vetting | The function pulls the applicant's public GitHub (age, repos, stars, followers, last push, local-AI keywords) and stores `gh_score` (0–100) + `gh_summary` + raw `gh_json` |
| Discord | Optional: set `DISCORD_WEBHOOK` (Pages secret) and every application posts an embed card with the vet score |
| GitHub rate limit | Optional: set `GITHUB_TOKEN` (Pages secret, read-only PAT) to raise the 60/h unauthenticated limit |
| Duplicates | Same email or GitHub login is rejected with 409 |

Read applications: Cloudflare dashboard → Workers & Pages → D1 → `tech2wild-lab` → Console:

```sql
SELECT id, created_at, status, name, email, x_handle, github, gh_score, gh_summary, lanes, hours FROM applications ORDER BY created_at DESC;
```

Approve someone: invite their GitHub login to the right team in the `Tech2wild` org (<https://github.com/Tech2wild>) and give them the Discord role, then `UPDATE applications SET status='approved' WHERE id='…'`.

## Verify at any time

```bash
curl -I https://tech2wild.com
curl -I https://www.tech2wild.com
```

Both should return `200` over HTTPS with `server: cloudflare`.

## Every deploy after that

```bash
git add -A
git commit -m "update"
git push
```

Cloudflare rebuilds in about a minute. Pull requests get their own preview URL.

## Files that matter for hosting

- `public/_headers` — long-lived cache on hashed `assets/*`, security headers on everything.
- `public/robots.txt`, `public/sitemap.xml` — search indexing.
- `index.html` — canonical URL and Open Graph / Twitter card tags. Add a 1200×630 `public/og.png` for link previews (the tags already point at it).
