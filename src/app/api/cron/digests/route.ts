import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyCronRequest } from "@/lib/cron/auth";
import { fetchMemberEmailsByUserId } from "@/lib/cron/member-emails";
import { sendWeeklyDigestEmail } from "@/lib/cron/digest-email";
import {
  detectViolations,
  persistViolations,
  type DetectedViolation,
} from "@/lib/schedule/violations";

const EXCHANGE_TYPES = ["exchange", "parenting_time"] as const;

export async function GET(request: Request) {
  const auth = verifyCronRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    { data: circles, error: circlesError },
    { data: pastEvents, error: pastEventsError },
    { data: upcomingEvents, error: upcomingError },
    { data: allMembers, error: membersError },
  ] = await Promise.all([
    supabase.from("circles").select("id, name"),
    supabase
      .from("events")
      .select("id, circle_id, title, starts_at, ends_at, type")
      .in("type", [...EXCHANGE_TYPES])
      .gte("starts_at", weekAgo.toISOString())
      .lte("starts_at", now.toISOString()),
    supabase
      .from("events")
      .select("circle_id")
      .in("type", [...EXCHANGE_TYPES])
      .gte("starts_at", now.toISOString())
      .lte("starts_at", weekAhead.toISOString()),
    supabase
      .from("circle_members")
      .select("circle_id, user_id")
      .eq("status", "active")
      .not("user_id", "is", null),
  ]);

  if (circlesError) {
    return NextResponse.json({ error: circlesError.message }, { status: 500 });
  }
  if (pastEventsError) {
    return NextResponse.json({ error: pastEventsError.message }, { status: 500 });
  }
  if (upcomingError) {
    return NextResponse.json({ error: upcomingError.message }, { status: 500 });
  }
  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  const pastEventIds = (pastEvents ?? []).map((e) => e.id as string);
  const { data: checkins, error: checkinsError } =
    pastEventIds.length > 0
      ? await supabase
          .from("checkins")
          .select("event_id, checked_at, gps_provided")
          .in("event_id", pastEventIds)
      : { data: [], error: null };

  if (checkinsError) {
    return NextResponse.json({ error: checkinsError.message }, { status: 500 });
  }

  const eventsByCircle = new Map<string, typeof pastEvents>();
  for (const event of pastEvents ?? []) {
    const circleId = event.circle_id as string;
    const list = eventsByCircle.get(circleId) ?? [];
    list.push(event);
    eventsByCircle.set(circleId, list);
  }

  const upcomingByCircle = new Map<string, number>();
  for (const event of upcomingEvents ?? []) {
    const circleId = event.circle_id as string;
    upcomingByCircle.set(circleId, (upcomingByCircle.get(circleId) ?? 0) + 1);
  }

  const membersByCircle = new Map<string, string[]>();
  for (const member of allMembers ?? []) {
    const circleId = member.circle_id as string;
    const userId = member.user_id as string;
    const list = membersByCircle.get(circleId) ?? [];
    list.push(userId);
    membersByCircle.set(circleId, list);
  }

  const emailByUserId = await fetchMemberEmailsByUserId(
    supabase,
    (allMembers ?? []).map((m) => m.user_id as string),
  );

  let totalViolations = 0;
  let emailsSent = 0;

  for (const circle of circles ?? []) {
    const circleId = circle.id as string;
    const circlePastEvents = eventsByCircle.get(circleId) ?? [];
    const circleEventIds = new Set(circlePastEvents.map((e) => e.id as string));
    const circleCheckins = (checkins ?? []).filter((c) =>
      circleEventIds.has(c.event_id as string),
    );

    const violations = detectViolations(circlePastEvents, circleCheckins, now);
    totalViolations += await persistViolations(supabase, violations);

    const memberIds = membersByCircle.get(circleId) ?? [];
    const emails = memberIds
      .map((id) => emailByUserId.get(id))
      .filter((email): email is string => Boolean(email));

    const flagged = violations.filter(
      (v): v is DetectedViolation => v.kind !== "on_time",
    );

    const result = await sendWeeklyDigestEmail({
      to: emails,
      circleName: circle.name as string,
      violations: flagged,
      upcomingCount: upcomingByCircle.get(circleId) ?? 0,
    });

    if (result.sent) emailsSent += 1;
  }

  return NextResponse.json({
    ok: true,
    circles: circles?.length ?? 0,
    violations_logged: totalViolations,
    digests_sent: emailsSent,
  });
}
