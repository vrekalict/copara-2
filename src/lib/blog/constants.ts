import type { BlogCategory } from "./types";

export const BLOG_CATEGORY_ALL = "All" as const;

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Communication",
  "Schedules",
  "Expenses",
  "Records",
  "Professionals",
];
