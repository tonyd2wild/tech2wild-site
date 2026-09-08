# Deploying tech2wild.com

The site is a static Vite build (`npm run build` → `dist/`). The domain stays registered at GoDaddy; hosting and DNS are on Cloudflare (free plan). Every push to `main` rebuilds and deploys.

## Current state (2026-09-08)

| Piece | Status |
|---|---|
| GitHub repo | `tonyd2wild/tech2wild-site` (public), branch `main` |
| Cloudflare Pages project | `tech2wild-site` → live at <https://tech2wild-site.pages.dev> |
| Build settings | command `npm run build`, output `dist`, production branch `main` |
| Cloudflare DNS zone | `tech2wild.com` added (Free plan), status **pending** until nameservers change |
| Cloudflare nameservers | `dimitris.ns.cloudflare.com`, `karina.ns.cloudflare.com` |
| GoDaddy nameservers (to replace) | `ns49.domaincontrol.com`, `ns50.domaincontrol.com` |
| Zone records kept | `www` CNAME → tech2wild.com, `pay` CNAME → GoDaddy paylinks, `_domainconnect` CNAME, `_dmarc` TXT |
| Zone records removed | two GoDaddy parking `A` records on `@` |
| Pages custom domain | **not yet attached** (Cloudflare requires the zone to be active first) |

## Remaining steps

### 1. GoDaddy: switch nameservers (Tony)

GoDaddy → My Products → tech2wild.com → **DNS** → **Nameservers** → **Change** → *I'll use my own nameservers*:

```
dimitris.ns.cloudflare.com
karina.ns.cloudflare.com
```

Remove `ns49.domaincontrol.com` and `ns50.domaincontrol.com`, save. If GoDaddy shows a DNSSEC toggle, make sure it is off. Propagation is usually minutes, worst case a few hours. Cloudflare emails when the zone goes active.

### 2. Cloudflare Pages: attach the custom domain

Pages project → **Custom domains** → **Set up a custom domain** → `tech2wild.com`, then again for `www.tech2wild.com`. Cloudflare creates the CNAME records automatically now that the zone is on Cloudflare. Certificates issue within ~15 minutes.

### 3. Verify

```bash
nslookup tech2wild.com
curl -I https://tech2wild.com
curl -I https://www.tech2wild.com
```

Both should return `200` over HTTPS.

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
