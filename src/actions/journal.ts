"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  JOURNAL_MEDIA_BUCKET,
  isValidJournalMediaPath,
  parseJournalMediaPaths,
} from "@/lib/journal-media";

export async function createJournalEntry(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const childId = String(formData.get("childId") ?? "").trim() || null;
  const mediaJson = String(formData.get("mediaPaths") ?? "[]");

  if (!circleId || !body) {
    return { error: "Write something for your journal entry." };
  }

  const media = parseJournalMediaPaths(mediaJson);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  for (const item of media) {
    if (!isValidJournalMediaPath(item.path, circleId)) {
      return { error: "Invalid media path." };
    }
    const { data, error } = await supabase.storage
      .from(JOURNAL_MEDIA_BUCKET)
      .createSignedUrl(item.path, 60);
    if (error || !data?.signedUrl) {
      return { error: "Media file not found. Upload again." };
    }
  }

  if (childId) {
    const { data: child } = await supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("circle_id", circleId)
      .maybeSingle();
    if (!child) return { error: "Invalid child." };
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .insert({
      circle_id: circleId,
      created_by: user.id,
      child_id: childId,
      body,
    })
    .select("id")
    .single();

  if (error || !entry) return { error: error?.message ?? "Could not save entry." };

  if (media.length > 0) {
    const { error: mediaError } = await supabase.from("journal_media").insert(
      media.map((item) => ({
        entry_id: entry.id,
        circle_id: circleId,
        file_path: item.path,
        mime: item.mime,
      })),
    );
    if (mediaError) return { error: mediaError.message };
  }

  revalidatePath("/app/journal");
  return { success: true };
}

export async function deleteJournalEntry(formData: FormData) {
  const entryId = String(formData.get("entryId") ?? "");
  if (!entryId) return { error: "Missing entry." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("created_by, journal_media(file_path)")
    .eq("id", entryId)
    .maybeSingle();

  if (!entry || entry.created_by !== user.id) {
    return { error: "You can only delete your own entries." };
  }

  const media = Array.isArray(entry.journal_media)
    ? entry.journal_media
    : entry.journal_media
      ? [entry.journal_media]
      : [];

  const paths = media
    .map((m) => (m as { file_path: string }).file_path)
    .filter(Boolean);

  if (paths.length > 0) {
    await supabase.storage.from(JOURNAL_MEDIA_BUCKET).remove(paths);
  }

  const { error } = await supabase.from("journal_entries").delete().eq("id", entryId);
  if (error) return { error: error.message };

  revalidatePath("/app/journal");
  return { success: true };
}
