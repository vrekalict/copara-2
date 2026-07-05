# Copara | Build Status

**Last updated:** 2026-07-04
**Handoff context:** Switching from prior AI tooling to Cursor to continue. This file is the handoff note — see "Known issues" below for resolved blockers.

---

## 1. What's done

### Phase 0 — Scaffold (complete, committed)
- Next.js 16 (App Router, TS, Tailwind v4) + shadcn/ui (`base-nova` style, Base UI under the hood — **not** Radix, so components use a `render` prop instead of `asChild`; links styled as buttons use `buttonVariants(...)` className directly, not `<Button asChild>`).
- `next-intl` for en/fr, **cookie-based** (`ACCORD_LOCALE` cookie), no `/en`/`/fr` URL prefix — matches the flat route list in the PRD. Locale switch is a server action (`src/actions/locale.ts`).
- PWA via `@serwist/turbopack` (not `@serwist/next` — that package doesn't support Turbopack, which is Next 16's default bundler for both `dev` and `build`). Service worker lives at `src/app/sw.ts`, served through a Next route handler at `src/app/serwist/[path]/route.ts`, registered client-side via `src/components/sw-provider.tsx`. Manifest icons are generated at request time with `next/og` `ImageResponse` (`src/app/icons/192|512|maskable-512/route.tsx`) rather than static PNG files.
- Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function renamed `middleware` → `proxy`). Ours is at `src/proxy.ts` and also refreshes the Supabase session cookie.
- Supabase schema/RLS: `supabase/migrations/20260101000000_init_schema.sql` (all tables from PRD §6, RLS policies, message hash-chain trigger, append-only enforcement trigger, 2-parent-per-circle limit trigger, `handle_new_user` trigger that auto-creates `profiles` + `user_settings` on signup) and `20260101000001_realtime.sql` (adds `messages` to the `supabase_realtime` publication).
- Auth: email/password + magic link (`src/actions/auth.ts`, `src/components/auth/*`), `/auth/callback` route, `next`-param redirect preserved end-to-end (sign-up/sign-in → email confirmation → back to wherever the user was headed, e.g. `/join/[inviteId]`).
- Protected `/app` shell: top bar + bottom tab nav (Messages/Calendar/Expenses/Vault/More), placeholder pages for tabs not yet built.

### Phase 1 — partial (in progress)
- **Circles + onboarding wizard**: `/onboarding/circle` → `/onboarding/invite` → `/onboarding/children` (`src/actions/circles.ts`, `src/actions/children.ts`). `/app` layout redirects users with no active circle membership into onboarding.
- **Invites**: `inviteCoParent` creates a `circle_members` row (`status='invited'`) and emails a join link via Resend (best-effort — failures are logged, not fatal). `/join/[inviteId]` is a public landing page (`src/actions/invites.ts`, `getInvitePreview` + `acceptInvite`, both using the **service-role** client since an invited-but-not-yet-active row fails the normal RLS `is_circle_member` check by design — this is intentional, not a bug).
- **Messaging**: thread list (`/app/messages`), thread view with Supabase Realtime (`src/components/messages/thread-view.tsx`), read receipts (`markThreadRead`), and a basic full-text search panel (`searchThreadMessages`, using the `tsvector` GIN index from the migration).
- Fixed a real RLS bug found while building this: `thread_participants_insert` originally required `circle_role = 'parent'` for *any* insert, which meant a `third_party` member could create a thread (allowed by `threads_insert`) but then couldn't add themselves as a participant. Fixed to also allow self-insertion by parents and third parties. (Edited in place in the original migration file since it had not yet been applied anywhere persistent at the time.)

### Infrastructure or Supabase project
- Real Supabase project is linked: ref `eyihuybzmqplzdicehix`. Both migrations are **pushed and applied** (confirmed via `supabase migration list --linked`).
- `.env.local` has real credentials (Supabase URL/anon/service-role, OpenAI, Resend, VAPID, cron secret) — **do not commit** (already covered by `.gitignore`'s `.env*` rule). The Supabase DB password was shared in this chat session in plaintext; consider rotating it if that's a concern (Project Settings → Database).
- Supabase MCP server is registered in `.mcp.json` — authentication varies by session/window.
- End-to-end verified against the **live** project (not just local Postgres): signup → `handle_new_user` trigger → `profiles`/`user_settings` rows created correctly. Test users created via `service.auth.admin.createUser` were cleaned up (`auth.admin.deleteUser`) afterward.

---

## 2. Known issues

### ~~🔴 `circles` INSERT fails RLS check~~ ✅ Fixed 2026-07-04 (Cursor)

**Root cause (not a broken `circles_insert` policy):** The INSERT itself succeeded. Failures came from two bootstrap gaps:

1. **`circles_select`** only allowed `is_circle_member(id)`. During onboarding the creator is not a member yet, so `.insert().select()` (PostgREST `INSERT … RETURNING`) failed with the misleading error *"new row violates row-level security policy"* — actually the SELECT/RETURNING leg, not the INSERT `WITH CHECK`.
2. **`circle_members_insert`** required `circle_role(circle_id) = 'parent'`, but the first parent cannot exist before that row is inserted (chicken-and-egg).

**Fix:** Migration `20260704185910_circle_bootstrap_rls.sql` — `circles_select` also allows `created_by = auth.uid()`; `circle_members_insert` also allows the circle creator to add themselves as `parent`. Applied to live project via Supabase MCP; full `createCircle` → member → invite flow verified with JS client.

**Debug test rows:** Queried live DB — no `Diag Circle` / `sqltest*` rows persisted (transactions rolled back as expected).

<details>
<summary>Original investigation notes (pre-fix)</summary>

**Symptom:** An authenticated user calling `supabase.from('circles').insert({ name, created_by: user.id })` gets:
```
new row violates row-level security policy for table "circles"
```
This blocks the entire onboarding flow (`createCircle` in `src/actions/circles.ts`) and therefore blocks everything downstream (invites, threads, messages) for a fresh account.

**The policy in question** (deployed on the live project, confirmed via `pg_policies`):
```sql
create policy "circles_insert" on public.circles for insert
  with check (created_by = auth.uid());
```

**What's been ruled out** (via direct SQL against the live DB using `supabase db query --linked` with a simulated JWT, and via the real signed-in JS client):
- The policy as deployed is exactly `(created_by = auth.uid())` — no duplicate/restrictive policies on `circles`, confirmed via `pg_policy` (not just the `pg_policies` view).
- No triggers on `circles` that could be mutating `created_by` before the check runs.
- `auth.uid()` **does** resolve correctly and **does** equal the test user's id — confirmed with `select auth.uid(), auth.uid() = '<uuid>'::uuid` inside the same simulated session (`set role authenticated; set request.jwt.claims = '...'`), which returned `true`.
- Despite that, `insert into circles (name, created_by) values ('x', auth.uid())` **in the same session** still throws the RLS violation. This was the last thing tested before switching to Cursor — i.e., using `auth.uid()` as the literal inserted value (removing any possibility of a client-side value mismatch) still fails.
- A working control: `profiles` table SELECT under RLS (`id = auth.uid()`) succeeds fine for the same session/user, so the general auth-context/JWT plumbing is not broken — this looks specific to the `circles` INSERT path.

**Leading hypotheses not yet confirmed:**
1. **CLI statement-batching artifact**: `supabase db query --linked` might not guarantee that `SET LOCAL`/`SET` and the following `INSERT` run on the same backend connection if it goes through a transaction-mode pooler (Supavisor/PgBouncer) — worth reproducing with a *direct* `psql` connection (not through the CLI wrapper) to rule this out before assuming it's a real schema/policy bug.
2. **Schema drift**: the Studio dashboard could have been used to hand-edit something on this project outside of the migration files. Run `supabase db diff --linked` to check for drift between the migration files and the live schema.
3. Something about the `created_by` column's FK (`references public.profiles (id)`) interacting with RLS check timing — though FK violations produce a distinct error message ("violates foreign key constraint"), not the RLS one we're seeing, so this is a weaker lead.
4. Worth also checking: `select rolbypassrls from pg_roles where rolname = 'authenticated'` (expect false) and confirming `authenticated` actually has table-level `INSERT` grant on `circles` (`information_schema.role_table_grants`) — a missing grant produces a *different* error ("permission denied for table"), not this one, so this is unlikely but cheap to rule out.

**Suggested next step:** reproduce with a direct `psql "postgresql://postgres:<password>@db.eyihuybzmqplzdicehix.supabase.co:5432/postgres"` session (bypassing the Supabase CLI's query wrapper entirely) and re-run the same `set role authenticated; set request.jwt.claims = '...'; insert ...` sequence there. If it still fails in a genuine single psql session, the bug is real and in the schema/policy; if it succeeds, the bug is in how the CLI's `db query` command batches statements, and testing should move to real client-driven testing instead (i.e., trust the JS-client repro over the CLI repro).

**No leftover test data was confirmed cleaned up** — a few debug attempts (`Diag Circle`, `sqltest`, `sqltest-set` named circles) may have left rows in the live `circles` table if their cleanup step didn't run (most were wrapped in transactions that were rolled back, so they likely did **not** persist, but this was not independently re-verified before switching tools — worth a quick `select * from circles where name like 'sqltest%' or name like 'Diag Circle%'` sanity check).

</details>

---

## 3. What remains (per PRD build plan)

### Phase 1 (complete)
- [x] Message attachments via Supabase Storage (25MB max, images/PDF/docs)
- [x] AI tone review + rewrite suggestions (`/api/ai/tone-review`, OpenAI API, debounced composer integration — `OPENAI_API_KEY` in `.env.local`)
- [x] `ai_events` audit logging + rate limiting (30 calls/user/hour per PRD)

### Phase 2 — Coordination (complete)
- [x] Calendar: events list, add event, change requests + approve/decline
- [x] Check-ins: `POST /api/checkins` (GPS verified server-side, boolean only stored)
- [x] Expenses + reimbursement requests + running balance
- [x] Schedule templates (2-2-3, week-on/off, alternating weekends) with 4-week event generation
- [x] Violation detection + weekly digest cron (`GET /api/cron/digests`, Bearer `CRON_SECRET`)

### Phase 3 — Records & Pro (complete)
- [x] PDF exports + hash-chain verification digest + public `/verify/[exportId]` page
- [x] AI dispute summarizer with message-ID citations (UI in `/app/exports` + existing `/api/ai/summarize`)
- [x] Professional role + `/pro` dashboard + dual-parent invite link (`/join/case/[circleId]`)
- [x] Web push (VAPID) + `<InstallPrompt />` + analytics events (`/api/analytics`, `/api/push/subscribe`)

**Migration:** `20260704193000_exports_storage_pro_bootstrap.sql` — exports storage bucket, pro bootstrap RLS, professional read access to threads/messages.

**Env note:** Add `NEXT_PUBLIC_VAPID_PUBLIC_KEY` to `.env.local` (same value as `VAPID_PUBLIC_KEY`) for client-side push subscription.

### Phase 4 — Polish (complete)
- [x] FR translation completeness pass (all Phase 3–4 namespaces, legal pages, hardcoded strings removed)
- [x] Empty states (`EmptyState` component; messages, vault)
- [x] Error boundaries (`/app/error.tsx`, root `error.tsx`)
- [x] Offline message queue (IndexedDB + flusher + thread composer integration)
- [x] a11y: skip link, focus-visible, reduced motion, bottom nav ARIA, 44px touch targets
- [x] Legal pages: `/legal/terms`, `/legal/privacy` (PIPEDA-aware copy, en + fr)

### Launch prep (manual)
- [ ] End-to-end test with a real two-parent pair
- [ ] 3 design-partner mediators committed

---

## 4. Notes for whoever picks this up in Cursor

- Don't regenerate `create-next-app`/`shadcn init` — the project is already scaffolded; just keep extending it.
- The `messages/en.json` / `messages/fr.json` files are the single source of truth for UI strings — every new namespace needs both.
- RLS is the primary authorization layer (PRD §10) — every new table needs policies before shipping a feature that touches it, and it's worth actually testing them (see `docker run --rm postgres:15` pattern used earlier in this session for local RLS smoke tests, or test directly against the live project like the circles bug above was found).
- The Supabase project has real user data risk now (it's linked and has real credentials) — be careful with destructive SQL against it.
