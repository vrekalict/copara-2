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
    .select("id, body, sender_id, created_at, attachments")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("locale")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ThreadView
      threadId={threadId}
      circleId={thread.circle_id}
      locale={profile?.locale ?? "en"}
      currentUserId={user.id}
      initialMessages={messages ?? []}
    />
  );
}
