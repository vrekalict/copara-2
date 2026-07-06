"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { staffPath } from "@/lib/admin/staff-path";
import {
  deleteBlogPostFromDb,
  importBlogPostsToDb,
  importStaticPostsToDb,
  upsertBlogPostInDb,
} from "@/lib/blog/repository";
import type { BlogCategory, BlogPostInput, BlogPostStatus } from "@/lib/blog/types";
import { parseBlogPostsJson } from "@/lib/blog/parse-import";
import { normalizeBlogBody } from "@/lib/blog/normalize-body";
import { getStaticPostsForImport } from "@/lib/blog";
import { createServiceClient } from "@/lib/supabase/service";

const CATEGORIES: BlogCategory[] = [
  "Communication",
  "Schedules",
  "Expenses",
  "Records",
  "Professionals",
];

function parseBlogInput(formData: FormData): BlogPostInput | { error: string } {
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = normalizeBlogBody(String(formData.get("body") ?? "").trim());
  const category = String(formData.get("category") ?? "") as BlogCategory;
  const author = String(formData.get("author") ?? "Copara Editorial").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const publishedAt = String(formData.get("publishedAt") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as BlogPostStatus;
  const featured = formData.get("featured") === "on";

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (!title) return { error: "Title is required." };
  if (!excerpt) return { error: "Excerpt is required." };
  if (!body) return { error: "Body is required." };
  if (!CATEGORIES.includes(category)) return { error: "Invalid category." };
  if (!seoDescription) return { error: "SEO description is required." };
  if (!publishedAt) return { error: "Publish date is required." };
  if (status !== "draft" && status !== "published") return { error: "Invalid status." };

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

export async function saveBlogPost(
  _prev: { error?: string; redirectTo?: string } | null,
  formData: FormData,
): Promise<{ error?: string; redirectTo?: string } | null> {
  try {
    const auth = await requireAdmin();

    const id = String(formData.get("id") ?? "").trim() || undefined;
    const parsed = parseBlogInput(formData);
    if ("error" in parsed) return { error: parsed.error };

    const coverFile = formData.get("coverImage") as File | null;
    let coverImagePath = String(formData.get("existingCoverPath") ?? "").trim() || null;

    if (coverFile && coverFile.size > 0) {
      const maxBytes = 5 * 1024 * 1024;
      if (coverFile.size > maxBytes) {
        return { error: "Cover image must be 5 MB or smaller." };
      }

      const service = createServiceClient();
      const ext = coverFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${parsed.slug}/cover.${ext}`;
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const { error: uploadError } = await service.storage
        .from("blog-images")
        .upload(path, buffer, { contentType: coverFile.type, upsert: true });

      if (uploadError) {
        return { error: `Cover image upload failed: ${uploadError.message}` };
      }
      coverImagePath = path;
    }

    const result = await upsertBlogPostInDb(
      { ...parsed, coverImagePath },
      auth.user.id,
      id,
    );

    if (!result.ok) return { error: result.error };

    revalidatePath("/blog");
    revalidatePath(`/blog/${result.post.slug}`);
    revalidatePath(staffPath("/blog"));
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");
    revalidatePath("/llms-full.txt");

    return {
      redirectTo: id
        ? `${staffPath("/blog")}?saved=1`
        : `${staffPath(`/blog/${result.post.id}/edit`)}?created=1`,
    };
  } catch (error) {
    console.error("[admin/blog] saveBlogPost failed:", error);
    const message = error instanceof Error ? error.message : "Could not save post.";
    if (message.includes("Body exceeded") || message.includes("body size limit")) {
      return {
        error:
          "Upload too large. Try a smaller cover image (under 5 MB) or shorten the article body.",
      };
    }
    return { error: message };
  }
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const result = await deleteBlogPostFromDb(id);
  if (!result.ok) return;

  revalidatePath("/blog");
  revalidatePath(staffPath("/blog"));
  redirect(`${staffPath("/blog")}?deleted=1`);
}

export async function importLegacyBlogPosts() {
  const auth = await requireAdmin();

  const result = await importStaticPostsToDb(auth.user.id, getStaticPostsForImport());

  revalidatePath("/blog");
  revalidatePath(staffPath("/blog"));
  return result;
}

export type BlogJsonImportResult =
  | { ok: true; imported: number; updated: number; skipped: number; failed: { slug: string; error: string }[] }
  | { ok: false; error: string };

export async function importBlogPostsFromJson(json: string): Promise<BlogJsonImportResult> {
  const auth = await requireAdmin();

  const trimmed = json.trim();
  if (!trimmed) return { ok: false, error: "Paste JSON or upload a .json file." };

  const parsed = parseBlogPostsJson(trimmed);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const result = await importBlogPostsToDb(auth.user.id, parsed.posts, { upsert: true });

  revalidatePath("/blog");
  revalidatePath(staffPath("/blog"));
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");

  for (const post of parsed.posts) {
    revalidatePath(`/blog/${post.slug}`);
  }

  return { ok: true, ...result };
}
