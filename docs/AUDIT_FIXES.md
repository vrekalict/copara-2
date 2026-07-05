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

## Batch 2 — Pending

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| 2 | `addChild` no explicit ownership check | Pending | RLS mitigates; add membership guard |
| 3 | `inviteCoParent` no circle-ownership check | Pending | RLS mitigates; add membership guard |
| 4 | Paywall not enforced in server actions | Pending | Call `getAppAccess` in onboarding actions |
| 6 | Check-in `location_verified` misleading | Pending | Rename field or drop proximity claim |
| 10 | Referral params dropped on professional early-access | Pending | |
| 11 | Partner sign-up for existing accounts | Pending | Product decision |
| 12–17 | Lower severity / SEO | Pending | |

## Change log

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
