import type { BlogCategory, BlogPost } from "./types";
import { getStaticPosts, STATIC_BLOG_POSTS } from "./static-posts";
import {
  fetchAllPostsFromDb,
  fetchPostBySlugFromDb,
  fetchPublishedPostsFromDb,
} from "./repository";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Communication",
  "Schedules",
  "Expenses",
  "Records",
  "Professionals",
];

async function resolvePublishedPosts(): Promise<BlogPost[]> {
  const fromDb = await fetchPublishedPostsFromDb();
  if (fromDb.length > 0) return fromDb;
  return getStaticPosts();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return resolvePublishedPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const fromDb = await fetchPostBySlugFromDb(slug);
  if (fromDb) return fromDb;
  return getStaticPosts().find((p) => p.slug === slug);
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await resolvePublishedPosts();
  return posts.filter((p) => p.featured);
}

export async function getPostsByCategory(category: BlogCategory | "All"): Promise<BlogPost[]> {
  const posts = await resolvePublishedPosts();
  if (category === "All") return posts;
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
  const fromDb = await fetchAllPostsFromDb();
  return fromDb;
}

export function getStaticPostsForImport(): BlogPost[] {
  return STATIC_BLOG_POSTS;
}

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

export type { BlogCategory, BlogPost, BlogPostInput, BlogPostStatus } from "./types";
