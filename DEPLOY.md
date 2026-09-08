# Deploying tech2wild.com

The site is a static Vite build (`npm run build` → `dist/`). Keep the domain registered at GoDaddy and host the files on Cloudflare Pages, which rebuilds and deploys on every push to `main`.

## One-time setup

### 1. Push the repo to GitHub

```bash
cd C:\Users\tonyd\tech2wild-site
git remote add origin https://github.com/tonyd2wild/tech2wild-site.git
git push -u origin main
```

(Create the empty repo at <https://github.com/new> first. Private is fine; Cloudflare only needs read access.)

### 2. Create the Cloudflare Pages project

1. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick `tonyd2wild/tech2wild-site`.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: add environment variable `NODE_VERSION` = `20`
4. Save and Deploy. You get a `*.pages.dev` URL in about a minute. Check it before touching DNS.

### 3. Attach the custom domain

In the Pages project → **Custom domains** → **Set up a custom domain** → enter `tech2wild.com`, then repeat for `www.tech2wild.com`.

Cloudflare will show the exact records it wants. There are two ways to satisfy them:

**Option A — keep DNS at GoDaddy (simplest, no nameserver change).**
In GoDaddy → My Products → tech2wild.com → **DNS** → add:

| Type  | Name | Value                              | TTL  |
|-------|------|------------------------------------|------|
| CNAME | `www`| `tech2wild-site.pages.dev`         | 600  |
| CNAME | `@`  | `tech2wild-site.pages.dev`         | 600  |

GoDaddy allows a CNAME on `@` through its "forwarding"-free flattening. If the GoDaddy editor refuses a CNAME on `@`, use Option B.

Delete any existing `A` record on `@` (GoDaddy's default parking record) and any `CNAME www` pointing at GoDaddy parking.

**Option B — move DNS to Cloudflare (recommended long-term).**
Add the site to Cloudflare (free plan), Cloudflare gives you two nameservers, and in GoDaddy → DNS → **Nameservers** → **Change** → paste them. Cloudflare then manages `tech2wild.com` and the Pages custom-domain step creates the records for you automatically. Registration and billing stay at GoDaddy.

### 4. Verify

```bash
nslookup tech2wild.com
curl -I https://tech2wild.com
```

Both `tech2wild.com` and `www.tech2wild.com` should return `200` over HTTPS. Cloudflare issues the certificate automatically; allow up to 15 minutes after DNS resolves.

## Every deploy after that

```bash
git add -A
git commit -m "update"
git push
```

Cloudflare rebuilds in ~60 s. Pull requests get their own preview URL.

## Files that matter for hosting

- `public/_headers` — long-lived cache on hashed `assets/*`, security headers on everything.
- `public/robots.txt`, `public/sitemap.xml` — search indexing.
- `index.html` — canonical URL and Open Graph / Twitter card tags. Add a 1200×630 `public/og.png` for link previews (the tags already point at it).
