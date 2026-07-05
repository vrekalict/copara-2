"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function getCasePreview(circleId: string) {
  const service = createServiceClient();

  const { data: circle } = await service
    .from("circles")
    .select("name")
    .eq("id", circleId)
    .maybeSingle();

  if (!circle) return null;

  const { data: invites } = await service
    .from("circle_members")
    .select("id, status, invited_email, role")
    .eq("circle_id", circleId)
    .eq("role", "parent");

  return {
    circleName: circle.name as string,
    invites: (invites ?? []).map((i) => ({
      id: i.id as string,
      status: i.status as string,
      email: i.invited_email as string | null,
    })),
  };
}

export async function acceptCaseInvite(circleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(`/join/case/${circleId}`)}`);
  }

  const service = createServiceClient();

  const { data: invites } = await service
    .from("circle_members")
    .select("id, status, invited_email, role")
    .eq("circle_id", circleId)
    .eq("role", "parent");

  const userEmail = user.email?.toLowerCase() ?? "";
  const invite = (invites ?? []).find(
    (i) =>
      i.status === "invited" &&
      (i.invited_email as string)?.toLowerCase() === userEmail,
  );

  if (!invite) {
    return { error: "No pending invite found for your email address." };
  }

  const { error } = await service
    .from("circle_members")
    .update({ user_id: user.id, status: "active" })
    .eq("id", invite.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/app");
}
