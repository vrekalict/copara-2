export function readingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
