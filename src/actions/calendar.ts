"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "event");
  const startsAt = String(formData.get("startsAt") ?? "");
  const endsAt = String(formData.get("endsAt") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!circleId || !title || !startsAt) {
    return { error: "Title and start time are required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase.from("events").insert({
    circle_id: circleId,
    title,
    type,
    starts_at: startsAt,
    ends_at: endsAt || null,
    location: location || null,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/app/calendar");
  return { success: true };
}

export async function createChangeRequest(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const eventId = String(formData.get("eventId") ?? "").trim();
  const type = String(formData.get("type") ?? "other");
  const note = String(formData.get("note") ?? "").trim();

  if (!circleId) return { error: "Missing circle." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase.from("change_requests").insert({
    circle_id: circleId,
    event_id: eventId || null,
    type,
    details: note ? { note } : {},
    requested_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/app/calendar");
  return { success: true };
}

export async function respondToChangeRequest(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (!requestId || !["approved", "declined"].includes(decision)) {
    return { error: "Invalid request." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("change_requests")
    .update({
      status: decision,
      responded_by: user.id,
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/app/calendar");
  return { success: true };
}
