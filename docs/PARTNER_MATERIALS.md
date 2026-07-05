# Partner digital materials kit

Digital self-serve materials for approved Copara partners. Physical print / mail-order is out of scope for now.

## Code (done)

- [x] Material catalog in `src/lib/pro/materials.ts` (filenames, paths, availability check)
- [x] Dashboard section **Marketing materials** on `/pro/dashboard`
- [x] Download links for PDFs/ZIP when files exist in `public/partner/`
- [x] Copy-to-clipboard email templates (case invite + referral outreach)
- [x] Locale-aware paths (`en/`, `fr/`) with English fallback for missing French files
- [x] Partner guide copy updated to say **download** (not request) materials
- [x] Placeholder folders: `public/partner/en/`, `public/partner/fr/`, `public/partner/brand/`
- [x] **Referral handout** — auto-generated PDF at `/pro/materials/referral-handout` with each partner's unique referral link (`src/lib/pro/referral-handout-pdf.tsx`)
- [x] **QR code** on referral handout PDF (same URL as the printed link)

## Your action items (manual assets)

Add files with **exact filenames** below. Until a file exists, the dashboard shows it as *Coming soon* (not downloadable).

**Referral handout does not need a manual PDF** — partners download a personalized version from the dashboard (includes their `/sign-up?ref=…` link and QR code).

### English — `public/partner/en/`

| File | Purpose |
|------|---------|
| `client-handout.pdf` | Give to clients after you create a case — explains case invite, trial, and signup |
| `partner-one-pager.pdf` | Partner program overview for your own reference or colleagues |

### French — `public/partner/fr/` (optional)

Same filenames as English. If a French file is missing, partners on `/fr` fall back to the English PDF.

| File | Purpose |
|------|---------|
| `client-handout.pdf` | Fiche client — invitation de dossier |
| `partner-one-pager.pdf` | Aperçu du programme partenaire |

### Brand pack — `public/partner/brand/` (locale-neutral)

| File | Purpose |
|------|---------|
| `copara-logo-pack.zip` | Logos and marks for slide decks / websites (see `docs/BRAND_ASSETS.md` for source assets) |
| `brand-guidelines.pdf` | Optional — logo usage, colours, do/don't (can ship later) |

## Suggested PDF content (for when you design them)

### Client handout — Claude prompt

Attach the Copara logo when you send this prompt (use `public/brand/logo-dark-desktop.png` — navy wordmark on transparent, for light backgrounds).

Save the result as `public/partner/en/client-handout.pdf` (and a French version as `public/partner/fr/client-handout.pdf` if needed).

```
Create a print-ready, one-page PDF handout for Copara (copara.ca) — a co-parenting app for separated parents in Canada.

I have attached the company logo. Place it prominently in the header. Use brand colours: navy #111439, accent #635BFF, background cream #F8F8F9, body text dark slate. Clean, professional, calm tone — suitable for a family lawyer or mediator to give to clients. Letter size (8.5×11), generous margins, readable at 11–12pt body.

Audience: A parent whose mediator/lawyer/coordinator just created a Copara case for them.

Title suggestion: "You've been invited to Copara"

Must include these sections (use plain language, short bullets or numbered steps):

1. What happened — Your professional set up a co-parenting case for you on Copara, a shared space for messages, calendar, shared expenses, and organized records.

2. What to do next —
   - Watch for an email from Copara with a link to join your case.
   - Both parents use the same invite link; each signs in with the email address that received the invite.
   - Create your account (or sign in) and accept the invite.

3. Subscription — Joining the case does not automatically mean free access forever. After accepting, you start a 14-day free trial, then choose a subscription. A Family Circle plan can cover both parents in one subscription.

4. What Copara helps with — Calmer messaging, shared calendar, expense tracking, journal, vault for child info, exportable records.

5. Privacy & records — Messages and records are organized and append-only over time. Copara supports communication; it does not replace legal advice.

Footer: copara.ca · Questions? Contact your professional or support@copara.ca (or similar). Small print: Copara is not a law firm and does not provide legal advice.

Do not include a specific case URL (that is unique per family). Do not include partner referral links on this handout — this document is only for the case-invite flow.

Output: a single PDF file ready to save as client-handout.pdf
```

---

### Referral handout — auto-generated (no manual PDF)

Partners click **Download** on **Referral handout** in the dashboard. The app generates a one-page PDF on the fly with:

- Copara logo from `public/brand/logo-dark-desktop.png`
- Their unique referral URL (`/sign-up?ref={code}` today)
- QR code encoding the same URL
- EN or FR copy based on dashboard locale

Implementation: `GET /pro/materials/referral-handout` (approved partners only).

To tweak layout or copy, edit `src/lib/pro/referral-handout-pdf.tsx`, `src/lib/pro/referral-handout-copy.ts`, and `src/lib/pro/referral-qr.ts`.

---

**Partner one-pager** — mirror `/professionals` benefits: read-only access, cases, exports, referral bonus. (No Claude prompt yet — add one here if you want.)

---

## Future: vanity referral URLs (planned — not built)

**Status:** Proposal only. Do not implement until approved.

### Today

- Referral code: random 8-char hex (e.g. `a3f9b2c1`)
- Public URL: `https://copara.ca/sign-up?ref=a3f9b2c1`
- Stored in `profiles.referral_code` (unique index)

### Proposal

Professional URLs such as:

- `https://copara.ca/ref/smith-family-law`
- or `https://copara.ca/r/smith-family-law`

### Why this is better

- More credible on printed handouts and in conversation
- Easier to remember and dictate
- Matches how partners think about their practice brand

### Recommended approach

1. **Path-based redirect (preferred)** — Add route `/ref/[slug]` that:
   - Looks up `profiles.referral_slug` (or reuse `referral_code` with slug format)
   - Redirects to `/sign-up?ref={code}` (preserves existing attribution + Stripe metadata flow)
   - Keeps one source of truth in DB; minimal change to webhook/signup logic

2. **Slug generation** — On partner approval (or first dashboard visit):
   - Derive from `practice_name` on application/profile: `"Smith Family Law"` → `smith-family-law`
   - Validate: `[a-z0-9-]`, 3–48 chars, no leading/trailing hyphens
   - Collision handling: append `-2`, `-3`, or short suffix
   - **Do not** auto-regenerate slug if practice renames (avoid breaking printed materials); optional manual admin edit

3. **Backward compatibility** — Keep existing hex codes working forever (`?ref=` still valid). New partners get slugs; optional one-time migration for existing partners.

4. **Partner dashboard** — Show primary link as vanity URL; keep `?ref=` as alternate/copy. PDF + QR use vanity URL once live.

5. **Reserved slugs blocklist** — `sign-up`, `pro`, `app`, `admin`, `api`, `ref`, `join`, etc.

### What would change (when approved)

| Area | Change |
|------|--------|
| Migration | `referral_slug` column + unique index, or migrate `referral_code` format |
| `src/lib/pro/referrals.ts` | Slug generation, lookup by slug, `buildReferralUrl()` |
| `src/app/ref/[slug]/page.tsx` | Redirect to sign-up with ref |
| Partner approval flow | Set slug from practice name |
| Referral handout PDF / QR | Use vanity URL |
| Existing partners | Migration script or lazy slug on next login |

### Open decisions (need your OK)

- Exact path: `/ref/{slug}` vs `/r/{slug}` vs subdomain
- Can partners **choose** their slug in dashboard, or admin-assigned only?
- Migrate existing hex codes to slugs, or dual links indefinitely?

---

## Not in v1 (future)

- [ ] Vanity referral URLs (see plan above)
- [ ] Printed kit request form
- [ ] Dynamic client handout with case-specific link
- [ ] Admin upload UI for materials

## Verify locally

1. Sign in as an approved partner → `/pro/dashboard` → **Referral handout** → **Download** (PDF should include your referral URL + QR)
2. Drop a test PDF at `public/partner/en/client-handout.pdf` → **Client handout** shows **Download**
3. Remove the client PDF → label switches to **Coming soon**
