import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExportKind, ExportParams } from "@/lib/exports/types";
import { computeChainDigest, type ChainRecord } from "@/lib/exports/chain";

export type MessageRow = {
  id: string;
  body: string | null;
  sender_id: string;
  created_at: string;
  hash: string;
  thread_id: string;
};

export type ExpenseRow = {
  id: string;
  amount_cents: number;
  currency: string;
  category: string;
  description: string | null;
  created_by: string;
  incurred_on: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  type: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  created_at: string;
};

export type CheckinRow = {
  id: string;
  event_id: string;
  user_id: string;
  checked_at: string;
  gps_provided: boolean;
};

export type ChangeRequestRow = {
  id: string;
  type: string;
  status: string;
  details: unknown;
  requested_by: string;
  created_at: string;
};

export type ExportData = {
  kind: ExportKind;
  params: ExportParams;
  chainRecords: ChainRecord[];
  messages: MessageRow[];
  expenses: ExpenseRow[];
  events: EventRow[];
  checkins: CheckinRow[];
  changeRequests: ChangeRequestRow[];
  profiles: Record<string, string>;
};

export async function fetchExportData(
  supabase: SupabaseClient,
  options: {
    circleId: string;
    kind: ExportKind;
    params: ExportParams;
  },
): Promise<ExportData> {
  const { circleId, kind, params } = options;
  const dateFrom = params.date_from;
  const dateTo = params.date_to;

  let messages: MessageRow[] = [];
  let expenses: ExpenseRow[] = [];
  let events: EventRow[] = [];
  let checkins: CheckinRow[] = [];
  let changeRequests: ChangeRequestRow[] = [];
  let chainRecords: ChainRecord[] = [];

  if (kind === "messages") {
    const threadIds = params.thread_ids ?? [];
    if (threadIds.length === 0) {
      throw new Error("Select at least one thread.");
    }

    let query = supabase
      .from("messages")
      .select("id, body, sender_id, created_at, hash, thread_id")
      .in("thread_id", threadIds)
      .order("created_at", { ascending: true });

    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    messages = (data ?? []) as MessageRow[];
    chainRecords = messages.map((m) => ({ id: m.id, hash: m.hash }));
  }

  if (kind === "expenses") {
    let query = supabase
      .from("expenses")
      .select("id, amount_cents, currency, category, description, created_by, incurred_on, created_at")
      .eq("circle_id", circleId)
      .order("created_at", { ascending: true });

    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    expenses = (data ?? []) as ExpenseRow[];
    chainRecords = expenses.map((e) => ({
      id: e.id,
      hash: computeChainDigest([{ id: e.id, hash: `${e.amount_cents}:${e.created_at}` }]),
    }));
  }

  if (kind === "schedule") {
    let eventsQuery = supabase
      .from("events")
      .select("id, title, type, starts_at, ends_at, location, created_at")
      .eq("circle_id", circleId)
      .order("starts_at", { ascending: true });

    if (dateFrom) eventsQuery = eventsQuery.gte("starts_at", dateFrom);
    if (dateTo) eventsQuery = eventsQuery.lte("starts_at", dateTo);

    const { data: eventData, error: eventsError } = await eventsQuery;
    if (eventsError) throw new Error(eventsError.message);
    events = (eventData ?? []) as EventRow[];

    const eventIds = events.map((e) => e.id);
    if (eventIds.length > 0) {
      const { data: checkinData, error: checkinsError } = await supabase
        .from("checkins")
        .select("id, event_id, user_id, checked_at, gps_provided")
        .in("event_id", eventIds)
        .order("checked_at", { ascending: true });

      if (checkinsError) throw new Error(checkinsError.message);
      checkins = (checkinData ?? []) as CheckinRow[];
    }

    chainRecords = [
      ...events.map((e) => ({ id: e.id, hash: e.id + e.starts_at })),
      ...checkins.map((c) => ({ id: c.id, hash: c.id + c.checked_at })),
    ];
  }

  if (kind === "change_requests") {
    let query = supabase
      .from("change_requests")
      .select("id, type, status, details, requested_by, created_at")
      .eq("circle_id", circleId)
      .order("created_at", { ascending: true });

    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    changeRequests = (data ?? []) as ChangeRequestRow[];
    chainRecords = changeRequests.map((c) => ({
      id: c.id,
      hash: c.id + c.status + c.created_at,
    }));
  }

  const userIds = new Set<string>();
  messages.forEach((m) => userIds.add(m.sender_id));
  expenses.forEach((e) => userIds.add(e.created_by));
  checkins.forEach((c) => userIds.add(c.user_id));
  changeRequests.forEach((c) => userIds.add(c.requested_by));

  const profiles: Record<string, string> = {};
  if (userIds.size > 0) {
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", [...userIds]);

    for (const p of profileRows ?? []) {
      profiles[p.id as string] = (p.display_name as string) ?? "Unknown";
    }
  }

  return {
    kind,
    params: {
      ...params,
      message_ids: messages.map((m) => m.id),
      message_hashes: messages.map((m) => m.hash),
    },
    chainRecords,
    messages,
    expenses,
    events,
    checkins,
    changeRequests,
    profiles,
  };
}

export function buildStoredParams(data: ExportData): ExportParams {
  return {
    date_from: data.params.date_from,
    date_to: data.params.date_to,
    thread_ids: data.params.thread_ids,
    message_ids: data.chainRecords.map((r) => r.id),
    message_hashes: data.chainRecords.map((r) => r.hash),
  };
}

/** Re-query live rows and recompute chain hashes for tamper verification. */
export async function fetchLiveChainRecords(
  supabase: SupabaseClient,
  kind: ExportKind,
  storedIds: string[],
): Promise<ChainRecord[]> {
  if (storedIds.length === 0) return [];

  if (kind === "messages") {
    const { data: messages } = await supabase
      .from("messages")
      .select("id, hash")
      .in("id", storedIds)
      .order("created_at", { ascending: true });

    const liveMap = new Map(
      (messages ?? []).map((m) => [m.id as string, m.hash as string]),
    );

    return storedIds.map((id) => ({
      id,
      hash: liveMap.get(id) ?? "__missing__",
    }));
  }

  if (kind === "expenses") {
    const { data: expenses } = await supabase
      .from("expenses")
      .select("id, amount_cents, created_at")
      .in("id", storedIds)
      .order("created_at", { ascending: true });

    const liveMap = new Map(
      (expenses ?? []).map((e) => [
        e.id as string,
        computeChainDigest([
          { id: e.id as string, hash: `${e.amount_cents}:${e.created_at}` },
        ]),
      ]),
    );

    return storedIds.map((id) => ({
      id,
      hash: liveMap.get(id) ?? "__missing__",
    }));
  }

  if (kind === "schedule") {
    const [{ data: events }, { data: checkins }] = await Promise.all([
      supabase.from("events").select("id, starts_at").in("id", storedIds),
      supabase.from("checkins").select("id, checked_at").in("id", storedIds),
    ]);

    const eventMap = new Map(
      (events ?? []).map((e) => [e.id as string, e.starts_at as string]),
    );
    const checkinMap = new Map(
      (checkins ?? []).map((c) => [c.id as string, c.checked_at as string]),
    );

    return storedIds.map((id) => {
      const startsAt = eventMap.get(id);
      if (startsAt !== undefined) {
        return { id, hash: id + startsAt };
      }
      const checkedAt = checkinMap.get(id);
      if (checkedAt !== undefined) {
        return { id, hash: id + checkedAt };
      }
      return { id, hash: "__missing__" };
    });
  }

  if (kind === "change_requests") {
    const { data: changeRequests } = await supabase
      .from("change_requests")
      .select("id, status, created_at")
      .in("id", storedIds)
      .order("created_at", { ascending: true });

    const liveMap = new Map(
      (changeRequests ?? []).map((c) => [
        c.id as string,
        (c.id as string) + (c.status as string) + (c.created_at as string),
      ]),
    );

    return storedIds.map((id) => ({
      id,
      hash: liveMap.get(id) ?? "__missing__",
    }));
  }

  return storedIds.map((id) => ({ id, hash: "__missing__" }));
}
