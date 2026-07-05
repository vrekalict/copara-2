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

## Your action items (manual assets)

Add files with **exact filenames** below. Until a file exists, the dashboard shows it as *Coming soon* (not downloadable).

### English — `public/partner/en/`

| File | Purpose |
|------|---------|
| `client-handout.pdf` | Give to clients after you create a case — explains case invite, trial, and signup |
| `referral-handout.pdf` | Waiting room / intake — explains Copara + your referral link (not case-specific) |
| `partner-one-pager.pdf` | Partner program overview for your own reference or colleagues |

### French — `public/partner/fr/` (optional)

Same filenames as English. If a French file is missing, partners on `/fr` fall back to the English PDF.

| File | Purpose |
|------|---------|
| `client-handout.pdf` | Fiche client — invitation de dossier |
| `referral-handout.pdf` | Fiche parrainage — lien partenaire |
| `partner-one-pager.pdf` | Aperçu du programme partenaire |

### Brand pack — `public/partner/brand/` (locale-neutral)

| File | Purpose |
|------|---------|
| `copara-logo-pack.zip` | Logos and marks for slide decks / websites (see `docs/BRAND_ASSETS.md` for source assets) |
| `brand-guidelines.pdf` | Optional — logo usage, colours, do/don't (can ship later) |

## Suggested PDF content (for when you design them)

**Client handout** should cover:

- Your professional invited them to a Copara case
- They will receive an email with a link (`/join/case/…`)
- Sign in with the **same email** that received the invite
- {trialDays}-day free trial, then subscription (Family plan option)
- Copara is private, append-only records — not legal advice

**Referral handout** should cover:

- What Copara is (co-parenting communication + records)
- Your partner referral link / QR (they sign up at `/sign-up?ref=…`)
- Does **not** create a case or grant you access — bonus tracking only
- {trialDays}-day trial for parents

**Partner one-pager** — mirror `/professionals` benefits: read-only access, cases, exports, referral bonus.

## Not in v1 (future)

- [ ] Personalized referral QR code (generated per partner)
- [ ] Printed kit request form
- [ ] Dynamic PDFs with partner practice name
- [ ] Admin upload UI for materials

## Verify locally

1. Drop a test PDF at `public/partner/en/client-handout.pdf`
2. Sign in as an approved partner → `/pro/dashboard`
3. **Marketing materials** section should show **Download** for that file
4. Remove the file → label switches to **Coming soon**
