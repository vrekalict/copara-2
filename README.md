# Copara (copara-2)

Canadian co-parenting platform: neutral messaging, custody schedules, shared expenses, and tamper-evident records.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Supabase** (Postgres, Auth, Storage, Realtime)
- **OpenAI** (`gpt-5.4-mini` for tone review; `gpt-5.4` summary fallback) — server-side only
- **next-intl** (en/fr)
- **PWA** via Serwist

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + OpenAI keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. Required for full functionality:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (tone review + dispute summaries)
- `SUPABASE_SERVICE_ROLE_KEY` (invite acceptance, cron jobs)

AI model overrides (optional):

- `OPENAI_MODEL_FAST` — default `gpt-5.4-mini`
- `OPENAI_MODEL_SUMMARY` — default `gpt-5.4-mini`
- `OPENAI_MODEL_SUMMARY_FALLBACK` — default `gpt-5.4`

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run lint     # ESLint
```

## Cron (weekly digest)

Schedule `GET /api/cron/digests` weekly (e.g. Vercel Cron). Send header:

```
Authorization: Bearer <CRON_SECRET>
```

The job detects late/missed/unlogged exchanges, writes to `schedule_events`, and emails active parents via Resend when configured.

## Docs

- Product requirements: `.claude/PRD.md`
- Build status: `.claude/STATUS.md`
