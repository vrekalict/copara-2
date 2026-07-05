import type { BlogPost } from "./types";
import { post as p1 } from "./posts/communicating-about-pickup-changes";
import { post as p2 } from "./posts/parenting-schedules-that-reduce-confusion";
import { post as p3 } from "./posts/keeping-expense-records-organized";
import { post as p4 } from "./posts/what-tamper-evident-records-mean";
import { post as p5 } from "./posts/records-mediators-want-to-see";
import { post as p6 } from "./posts/calm-messaging-high-conflict-weeks";

/** Legacy file-based posts — used as fallback until CMS posts exist in the database. */
export const STATIC_BLOG_POSTS: BlogPost[] = [p1, p2, p3, p4, p5, p6];

export function getStaticPosts(): BlogPost[] {
  return [...STATIC_BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
