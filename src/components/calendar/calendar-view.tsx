"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createEvent, createChangeRequest, respondToChangeRequest } from "@/actions/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EventRow = {
  id: string;
  title: string;
  type: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
};

type ChangeRequestRow = {
  id: string;
  type: string;
  status: string;
  details: { note?: string } | null;
  events: { title: string } | { title: string }[] | null;
};

type ActionState = { error?: string; success?: boolean } | null;

export function CalendarView({
  circleId,
  events,
  changeRequests,
}: {
  circleId: string;
  events: EventRow[];
  changeRequests: ChangeRequestRow[];
}) {
  const t = useTranslations("calendar");

  const [eventState, eventAction, eventPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await createEvent(formData)) ?? null,
    null,
  );

  const [requestState, requestAction, requestPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => (await createChangeRequest(formData)) ?? null,
    null,
  );

  const [, respondAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      await respondToChangeRequest(formData);
      return null;
    },
    null,
  );

  async function checkIn(eventId: string) {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          circle_id: circleId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      });
    });
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-lg font-semibold">{t("title")}</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("upcoming")}</h2>
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}
        <ul className="flex flex-col divide-y divide-border">
          {events.map((event) => (
            <li key={event.id} className="flex flex-col gap-2 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.starts_at).toLocaleString()} · {t(`type.${event.type}`)}
                  </p>
                  {event.location && (
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  )}
                </div>
                {(event.type === "exchange" || event.type === "parenting_time") && (
                  <Button type="button" size="sm" variant="outline" onClick={() => void checkIn(event.id)}>
                    {t("checkIn")}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="font-medium">{t("addEvent")}</h2>
        <form action={eventAction} className="flex flex-col gap-3">
          <input type="hidden" name="circleId" value={circleId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">{t("eventTitle")}</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">{t("eventType")}</Label>
            <select id="type" name="type" className="h-8 rounded-lg border border-border bg-background px-2 text-sm">
              <option value="event">{t("type.event")}</option>
              <option value="parenting_time">{t("type.parenting_time")}</option>
              <option value="exchange">{t("type.exchange")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startsAt">{t("startsAt")}</Label>
            <Input id="startsAt" name="startsAt" type="datetime-local" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endsAt">{t("endsAt")}</Label>
            <Input id="endsAt" name="endsAt" type="datetime-local" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">{t("location")}</Label>
            <Input id="location" name="location" />
          </div>
          {eventState?.error && <p className="text-sm text-destructive">{eventState.error}</p>}
          <Button type="submit" disabled={eventPending}>
            {t("addEvent")}
          </Button>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t("changeRequests")}</h2>
        <ul className="flex flex-col gap-2">
          {changeRequests.map((req) => (
            <li key={req.id} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">
                {(Array.isArray(req.events) ? req.events[0]?.title : req.events?.title) ?? t("generalRequest")} — {t(`requestType.${req.type}`)}
              </p>
              <p className="text-muted-foreground">{req.details?.note}</p>
              <p className="capitalize text-muted-foreground">{req.status}</p>
              {req.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <form action={respondAction}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="decision" value="approved" />
                    <Button type="submit" size="sm">{t("approve")}</Button>
                  </form>
                  <form action={respondAction}>
                    <input type="hidden" name="requestId" value={req.id} />
                    <input type="hidden" name="decision" value="declined" />
                    <Button type="submit" size="sm" variant="outline">{t("decline")}</Button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>

        <form action={requestAction} className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <input type="hidden" name="circleId" value={circleId} />
          <h3 className="font-medium">{t("newRequest")}</h3>
          <select name="eventId" className="h-8 rounded-lg border border-border bg-background px-2 text-sm">
            <option value="">{t("generalRequest")}</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <select name="type" className="h-8 rounded-lg border border-border bg-background px-2 text-sm">
            <option value="swap_day">{t("requestType.swap_day")}</option>
            <option value="time_change">{t("requestType.time_change")}</option>
            <option value="location_change">{t("requestType.location_change")}</option>
            <option value="other">{t("requestType.other")}</option>
          </select>
          <Input name="note" placeholder={t("requestNote")} />
          {requestState?.error && <p className="text-sm text-destructive">{requestState.error}</p>}
          <Button type="submit" disabled={requestPending}>{t("submitRequest")}</Button>
        </form>
      </section>
    </div>
  );
}
