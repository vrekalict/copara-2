"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  isValidVaultFilePath,
  parseEmergencyContacts,
} from "@/lib/vault-files";

export async function updateChildVault(formData: FormData) {
  const childId = String(formData.get("childId") ?? "");
  const circleId = String(formData.get("circleId") ?? "");
  const notesMedical = String(formData.get("notesMedical") ?? "").trim();
  const notesSchool = String(formData.get("notesSchool") ?? "").trim();
  const emergencyContactsRaw = String(formData.get("emergencyContacts") ?? "");

  if (!childId || !circleId) return { error: "Missing child." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("children")
    .update({
      notes_medical: notesMedical || null,
      notes_school: notesSchool || null,
      emergency_contacts: parseEmergencyContacts(emergencyContactsRaw),
    })
    .eq("id", childId)
    .eq("circle_id", circleId);

  if (error) return { error: error.message };

  revalidatePath("/app/vault");
  return { success: true };
}

export async function createVaultDocument(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const childId = String(formData.get("childId") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const filePath = String(formData.get("filePath") ?? "").trim();
  const shareWithProfessional = formData.get("shareWithProfessional") === "on";

  if (!circleId || !title || !filePath) {
    return { error: "Title and file are required." };
  }

  if (!isValidVaultFilePath(filePath, circleId)) {
    return { error: "Invalid file path." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: fileCheck, error: fileError } = await supabase.storage
    .from("vault-files")
    .createSignedUrl(filePath, 60);
  if (fileError || !fileCheck?.signedUrl) {
    return { error: "File not found. Upload again." };
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

  const visibility = shareWithProfessional
    ? { roles: ["professional"] }
    : {};

  const { error } = await supabase.from("vault_items").insert({
    circle_id: circleId,
    child_id: childId,
    kind: "document",
    title,
    file_url: filePath,
    visibility,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/app/vault");
  return { success: true };
}

export async function deleteVaultDocument(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) return { error: "Missing document." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: item } = await supabase
    .from("vault_items")
    .select("circle_id, file_url")
    .eq("id", itemId)
    .maybeSingle();

  if (!item) return { error: "Document not found." };

  if (item.file_url) {
    await supabase.storage.from("vault-files").remove([item.file_url]);
  }

  const { error } = await supabase.from("vault_items").delete().eq("id", itemId);
  if (error) return { error: error.message };

  revalidatePath("/app/vault");
  return { success: true };
}
