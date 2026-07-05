import webpush from "web-push";
import { BRAND } from "@/lib/brand";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

function configureVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? `mailto:${BRAND.emails.support}`;
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function sendWebPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushPayload,
) {
  if (!configureVapid()) {
    console.warn("VAPID keys not configured; skipping push.");
    return { ok: false as const, error: "VAPID not configured" };
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
    );
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Push failed";
    return { ok: false as const, error: message };
  }
}

export function getVapidPublicKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? process.env.VAPID_PUBLIC_KEY ?? "";
}
