import { completeJson } from "@/lib/ai/openai";
import { estimateTokens, getAiModel } from "@/lib/ai/model-router";

export type SummaryTimelineEntry = {
  at: string;
  summary: string;
  message_ids: string[];
};

export type SummaryPosition = {
  party: string;
  position: string;
};

export type DisputeSummaryResult = {
  timeline: SummaryTimelineEntry[];
  positions: SummaryPosition[];
  unresolved: string[];
  disclaimer: string;
};

const SYSTEM_PROMPT = `You summarize co-parenting message threads for mediators and parents.
Return ONLY valid JSON with this exact shape:
{
  "timeline": [{"at":"ISO8601","summary":"string","message_ids":["uuid"]}],
  "positions": [{"party":"string","position":"string"}],
  "unresolved": ["string"],
  "disclaimer": "AI-generated summary; original records available; not legal advice."
}

Rules:
- Never fabricate facts or take sides.
- Cite message_ids from the transcript for timeline entries.
- Use plain language; no legal advice.
- Respond in the user's locale when locale is fr.
- disclaimer must always note this is not legal advice.`;

type TranscriptMessage = {
  id: string;
  sender_id: string;
  body: string | null;
  created_at: string;
};

export async function summarizeDispute(options: {
  messages: TranscriptMessage[];
  locale: string;
  topicFilter?: string;
  professionalExport?: boolean;
}): Promise<{ result: DisputeSummaryResult; model: string }> {
  const transcript = options.messages
    .map(
      (m) =>
        `[${m.created_at}] message_id=${m.id} sender=${m.sender_id}: ${m.body ?? ""}`,
    )
    .join("\n");

  const tokenEstimate = estimateTokens(transcript);
  const model = getAiModel(
    "summary",
    tokenEstimate,
    options.professionalExport,
  );

  const topicLine = options.topicFilter
    ? `\nTopic filter: ${options.topicFilter}`
    : "";

  const parsed = await completeJson<DisputeSummaryResult>({
    model,
    system: SYSTEM_PROMPT,
    user: `Locale: ${options.locale}${topicLine}\n\nTranscript:\n${transcript}`,
    maxTokens: 4096,
  });

  if (
    !Array.isArray(parsed.timeline) ||
    !Array.isArray(parsed.positions) ||
    !Array.isArray(parsed.unresolved)
  ) {
    throw new Error("Unexpected AI response shape.");
  }

  return {
    model,
    result: {
      timeline: parsed.timeline,
      positions: parsed.positions,
      unresolved: parsed.unresolved,
      disclaimer:
        parsed.disclaimer ??
        "AI-generated summary; original records available; not legal advice.",
    },
  };
}
