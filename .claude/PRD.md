# PRD — "Accord" Co-Parenting Platform (MVP)

**Version:** 1.0
**Owner:** Tom
**Target:** Hand-off document for AI-assisted build (Cursor)
**Status:** Ready for build

---

## 1. Product Overview

### 1.1 One-liner
An AI-native co-parenting platform that helps separated parents communicate neutrally, coordinate custody schedules, track shared expenses, and generate court-ready records — distributed as a PWA (installable on iOS/Android/web from a single codebase).

### 1.2 Positioning vs. incumbents (AppClose, OurFamilyWizard)
We are NOT building feature-parity. The wedge is:
1. **AI-assisted neutral messaging** — deeper than AppClose's Co-Parent Assist: full rewrite suggestions before sending, not just tone flags.
2. **AI dispute summarization** — "summarize the last 30 days of conflict about pickup times" → court-ready PDF summary for attorneys/mediators.
3. **Automatic schedule-violation detection** — planned vs. actual custody time auto-flagged, not just logged.
4. **Bilingual (English + French)** — differentiator for Canadian family courts (Ontario/Quebec).
5. **Mediator/attorney dashboard** — B2B distribution channel (design-partner mediators onboard both parents at once, solving the two-sided adoption problem).

### 1.3 Non-goals for MVP
- Native iOS/Android apps (PWA only; Capacitor wrap post-validation)
- In-app payments/money movement (log expenses + reimbursement requests only; Stripe Connect in Phase 2)
- Audio/video calling (Phase 2)
- Certified/notarized business records with legal affidavits (Phase 2 — requires legal review; MVP ships tamper-evident exports)

---

## 2. Users & Roles

| Role | Description | Permissions |
|---|---|---|
| `parent` | Co-parent in a circle | Full: message, schedule, expenses, exports |
| `third_party` | Grandparent, stepparent, caregiver | Scoped: see only what parents share |
| `professional` | Mediator, attorney, GAL | Read-only observer of shared threads/calendar; can export records; owns a firm dashboard |
| `admin` | Platform admin (Tom) | Support tooling, fee waivers, moderation |

**Circle** = the core tenancy unit. A circle contains exactly 2 parents + N invited members. A user can belong to multiple circles (blended families).

---

## 3. Core MVP Features

### 3.1 Auth & Onboarding
- Supabase Auth: email/password + magic link. Google OAuth optional.
- Onboarding wizard: create profile → create circle → invite co-parent (email/SMS link) → add children (name, DOB, allergies/medical notes, school) → optional: invite professional.
- **Co-parent invite flow is critical:** invite link works without app install (web-first), shows a value-prop landing page, and the inviting parent can send requests to a non-registered co-parent via email (they can respond by email until they join).
- Locale selection: `en` / `fr` (next-intl or similar; all UI strings in translation files from day 1).

### 3.2 Secure Messaging (immutable)
- 1:1 and group threads within a circle. Professionals can be added as observers to a thread.
- Messages are **append-only**: no edit, no delete. Server-side timestamp (sent/delivered/read receipts stored).
- **Hash chain:** each message row stores `sha256(prev_hash + message_id + sender_id + body + created_at)`. This makes exports tamper-evident.
- Attachments: images, PDFs, docs → Supabase Storage, virus-scan optional (Phase 2), max 25MB.
- Full-text search (Postgres `tsvector`) by keyword + date range.
- Export any thread to PDF (see 3.7).

### 3.3 AI Tone Review & Neutral Rewrite ("Steady Send")
- Before send, message body is optionally analyzed by OpenAI (`gpt-5.4-mini` by default).
- Returns: tone assessment (hostile / neutral / constructive), specific flagged phrases, and **1–3 full rewrite suggestions** the user can tap to replace their draft.
- UX: subtle inline indicator while typing stops (debounced 1.5s after pause, or on send tap). Never blocks sending — user always retains control. One-tap "Send as-is."
- Every AI suggestion + whether it was accepted is logged to `ai_events` (audit trail; also future training signal).
- System prompt requirements: never fabricate facts, never take sides, rewrite preserves the sender's actual request/content, plain language, no legal advice.
- Rate limiting: 30 AI calls/user/hour (config).

### 3.4 AI Dispute Summarizer (professional + parent facing)
- Input: thread(s) + date range + optional topic filter ("pickup times").
- Output: structured summary — timeline of events, each party's stated position, unresolved items, linked message IDs as citations.
- Rendered in-app and exportable to PDF with a disclaimer footer ("AI-generated summary; original records attached/available; not legal advice").
- Uses the Messages API with the thread transcript; chunk long threads; cite message IDs.

### 3.5 Custody Calendar & Schedule
- Shared calendar per circle: events (appointments, activities) + **parenting-time blocks** (recurring templates: week-on/week-off, 2-2-3, alternating weekends, custom RRULE).
- Change requests: swap day, adjust pickup/dropoff time/location → other parent approves/declines; all logged.
- **Check-ins:** parent taps "Check in" at exchange → stores GPS-verified timestamp + coarse location confirmation (arrival verification only — location is never shared/tracked between parents; store a boolean "verified at expected location" + timestamp, not raw coordinates visible to the other parent).
- **Violation detection (AI-lite, rules-based for MVP):** compare planned parenting-time blocks vs. check-in records; auto-flag late (>15 min configurable), missed, or unlogged exchanges into a `schedule_events` log. Weekly digest.

### 3.6 Expense Tracking & Reimbursement Requests
- Log expense: amount, category (medical, school, activities, clothing, other), child, receipt photo, split % (default 50/50, configurable per circle).
- Reimbursement request → other parent approves / declines / disputes (with reason). Status log immutable.
- Running balance per circle ("Alex owes Jordan $214.50").
- NO money movement in MVP. "Mark as paid outside app" with confirmation from both sides.

### 3.7 Court-Ready Exports
- Export: messages (thread/date range), expense history, schedule + check-in log, change requests.
- PDF format: cover page (circle, parties, date range, export timestamp, export ID/UUID), every record with server timestamps, final page with the hash-chain verification digest and instructions to verify at `/verify/[export-id]`.
- `/verify/[export-id]` public page: re-computes the chain and confirms the export matches stored records (tamper-evidence, not legal certification — copy must say "tamper-evident record export," never "certified").
- Exports are free and unlimited (adoption lever; AppClose charges).

### 3.8 Info Vault
- Per child: medical (allergies, medications, doctors), school, sizes, emergency contacts, documents (insurance cards, custody order PDF).
- Sharing controls: parents choose what third parties/professionals see.

### 3.9 Professional (Mediator/Attorney) Dashboard
- Separate role + `/pro` area: list of connected circles, read-only view of shared threads/calendar/expenses, one-click export, AI dispute summary generation.
- Professionals sign up free; they invite BOTH parents via one link (this is the B2B distribution wedge).

### 3.10 Notifications
- Web Push (VAPID) for: new message, new request, request decision, upcoming exchange (2h before), weekly digest.
- Email fallback (Resend) for all of the above + for non-registered co-parents receiving requests.

---

## 4. PWA Requirements (iOS/Android readiness)

### 4.1 Baseline
- `manifest.webmanifest`: name "Accord", short_name, icons (192/512 + maskable), `display: standalone`, theme/background colors, `start_url: /app`.
- Service worker (use `@serwist/next` — successor to next-pwa — or Workbox): precache app shell, runtime cache for API GETs (stale-while-revalidate), offline fallback page. Messages queue-and-retry on reconnect (Background Sync where supported; manual retry queue in IndexedDB as fallback for iOS).
- Web Push via service worker (iOS 16.4+ supports push for installed PWAs — installation is REQUIRED for push on iOS, which strengthens the install prompt case).

### 4.2 Install Prompt (explicit requirement)
Implement a smart install prompt component (`<InstallPrompt />`):

**Trigger logic:**
- Never show on first visit. Show after engagement signal: user has completed onboarding AND (sent ≥1 message OR returned for a 2nd session).
- Also show contextually when the user enables notifications on iOS Safari (since push requires install on iOS).
- Respect dismissal: if dismissed, snooze 7 days (localStorage is unavailable per platform constraints in some embedded contexts — persist snooze in the `user_settings` DB row, keyed to user).
- Never show if already installed (`display-mode: standalone` media query or `navigator.standalone`).

**Platform behavior:**
- **Android/Chrome + desktop Chrome/Edge:** capture `beforeinstallprompt` event, suppress default, show custom bottom-sheet: "Install Accord for faster access and notifications" with [Install] → call `prompt()`.
- **iOS Safari:** no `beforeinstallprompt`. Show an instructional sheet: "Tap Share → Add to Home Screen" with the share icon graphic and 2-step visual. Detect iOS via UA + `!navigator.standalone`.
- Track events: `pwa_prompt_shown`, `pwa_prompt_accepted`, `pwa_prompt_dismissed`, `pwa_installed` (via `appinstalled` event).

### 4.3 Native-feel requirements
- Bottom tab nav on mobile (Messages / Calendar / Expenses / Vault / More), top app bar, safe-area insets (`env(safe-area-inset-*)`), no 300ms tap delay, `viewport-fit=cover`, pull-to-refresh disabled where it conflicts, skeleton loaders, 44px minimum touch targets.
- Lighthouse PWA + performance targets: PWA installable ✓, LCP < 2.5s on 4G, CLS < 0.1.

---

## 5. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript | Same patterns as prior projects |
| Styling | Tailwind CSS + shadcn/ui | Brand: define tokens in `globals.css`; clean, calm, trust-signaling palette (blues/neutrals — deliberately NOT aggressive reds) |
| DB/Auth/Storage/Realtime | Supabase | Postgres + RLS is the security backbone; Realtime channels for live messaging |
| AI | OpenAI API (`gpt-5.4-mini` fast, `gpt-5.4` summary fallback) | Tone review, rewrites, summarization. All calls server-side (API routes) — never expose key client-side |
| Email | Resend | Transactional + non-user request relay |
| Push | Web Push (VAPID) via service worker | `web-push` npm package server-side |
| PDF export | `@react-pdf/renderer` or server-side Playwright/Chromium render | Must embed hash digest + export UUID |
| i18n | `next-intl` | `en` + `fr` from day 1 |
| Payments (Phase 2) | Stripe Connect | Reuse Whisker Payments patterns |
| Hosting | Vercel | Edge-friendly; Supabase hosted separately |
| Native wrap (Phase 3) | Capacitor | Only after retention proof |
| Analytics | PostHog (self-serve) or Vercel Analytics | Must track PWA install funnel + retention cohorts |

---

## 6. Data Model (Supabase / Postgres)

All tables have RLS enabled. Core principle: **a user can only read rows belonging to circles they are a member of, scoped further by role.**

```sql
-- profiles (extends auth.users)
profiles(id uuid pk refs auth.users, display_name, avatar_url, locale text default 'en',
         role_default text, created_at)

-- circles
circles(id uuid pk, name, created_by uuid, expense_split_default numeric default 50,
        timezone text default 'America/Toronto', created_at)

circle_members(id uuid pk, circle_id fk, user_id fk, role text check in
        ('parent','third_party','professional'), invited_email text, status text
        check in ('invited','active','removed'), permissions jsonb, created_at)
-- constraint: max 2 rows with role='parent' per circle

children(id uuid pk, circle_id fk, first_name, dob date, notes_medical text,
         notes_school text, emergency_contacts jsonb, created_at)

-- messaging (append-only: REVOKE UPDATE, DELETE via RLS + trigger guard)
threads(id uuid pk, circle_id fk, title, is_group bool, created_by, created_at)
thread_participants(thread_id fk, user_id fk, role text, added_at)
messages(id uuid pk, thread_id fk, sender_id fk, body text, attachments jsonb,
         prev_hash text, hash text not null, created_at timestamptz default now())
-- trigger: BEFORE INSERT computes hash = sha256(coalesce(prev_hash,'genesis') || id || sender_id || body || created_at)
-- trigger: BLOCK all UPDATE/DELETE
message_receipts(message_id fk, user_id fk, delivered_at, read_at)

-- calendar
schedule_templates(id, circle_id, name, rrule text, parent_a_blocks jsonb, active bool)
events(id, circle_id, child_id nullable, type text check in ('event','parenting_time','exchange'),
       title, starts_at, ends_at, location text, responsible_parent uuid, notes, created_by, created_at)
change_requests(id, circle_id, event_id nullable, type text check in
       ('swap_day','time_change','location_change','other'),
       details jsonb, requested_by, status text check in ('pending','approved','declined'),
       responded_by, responded_at, created_at)
checkins(id, circle_id, event_id fk, user_id, checked_at timestamptz,
         location_verified bool, created_at)  -- raw coords NEVER stored/shared
schedule_events(id, circle_id, event_id, kind text check in ('late','missed','unlogged','on_time'),
         delta_minutes int, detected_at)  -- violation log, system-written

-- expenses (append-only status log)
expenses(id, circle_id, child_id, created_by, amount_cents int, currency text default 'CAD',
         category text, description, receipt_url, split_pct numeric, incurred_on date, created_at)
reimbursement_requests(id, expense_id fk, requested_by, status text check in
         ('pending','approved','declined','disputed','settled'), status_history jsonb, created_at)

-- vault
vault_items(id, circle_id, child_id nullable, kind text, title, content jsonb,
         file_url, visibility jsonb, created_by, created_at)

-- AI + exports
ai_events(id, user_id, circle_id, kind text check in ('tone_review','rewrite_accepted',
         'rewrite_rejected','summary'), input_hash text, output jsonb, model text, created_at)
exports(id uuid pk, circle_id, requested_by, kind text, params jsonb,
         file_url, chain_digest text, created_at)  -- powers /verify/[id]

-- settings & push
user_settings(user_id pk, pwa_prompt_snoozed_until timestamptz, notif_prefs jsonb)
push_subscriptions(id, user_id, endpoint text, keys jsonb, created_at)
```

**RLS essentials:**
- `is_circle_member(circle_id)` security-definer helper used in all policies.
- `professional` role: SELECT only, and only on threads where they're a `thread_participant`, plus calendar/expenses if `permissions->>'view_finance' = 'true'`.
- `messages`: INSERT allowed only for thread participants; UPDATE/DELETE denied to everyone including service role paths in app code (trigger raises exception).

---

## 7. API Routes (App Router `/app/api/*`)

| Route | Method | Purpose |
|---|---|---|
| `/api/circles` | GET/POST | List/create circles |
| `/api/circles/[id]/invite` | POST | Invite member (email link; works for non-users) |
| `/api/threads` `/api/threads/[id]/messages` | GET/POST | Messaging; POST computes hash server-side via trigger |
| `/api/ai/tone-review` | POST | body → OpenAI → tone + rewrites (server-side key) |
| `/api/ai/summarize` | POST | thread ids + range → structured summary (OpenAI; `gpt-5.4-mini` default, `gpt-5.4` fallback) |
| `/api/events` `/api/change-requests` | GET/POST/PATCH | Calendar + requests |
| `/api/checkins` | POST | GPS verify server-side, store boolean only |
| `/api/expenses` `/api/reimbursements` | GET/POST/PATCH | Money tracking |
| `/api/exports` | POST | Generate PDF, compute chain digest, upload to Storage |
| `/api/verify/[exportId]` | GET | Recompute + compare digest |
| `/api/push/subscribe` | POST | Store push subscription |
| `/api/cron/digests` | GET (cron) | Weekly digest + violation detection sweep |

**AI route contract example (`/api/ai/tone-review`):**
```json
// request
{ "draft": "string", "thread_id": "uuid", "locale": "en" }
// response
{ "tone": "hostile|tense|neutral|constructive",
  "flags": [{ "phrase": "...", "reason": "..." }],
  "rewrites": ["...", "...", "..."] }
```

---

## 8. Screens / Routes (mobile-first)

```
/                     Marketing landing (value prop, pro signup CTA, FR toggle)
/join/[inviteId]      Invite landing → signup → auto-join circle
/app                  Shell: bottom tabs
/app/messages         Thread list → /app/messages/[threadId]
/app/calendar         Month/week view, parenting-time color coding, + request button
/app/expenses         List + running balance → /app/expenses/new
/app/vault            Children info + documents
/app/more             Settings, exports, members, language, install app, help
/app/exports          Export builder + history
/pro                  Professional dashboard (circle list → circle detail)
/verify/[exportId]    Public verification page
```

Key components: `<InstallPrompt />` (per §4.2), `<ToneReviewBar />` (composer add-on), `<HashBadge />` (message detail: "record #, verified"), `<ScheduleViolationCard />`, `<ExportWizard />`.

---

## 9. Build Plan (phased, for Cursor execution)

### Phase 0 — Scaffold (Day 1–2)
1. `create-next-app` (TS, Tailwind, App Router) + shadcn/ui + next-intl + Serwist PWA config + manifest + icons.
2. Supabase project: run schema migration (all tables §6), RLS policies, hash trigger, append-only triggers. Seed script with demo circle.
3. Auth flows (email/password + magic link), protected `/app` layout, profile creation.
**Verify:** Lighthouse shows installable PWA; RLS tested with two test users (user B cannot read user A's circle).

### Phase 1 — Core loops (Week 1–2)
4. Circles + invites (including non-user email relay), children, roles.
5. Messaging: threads, realtime (Supabase Realtime), receipts, attachments, search. Append-only + hash chain verified by test.
6. AI tone review + rewrites (server route, debounced composer integration, ai_events logging, rate limit).
**Verify:** e2e test — hostile draft returns rewrites; accepted rewrite logged; messages immutable (UPDATE attempt fails).

### Phase 2 — Coordination (Week 3–4)
7. Calendar: templates (2-2-3, week-on/off, alternating weekends), events, change requests + approvals.
8. Check-ins (server-side geoverification → boolean), violation detection cron, weekly digest email.
9. Expenses + reimbursement requests + running balance.
**Verify:** violation sweep flags a late check-in fixture; balance math property-tested.

### Phase 3 — Records & Pro (Week 5–6)
10. PDF exports + chain digest + `/verify` page.
11. AI dispute summarizer with message-ID citations.
12. Professional role, `/pro` dashboard, dual-parent invite link.
13. Web push + notification preferences + `<InstallPrompt />` full logic + analytics events.
**Verify:** export → alter a DB row copy → verify page detects mismatch; iOS install instructions render on Safari UA; Android `beforeinstallprompt` path works in Chrome.

### Phase 4 — Polish & launch prep (Week 7)
14. FR translation pass, empty states, error boundaries, offline queue for messages, a11y pass (WCAG AA), legal pages (ToS, Privacy — PIPEDA-aware since Canadian users), analytics funnels.
**Launch gate:** 3 design-partner mediators committed; onboarding tested with a real two-parent pair.

---

## 10. Security & Compliance Requirements
- OpenAI API key, Supabase service key, VAPID private key: server-side env only. Never in client bundles.
- All AI processing server-side; store `input_hash` not raw drafts in `ai_events` unless user consents (privacy).
- RLS is the primary authorization layer; API routes additionally validate membership (defense in depth).
- Rate limiting on AI + auth routes (Upstash Redis or Vercel middleware).
- Data residency note: Canadian users → prefer Supabase region ca-central if available; document PIPEDA stance in privacy policy.
- Never market exports as "certified" or "court-admissible" — copy: "tamper-evident, timestamped records suitable for review by legal professionals."
- Coarse location: raw GPS never persisted or shown to the other parent. Only `location_verified: boolean`.

## 11. Success Metrics (MVP validation gates)
- Activation: % of invited co-parents who join within 7 days (target ≥40%)
- D7 retention of parent pairs (target ≥35%)
- PWA install rate among D2+ users (target ≥25%)
- AI rewrite acceptance rate (target ≥20% of flagged drafts)
- 3–5 professionals actively using `/pro` within 60 days
- **Kill condition:** if no mediator/lawyer will pilot with real clients after MVP demo, stop.

## 12. Out of Scope (explicitly, so the AI builder doesn't wander)
- Native builds, app store submissions
- Payments/money movement, ipayou-style features
- Audio/video calls, call recording
- Certified business records / affidavits
- Multi-jurisdiction legal templates
