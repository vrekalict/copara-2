/**
 * Brand image paths under /public/brand/.
 * Drop your files using these exact names — see docs/BRAND_ASSETS.md.
 */
export const BRAND_ASSETS = {
  logo: {
    dark: {
      desktop: "/brand/logo-dark-desktop.png",
      mobile: "/brand/logo-dark-mobile.png",
    },
    light: {
      desktop: "/brand/logo-light-desktop.png",
      mobile: "/brand/logo-light-mobile.png",
    },
  },
  mark: {
    dark: "/brand/mark-dark.png",
    light: "/brand/mark-light.png",
  },
  icons: {
    favicon32: "/brand/favicon-32.png",
    apple180: "/brand/apple-touch-icon.png",
    pwa192: "/brand/icon-192.png",
    pwa512: "/brand/icon-512.png",
    maskable512: "/brand/icon-maskable-512.png",
  },
} as const;

export type LogoVariant = "dark" | "light";
export type LogoLayout = "desktop" | "mobile";

/** Display dimensions (CSS px) — adjust if your artboards differ. */
export const LOGO_DISPLAY = {
  desktop: { width: 140, height: 36 },
  mobile: { width: 36, height: 36 },
  mark: { width: 32, height: 32 },
} as const;

export function logoSrc(variant: LogoVariant, layout: LogoLayout) {
  return BRAND_ASSETS.logo[variant][layout];
}
