/** Secret URL prefix for staff-only tools (blog CMS, partner review). Not linked from the public site. */
export function getStaffBasePath(): string | null {
  const raw = process.env.COPARA_STAFF_PATH?.trim();
  if (!raw) return null;

  let path = raw.startsWith("/") ? raw : `/${raw}`;
  path = path.replace(/\/+$/, "");

  if (path === "/admin" || path === "/app" || path === "/api" || path.length < 8) {
    return null;
  }

  if (!/^\/[a-z0-9][a-z0-9-]*$/i.test(path)) {
    return null;
  }

  return path;
}

export function staffPath(suffix = ""): string {
  const base = getStaffBasePath();
  if (!base) {
    throw new Error("COPARA_STAFF_PATH is not configured.");
  }
  if (!suffix) return base;
  return `${base}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}

export function isStaffRequestPath(pathname: string): boolean {
  const base = getStaffBasePath();
  if (!base) return false;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function staffPathToInternal(pathname: string): string {
  const base = getStaffBasePath();
  if (!base || !isStaffRequestPath(pathname)) return pathname;
  const rest = pathname.slice(base.length);
  return `/admin${rest || ""}`;
}

export function isInternalStaffPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
