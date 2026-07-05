import { isPlanKey } from "@/lib/stripe/config";

function subscribePath(plan: string, ref: string) {
  const params = new URLSearchParams({ plan });
  if (ref) params.set("ref", ref);
  return `/subscribe?${params.toString()}`;
}

/** Post-auth destination from sign-in / sign-up / OAuth query params. */
export function resolveAuthRedirect(options: {
  next?: string | null;
  plan?: string | null;
  ref?: string | null;
  /** Default when no next/plan (sign-in vs sign-up). */
  fallback?: string;
}): string {
  const next = options.next?.trim() ?? "";
  const plan = options.plan?.trim() ?? "";
  const ref = options.ref?.trim() ?? "";
  const fallback = options.fallback ?? "/app";

  if (next.startsWith("/join/")) return next;
  if (plan && isPlanKey(plan)) return subscribePath(plan, ref);
  if (next.startsWith("/")) return next;
  return fallback;
}

export function authCallbackUrl(origin: string, destination: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent(destination)}`;
}
