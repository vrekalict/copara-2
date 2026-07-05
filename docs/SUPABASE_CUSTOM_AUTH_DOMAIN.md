# Custom auth domain: `auth.copara.ca`

Use this checklist when you want Google (and other OAuth providers) to show **`auth.copara.ca`** instead of **`eyihuybzmqplzdicehix.supabase.co`** on the account picker and consent screens.

Copara’s app code already sends users back to **`https://copara.ca/auth/callback`** after OAuth. A custom Supabase domain changes the **middle hop** (Supabase ↔ Google), not your Next.js callback route.

---

## What changes for users

| Step | Today (default) | After custom domain |
|------|-----------------|---------------------|
| Tap “Sign in with Google” on `copara.ca` | Redirect to `*.supabase.co` → Google | Redirect to `auth.copara.ca` → Google |
| Google screen says “continue to…” | `eyihuybzmqplzdicehix.supabase.co` | `auth.copara.ca` |
| After Google | Back to `copara.ca/auth/callback` | Same — no change |
| Magic-link / verify emails | Links on `*.supabase.co` | Links on `auth.copara.ca` |

---

## Prerequisites

- [ ] **Supabase paid plan** — custom domains are a [paid add-on](https://supabase.com/docs/guides/platform/custom-domains#pricing) (Pro/Team/Enterprise + custom domain usage).
- [ ] **DNS access** for `copara.ca` (Cloudflare, registrar, etc.).
- [ ] **Owner or Admin** on the Supabase project.
- [ ] **Supabase CLI** installed and logged in (`supabase login`).
- [ ] Know your project ref: `eyihuybzmqplzdicehix` (from Dashboard → Project Settings → General).

**Important:** Each Supabase project gets **one** custom domain. If you set `auth.copara.ca`, it also serves Auth API, Storage, and Edge Functions at that host (e.g. `https://auth.copara.ca/storage/v1/...`). That is normal; Copara only needs the branding win for Auth/OAuth.

---

## Phase 1 — DNS (do not activate yet)

### 1.1 Choose the hostname

- [ ] Use **`auth.copara.ca`** (subdomain only — root `copara.ca` is not supported by Supabase custom domains).

### 1.2 CNAME record

In your DNS provider, add:

| Type | Name | Target | TTL |
|------|------|--------|-----|
| CNAME | `auth` | `eyihuybzmqplzdicehix.supabase.co.` | 300 (low while testing) |

- [ ] Trailing dot on the target is optional depending on provider.
- [ ] If your registrar auto-appends `copara.ca`, create the record for `auth` only, not `auth.copara.ca.copara.ca`.

### 1.3 Register domain with Supabase (TXT for verification)

Dashboard: **Project Settings → General → Custom Domains**,  
or CLI:

```bash
supabase domains create --project-ref eyihuybzmqplzdicehix --custom-hostname auth.copara.ca
```

- [ ] Add the **`_acme-challenge.auth`** TXT record Supabase returns.
- [ ] Run verify until DNS is accepted (propagation can take minutes):

```bash
supabase domains reverify --project-ref eyihuybzmqplzdicehix
```

- [ ] Wait for SSL issuance (Supabase docs: up to ~30 minutes).

**Stop here until Phase 2 is done.** Do not activate until OAuth redirect URIs are updated.

---

## Phase 2 — OAuth & Supabase URL config (before activation)

### 2.1 Google Cloud Console

Open [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) → your OAuth 2.0 Client ID used by Supabase.

**Authorized redirect URIs** — keep the old URI and add the new one:

- [ ] `https://eyihuybzmqplzdicehix.supabase.co/auth/v1/callback` *(keep during transition)*
- [ ] `https://auth.copara.ca/auth/v1/callback` *(add)*

**OAuth consent screen** (same project):

- [ ] App name: **Copara**
- [ ] User support email / developer contact filled in
- [ ] App logo uploaded (optional but recommended)
- [ ] Authorized domains: `copara.ca` (and add `auth.copara.ca` if Google asks)
- [ ] Privacy policy: `https://copara.ca/legal/privacy`
- [ ] Terms: `https://copara.ca/legal/terms`

Supabase Dashboard → **Authentication → Providers → Google**:

- [ ] Confirm your **Client ID** and **Client Secret** are set (Copara uses [custom Google credentials](https://supabase.com/docs/guides/auth/social-login/auth-google), not Supabase’s shared app).

### 2.2 Supabase Authentication → URL configuration

- [ ] **Site URL:** `https://copara.ca`
- [ ] **Redirect URLs** (allow list for post-OAuth return to the app):

```
https://copara.ca/auth/callback
https://copara.ca/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

Add Vercel preview URLs if you test OAuth on preview deployments.

These are unchanged by the custom domain — they are where Supabase sends the user **after** Google, handled by `src/app/auth/callback/route.ts`.

### 2.3 Other providers (if enabled later)

For each OAuth provider (Apple, GitHub, etc.), add **both** callback URLs in the **provider’s** console:

- `https://eyihuybzmqplzdicehix.supabase.co/auth/v1/callback`
- `https://auth.copara.ca/auth/v1/callback`

---

## Phase 3 — Activate custom domain

When DNS is verified and Google redirect URIs include `auth.copara.ca`:

```bash
supabase domains activate --project-ref eyihuybzmqplzdicehix
```

Or activate in **Project Settings → General → Custom Domains**.

- [ ] Confirm `https://auth.copara.ca/auth/v1/health` (or Auth settings page) loads with valid HTTPS.
- [ ] Old `*.supabase.co` URL **still works** during transition — no need to rush env updates.

---

## Phase 4 — App & hosting env vars

Update everywhere `NEXT_PUBLIC_SUPABASE_URL` is set:

| Environment | Variable | New value |
|-------------|----------|-----------|
| Local `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` | `https://auth.copara.ca` |
| Vercel Production | same | `https://auth.copara.ca` |
| Vercel Preview (optional) | same | keep `*.supabase.co` for previews *or* use custom domain consistently |

**Do not change:**

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Copara reads the URL from env in:

- `src/lib/supabase/client.ts` (browser OAuth)
- `src/lib/supabase/server.ts` (server session)
- `src/lib/supabase/service.ts` (blog CMS, cron, etc.)

No code changes required — only env vars.

- [ ] Redeploy Vercel after updating production env vars.
- [ ] Restart local dev server.

---

## Phase 5 — Verification checklist

Run through each flow on **production** (`copara.ca`) after deploy:

### Google OAuth

- [ ] Sign-in page → **Continue with Google**
- [ ] Google screen shows **“continue to auth.copara.ca”** (not `*.supabase.co`)
- [ ] After account pick, land on intended page (`/app`, `/subscribe`, `/complete-signup`, etc.)
- [ ] New Google user hits **Complete signup** (province + legal) if required
- [ ] Repeat on **mobile Safari** and **installed PWA** if applicable

### Email auth (bonus — links also move to custom domain)

- [ ] Magic link email → link host is `auth.copara.ca`
- [ ] Confirm signup / reset password (when implemented) → same

### Regression

- [ ] Email + password sign-in still works
- [ ] Blog CMS / admin (service role) still works
- [ ] Stripe webhook + `/app` paid gate unchanged (no dependency on Supabase URL host for Stripe)

---

## Phase 6 — Cleanup (optional, after 1–2 weeks stable)

- [ ] Remove old Google redirect URI `https://eyihuybzmqplzdicehix.supabase.co/auth/v1/callback` if you no longer need rollback
- [ ] Raise DNS TTL on `auth` CNAME to normal (e.g. 3600)
- [ ] Document activation date in team notes

---

## Rollback

If OAuth breaks after activation:

1. **Quick:** Point `NEXT_PUBLIC_SUPABASE_URL` back to `https://eyihuybzmqplzdicehix.supabase.co` and redeploy (old domain still works).
2. **Full:** `supabase domains delete --project-ref eyihuybzmqplzdicehix` (see [Supabase docs](https://supabase.com/docs/guides/platform/custom-domains#remove-a-custom-domain)).

Keep both Google redirect URIs until you are confident.

---

## Copara-specific reference

| Item | Value |
|------|--------|
| Public site | `https://copara.ca` |
| Proposed auth domain | `https://auth.copara.ca` |
| Supabase project URL (current) | `https://eyihuybzmqplzdicehix.supabase.co` |
| App OAuth callback | `https://copara.ca/auth/callback?next=...` |
| Supabase OAuth callback (Google) | `https://auth.copara.ca/auth/v1/callback` |
| Google button | `src/components/auth/google-sign-in-button.tsx` |
| Session exchange | `src/app/auth/callback/route.ts` |

---

## Known limitations

- **Single custom domain per project** — cannot split Auth and Storage onto different hostnames.
- **Paid add-on** — confirm billing before starting.
- **OIDC discovery issuer** — some advanced MCP/OIDC clients may still see `*.supabase.co` in discovery metadata ([Supabase issue #2486](https://github.com/supabase/auth/issues/2486)). This does **not** affect standard Google OAuth for Copara.
- **Email alignment** — auth email links will use `auth.copara.ca`; your Supabase SMTP `from` (`noreply@copara.ca`) is separate. See `docs/SUPABASE_EMAIL_TEMPLATES.md`.

---

## When to do this

**Good time:** before a professional/partner launch, demo recordings, or if users ask about the Supabase URL.

**OK to defer:** early beta, no reported trust friction — default Supabase domain is functionally fine.

---

## Related docs

- `docs/SUPABASE_EMAIL_TEMPLATES.md` — auth email copy and SMTP
- `.env.example` — env var names
- [Supabase: Custom domains](https://supabase.com/docs/guides/platform/custom-domains)
