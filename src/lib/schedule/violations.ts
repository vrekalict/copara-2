import type { SupabaseClient } from "@supabase/supabase-js";

export const LATE_GRACE_MINUTES = 15;

type ExchangeEvent = {
  id: string;
  circle_id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  type: string;
};

type Checkin = {
  event_id: string;
  checked_at: string;
  gps_provided: boolean;
};

export type ViolationKind = "late" | "missed" | "unlogged" | "on_time";

export type DetectedViolation = {
  circle_id: string;
  event_id: string;
  kind: ViolationKind;
  delta_minutes: number | null;
  event_title: string;
  starts_at: string;
};

export function detectViolations(
  events: ExchangeEvent[],
  checkins: Checkin[],
  now = new Date(),
): DetectedViolation[] {
  const checkinsByEvent = new Map<string, Checkin[]>();
  for (const checkin of checkins) {
    const list = checkinsByEvent.get(checkin.event_id) ?? [];
    list.push(checkin);
    checkinsByEvent.set(checkin.event_id, list);
  }

  const results: DetectedViolation[] = [];

  for (const event of events) {
    if (!["exchange", "parenting_time"].includes(event.type)) continue;

    const startsAt = new Date(event.starts_at);
    const graceMs = LATE_GRACE_MINUTES * 60 * 1000;
    const eventCheckins = checkinsByEvent.get(event.id) ?? [];

    if (eventCheckins.length === 0) {
      if (now.getTime() > startsAt.getTime() + graceMs) {
        results.push({
          circle_id: event.circle_id,
          event_id: event.id,
          kind: event.type === "exchange" ? "unlogged" : "missed",
          delta_minutes: null,
          event_title: event.title,
          starts_at: event.starts_at,
        });
      }
      continue;
    }

    const earliest = eventCheckins
      .map((c) => new Date(c.checked_at))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    const deltaMs = earliest.getTime() - startsAt.getTime();

    if (deltaMs > graceMs) {
      results.push({
        circle_id: event.circle_id,
        event_id: event.id,
        kind: "late",
        delta_minutes: Math.round(deltaMs / 60000),
        event_title: event.title,
        starts_at: event.starts_at,
      });
    } else {
      results.push({
        circle_id: event.circle_id,
        event_id: event.id,
        kind: "on_time",
        delta_minutes: Math.max(0, Math.round(deltaMs / 60000)),
        event_title: event.title,
        starts_at: event.starts_at,
      });
    }
  }

  return results;
}

export async function persistViolations(
  supabase: SupabaseClient,
  violations: DetectedViolation[],
) {
  const actionable = violations.filter((v) => v.kind !== "on_time");
  if (actionable.length === 0) return 0;

  const eventIds = actionable.map((v) => v.event_id);
  const { data: existing } = await supabase
    .from("schedule_events")
    .select("event_id, kind")
    .in("event_id", eventIds);

  const existingKeys = new Set(
    (existing ?? []).map((row) => `${row.event_id}:${row.kind}`),
  );

  const toInsert = actionable
    .filter((v) => !existingKeys.has(`${v.event_id}:${v.kind}`))
    .map((v) => ({
      circle_id: v.circle_id,
      event_id: v.event_id,
      kind: v.kind,
      delta_minutes: v.delta_minutes,
    }));

  if (toInsert.length === 0) return 0;

  const { error } = await supabase.from("schedule_events").insert(toInsert);
  if (error) throw error;
  return toInsert.length;
}
