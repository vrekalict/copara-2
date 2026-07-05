import { createServiceClient } from "@/lib/supabase/service";
import { sendWebPush } from "@/lib/push/send";

export async function notifyUserPush(
  userId: string,
  payload: { title: string; body: string; url?: string },
) {
  const service = createServiceClient();

  const { data: settings } = await service
    .from("user_settings")
    .select("notif_prefs")
    .eq("user_id", userId)
    .maybeSingle();

  const prefs = (settings?.notif_prefs ?? {}) as Record<string, boolean>;
  if (prefs.messages === false) return;

  const { data: subs } = await service
    .from("push_subscriptions")
    .select("endpoint, keys")
    .eq("user_id", userId);

  for (const sub of subs ?? []) {
    await sendWebPush(
      {
        endpoint: sub.endpoint as string,
        keys: sub.keys as { p256dh: string; auth: string },
      },
      payload,
    );
  }
}

export async function notifyThreadParticipants(options: {
  threadId: string;
  excludeUserId: string;
  title: string;
  body: string;
  url: string;
}) {
  const service = createServiceClient();
  const { data: participants } = await service
    .from("thread_participants")
    .select("user_id")
    .eq("thread_id", options.threadId)
    .neq("user_id", options.excludeUserId);

  await Promise.all(
    (participants ?? []).map((p) =>
      notifyUserPush(p.user_id as string, {
        title: options.title,
        body: options.body,
        url: options.url,
      }),
    ),
  );
}
