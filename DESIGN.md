---
version: marketing-v1
name: Copara
description: Calm Canadian legal-tech / family-tech — blues, slate, cream, mist; premium typography and spacing.
colors:
  primary: "#2563eb"
  primary-foreground: "#ffffff"
  cream: "#faf9f6"
  mist: "#f0f4f8"
  slate: "#334155"
  accent-teal: "#0d9488"
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.03em
  headline:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: Geist
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
spacing:
  section-y: 96px
  section-y-mobile: 64px
  container: 1120px
---

# Copara Design System

## Overview

Copara marketing surfaces use **calm institutional trust** — premium Canadian legal-tech / family-tech. Separated parents should feel stability; professionals should read audit-ready restraint.

App shell (`/app`) shares Geist typography and blue primary; marketing adds cream/mist section backgrounds and wider containers.

## Colors

- **Primary blue (`#2563eb`):** CTAs, links, self-message bubbles in mockups
- **Cream (`--marketing-cream`):** Warm hero/section backgrounds
- **Mist (`--marketing-mist`):** Alternate section wash
- **Slate (`--marketing-slate`):** Headlines on cream, footer text
- **Teal accent (sparingly):** Verified/export badges only — not dominant

**Avoid:** aggressive red, purple AI gradients, neon glows, gray-on-blue low contrast

## Typography

- **Geist** for all marketing copy
- **Geist Mono** for hash snippets, export IDs in mockups only
- Display headlines: `.display` — clamp 2.25–3.75rem, weight 700, tight tracking
- Section headlines: up to 2.75rem on lg
- Body: `.lead` for subheads — muted slate, smaller than hero for contrast
- Eyebrows: `.eyebrow` — uppercase, tracked, primary color
- Minimum 16px body on mobile

## Layout

- Max width: `max-w-6xl` (1120px) centered
- Section padding: `py-16 md:py-24`
- Grid: 1 col mobile → 2–3 col desktop for feature cards
- Phone mockups: realistic aspect ratio, subtle border, no fantasy chrome

## Components (marketing)

| Component | Usage |
|-----------|--------|
| `MarketingHeader` | Sticky nav, mobile menu, Early Access CTA |
| `MarketingFooter` | Links, en/fr, legal |
| `Section` | Consistent vertical rhythm + optional cream/mist bg |
| `FeatureCard` | Icon + title + copy + link |
| `PhoneMockup` | Frame for app UI previews |
| `PricingToggle` | Monthly/yearly CAD switch |
| `FaqAccordion` | Accessible disclosure panels |
| `JsonLd` | Structured data injection |

## Mockups

Build from actual app patterns: message bubbles, tone review bar, bottom nav tabs, hash badges, calendar blocks, expense rows. Static React — no fake screenshots or AI people.

## Do's and Don'ts

**Do:** Strong spacing, accessible contrast, descriptive CTAs, internal links, draft legal warnings  
**Don't:** Lorem ipsum, fake social proof, competitor name-drops, legal overclaims, template hero blobs
