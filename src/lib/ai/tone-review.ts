import { completeJson } from "@/lib/ai/openai";
import { getAiModel } from "@/lib/ai/model-router";

export type ToneLevel = "hostile" | "tense" | "neutral" | "constructive";

export type ToneFlag = {
  phrase: string;
  reason: string;
};

export type ToneReviewResult = {
  tone: ToneLevel;
  flags: ToneFlag[];
  rewrites: string[];
};

const SYSTEM_PROMPT = `You review co-parenting message drafts for tone before they are sent.
Return ONLY valid JSON with this exact shape:
{"tone":"hostile|tense|neutral|constructive","flags":[{"phrase":"...","reason":"..."}],"rewrites":["...","...","..."]}

Rules:
- Never fabricate facts or take sides between parents.
- Rewrites must preserve the sender's actual request and content.
- Use plain language; no legal advice.
- Respond in the user's locale (English or French) for flags and rewrites when locale is fr.
- Provide 1-3 rewrite suggestions when tone is hostile or tense; otherwise rewrites may be an empty array.
- flags should cite specific phrases from the draft when possible.`;

export async function reviewMessageTone(
  draft: string,
  locale: string,
): Promise<{ result: ToneReviewResult; model: string }> {
  const model = getAiModel("tone_review");
  const parsed = await completeJson<ToneReviewResult>({
    model,
    system: SYSTEM_PROMPT,
    user: `Locale: ${locale}\n\nDraft:\n${draft}`,
    maxTokens: 1024,
  });

  if (
    !parsed.tone ||
    !Array.isArray(parsed.flags) ||
    !Array.isArray(parsed.rewrites)
  ) {
    throw new Error("Unexpected AI response shape.");
  }

  return {
    model,
    result: {
      tone: parsed.tone,
      flags: parsed.flags.slice(0, 5),
      rewrites: parsed.rewrites.slice(0, 3),
    },
  };
}
