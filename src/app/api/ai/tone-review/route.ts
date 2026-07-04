import { NextResponse } from "next/server";
import {
  AI_RATE_LIMIT_PER_HOUR,
  countRecentAiCalls,
  hashDraft,
  logAiEvent,
} from "@/lib/ai/events";
import { requireThreadParticipant } from "@/lib/ai/thread-access";
import { reviewMessageTone } from "@/lib/ai/tone-review";

type ToneReviewRequest = {
  draft?: string;
  thread_id?: string;
  locale?: string;
};

export async function POST(request: Request) {
  let body: ToneReviewRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const draft = body.draft?.trim() ?? "";
  const threadId = body.thread_id ?? "";
  const locale = body.locale === "fr" ? "fr" : "en";

  if (!draft || draft.length < 3) {
    return NextResponse.json({ error: "Draft is too short." }, { status: 400 });
  }
  if (!threadId) {
    return NextResponse.json({ error: "Missing thread_id." }, { status: 400 });
  }

  const access = await requireThreadParticipant(threadId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { supabase, user, thread } = access;

  try {
    const recent = await countRecentAiCalls(supabase, user.id);
    if (recent >= AI_RATE_LIMIT_PER_HOUR) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }

    const { result, model } = await reviewMessageTone(draft, locale);

    await logAiEvent(supabase, {
      userId: user.id,
      circleId: thread.circle_id,
      kind: "tone_review",
      inputHash: hashDraft(draft),
      output: result,
      model,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tone review failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
