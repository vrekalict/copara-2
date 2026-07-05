import Link from "next/link";
import { Suspense } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import {
  BLOG_CATEGORY_ALL,
  BlogCategoryNav,
} from "@/components/blog/blog-category-nav";
import { LegalDisclaimer } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { BLOG_CATEGORIES, getPostsByCategory, type BlogCategory, type BlogPost } from "@/lib/blog";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Co-parenting resources and guides",
  description:
    "Practical articles from Copara on calm co-parenting communication, custody schedules, shared expenses, and tamper-evident records for Canadian families.",
  path: "/blog",
});

export const revalidate = 60;

function parseCategory(value: string | undefined): BlogCategory | typeof BLOG_CATEGORY_ALL {
  if (!value) return BLOG_CATEGORY_ALL;
  if (BLOG_CATEGORIES.includes(value as BlogCategory)) return value as BlogCategory;
  return BLOG_CATEGORY_ALL;
}

function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: raw } = await searchParams;
  const category = parseCategory(raw);
  const posts = sortBlogPosts(await getPostsByCategory(category));

  return (
    <>
      <Section className="pt-12 md:pt-16">
        <SectionHeader
          align="left"
          eyebrow="Resources"
          title="Guides for calmer co-parenting"
          description="Practical articles on communication, schedules, expenses, and records. Written for Canadian families and the professionals who support them. Not legal advice."
        />
        <Suspense fallback={null}>
          <BlogCategoryNav active={category} />
        </Suspense>
      </Section>

      <Section className="pt-0 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-muted-foreground">No articles in this category yet.</p>
        )}
      </Section>

      <Section variant="mist" className="pb-20">
        <LegalDisclaimer />
        <p className="mt-6 text-sm">
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Start free trial
          </Link>{" "}
          to use Copara with your co-parenting circle.
        </p>
      </Section>
    </>
  );
}
