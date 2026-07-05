# `/app` Code Review Findings

Reviewed 2026-07-05. Covers `src/app/**` and the server actions/components those pages depend on. Findings are grouped by severity. File:line references point to the current working tree (includes uncommitted changes in the pro-partner flow).

---

## High severity (security / correctness)

### 1. Open redirect via protocol-relative `next` param
**`src/lib/auth/redirect.ts:24`, `src/actions/auth.ts:13`**

The "is this redirect safe" check is `next.startsWith("/")`. A value like `//evil.com` also starts with `/` but browsers treat it as protocol-relative and navigate off-site. This helper backs every post-auth redirect (`sign-in/page.tsx:27-32`, `sign-up/page.tsx:29-36`, `complete-signup.ts:56-63`, and `nextPath` in `auth.ts:98`), and the value is round-tripped from the public query string into a hidden form field in `sign-in-form.tsx:45,79`. End-to-end exploit: link a victim to `/sign-in?next=//evil.com`, they sign in normally, and get bounced to an attacker-controlled page right after authenticating — a solid phishing primitive.

**Fix:** also reject values starting with `//`, or resolve with `new URL(next, base)` and compare origins.

`src/app/auth/callback/route.ts:7,13` has the same loose check but is lower risk since `next` is concatenated after `origin`, so it can't escape the origin — still worth tightening for consistency.

### 2. `addChild` has no auth or ownership check
**`src/actions/children.ts:6-29`**

`circleId` is read straight from client-supplied `FormData`. There's no `supabase.auth.getUser()` call and no check that the caller belongs to that circle before inserting into `children`. Compare with `createCircle`, which does check the user. Depending on how permissive the `children` table's RLS policy is, this could let an authenticated user insert a child record into an arbitrary circle by guessing/knowing its UUID (it travels through a plain hidden input in `children-form.tsx:44`).

### 3. `inviteCoParent` has no circle-ownership check
**`src/actions/circles.ts:48-90`**

Checks the caller is logged in, but never verifies the caller is a member of the `circleId` being invited into (also sourced from client form data, `invite-form.tsx:24`). An authenticated attacker who knows another circle's UUID could send invites into it.

### 4. Paywall not enforced at the server-action layer
**`src/app/onboarding/layout.tsx:19-22` vs. `createCircle` / `inviteCoParent` / `addChild`**

`requirePaidAccess` is only checked in the onboarding *layout*. The underlying server actions don't re-check paid status, so calling them directly (bypassing the page) skips the paywall.

### 5. Export tamper-detection is dead code for 3 of 4 export kinds
**`src/app/api/verify/[exportId]/route.ts:35-67,93`**

Tamper checking only re-queries live data when `kind === "messages"`. For `expenses`, `schedule`, and `change_requests`, the `else if` branch builds "live" records directly from the already-stored hashes — it never touches the `expenses`/`events`/`change_requests` tables. The nested `if (kind === "messages")` at lines 52-66 can never execute in that branch. Net effect: the "tamper detected" badge shown to users will essentially always say "verified" for expense/schedule/change-request exports even if the underlying record was edited after export — defeating the stated purpose of the feature for most export types.

### 6. `verifyLocation` doesn't verify anything
**`src/app/api/checkins/route.ts:16-18`**

```ts
function verifyLocation(lat: number, lng: number) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
```
This only checks the coordinates are valid global GPS values — it never compares against the event's actual location (the `events` table only stores free-text `location`, with nothing to check proximity against). Any coordinates from anywhere on Earth set `location_verified: true`, which is misleading given the name/comment and that check-ins likely feed into custody-exchange evidence.

---

## Medium severity (broken flows)

### 7. Partner "wrong account" screen is a dead end
**`src/components/pro/partner-activate-panel.tsx:26-46`, `src/app/pro/activate/page.tsx:71,75`**

When a signed-in user's email doesn't match the invited partner email, both recovery CTAs loop back to the same screen instead of resolving anything:
- "Create partner account" → `/pro/activate/sign-up?token=...`, but that page redirects back to `/pro/activate?token=...` whenever `user` is truthy (`sign-up/page.tsx:26-28`) — and the user is still signed in with the wrong email, so it bounces straight back to `wrong-account`.
- "Sign in with {email}" → `/pro/activate?token=...&sign-in=1`, but `sign-in=1` only affects the branch gated on `!user`; since the user is already signed in, it's ignored and the same `wrong-account` screen re-renders.

There's no sign-out control offered despite the copy saying "Sign out, then create or sign in...". A user in this state currently has no way to proceed.

### 8. "Already activated" message is unreachable
**`src/actions/pro/partner.ts:339` vs. `381-389`; `src/app/pro/activate/page.tsx:48-60`**

`getPartnerActivation` returns `null` whenever `status !== "approved"` (line 324) before it ever reaches the `alreadyActivated: Boolean(data.user_id)` computation on line 339. But `user_id` is only ever set together with `status: "activated"` in `activatePartnerAccount` (lines 381-389) — so by the time `user_id` is non-null, the function has already bailed out with `null`. Reusing an activation token after activation always shows "Invalid activation link" instead of the intended "Partner access already active" message (`page.tsx:48-60`).

### 9. Malformed redirect URL when `ref` is set without `plan`
**`src/app/(auth)/subscribe/page.tsx:22-25`**

```ts
const next = plan ? `/subscribe?plan=${...}` : "/subscribe";
const refParam = ref ? `&ref=${...}` : "";
redirect(`/sign-in?next=${encodeURIComponent(`${next}${refParam}`)}`);
```
If `ref` is present but `plan` isn't, `next` has no `?`, producing `/subscribe&ref=CODE` — a malformed query string. The referral code is silently lost after sign-in. Should build with `URLSearchParams` instead of manual concatenation (as `resolveAuthRedirect`'s `subscribePath` does correctly elsewhere).

### 10. Referral/plan params dropped on professional early-access redirect
**`src/app/(marketing)/early-access/page.tsx:9-17`**

`ref`/`plan` are collected into a `next` param set, but when `role === "professional"` the redirect goes to `/professionals#apply` without ever appending them — silently discarding referral tracking for early-access links aimed at professionals.

### 11. Sign-up default flow may leave existing-account users stuck
**`src/actions/pro/partner.ts` `signUpPartnerWithPassword:400-453`**

First-time partner visitors are now sent straight to sign-up by default (per updated copy at lines 108-112). Supabase's `auth.signUp` for an already-registered, confirmed email typically returns an obfuscated success (no session/no error), so a user who already has an account would just see the generic "check your email" message with no clear indication they should use the small "Sign in instead" link. Flagged as an intentional-looking regression worth confirming with product.

---

## Low severity / consistency issues

### 12. Inconsistent auth guard on messages page
**`src/app/app/messages/page.tsx:24`**

Uses `user!.id` without the `if (!user) redirect("/sign-in")` guard every sibling page (calendar, expenses, journal, vault, albums, exports) has. Currently safe only because `AppLayout` already redirects unauthenticated users — but would throw if that upstream guarantee changes.

### 13. Missing defense-in-depth ownership filters (RLS-only)
- **`src/app/app/messages/page.tsx:29-34`** — `threads` query has no explicit circle/membership filter; relies solely on RLS.
- **`src/app/api/exports/route.ts` `GET:179-208`** — lists exports for an arbitrary `circle_id` query param with no membership check in application code, unlike the `POST` handler in the same file (lines 55-65) which does check. Not currently exploitable (RLS backs both), but inconsistent within the same file.

### 14. `<html lang>` doesn't reflect `/fr/*` marketing routes
**`src/app/layout.tsx:56`, `src/i18n/request.ts:10-21`**

Locale is resolved purely from the `ACCORD_LOCALE` cookie (default `"en"`); nothing sets that cookie based on the `/fr` URL segment. A first-time visitor landing directly on `/fr/conditions` gets French content under `<html lang="en">` — an accessibility and SEO-language-detection issue.

### 15. Open Graph locale hardcoded to English everywhere
**`src/lib/marketing/metadata.ts:30`, `src/lib/marketing/site.ts:7`**

`openGraph.locale` always uses `SITE.locale`, hardcoded to `"en_CA"`. All `/fr/*` pages emit `og:locale=en_CA` instead of `fr_CA`.

### 16. No hreflang / `alternates.languages` between locale pairs
**`src/lib/marketing/metadata.ts`**

Only `alternates.canonical` is set; there's no `alternates.languages` linking `/` ↔ `/fr`, `/terms` ↔ `/fr/conditions`, `/privacy` ↔ `/fr/confidentialite`, `/coparenting-guide` ↔ `/fr/guide-coparentalite`. Search engines have no machine-readable signal for the translations, relying only on the manual in-page language-switch links.

### 17. Misleading card title on partner "wrong account" screen
**`src/app/pro/activate/page.tsx:81`**

`CardTitle` renders "Activate partner access" for both `activate` and `wrong-account` modes; only `sign-in` mode gets distinct copy. Compounds finding #7 by not signaling the user is in a conflicting-session state.

---

## Noted but not bugs

- Stripe webhook signature verification, cron secret check (`verifyCronRequest`), and AI route auth/rate-limiting (`requireThreadParticipant`, `countRecentAiCalls`) all look correct.
- `getInvitePreview`/`getCasePreview` and `acceptInvite`/`acceptCaseInvite` correctly re-verify the invited email matches the signed-in user before mutating.
- `src/api/cron/digests/route.ts` does a sequential `auth.admin.getUserById` call per circle member inside nested loops — an N+1 pattern, not a correctness bug, but worth revisiting if circles grow.
- `src/lib/marketing/llms.ts`'s hand-curated route list omits `/features/*` subpages and the `/fr/*` legal/guide pages present in the sitemap — incomplete, not broken.
- Recent `sign-in-form.tsx` changes (`defaultEmail`, `readOnly`, `hideSignUpLink`) are internally consistent and correctly threaded through both password and magic-link branches.
- Admin routes (`requireAdmin`/`isAdminEmail`) and the pro portal layout (`requireApprovedPartner`) are properly gated; the circles page correctly checks `circle_members` ownership before showing case data.
