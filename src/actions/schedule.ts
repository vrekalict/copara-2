"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  generatePresetEvents,
  type SchedulePreset,
} from "@/lib/schedule/presets";

const VALID_PRESETS: SchedulePreset[] = [
  "week_on_off",
  "two_two_three",
  "alternating_weekends",
];

export async function createScheduleTemplate(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const preset = String(formData.get("preset") ?? "") as SchedulePreset;
  const parentAId = String(formData.get("parentAId") ?? "");
  const parentBId = String(formData.get("parentBId") ?? "");
  const applyNow = formData.get("applyNow") === "on";

  if (!circleId || !VALID_PRESETS.includes(preset)) {
    return { error: "Invalid schedule template." };
  }
  if (!parentAId || !parentBId || parentAId === parentBId) {
    return { error: "Select two different parents." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase.from("schedule_templates").insert({
    circle_id: circleId,
    name: preset,
    rrule: `preset:${preset}`,
    parent_a_blocks: { parent_a_id: parentAId, parent_b_id: parentBId },
    active: true,
  });

  if (error) {
    return { error: error.message };
  }

  if (applyNow) {
    const events = generatePresetEvents({
      preset,
      circleId,
      parentAId,
      parentBId,
      createdBy: user.id,
    });

    const { error: eventsError } = await supabase.from("events").insert(events);
    if (eventsError) {
      return { error: eventsError.message };
    }
  }

  revalidatePath("/app/calendar");
  return { success: true };
}

export async function applyScheduleTemplate(formData: FormData) {
  const templateId = String(formData.get("templateId") ?? "");
  if (!templateId) return { error: "Missing template." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: template } = await supabase
    .from("schedule_templates")
    .select("id, circle_id, rrule, parent_a_blocks")
    .eq("id", templateId)
    .single();

  if (!template) return { error: "Template not found." };

  const preset = template.rrule?.replace("preset:", "") as SchedulePreset;
  if (!VALID_PRESETS.includes(preset)) {
    return { error: "Unsupported template preset." };
  }

  const blocks = template.parent_a_blocks as {
    parent_a_id?: string;
    parent_b_id?: string;
  };
  if (!blocks.parent_a_id || !blocks.parent_b_id) {
    return { error: "Template is missing parent assignments." };
  }

  const events = generatePresetEvents({
    preset,
    circleId: template.circle_id,
    parentAId: blocks.parent_a_id,
    parentBId: blocks.parent_b_id,
    createdBy: user.id,
  });

  const { error } = await supabase.from("events").insert(events);
  if (error) return { error: error.message };

  revalidatePath("/app/calendar");
  return { success: true };
}
