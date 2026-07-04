export type AiTask = "tone_review" | "rewrite" | "summary";

export function getAiModel(
  task: AiTask,
  tokenEstimate?: number,
  professionalExport?: boolean,
) {
  if (
    task === "summary" &&
    (professionalExport || (tokenEstimate && tokenEstimate > 100_000))
  ) {
    return process.env.OPENAI_MODEL_SUMMARY_FALLBACK || "gpt-5.4";
  }

  if (task === "summary") {
    return process.env.OPENAI_MODEL_SUMMARY || "gpt-5.4-mini";
  }

  return process.env.OPENAI_MODEL_FAST || "gpt-5.4-mini";
}

export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}
