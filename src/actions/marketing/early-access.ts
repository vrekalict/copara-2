"use server";

import { Resend } from "resend";
import { recordLegalAcceptance } from "@/actions/legal/acceptance";
import { canQuebecPaidSignup, isQuebecProvince } from "@/lib/legal/config";
import { createServiceClient } from "@/lib/supabase/service";
import { BRAND, brandEmailFrom } from "@/lib/brand";

async function notifyTeam(subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: brandEmailFrom("hello"),
      to: BRAND.emails.hello,
      subject,
      text: body,
    });
  } catch (error) {
    console.warn("[marketing] Resend notification failed:", error);
  }
}

export async function submitEarlyAccess(
  _prev: { error?: string; success?: boolean; message?: string } | null,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const province = String(formData.get("province") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const acceptedLegal = formData.get("acceptedLegal") === "true";
  const confirmedFrenchAccess = formData.get("confirmedFrenchAccess") === "true";

  if (!name || !email || !role || !province || !interest) {
    return { error: "Please fill in all required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (isQuebecProvince(province) && !canQuebecPaidSignup()) {
    return {
      error:
        "Paid signup in Quebec is not available yet. Please join the Quebec waitlist instead.",
    };
  }

  const acceptance = await recordLegalAcceptance({
    email,
    province,
    confirmedFrenchAccess,
    acceptedTerms: acceptedLegal,
    acceptedPrivacy: acceptedLegal,
  });

  if (acceptance.error) {
    return { error: acceptance.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("early_access_leads").insert({
    name,
    email,
    role,
    province,
    interest,
    message: message || null,
    source: "early_access",
  });

  if (error) {
    console.error("[early-access] persist failed:", error.message);
    return { error: "Could not save your request. Please try again or email us directly." };
  }

  await notifyTeam(
    `Early access: ${name} (${province})`,
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Role: ${role}`,
      `Province: ${province}`,
      `Interest: ${interest}`,
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    success: true,
    message:
      "We received your interest. We will email you when early access opens for your province.",
  };
}

export async function submitContact(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { error: "Please fill in all fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
  });

  if (error) {
    console.error("[contact] persist failed:", error.message);
    return { error: "Could not send your message. Please email support directly." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: brandEmailFrom("hello"),
        to: BRAND.emails.support,
        replyTo: email,
        subject: `[Contact] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch (err) {
      console.warn("[contact] Resend forward failed:", err);
    }
  }

  return { success: true };
}
