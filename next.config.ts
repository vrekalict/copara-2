import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Blog edit forms include full post body + cover image (up to 5MB in storage bucket).
      bodySizeLimit: "6mb",
    },
  },
};

export default withSerwist(withNextIntl(nextConfig));
