import { NextResponse } from "next/server";
import { hashDraft, logAiEvent } from "@/lib/ai/events";
import { requireThreadParticipant } from "@/lib/ai/thread-access";

type RewriteChoiceRequest = {
  thread_id?: string;
  draft?: string;
  rewrite?: string;
  accepted?: boolean;
};

export async function POST(request: Request) {
  let body: RewriteChoiceRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const threadId = body.thread_id ?? "";
  const draft = body.draft?.trim() ?? "";
  const rewrite = body.rewrite?.trim() ?? "";

  if (!threadId || !draft || !rewrite) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const access = await requireThreadParticipant(threadId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { supabase, user, thread } = access;

  try {
    await logAiEvent(supabase, {
      userId: user.id,
      circleId: thread.circle_id,
      kind: body.accepted ? "rewrite_accepted" : "rewrite_rejected",
      inputHash: hashDraft(draft),
      output: { rewrite },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not log choice." }, { status: 500 });
  }
}
