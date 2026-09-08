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
