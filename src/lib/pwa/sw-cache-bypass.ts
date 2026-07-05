declare const __COPARA_STAFF_PATH__: string;

const BYPASS_PREFIXES = [
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

/** Routes that must always hit the network (auth, admin CMS, billing). */
export function shouldBypassSwCache(pathname: string): boolean {
  if (BYPASS_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  const staffPath = typeof __COPARA_STAFF_PATH__ === "string" ? __COPARA_STAFF_PATH__.trim() : "";
  const normalizedStaffPath = staffPath.replace(/\/+$/, "");
  if (
    normalizedStaffPath &&
    (pathname === normalizedStaffPath || pathname.startsWith(`${normalizedStaffPath}/`))
  ) {
    return true;
  }

  return false;
}
