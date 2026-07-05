import type { BlogCategory, BlogPost } from "./types";
import { post as p1 } from "./posts/communicating-about-pickup-changes";
import { post as p2 } from "./posts/parenting-schedules-that-reduce-confusion";
import { post as p3 } from "./posts/keeping-expense-records-organized";
import { post as p4 } from "./posts/what-tamper-evident-records-mean";
import { post as p5 } from "./posts/records-mediators-want-to-see";
import { post as p6 } from "./posts/calm-messaging-high-conflict-weeks";

const ALL_POSTS: BlogPost[] = [p1, p2, p3, p4, p5, p6];

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Communication",
  "Schedules",
  "Expenses",
  "Records",
  "Professionals",
];

export function getAllPosts(): BlogPost[] {
  return [...ALL_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostsByCategory(category: BlogCategory | "All"): BlogPost[] {
  const posts = getAllPosts();
  if (category === "All") return posts;
  return posts.filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return getAllPosts().slice(0, limit);
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current.category ? 1 : 0;
      const bScore = b.category === current.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
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

export type { BlogCategory, BlogPost };
