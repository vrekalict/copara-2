import { BLOG_CATEGORIES } from "./constants";
import type { BlogCategory, BlogPostInput, BlogPostStatus } from "./types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type RawImportPost = Record<string, unknown>;

export type ParsedImportResult =
  | { ok: true; posts: BlogPostInput[] }
  | { ok: false; error: string };

export type ImportRowError = { index: number; slug?: string; error: string };

function readString(obj: RawImportPost, ...keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function readBoolean(obj: RawImportPost, key: string, fallback: boolean): boolean {
  const value = obj[key];
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseOnePost(raw: unknown, index: number): BlogPostInput | ImportRowError {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { index, error: "Each post must be a JSON object." };
  }

  const obj = raw as RawImportPost;
  const slug = readString(obj, "slug");
  const title = readString(obj, "title");
  const excerpt = readString(obj, "excerpt");
  const body = readString(obj, "body");
  const category = readString(obj, "category") as BlogCategory;
  const author = readString(obj, "author") || "Copara Editorial";
  const seoDescription = readString(obj, "seoDescription", "seo_description");
  const publishedAt = readString(obj, "publishedAt", "published_at");
  const status = (readString(obj, "status") || "draft") as BlogPostStatus;
  const featured = readBoolean(obj, "featured", false);

  if (!slug || !SLUG_RE.test(slug)) {
    return { index, slug: slug || undefined, error: "Invalid or missing slug (lowercase letters, numbers, hyphens)." };
  }
  if (!title) return { index, slug, error: "Title is required." };
  if (!excerpt) return { index, slug, error: "Excerpt is required." };
  if (!body) return { index, slug, error: "Body is required." };
  if (!BLOG_CATEGORIES.includes(category)) {
    return {
      index,
      slug,
      error: `Invalid category. Use one of: ${BLOG_CATEGORIES.join(", ")}.`,
    };
  }
  if (!seoDescription) return { index, slug, error: "seoDescription is required." };
  if (!publishedAt || !DATE_RE.test(publishedAt)) {
    return { index, slug, error: "publishedAt must be YYYY-MM-DD." };
  }
  if (status !== "draft" && status !== "published") {
    return { index, slug, error: 'status must be "draft" or "published".' };
  }

  return {
    slug,
    title,
    excerpt,
    body,
    category,
    author,
    seoDescription,
    publishedAt,
    status,
    featured,
    coverImagePath: null,
  };
}

export function parseBlogPostsJson(json: string): ParsedImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "Invalid JSON. Check brackets, commas, and quotes." };
  }

  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length === 0) {
    return { ok: false, error: "JSON must contain at least one post." };
  }
  if (rows.length > 50) {
    return { ok: false, error: "Import up to 50 posts at a time." };
  }

  const posts: BlogPostInput[] = [];
  const errors: ImportRowError[] = [];

  rows.forEach((row, index) => {
    const result = parseOnePost(row, index);
    if ("error" in result) {
      errors.push(result);
    } else {
      posts.push(result);
    }
  });

  if (errors.length > 0) {
    const preview = errors
      .slice(0, 3)
      .map((e) => `#${e.index + 1}${e.slug ? ` (${e.slug})` : ""}: ${e.error}`)
      .join(" ");
    return {
      ok: false,
      error: errors.length === 1 ? preview : `${errors.length} posts invalid. ${preview}`,
    };
  }

  const slugs = posts.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) {
    return { ok: false, error: "Duplicate slugs in import batch." };
  }

  return { ok: true, posts };
}

export const BLOG_IMPORT_SAMPLE = [
  {
    title: "Example co-parenting article",
    slug: "example-co-parenting-article",
    excerpt: "One or two sentences shown on the blog index.",
    seoDescription: "150–160 character meta description for search engines.",
    category: "Communication",
    author: "Copara Editorial",
    publishedAt: "2026-07-05",
    status: "draft",
    featured: false,
    body: "Opening paragraph.\n\n## Section heading\n\nBody with **bold** text.\n\n- Bullet one\n- Bullet two",
  },
];
