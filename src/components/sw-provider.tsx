"use client";

import { usePathname } from "next/navigation";
import { SerwistProvider } from "@serwist/turbopack/react";

const SW_BYPASS_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/auth",
  "/onboarding",
  "/subscribe",
  "/account",
  "/join",
  "/pro",
] as const;

function shouldDisableServiceWorker(pathname: string): boolean {
  if (process.env.NODE_ENV === "development") return true;

  if (SW_BYPASS_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  // Staff CMS uses a secret path prefix configured per deployment.
  if (/^\/copara-staff-[a-z0-9-]+(?:\/|$)/i.test(pathname)) {
    return true;
  }

  return false;
}

export function SwProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const disable = shouldDisableServiceWorker(pathname);

  return (
    <SerwistProvider swUrl="/serwist/sw.js" disable={disable} reloadOnOnline>
      {children}
    </SerwistProvider>
  );
}
