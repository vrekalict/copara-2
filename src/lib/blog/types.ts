export type BlogCategory =
  | "Communication"
  | "Schedules"
  | "Expenses"
  | "Records"
  | "Professionals";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id?: string;
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
  status?: BlogPostStatus;
  coverImageUrl?: string;
};

export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  featured: boolean;
  author: string;
  body: string;
  seoDescription: string;
  status: BlogPostStatus;
  coverImagePath?: string | null;
};
