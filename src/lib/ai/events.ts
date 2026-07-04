import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const AI_RATE_LIMIT_PER_HOUR = 30;

export function hashDraft(draft: string) {
  return createHash("sha256").update(draft).digest("hex");
}

export async function countRecentAiCalls(
  supabase: SupabaseClient,
  userId: string,
) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("ai_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("kind", ["tone_review", "summary"])
    .gte("created_at", since);

  if (error) throw error;
  return count ?? 0;
}

/** @deprecated Use countRecentAiCalls */
export const countRecentToneReviews = countRecentAiCalls;

export async function logAiEvent(
  supabase: SupabaseClient,
  event: {
    userId: string;
    circleId: string;
    kind: "tone_review" | "rewrite_accepted" | "rewrite_rejected" | "summary";
    inputHash?: string;
    output?: unknown;
    model?: string;
  },
) {
  const { error } = await supabase.from("ai_events").insert({
    user_id: event.userId,
    circle_id: event.circleId,
    kind: event.kind,
    input_hash: event.inputHash ?? null,
    output: event.output ?? null,
    model: event.model ?? null,
  });
  if (error) throw error;
}
