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

  const { data: events } = await supabase
    .from("events")
    .select("id, title, type, starts_at, ends_at, location")
    .eq("circle_id", circle.circleId)
    .gte("starts_at", now)
    .order("starts_at", { ascending: true })
    .limit(20);

  const { data: changeRequests } = await supabase
    .from("change_requests")
    .select("id, type, status, details, events(title)")
    .eq("circle_id", circle.circleId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <CalendarView
      circleId={circle.circleId}
      events={events ?? []}
      changeRequests={changeRequests ?? []}
    />
  );
}
