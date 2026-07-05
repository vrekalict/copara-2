# Partner digital materials kit

Digital self-serve materials for approved Copara partners. Physical print / mail-order is out of scope for now.

## Code (done)

- [x] Material catalog in `src/lib/pro/materials.ts`
- [x] Dashboard section **Marketing materials** on `/pro/dashboard`
- [x] Copy-to-clipboard email templates (case invite + referral outreach)
- [x] **Referral handout** — `/pro/materials/referral-handout` (personalized `/r/{slug}` + QR)
- [x] **Client handout** — `/pro/materials/client-handout?circleId=…` (per case, from case page)
- [x] **Partner one-pager** — `/pro/materials/partner-one-pager` (program overview, EN/FR)
- [x] **Brand guidelines** — `/pro/materials/brand-guidelines` (logo, colours, co-branding, EN/FR)
- [x] Vanity referral URLs — `/r/{slug}` with dashboard slug picker

## Manual asset (optional)

| File | Location | Purpose |
|------|----------|---------|
| `copara-logo-pack.zip` | `public/partner/brand/` | Logos and marks for slide decks / websites |

Until the ZIP exists, **Logo pack** shows *Coming soon*. Source assets live in `public/brand/` (see `docs/BRAND_ASSETS.md`).

## Dynamic PDFs

| Material | Route | Notes |
|----------|-------|-------|
| Referral handout | `GET /pro/materials/referral-handout` | Partner's `/r/{slug}` + QR |
| Client handout | `GET /pro/materials/client-handout?circleId=…` | Case invite link + QR |
| Partner one-pager | `GET /pro/materials/partner-one-pager` | Program overview |
| Brand guidelines | `GET /pro/materials/brand-guidelines` | Logo usage + colours |

All routes require an approved partner session. Edit copy in `src/lib/pro/*-copy.ts` and layout in `src/lib/pro/*-pdf.tsx`.

## Verify locally

1. Sign in as approved partner → `/pro/dashboard` → **Marketing materials**
2. Download **Partner one-pager** and **Brand guidelines** (PDFs generate on the fly)
3. **Referral handout** includes your `/r/{slug}` + QR
4. Case page → **Download client handout**
5. Drop `public/partner/brand/copara-logo-pack.zip` → **Logo pack** shows **Download**
