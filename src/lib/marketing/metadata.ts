import type { Metadata } from "next";
import { SITE } from "./site";

export type MarketingLocale = "en" | "fr";

export const MARKETING_LOCALE = {
  en: { ogLocale: "en_CA" as const, hrefLang: "en-CA" as const },
  fr: { ogLocale: "fr_CA" as const, hrefLang: "fr-CA" as const },
} as const;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  locale?: MarketingLocale;
  /** hreflang pairs for translated marketing pages */
  languageAlternates?: { en: string; fr: string };
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  locale = "en",
  languageAlternates,
}: PageMeta): Metadata {
  const canonical = `${SITE.url}${path}`;
  const fullTitle = path === "/" ? `${SITE.name} | ${title}` : `${title} | ${SITE.name}`;
  const og = ogTitle ?? title;
  const ogDesc = ogDescription ?? description;
  const localeMeta = MARKETING_LOCALE[locale];

  const alternates: Metadata["alternates"] = { canonical };
  if (languageAlternates) {
    alternates.languages = {
      [MARKETING_LOCALE.en.hrefLang]: `${SITE.url}${languageAlternates.en}`,
      [MARKETING_LOCALE.fr.hrefLang]: `${SITE.url}${languageAlternates.fr}`,
    };
  }

  return {
    title: fullTitle,
    description,
    alternates,
    openGraph: {
      type: "website",
      locale: localeMeta.ogLocale,
      url: canonical,
      siteName: SITE.name,
      title: `${og} | ${SITE.name}`,
      description: ogDesc,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${og} | ${SITE.name}`,
      description: ogDesc,
      images: ["/opengraph-image"],
    },
  };
}
