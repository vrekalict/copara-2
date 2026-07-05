# Copara brand assets

Place your logo and icon files in **`public/brand/`** using these exact filenames.

The site uses your PNGs (or WebP) when present. Until files exist, header logos fall back to the built-in SVG wordmark and favicons use the generated mark.

## Header & footer logos

For **dark** logos use navy/wordmark on transparent — for lilac headers (`/`, marketing pages, app top bar).

For **light** logos use white/wordmark on transparent — for navy backgrounds (footer, auth panel).

| File | Use |
|------|-----|
| `logo-dark-desktop.png` | Marketing header, admin shell (≥640px) |
| `logo-dark-mobile.png` | Marketing header compact (<640px) — often mark-only |
| `logo-light-desktop.png` | Footer, auth panel (≥640px) |
| `logo-light-mobile.png` | Footer / auth on small screens (optional; desktop file used if missing) |

Optional mark-only (app top bar):

| File | Use |
|------|-----|
| `mark-dark.png` | App shell top bar |
| `mark-light.png` | Reserved for dark app chrome |

**Recommended sizes**

- Desktop wordmark: ~280×72 px @2x (displayed ~140×36)
- Mobile / mark: 72×72 px @2x (displayed ~36×36)

SVG is supported — use the same paths with `.svg` extension and update `src/lib/brand/assets.ts`.

## Favicon & PWA icons

| File | Size | Use |
|------|------|-----|
| `favicon-32.png` | 32×32 | Browser tab |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `icon-192.png` | 192×192 | PWA manifest |
| `icon-512.png` | 512×512 | PWA manifest, Open Graph fallback |
| `icon-maskable-512.png` | 512×512 | Android maskable (safe zone ~80% center) |

After adding `favicon-32.png` and `apple-touch-icon.png`, the root layout metadata serves them automatically. PWA manifest reads from `/brand/icon-*.png`.

## Quick checklist

1. Export all variants from your design tool
2. Copy into `public/brand/` with names above
3. Hard-refresh copara.ca (or local dev) — logos update immediately
4. Re-install PWA on phone to pick up new icons

## File tree example

```
public/brand/
  logo-dark-desktop.png
  logo-dark-mobile.png
  logo-light-desktop.png
  logo-light-mobile.png
  mark-dark.png
  favicon-32.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png
  icon-maskable-512.png
```
