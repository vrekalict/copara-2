import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThreadView } from "@/components/messages/thread-view";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: thread } = await supabase
    .from("threads")
    .select("id, circle_id")
    .eq("id", threadId)
    .maybeSingle();

  if (!thread) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, body, sender_id, created_at, attachments, hash")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("locale")
    .eq("id", user.id)
    .maybeSingle();

  const { data: participants } = await supabase
    .from("thread_participants")
    .select("user_id, profiles(display_name)")
    .eq("thread_id", threadId);

  const participantNames: Record<string, string> = {};
  for (const row of participants ?? []) {
    const profileRow = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (row.user_id && profileRow?.display_name) {
      participantNames[row.user_id as string] = profileRow.display_name as string;
    }
  }

  return (
    <ThreadView
      threadId={threadId}
      circleId={thread.circle_id}
      locale={profile?.locale ?? "en"}
      currentUserId={user.id}
      initialMessages={messages ?? []}
      participantNames={participantNames}
    />
  );
}
