import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { CalendarView } from "@/components/calendar/calendar-view";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const now = new Date().toISOString();

  const [
    { data: events },
    { data: changeRequests },
    { data: templates },
    { data: violations },
    { data: parentMembers },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, type, starts_at, ends_at, location")
      .eq("circle_id", circle.circleId)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(20),
    supabase
      .from("change_requests")
      .select("id, type, status, details, events(title)")
      .eq("circle_id", circle.circleId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("schedule_templates")
      .select("id, name, rrule, active")
      .eq("circle_id", circle.circleId)
      .eq("active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("schedule_events")
      .select("id, kind, delta_minutes, detected_at, events(title, starts_at)")
      .eq("circle_id", circle.circleId)
      .neq("kind", "on_time")
      .order("detected_at", { ascending: false })
      .limit(10),
    supabase
      .from("circle_members")
      .select("user_id, profiles(display_name)")
      .eq("circle_id", circle.circleId)
      .eq("status", "active")
      .eq("role", "parent")
      .not("user_id", "is", null),
  ]);

  const parents = (parentMembers ?? []).map((m) => {
    const profile = m.profiles as { display_name: string | null } | { display_name: string | null }[] | null;
    const displayName = Array.isArray(profile) ? profile[0]?.display_name : profile?.display_name;
    return {
      user_id: m.user_id as string,
      display_name: displayName ?? null,
    };
  });

  return (
    <CalendarView
      circleId={circle.circleId}
      events={events ?? []}
      changeRequests={changeRequests ?? []}
      templates={templates ?? []}
      violations={violations ?? []}
      parents={parents}
    />
  );
}
