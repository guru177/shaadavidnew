# Production deploy (Vercel + Neon + custom domain)

This app stores all commerce/content data through `getDb()` / `saveDb()`.
On Vercel the local filesystem is ephemeral, so production **requires** Neon Postgres via `DATABASE_URL`.

Locally, if `DATABASE_URL` is unset, the app still uses `database.json` (created from `database.seed.json` on first write).

## 1. Create Neon database

1. Create a project at [neon.tech](https://neon.tech) (or Vercel → Storage → Neon).
2. Copy the **pooled** connection string into Vercel as `DATABASE_URL`.
3. Optionally set `DATABASE_URL_UNPOOLED` for migrations (Neon “direct” connection).

## 2. Migrate + seed

From your machine (with `DATABASE_URL` pointing at Neon):

```bash
npx prisma migrate deploy
# or first time:
npx prisma migrate dev --name init_app_state

npm run db:seed
```

`db:seed` imports `database.json` if present, otherwise `database.seed.json`.

## 3. Vercel project

1. Import the GitHub repo into Vercel.
2. Framework: Next.js (auto-detected).
3. Build command: `prisma generate && next build` (already in `package.json` `build` / `postinstall`).
4. Set **Production** environment variables (see below).
5. Deploy.

### Required env vars

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon pooled URL |
| `ADMIN_USER` | Admin username (no defaults in production) |
| `ADMIN_PASSWORD` | Strong password (no defaults in production) |
| `ADMIN_SESSION_SECRET` | Long random string (do **not** reuse Razorpay secret) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://yourdomain.com` |

### Payments / email / AI (as needed)

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Browser key |
| `RAZORPAY_KEY_ID` | Server key id |
| `RAZORPAY_KEY_SECRET` | Server secret |
| `RAZORPAY_WEBHOOK_SECRET` | From Razorpay dashboard |
| `RESEND_API_KEY` / `EMAIL_FROM` | Optional order emails |
| `GROQ_API_KEY` or `GEMINI_API_KEY` | Chatbot |

Also set **Admin → Settings → Site URL** to the same canonical `https://…` host.

## 4. Custom domain

1. Vercel → Project → Settings → Domains → add `yourdomain.com` (and `www` if desired).
2. At your registrar, add the DNS records Vercel shows:
   - Apex: A record to `76.76.21.21` (or ALIAS/ANAME if supported)
   - `www`: CNAME to `cname.vercel-dns.com`
3. Wait for SSL (automatic).
4. Prefer one canonical host (redirect www ↔ apex in Vercel).
5. Confirm `NEXT_PUBLIC_SITE_URL` and settings `siteUrl` match that host.

## 5. Razorpay webhook

Set webhook URL to:

`https://yourdomain.com/api/razorpay/webhook`

Use live keys + live webhook secret when you leave test mode.

## 6. Post-deploy smoke checklist

- [ ] Home, product, shop, blogs, gallery load
- [ ] COD checkout creates an order
- [ ] Razorpay test (or live) payment path works
- [ ] `/track` finds the order
- [ ] Admin login with **new** credentials
- [ ] Order still present after a Vercel redeploy (proves Neon persistence)
- [ ] Settings / blog / gallery save round-trip

## 7. Security notes

- Production refuses to boot admin auth if `ADMIN_USER`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET` are missing or still the old hard-coded defaults.
- Do not commit `.env*` or live `database.json` (gitignored). Keep `database.seed.json` as non-secret seed content only.
