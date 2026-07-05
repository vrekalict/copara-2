import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate, postThumbnailUrl, readingTimeMinutes } from "@/lib/blog";
import { cn } from "@/lib/utils";

function BlogCardCover({ post, featured }: { post: BlogPost; featured: boolean }) {
  const thumbnail = postThumbnailUrl(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      tabIndex={-1}
      aria-hidden
      className={cn(
        "relative block shrink-0 overflow-hidden bg-mist",
        featured
          ? "aspect-[16/10] w-full lg:aspect-auto lg:w-56 lg:self-stretch xl:w-64"
          : "aspect-[16/10] w-full",
      )}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--marketing-teal)]/15 via-primary/5 to-[var(--marketing-navy)]/10 p-4">
          <ImageIcon className="size-8 text-primary/40" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {post.category}
          </span>
        </div>
      )}
    </Link>
  );
}

export function BlogCard({
  post,
  featured = false,
  className,
}: {
  post: BlogPost;
  featured?: boolean;
  className?: string;
}) {
  const minutes = readingTimeMinutes(post.body);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-background transition-shadow hover:shadow-[0_12px_32px_-20px_oklch(0.28_0.03_250_/_0.35)]",
        featured &&
          "border-2 hover:shadow-[0_16px_40px_-24px_oklch(0.28_0.03_250_/_0.4)] lg:col-span-2 lg:flex-row",
        className,
      )}
    >
      <BlogCardCover post={post} featured={featured} />
      <div className={cn("flex flex-1 flex-col", featured ? "p-7" : "p-6")}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
            {post.category}
          </span>
          <span className="text-muted-foreground">{formatBlogDate(post.publishedAt)}</span>
          <span className="text-muted-foreground">{minutes} min read</span>
        </div>
        <h2
          className={cn(
            "font-semibold tracking-tight text-slate-heading",
            featured ? "mt-4 text-2xl sm:text-3xl" : "mt-3 text-xl",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
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
