import type { Metadata } from "next";
import { SITE } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: PageMeta): Metadata {
  const canonical = `${SITE.url}${path}`;
  const fullTitle = path === "/" ? `${SITE.name} | ${title}` : `${title} | ${SITE.name}`;
  const og = ogTitle ?? title;
  const ogDesc = ogDescription ?? description;

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: SITE.locale,
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
