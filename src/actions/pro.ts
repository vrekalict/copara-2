"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { BRAND, brandEmailFrom } from "@/lib/brand";
import { Resend } from "resend";

export async function createProCase(formData: FormData) {
  const caseName = String(formData.get("caseName") ?? "").trim();
  const parent1Email = String(formData.get("parent1Email") ?? "")
    .trim()
    .toLowerCase();
  const parent2Email = String(formData.get("parent2Email") ?? "")
    .trim()
    .toLowerCase();

  if (!caseName) return { error: "Please name the case." };
  if (!parent1Email || !parent2Email) {
    return { error: "Enter both parent email addresses." };
  }
  if (parent1Email === parent2Email) {
    return { error: "Parent emails must be different." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  await supabase
    .from("profiles")
    .update({ role_default: "professional" })
    .eq("id", user.id);

  const { data: circle, error: circleError } = await supabase
    .from("circles")
    .insert({ name: caseName, created_by: user.id })
    .select("id")
    .single();

  if (circleError || !circle) {
    return { error: circleError?.message ?? "Could not create case." };
  }

  const { error: memberError } = await supabase.from("circle_members").insert({
    circle_id: circle.id,
    user_id: user.id,
    role: "professional",
    status: "active",
    permissions: { view_finance: true },
  });

  if (memberError) {
    return { error: memberError.message };
  }

  const invites = await Promise.all(
    [parent1Email, parent2Email].map(async (email) => {
      const { data: invite, error } = await supabase
        .from("circle_members")
        .insert({
          circle_id: circle.id,
          role: "parent",
          status: "invited",
          invited_email: email,
        })
        .select("id")
        .single();

      if (error || !invite) return null;
      return { email, inviteId: invite.id as string };
    }),
  );

  const origin = (await headers()).get("origin") ?? "";
  const caseLink = `${origin}/join/case/${circle.id}`;

  for (const invite of invites) {
    if (!invite) continue;
    await sendProInviteEmail({
      to: invite.email,
      caseName,
      caseLink,
    });
  }

  redirect(`/pro?case=${circle.id}`);
}

async function sendProInviteEmail({
  to,
  caseName,
  caseLink,
}: {
  to: string;
  caseName: string;
  caseLink: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping pro invite email.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: brandEmailFrom("invites"),
      to,
      subject: `Your mediator invited you to ${caseName} on ${BRAND.name}`,
      html: `<p>A professional has invited you to join a co-parenting case on ${BRAND.name}.</p>
        <p><a href="${caseLink}">Accept the invite</a></p>
        <p>Both parents use the same link. Sign in with the email address that received this message.</p>`,
    });
  } catch (err) {
    console.error("Failed to send pro invite email", err);
  }
}

export async function getProCircles(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("circle_members")
    .select("circle_id, circles(id, name, created_at)")
    .eq("user_id", userId)
    .eq("role", "professional")
    .eq("status", "active");

  return (data ?? []).map((row) => {
    const circles = row.circles as { id: string; name: string; created_at: string } | { id: string; name: string; created_at: string }[] | null;
    const circle = Array.isArray(circles) ? circles[0] : circles;
    return {
      circleId: row.circle_id as string,
      name: circle?.name ?? "Case",
      createdAt: circle?.created_at ?? "",
    };
  });
}
