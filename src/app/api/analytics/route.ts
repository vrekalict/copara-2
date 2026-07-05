import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_EVENTS = new Set([
  "pwa_prompt_shown",
  "pwa_prompt_accepted",
  "pwa_prompt_dismissed",
  "pwa_installed",
  "export_created",
  "summary_generated",
]);

export async function POST(request: Request) {
  let body: { event?: string; properties?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.event || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", body.event, body.properties, user?.id ?? "anonymous");
  }

  return NextResponse.json({ ok: true });
}
