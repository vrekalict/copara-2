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
- [x] **Referral handout** — auto-generated PDF at `/pro/materials/referral-handout` with each partner's `/r/{slug}` link and QR code
- [x] **Vanity referral URLs** — partners choose `/r/{slug}` on the dashboard; availability check; lazy migration from legacy hex codes on first dashboard visit
- [x] **Client handout** — auto-generated per case at `/pro/materials/client-handout?circleId=…` with case invite link + QR; download from each case page

## Your action items (manual assets)

Add files with **exact filenames** below. Until a file exists, the dashboard shows it as *Coming soon* (not downloadable).

**Referral handout and client handout do not need manual PDFs** — partners download personalized versions from the app.

### English — `public/partner/en/`

| File | Purpose |
|------|---------|
| `partner-one-pager.pdf` | Partner program overview for your own reference or colleagues |

### French — `public/partner/fr/` (optional)

Same filenames as English. If a French file is missing, partners on `/fr` fall back to the English PDF.

| File | Purpose |
|------|---------|
| `partner-one-pager.pdf` | Aperçu du programme partenaire |

### Brand pack — `public/partner/brand/` (locale-neutral)

| File | Purpose |
|------|---------|
| `copara-logo-pack.zip` | Logos and marks for slide decks / websites (see `docs/BRAND_ASSETS.md` for source assets) |
| `brand-guidelines.pdf` | Optional — logo usage, colours, do/don't (can ship later) |

## Dynamic PDFs (no manual files)

### Referral handout

Partners click **Download** on **Referral handout** in the dashboard. The app generates a one-page PDF with:

- Copara logo from `public/brand/logo-dark-desktop.png`
- Their unique referral URL (`https://copara.ca/r/{slug}`)
- QR code encoding the same URL
- EN or FR copy based on dashboard locale

Implementation: `GET /pro/materials/referral-handout` (approved partners only).

Edit layout/copy in `src/lib/pro/referral-handout-pdf.tsx`, `src/lib/pro/referral-handout-copy.ts`, and `src/lib/pro/referral-qr.ts`.

### Client handout (per case)

On each case page (`/pro/circles/{id}`), partners click **Download client handout**. The PDF includes:

- Case name in the subtitle
- That case's invite URL (`/join/case/{circleId}`) and QR code
- EN or FR copy based on locale

Implementation: `GET /pro/materials/client-handout?circleId=…` (approved partner with active professional membership on the case).

Edit layout/copy in `src/lib/pro/client-handout-pdf.tsx` and `src/lib/pro/client-handout-copy.ts`.

## Vanity referral URLs

- **Format:** `https://copara.ca/r/{slug}`
- **Route:** `src/app/r/[slug]/page.tsx` redirects to `/sign-up?ref={slug}`
- **Slug picker:** Referral program section on `/pro/dashboard`
- **Migration:** Existing partners get a slug derived from practice name on first dashboard visit (`ensureReferralSlugForUser` in `src/lib/pro/referrals.ts`); `referral_code` is updated to match for commission tracking
- **Attribution:** Sign-up (`captureReferralLead`), Stripe checkout metadata, and webhook handlers resolve slugs via `findProfessionalByReferralRef`

**Partner one-pager** — mirror `/professionals` benefits: read-only access, cases, exports, referral bonus. (No Claude prompt yet — add one here if you want.)

## Not in v1 (future)

- [ ] Printed kit request form
- [ ] Admin upload UI for materials

## Verify locally

1. Sign in as an approved partner → `/pro/dashboard` → choose a slug under **Referral program** → copy `/r/{slug}` link
2. Visit `/r/{slug}` → should redirect to sign-up with `?ref=` set
3. **Referral handout** → **Download** (PDF should include `/r/{slug}` + QR)
4. Open a case → **Download client handout** (PDF should include `/join/case/{id}` + QR)
5. Drop a test PDF at `public/partner/en/partner-one-pager.pdf` → **Partner one-pager** shows **Download**
