import { createServiceClient } from "@/lib/supabase/service";
import type { BlogPost, BlogPostInput, BlogPostStatus } from "./types";

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: BlogPost["category"];
  author: string;
  seo_description: string;
  featured: boolean;
  status: BlogPostStatus;
  cover_image_path: string | null;
  published_at: string;
  updated_at: string;
};

function coverImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return undefined;
  return `${base}/storage/v1/object/public/blog-images/${path}`;
}

export function mapBlogPostRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    author: row.author,
    seoDescription: row.seo_description,
    featured: row.featured,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    coverImageUrl: coverImageUrl(row.cover_image_path),
  };
}

export async function fetchPublishedPostsFromDb(): Promise<BlogPost[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[blog] fetch published failed:", error.message);
    return [];
  }

  return (data as BlogPostRow[]).map(mapBlogPostRow);
}

export async function fetchAllPostsFromDb(): Promise<BlogPost[]> {
  const service = createServiceClient();
  const { data, error } = await service
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[blog] fetch all failed:", error.message);
    return [];
  }

  return (data as BlogPostRow[]).map(mapBlogPostRow);
}

export async function fetchPostBySlugFromDb(slug: string): Promise<BlogPost | undefined> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return undefined;
  return mapBlogPostRow(data as BlogPostRow);
}

export async function fetchPostByIdFromDb(id: string): Promise<BlogPost | undefined> {
  const service = createServiceClient();
  const { data, error } = await service.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (error || !data) return undefined;
  return mapBlogPostRow(data as BlogPostRow);
}

export async function upsertBlogPostInDb(
  input: BlogPostInput,
  userId: string,
  id?: string,
): Promise<{ ok: true; post: BlogPost } | { ok: false; error: string }> {
  const service = createServiceClient();
  const payload = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    category: input.category,
    author: input.author,
    seo_description: input.seoDescription,
    featured: input.featured,
    status: input.status,
    cover_image_path: input.coverImagePath ?? null,
    published_at: input.publishedAt,
    updated_at: new Date().toISOString(),
    ...(id ? {} : { created_by: userId }),
  };

  const query = id
    ? service.from("blog_posts").update(payload).eq("id", id).select("*").single()
    : service.from("blog_posts").insert(payload).select("*").single();

  const { data, error } = await query;

  if (error) {
    console.error("[blog] upsert failed:", error.message);
    if (error.code === "23505") {
      return { ok: false, error: "A post with this URL slug already exists." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, post: mapBlogPostRow(data as BlogPostRow) };
}

export async function deleteBlogPostFromDb(id: string): Promise<{ ok: boolean; error?: string }> {
  const service = createServiceClient();
  const { error } = await service.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("[blog] delete failed:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function importStaticPostsToDb(
  userId: string,
  posts: BlogPost[],
): Promise<{ imported: number; skipped: number }> {
  const service = createServiceClient();
  const { data: existing } = await service.from("blog_posts").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug as string));

  let imported = 0;
  let skipped = 0;

  for (const post of posts) {
    if (existingSlugs.has(post.slug)) {
      skipped++;
      continue;
    }

    const result = await upsertBlogPostInDb(
      {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        category: post.category,
        author: post.author,
        seoDescription: post.seoDescription,
        featured: post.featured ?? false,
        status: "published",
        publishedAt: post.publishedAt,
        coverImagePath: null,
      },
      userId,
    );

    if (result.ok) imported++;
  }

  return { imported, skipped };
}
