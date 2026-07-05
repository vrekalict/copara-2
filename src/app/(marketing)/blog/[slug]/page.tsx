import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogContent } from "@/components/blog/blog-content";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/marketing/json-ld";
import { LegalDisclaimer } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import {
  formatBlogDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  readingTimeMinutes,
} from "@/lib/blog";
import { pageMetadata } from "@/lib/marketing/metadata";
import { blogPostingSchema } from "@/lib/marketing/schema";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    ogTitle: post.title,
    ogDescription: post.excerpt,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const minutes = readingTimeMinutes(post.body);

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <Section className="pt-12 md:pt-16">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← All resources
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>{minutes} min read</span>
            <span>{post.author}</span>
          </div>
          <h1 className="display mt-6 text-[clamp(2rem,4vw,2.75rem)]">{post.title}</h1>
          <p className="lead mt-5">{post.excerpt}</p>
          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt=""
              className="mt-8 w-full rounded-xl border border-[var(--marketing-border)] object-cover"
            />
          )}
          <div className="mt-10 border-t border-[var(--marketing-border)] pt-10">
            <BlogContent body={post.body} />
          </div>
          <div className="mt-10">
            <LegalDisclaimer />
          </div>
        </article>
      </Section>

      {related.length > 0 && (
        <Section variant="cream" className="pb-20">
          <h2 className="mb-6 text-2xl font-semibold text-slate-heading">Related reading</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
