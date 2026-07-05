import type { BlogPost } from "./types";

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

/** Cover image from CMS, or first markdown image in the post body. */
export function postThumbnailUrl(post: BlogPost): string | undefined {
  if (post.coverImageUrl) return post.coverImageUrl;
  const match = post.body.match(/!\[[^\]]*]\(([^)]+)\)/);
  const src = match?.[1]?.trim();
  if (!src || src.startsWith("data:")) return undefined;
  return src;
}
