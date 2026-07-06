import type { MetadataRoute } from "next";
import { SITE } from "@/lib/marketing/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/api/", "/pro/", "/onboarding/", "/auth/", "/join/", "/admin/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
