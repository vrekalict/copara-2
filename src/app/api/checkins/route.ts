import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type CheckinBody = {
  event_id?: string;
  circle_id?: string;
  latitude?: number;
  longitude?: number;
};

function isValidCoord(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** True when latitude/longitude are valid global GPS coordinates (not proximity to event). */
function hasValidGpsCoordinates(lat: number, lng: number) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export async function POST(request: Request) {
  let body: CheckinBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const eventId = body.event_id ?? "";
  const circleId = body.circle_id ?? "";

  if (!eventId || !circleId) {
    return NextResponse.json({ error: "Missing event_id or circle_id." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, circle_id, type")
    .eq("id", eventId)
    .eq("circle_id", circleId)
    .maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const hasCoords =
    isValidCoord(body.latitude) && isValidCoord(body.longitude);
  const gpsProvided = hasCoords
    ? hasValidGpsCoordinates(body.latitude!, body.longitude!)
    : false;

  const { data: checkin, error } = await supabase
    .from("checkins")
    .insert({
      circle_id: circleId,
      event_id: eventId,
      user_id: user.id,
      gps_provided: gpsProvided,
    })
    .select("id, checked_at, gps_provided")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(checkin);
}
