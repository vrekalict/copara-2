"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createThread(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!circleId) return { error: "Missing circle." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: members, error: membersError } = await supabase
    .from("circle_members")
    .select("user_id")
    .eq("circle_id", circleId)
    .eq("status", "active")
    .not("user_id", "is", null);

  if (membersError) return { error: membersError.message };

  const { data: thread, error } = await supabase
    .from("threads")
    .insert({ circle_id: circleId, title: title || null, created_by: user.id })
    .select("id")
    .single();

  if (error || !thread) {
    return { error: error?.message ?? "Could not start the conversation." };
  }

  const participantIds = new Set([user.id, ...members.map((m) => m.user_id as string)]);
  const { error: participantsError } = await supabase.from("thread_participants").insert(
    Array.from(participantIds).map((userId) => ({ thread_id: thread.id, user_id: userId })),
  );

  if (participantsError) {
    return { error: participantsError.message };
  }

  redirect(`/app/messages/${thread.id}`);
}

export async function sendMessage(formData: FormData) {
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!threadId || !body) return { error: "Message can't be empty." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, sender_id: user.id, body });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/messages/${threadId}`);
  return { success: true };
}

export async function searchThreadMessages(formData: FormData) {
  const threadId = String(formData.get("threadId") ?? "");
  const query = String(formData.get("query") ?? "").trim();
  const dateFrom = String(formData.get("dateFrom") ?? "").trim();
  const dateTo = String(formData.get("dateTo") ?? "").trim();
  if (!threadId || !query) return { results: [] };

  const supabase = await createClient();
  let builder = supabase
    .from("messages")
    .select("id, body, created_at, sender_id")
    .eq("thread_id", threadId)
    .textSearch("body", query, { type: "websearch", config: "simple" })
    .order("created_at", { ascending: false });

  if (dateFrom) builder = builder.gte("created_at", dateFrom);
  if (dateTo) builder = builder.lte("created_at", dateTo);

  const { data, error } = await builder;
  if (error) return { error: error.message, results: [] };

  return { results: data ?? [] };
}

export async function markThreadRead(threadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: messages } = await supabase
    .from("messages")
    .select("id")
    .eq("thread_id", threadId);

  if (!messages || messages.length === 0) return;

  const rows = messages.map((m) => ({
    message_id: m.id as string,
    user_id: user.id,
    read_at: new Date().toISOString(),
  }));

  await supabase
    .from("message_receipts")
    .upsert(rows, { onConflict: "message_id,user_id" });
}
