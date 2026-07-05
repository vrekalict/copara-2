import type { MetadataRoute } from "next";
import { getStaffBasePath } from "@/lib/admin/staff-path";
import { SITE } from "@/lib/marketing/site";

export default function robots(): MetadataRoute.Robots {
  const staffPath = getStaffBasePath();
  const disallow = ["/app/", "/api/", "/pro/", "/onboarding/", "/auth/", "/join/", "/admin/"];
  if (staffPath) {
    disallow.push(`${staffPath}/`);
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
