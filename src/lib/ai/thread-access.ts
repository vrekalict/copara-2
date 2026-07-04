import { createClient } from "@/lib/supabase/server";

export async function requireThreadParticipant(threadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" as const, status: 401 as const };
  }

  const { data: thread, error } = await supabase
    .from("threads")
    .select("id, circle_id")
    .eq("id", threadId)
    .maybeSingle();

  if (error || !thread) {
    return { error: "Thread not found.", status: 404 as const };
  }

  const { data: participant } = await supabase
    .from("thread_participants")
    .select("user_id")
    .eq("thread_id", threadId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!participant) {
    return { error: "Forbidden", status: 403 as const };
  }

  return { supabase, user, thread };
}
