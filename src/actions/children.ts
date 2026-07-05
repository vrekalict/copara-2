"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireActiveCircleParent } from "@/lib/circles/membership";
import { requirePaidAccess } from "@/lib/stripe/guard";

export async function addChild(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const dob = String(formData.get("dob") ?? "").trim();

  if (!circleId || !firstName) {
    return { error: "Enter the child's first name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const paid = await requirePaidAccess(supabase, user.id);
  if (!paid.ok) redirect(paid.redirectTo);

  const membership = await requireActiveCircleParent(supabase, user.id, circleId);
  if (!membership.ok) return { error: membership.error };

  const { error } = await supabase.from("children").insert({
    circle_id: circleId,
    first_name: firstName,
    dob: dob || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/onboarding/children");
  revalidatePath("/app/vault");
  return { success: true };
}
