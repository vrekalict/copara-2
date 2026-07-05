import type { BlogCategory, BlogPost } from "./types";
import { BLOG_CATEGORY_ALL } from "./constants";
import { getStaticPosts, STATIC_BLOG_POSTS } from "./static-posts";

export { BLOG_CATEGORIES, BLOG_CATEGORY_ALL } from "./constants";
export { formatBlogDate, postThumbnailUrl, readingTimeMinutes } from "./utils";

async function resolvePublishedPosts(): Promise<BlogPost[]> {
  const { fetchPublishedPostsFromDb } = await import("./repository");
  const fromDb = await fetchPublishedPostsFromDb();
  const staticPosts = getStaticPosts();

  if (fromDb.length === 0) return staticPosts;

  const dbSlugs = new Set(fromDb.map((post) => post.slug));
  const legacyOnly = staticPosts.filter((post) => !dbSlugs.has(post.slug));
  return [...fromDb, ...legacyOnly];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return resolvePublishedPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { fetchPostBySlugFromDb } = await import("./repository");
  const fromDb = await fetchPostBySlugFromDb(slug);
  if (fromDb) return fromDb;
  return getStaticPosts().find((p) => p.slug === slug);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await resolvePublishedPosts();
  return posts.filter((p) => p.featured);
}

export async function getPostsByCategory(
  category: BlogCategory | typeof BLOG_CATEGORY_ALL,
): Promise<BlogPost[]> {
  const posts = await resolvePublishedPosts();
  if (category === BLOG_CATEGORY_ALL) return posts;
  return posts.filter((p) => p.category === category);
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const current = await getPostBySlug(slug);
  const posts = await resolvePublishedPosts();
  if (!current) return posts.slice(0, limit);
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 1 : 0;
      const bScore = b.category === current.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  const { fetchAllPostsFromDb } = await import("./repository");
  return fetchAllPostsFromDb();
}

export function getStaticPostsForImport(): BlogPost[] {
  return STATIC_BLOG_POSTS;
}

export type { BlogCategory, BlogPost, BlogPostInput, BlogPostStatus } from "./types";
