# Audit Fix Verification

Independent re-check of every "Done" row in [`AUDIT_FIXES.md`](./AUDIT_FIXES.md) against the actual code. Each finding was re-derived from source, not taken on the tracker's word.

**Status after verification follow-up (2026-07-05): all items closed.**

---

## Follow-up items (resolved)

### A. Open redirect control-character bypass  **Fixed**
`isSafeRedirectPath()` now rejects embedded C0 control characters (`\u0000-\u001F`) and DEL (`\u007F`) so paths like `/\t/evil.com` cannot pass validation. See `src/lib/auth/redirect.ts`.

### B. Marketing copy overstating check-in verification  **Fixed**
Updated FAQ, homepage, security page, calendar feature page, co-parenting guide, and privacy policy copy to state that check-ins record whether GPS was provided  not proximity or arrival verification.

### C. `gps_provided` migration idempotency  **Documented**
Migration `20260705170000` is a one-shot rename tracked by Supabase migration history. Deploy via `supabase db push` only; do not re-run SQL manually. Already applied to production.

---

## Fully verified as fixed

| # | Finding | Verdict |
|---|---------|---------|
| 1 | Open redirect | Fixed (including control-char bypass) |
| 2 | `addChild` no ownership check | Fixed |
| 3 | `inviteCoParent` no ownership check | Fixed |
| 4 | Paywall not enforced in actions | Fixed |
| 5 | Export tamper detection dead code | Fixed |
| 6 | Check-in "verified" naming misleading | Fixed (code + copy) |
| 7 | Partner wrong-account dead end | Fixed |
| 8 | "Already activated" unreachable | Fixed |
| 9 | Malformed subscribe URL | Fixed |
| 10 | Referral param dropped (professional redirect) | Fixed |
| 11 | Partner sign-up for existing accounts | Fixed |
| 12 | Messages page missing auth guard | Fixed |
| 13 | Exports GET missing membership check | Fixed |
| 14 | `<html lang>` wrong on `/fr/*` | Fixed |
| 15 | OG locale hardcoded English | Fixed |
| 16 | No hreflang between locale pairs | Fixed |
| 17 | Wrong-account title misleading | Fixed |
|  | N+1 in digest cron | Fixed |
|  | `llms.ts` route index incomplete | Fixed |
|  | Column rename `location_verified`’`gps_provided` | Fixed |

See [`AUDIT_FIXES.md`](./AUDIT_FIXES.md) for file-level change log.
