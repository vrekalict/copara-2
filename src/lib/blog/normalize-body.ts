/** Prepare blog post body text for markdown rendering. */
export function normalizeBlogBody(body: string): string {
  let text = body.replace(/\r\n/g, "\n").trim();
  if (!text) return text;

  text = convertHtmlAnchorsToMarkdown(text);
  text = unwrapOuterCodeFence(text);

  return text.trim();
}

function convertHtmlAnchorsToMarkdown(text: string): string {
  return text.replace(
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href: string, label: string) => `[${label.replace(/<[^>]+>/g, "").trim()}](${href})`,
  );
}

/** ChatGPT exports often wrap the entire article in a single fenced code block. */
function unwrapOuterCodeFence(text: string): string {
  if (!text.startsWith("```")) return text;

  const lines = text.split("\n");
  if (!lines[0].trim().startsWith("```")) return text;

  const closeIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "```");
  if (closeIndex === -1) return text;

  const inside = lines.slice(1, closeIndex).join("\n");
  const remainder = lines.slice(closeIndex + 1).join("\n").trim();

  const unwrapped = remainder ? `${inside}\n\n${remainder}` : inside;
  return unwrapOuterCodeFence(unwrapped);
}
