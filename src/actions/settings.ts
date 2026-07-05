"use server";

import { createClient } from "@/lib/supabase/server";

const SNOOZE_DAYS = 7;

export async function snoozeInstallPrompt() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const until = new Date();
  until.setDate(until.getDate() + SNOOZE_DAYS);

  await supabase
    .from("user_settings")
    .update({ pwa_prompt_snoozed_until: until.toISOString() })
    .eq("user_id", user.id);
}

export async function updateNotifPrefs(prefs: Record<string, boolean>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("user_settings")
    .update({ notif_prefs: prefs })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
