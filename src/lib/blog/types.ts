export type BlogCategory =
  | "Communication"
  | "Schedules"
  | "Expenses"
  | "Records"
  | "Professionals";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  author: string;
  body: string;
  seoDescription: string;
};
