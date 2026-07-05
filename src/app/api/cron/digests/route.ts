import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyCronRequest } from "@/lib/cron/auth";
import { sendWeeklyDigestEmail } from "@/lib/cron/digest-email";
import {
  detectViolations,
  persistViolations,
  type DetectedViolation,
} from "@/lib/schedule/violations";

export async function GET(request: Request) {
  const auth = verifyCronRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const { data: circles, error: circlesError } = await supabase
    .from("circles")
    .select("id, name");

  if (circlesError) {
    return NextResponse.json({ error: circlesError.message }, { status: 500 });
  }

  let totalViolations = 0;
  let emailsSent = 0;

  for (const circle of circles ?? []) {
    const { data: pastEvents } = await supabase
      .from("events")
      .select("id, circle_id, title, starts_at, ends_at, type")
      .eq("circle_id", circle.id)
      .in("type", ["exchange", "parenting_time"])
      .gte("starts_at", weekAgo.toISOString())
      .lte("starts_at", now.toISOString());

    const eventIds = (pastEvents ?? []).map((e) => e.id);
    const { data: checkins } =
      eventIds.length > 0
        ? await supabase
            .from("checkins")
            .select("event_id, checked_at, location_verified")
            .in("event_id", eventIds)
        : { data: [] };

    const violations = detectViolations(pastEvents ?? [], checkins ?? [], now);
    totalViolations += await persistViolations(supabase, violations);

    const { count: upcomingCount } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("circle_id", circle.id)
      .in("type", ["exchange", "parenting_time"])
      .gte("starts_at", now.toISOString())
      .lte("starts_at", weekAhead.toISOString());

    const { data: members } = await supabase
      .from("circle_members")
      .select("user_id")
      .eq("circle_id", circle.id)
      .eq("status", "active")
      .not("user_id", "is", null);

    const emails: string[] = [];
    for (const member of members ?? []) {
      const { data: authUser } = await supabase.auth.admin.getUserById(
        member.user_id as string,
      );
      if (authUser.user?.email) emails.push(authUser.user.email);
    }

    const flagged = violations.filter(
      (v): v is DetectedViolation => v.kind !== "on_time",
    );

    const result = await sendWeeklyDigestEmail({
      to: emails,
      circleName: circle.name,
      violations: flagged,
      upcomingCount: upcomingCount ?? 0,
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
