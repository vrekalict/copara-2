import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { JournalView } from "@/components/journal/journal-view";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const [{ data: entries }, { data: children }] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id, body, created_at, created_by, child_id, journal_media(id, file_path, mime)")
      .eq("circle_id", circle.circleId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("children")
      .select("id, first_name")
      .eq("circle_id", circle.circleId)
      .order("first_name"),
  ]);

  const authorIds = [...new Set((entries ?? []).map((e) => e.created_by))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", authorIds)
    : { data: [] };

  const authorNames = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p.display_name ?? "Parent"]),
  );

  return (
    <JournalView
      circleId={circle.circleId}
      entries={(entries ?? []) as Parameters<typeof JournalView>[0]["entries"]}
      children={children ?? []}
      authorNames={authorNames}
      currentUserId={user.id}
    />
  );
}
