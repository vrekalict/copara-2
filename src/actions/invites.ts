"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAppAccess } from "@/lib/stripe/access";
import { BRAND } from "@/lib/brand";

export async function getInvitePreview(inviteId: string) {
  const service = createServiceClient();

  const { data: invite } = await service
    .from("circle_members")
    .select("status, invited_email, circles(name)")
    .eq("id", inviteId)
    .maybeSingle();

  if (!invite) return null;

  const circle = Array.isArray(invite.circles) ? invite.circles[0] : invite.circles;

  return {
    status: invite.status as string,
    circleName: (circle?.name as string | undefined) ?? BRAND.defaultCircleName,
  };
}

export async function acceptInvite(inviteId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-up?next=${encodeURIComponent(`/join/${inviteId}`)}`);
  }

  const service = createServiceClient();

  const { data: invite } = await service
    .from("circle_members")
    .select("id, status, invited_email, circle_id")
    .eq("id", inviteId)
    .maybeSingle();

  if (!invite || invite.status !== "invited") {
    return { error: "This invite is no longer valid." };
  }

  if (invite.invited_email?.toLowerCase() !== user.email?.toLowerCase()) {
    return {
      error: "This invite was sent to a different email address. Sign in with that address instead.",
    };
  }

  const { error } = await service
    .from("circle_members")
    .update({ user_id: user.id, status: "active" })
    .eq("id", inviteId);

  if (error) {
    return { error: error.message };
  }

  const access = await getAppAccess(supabase, user.id);
  if (!access.hasAccess) {
    redirect("/subscribe");
  }

  redirect("/app");
}
