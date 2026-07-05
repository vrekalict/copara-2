# App Audit Fix Tracker

Source: [`app-review-findings.md`](../app-review-findings.md) (2026-07-05). Tracks remediation of `/app` code review findings.

## Batch 1 — Complete

| # | Finding | Status | Files changed |
|---|---------|--------|---------------|
| 1 | Open redirect via `//evil.com` in `next` param | **Done** | `src/lib/auth/redirect.ts`, `src/actions/auth.ts`, `src/lib/supabase/middleware.ts`, `src/app/auth/callback/route.ts` |
| 5 | Export tamper detection dead for expenses/schedule/change_requests | **Done** | `src/lib/exports/fetch-data.ts` (`fetchLiveChainRecords`), `src/app/api/verify/[exportId]/route.ts` |
| 7 | Partner wrong-account screen dead end | **Done** | `src/actions/auth.ts` (`signOutTo`), `src/components/pro/partner-activate-panel.tsx`, `src/app/pro/activate/page.tsx` |
| 8 | "Already activated" message unreachable | **Done** | `src/actions/pro/partner.ts` (`getPartnerActivation`, `activatePartnerAccount`) |
| 9 | Malformed subscribe URL when `ref` without `plan` | **Done** | `src/app/(auth)/subscribe/page.tsx` |

## Batch 2 — Complete

| # | Finding | Status | Files changed |
|---|---------|--------|---------------|
| 2 | `addChild` no explicit ownership check | **Done** | `src/lib/circles/membership.ts`, `src/actions/children.ts` |
| 3 | `inviteCoParent` no circle-ownership check | **Done** | `src/actions/circles.ts` |
| 4 | Paywall not enforced in server actions | **Done** | `src/actions/children.ts`, `src/actions/circles.ts` (`requirePaidAccess`) |
| 6 | Check-in `location_verified` misleading | **Done** | Renamed column + labels (see Batch 3) |
| 10 | Referral params dropped on professional early-access | **Done** | `src/app/(marketing)/early-access/page.tsx` |
| 11 | Partner sign-up for existing accounts | **Done** | `src/actions/pro/partner.ts` (detect empty identities) |
| 12 | Messages page missing auth guard | **Done** | `src/app/app/messages/page.tsx` |
| 13 | Exports GET missing membership check | **Done** | `src/app/api/exports/route.ts` |
| 14 | `<html lang>` wrong on `/fr/*` | **Done** | `src/lib/supabase/middleware.ts` (sets `ACCORD_LOCALE` cookie) |
| 15 | Open Graph locale hardcoded English | **Done** | `src/lib/marketing/metadata.ts` (`locale` param → `og:locale`) |
| 16 | No hreflang between locale pairs | **Done** | `src/lib/marketing/metadata.ts` + paired EN/FR marketing pages |
| 17 | Wrong-account title misleading | **Done** | Batch 1 (`src/app/pro/activate/page.tsx`) |

## Batch 3 — Complete

| # | Finding | Status | Files changed |
|---|---------|--------|---------------|
| — | Rename DB column `location_verified` → `gps_provided` | **Done** | `supabase/migrations/20260705170000_checkins_gps_provided.sql` + app code |
| — | N+1 in digest cron | **Done** | `src/app/api/cron/digests/route.ts`, `src/lib/cron/member-emails.ts` |
| — | `llms.ts` route list incomplete | **Done** | `src/lib/marketing/llms.ts` (all `MARKETING_ROUTES` indexed) |

## Change log

### 2026-07-05 — Batch 3

**Column rename `gps_provided`**

- Migration renames `checkins.location_verified` → `gps_provided`.
- Updated check-in API, exports, violations types, and digest cron selects.

**Digest cron performance**

- Bulk-fetch past/upcoming events, members, and checkins instead of per-circle queries.
- `fetchMemberEmailsByUserId()` resolves auth emails in parallel chunks (25 at a time) once per run.

**LLM index completeness**

- `buildLlmsTxt()` lists all marketing routes from `MARKETING_ROUTES` (feature subpages, coparenting guide, FR legal/guide).
- `getMarketingPageDocs()` adds stub entries for routes without long-form body content.

### 2026-07-05 — Batch 2

**#2–4 Server-action guards**

- Added `requireActiveCircleParent()` and `requireActiveCircleMember()` in `src/lib/circles/membership.ts`.
- `addChild` and `inviteCoParent` verify active parent membership before mutating.
- `createCircle`, `inviteCoParent`, and `addChild` call `requirePaidAccess()` when billing is enforced.

**#6 Check-in GPS labeling**

- Renamed internal helper to `hasValidGpsCoordinates`; DB column renamed in Batch 3.
- Export PDF label: "GPS included".

**#10 Early-access referral**

- Professional redirect preserves `ref` as query param: `/professionals?ref=…#apply`.

**#11 Existing partner account**

- `signUpPartnerWithPassword` returns a clear error when Supabase reports an existing email (`identities.length === 0`).

**#12–13 Defense in depth**

- Messages page redirects unauthenticated users to sign-in.
- Exports GET handler checks circle membership like POST.

**#14–16 French SEO**

- Middleware sets `ACCORD_LOCALE=fr` cookie on `/fr` routes → correct `<html lang>`.
- `pageMetadata()` accepts `locale` and `languageAlternates` for `og:locale` and hreflang.
- Paired pages: `/`↔`/fr`, `/terms`↔`/fr/conditions`, `/privacy`↔`/fr/confidentialite`, `/coparenting-guide`↔`/fr/guide-coparentalite`.

### 2026-07-05 — Batch 1

**#1 Open redirect**

- Added `isSafeRedirectPath()` and `safeRedirectPath()` — rejects `//`, `\`, and `://` in path-only redirects.
- Wired through `resolveAuthRedirect`, `nextPath` in auth actions, middleware complete-signup redirect, and OAuth callback.

**#5 Export tamper detection**

- Added `fetchLiveChainRecords()` mirroring hash computation in `fetchExportData` for all four export kinds.
- Verify route now compares live DB state to stored hashes for every kind (not just messages).

**#7 Partner wrong-account**

- Added `signOutTo()` server action with safe redirect validation.
- Wrong-account panel offers “Sign out and create partner account” / “Sign out and sign in with {email}” instead of looping links.
- Distinct AuthShell title and description for wrong-account mode.

**#8 Already activated**

- `getPartnerActivation` returns early for `status === "activated"` with `alreadyActivated: true`.
- Activation no longer clears `approval_token`, so reused links resolve to the “Already activated” screen.
- `activatePartnerAccount` redirects to dashboard if already activated.

**#9 Subscribe URL**

- Unauthenticated subscribe redirect built with `URLSearchParams` so `ref` works with or without `plan`.

## Deploy notes

Run pending Supabase migrations on production:

```bash
# Includes partner email tracking (Batch 0) and gps_provided rename (Batch 3)
supabase db push
```

Or apply manually:

- `supabase/migrations/20260705160000_partner_approval_email_tracking.sql`
- `supabase/migrations/20260705170000_checkins_gps_provided.sql`
