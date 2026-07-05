"use server";

import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";
import { BRAND, brandEmailFrom } from "@/lib/brand";

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
