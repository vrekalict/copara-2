"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function createCircle(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Please name your circle." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: circle, error } = await supabase
    .from("circles")
    .insert({ name, created_by: user.id })
    .select("id")
    .single();

  if (error || !circle) {
    return { error: error?.message ?? "Could not create circle." };
  }

  const { error: memberError } = await supabase.from("circle_members").insert({
    circle_id: circle.id,
    user_id: user.id,
    role: "parent",
    status: "active",
  });

  if (memberError) {
    return { error: memberError.message };
  }

  redirect(`/onboarding/invite?circle=${circle.id}`);
}

export async function inviteCoParent(formData: FormData) {
  const circleId = String(formData.get("circleId") ?? "");
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!circleId) redirect("/onboarding/circle");
  if (!email) return { error: "Enter your co-parent's email." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: circle } = await supabase
    .from("circles")
    .select("name")
    .eq("id", circleId)
    .single();

  const { data: invite, error } = await supabase
    .from("circle_members")
    .insert({
      circle_id: circleId,
      role: "parent",
      status: "invited",
      invited_email: email,
    })
    .select("id")
    .single();

  if (error || !invite) {
    return { error: error?.message ?? "Could not create the invite." };
  }

  await sendInviteEmail({
    to: email,
    circleName: circle?.name ?? "Accord",
    inviteId: invite.id,
  });

  redirect(`/onboarding/children?circle=${circleId}`);
}

async function sendInviteEmail({
  to,
  circleName,
  inviteId,
}: {
  to: string;
  circleName: string;
  inviteId: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping invite email send.");
    return;
  }

  const origin = (await headers()).get("origin");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Accord <invites@accord.app>",
      to,
      subject: `You've been invited to ${circleName} on Accord`,
      html: `<p>You've been invited to co-parent together on Accord.</p>
        <p><a href="${origin}/join/${inviteId}">Accept the invite</a></p>`,
    });
  } catch (err) {
    console.error("Failed to send invite email", err);
  }
}
