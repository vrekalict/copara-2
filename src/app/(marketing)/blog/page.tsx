import Link from "next/link";
import { Suspense } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import {
  BLOG_CATEGORY_ALL,
  BlogCategoryNav,
} from "@/components/blog/blog-category-nav";
import { LegalDisclaimer } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import {
  BLOG_CATEGORIES,
  getFeaturedPosts,
  getPostsByCategory,
  type BlogCategory,
} from "@/lib/blog";
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

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: raw } = await searchParams;
  const category = parseCategory(raw);
  const featured = category === BLOG_CATEGORY_ALL ? await getFeaturedPosts() : [];
  const posts = (await getPostsByCategory(category)).filter(
    (p) => !featured.some((f) => f.slug === p.slug),
  );

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

      {featured.length > 0 && (
        <Section variant="cream" className="pt-0">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">
            Featured
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} featured />
            ))}
          </div>
        </Section>
      )}

      <Section className={featured.length > 0 ? "pt-0" : undefined}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && featured.length === 0 && (
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
