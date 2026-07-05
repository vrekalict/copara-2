import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate, readingTimeMinutes } from "@/lib/blog";

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const minutes = readingTimeMinutes(post.body);

  return (
    <article
      className={
        featured
          ? "group flex flex-col rounded-2xl border-2 border-[var(--marketing-border)] bg-background p-7 transition-shadow hover:shadow-[0_16px_40px_-24px_oklch(0.28_0.03_250_/_0.4)] lg:col-span-2 lg:flex-row lg:gap-8"
          : "group flex flex-col rounded-2xl border border-[var(--marketing-border)] bg-background p-6 transition-shadow hover:shadow-[0_12px_32px_-20px_oklch(0.28_0.03_250_/_0.35)]"
      }
    >
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            {post.category}
          </span>
          <span className="text-muted-foreground">{formatBlogDate(post.publishedAt)}</span>
          <span className="text-muted-foreground">{minutes} min read</span>
        </div>
        <h2
          className={
            featured
              ? "mt-4 text-2xl font-semibold tracking-tight text-slate-heading sm:text-3xl"
              : "mt-3 text-xl font-semibold tracking-tight text-slate-heading"
          }
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 text-sm font-semibold text-primary hover:underline"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
