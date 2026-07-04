# Accord (copara-2)

Co-parenting coordination app — messaging, calendar, expenses, and court-ready records.

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

## Docs

- Product requirements: `.claude/PRD.md`
- Build status: `.claude/STATUS.md`
