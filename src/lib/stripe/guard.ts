import type { SupabaseClient } from "@supabase/supabase-js";
import { stripeConfigured } from "@/lib/stripe/client";
import { getAppAccess } from "@/lib/stripe/access";

export function billingEnforced() {
  return stripeConfigured();
}

export async function requirePaidAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; redirectTo: string }> {
  if (!billingEnforced()) {
    return { ok: true };
  }

  const access = await getAppAccess(supabase, userId);
  if (access.hasAccess) {
    return { ok: true };
  }

  return { ok: false, redirectTo: "/subscribe" };
}
