import { NextResponse } from "next/server";
import { createHash } from "crypto";
import {
  AI_RATE_LIMIT_PER_HOUR,
  countRecentAiCalls,
  logAiEvent,
} from "@/lib/ai/events";
import { summarizeDispute } from "@/lib/ai/summarize";
import { createClient } from "@/lib/supabase/server";

type SummarizeRequest = {
  thread_ids?: string[];
  circle_id?: string;
  date_from?: string;
  date_to?: string;
  topic_filter?: string;
  locale?: string;
  professional_export?: boolean;
};

function hashInput(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  let body: SummarizeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const threadIds = body.thread_ids ?? [];
  const circleId = body.circle_id ?? "";
  const locale = body.locale === "fr" ? "fr" : "en";

  if (!circleId || threadIds.length === 0) {
    return NextResponse.json(
      { error: "Missing circle_id or thread_ids." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let query = supabase
    .from("messages")
    .select("id, body, sender_id, created_at, thread_id")
    .in("thread_id", threadIds)
    .order("created_at", { ascending: true });

  if (body.date_from) query = query.gte("created_at", body.date_from);
  if (body.date_to) query = query.lte("created_at", body.date_to);

  const { data: messages, error: messagesError } = await query;
  if (messagesError) {
    return NextResponse.json({ error: messagesError.message }, { status: 500 });
  }

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages in range." }, { status: 400 });
  }

  try {
    const recent = await countRecentAiCalls(supabase, user.id);
    if (recent >= AI_RATE_LIMIT_PER_HOUR) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }

    const { result, model } = await summarizeDispute({
      messages,
      locale,
      topicFilter: body.topic_filter,
      professionalExport: body.professional_export,
    });

    const inputHash = hashInput(
      JSON.stringify({
        threadIds,
        dateFrom: body.date_from,
        dateTo: body.date_to,
        topic: body.topic_filter,
        messageCount: messages.length,
      }),
    );

    await logAiEvent(supabase, {
      userId: user.id,
      circleId,
      kind: "summary",
      inputHash,
      output: result,
      model,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Summary failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
