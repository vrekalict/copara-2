"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addChild(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const dob = String(formData.get("dob") ?? "").trim();

  if (!circleId || !firstName) {
    return { error: "Enter the child's first name." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("children").insert({
    circle_id: circleId,
    first_name: firstName,
    dob: dob || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/onboarding/children");
  return { success: true };
}
