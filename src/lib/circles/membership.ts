import type { SupabaseClient } from "@supabase/supabase-js";

/** Caller must be an active parent member of the circle. */
export async function requireActiveCircleParent(
  supabase: SupabaseClient,
  userId: string,
  circleId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!circleId) {
    return { ok: false, error: "Missing circle." };
  }

  const { data } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("role", "parent")
    .maybeSingle();

  if (!data) {
    return { ok: false, error: "You don't have permission to manage this circle." };
  }

  return { ok: true };
}

/** Caller must be an active member of the circle (any role). */
export async function requireActiveCircleMember(
  supabase: SupabaseClient,
  userId: string,
  circleId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!circleId) {
    return { ok: false, error: "Missing circle." };
  }

  const { data } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!data) {
    return { ok: false, error: "You don't have access to this circle." };
  }

  return { ok: true };
}
