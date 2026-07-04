import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI is not configured.");
  }
  return new OpenAI({ apiKey });
}

export async function completeJson<T>(options: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: options.model,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
    response_format: { type: "json_object" },
    max_tokens: options.maxTokens ?? 4096,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty AI response.");
  }

  return JSON.parse(text) as T;
}
