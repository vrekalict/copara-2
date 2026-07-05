import type { SupabaseClient } from "@supabase/supabase-js";

const USER_EMAIL_CHUNK = 25;

/** Resolve auth user emails in parallel chunks (avoids sequential N+1 per member). */
export async function fetchMemberEmailsByUserId(
  supabase: SupabaseClient,
  userIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const emailByUserId = new Map<string, string>();

  for (let i = 0; i < uniqueIds.length; i += USER_EMAIL_CHUNK) {
    const chunk = uniqueIds.slice(i, i + USER_EMAIL_CHUNK);
    const results = await Promise.all(
      chunk.map((id) => supabase.auth.admin.getUserById(id)),
    );

    for (const { data } of results) {
      const id = data.user?.id;
      const email = data.user?.email;
      if (id && email) emailByUserId.set(id, email);
    }
  }

  return emailByUserId;
}
