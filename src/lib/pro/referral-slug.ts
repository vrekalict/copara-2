import type { SupabaseClient } from "@supabase/supabase-js";

/** Vanity referral slug helpers for /r/{slug} partner links. */

export const REFERRAL_SLUG_MIN = 3;
export const REFERRAL_SLUG_MAX = 48;

export const RESERVED_REFERRAL_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "blog",
  "contact",
  "dashboard",
  "early-access",
  "faq",
  "features",
  "fr",
  "join",
  "legal",
  "offline",
  "onboarding",
  "pricing",
  "privacy",
  "pro",
  "professionals",
  "r",
  "ref",
  "security",
  "sign-in",
  "sign-up",
  "subscribe",
  "terms",
  "verify",
  "www",
]);

export function slugifyReferralSource(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, REFERRAL_SLUG_MAX);
}

export function validateReferralSlug(slug: string): string | null {
  const normalized = slug.trim().toLowerCase();
  if (normalized.length < REFERRAL_SLUG_MIN) {
    return `Use at least ${REFERRAL_SLUG_MIN} characters.`;
  }
  if (normalized.length > REFERRAL_SLUG_MAX) {
    return `Use at most ${REFERRAL_SLUG_MAX} characters.`;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return "Use lowercase letters, numbers, and single hyphens only.";
  }
  if (RESERVED_REFERRAL_SLUGS.has(normalized)) {
    return "This link is reserved. Choose another.";
  }
  return null;
}

export function isLegacyReferralCode(value: string): boolean {
  return /^[a-f0-9]{8}$/.test(value.trim().toLowerCase());
}

export async function isReferralSlugAvailable(
  supabase: SupabaseClient,
  slug: string,
  excludeUserId?: string,
): Promise<boolean> {
  const normalized = slug.trim().toLowerCase();
  const validation = validateReferralSlug(normalized);
  if (validation) return false;

  let query = supabase.from("profiles").select("id").eq("referral_slug", normalized);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data } = await query.maybeSingle();
  return !data;
}

export async function generateUniqueReferralSlug(
  supabase: SupabaseClient,
  base: string,
  excludeUserId?: string,
): Promise<string> {
  const root = slugifyReferralSource(base);
  const seed =
    root.length >= REFERRAL_SLUG_MIN ? root : slugifyReferralSource(`${root}-partner`);

  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate =
      attempt === 0 ? seed : `${seed.slice(0, REFERRAL_SLUG_MAX - 4)}-${attempt + 1}`;
    const validation = validateReferralSlug(candidate);
    if (validation) continue;

    const available = await isReferralSlugAvailable(supabase, candidate, excludeUserId);
    if (available) return candidate;
  }

  throw new Error("Could not generate a unique referral slug.");
}
