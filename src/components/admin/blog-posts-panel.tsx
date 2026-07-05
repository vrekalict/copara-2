"use client";

import Link from "next/link";
import { useTransition } from "react";
import { FilePlus, Upload } from "lucide-react";
import { deleteBlogPost, importLegacyBlogPosts } from "@/actions/admin/blog";
import type { StaffBlogPaths } from "@/lib/admin/staff-blog-paths";
import type { BlogPost } from "@/lib/blog/types";
import { formatBlogDate } from "@/lib/blog/utils";
import { AdminCard } from "@/components/admin/admin-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogPostsPanel({
  posts,
  showImport,
  paths,
}: {
  posts: BlogPost[];
  showImport: boolean;
  paths: StaffBlogPaths;
}) {
  const [isPending, startTransition] = useTransition();

  function editHref(id: string) {
    return `${paths.index}/${id}/edit`;
  }

  function handleImport() {
    startTransition(async () => {
      await importLegacyBlogPosts();
      window.location.reload();
    });
  }

  if (posts.length === 0) {
    return (
      <AdminCard className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--marketing-teal)]/10">
          <FilePlus className="size-5 text-[var(--marketing-teal)]" aria-hidden />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--marketing-slate)]">No posts yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Start fresh with a new article, or import the original file-based posts that shipped with
          the marketing site.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={paths.new} className={cn(buttonVariants())}>
            Create first post
          </Link>
          {showImport && (
            <Button type="button" variant="outline" disabled={isPending} onClick={handleImport}>
              <Upload className="mr-2 size-4" aria-hidden />
              {isPending ? "Importing…" : "Import legacy posts"}
            </Button>
          )}
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {posts.length} post{posts.length === 1 ? "" : "s"} · newest first
        </p>
        <div className="flex flex-wrap gap-2">
          {showImport && (
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleImport}>
              Import legacy posts
            </Button>
          )}
          <Link href={paths.new} className={cn(buttonVariants({ size: "sm" }))}>
            New post
          </Link>
        </div>
      </div>

      <ul className="divide-y overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-white">
        {posts.map((post) => (
          <li
            key={post.id ?? post.slug}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={editHref(post.id!)}
                  className="font-medium text-[var(--marketing-slate)] hover:text-[var(--marketing-teal)]"
                >
                  {post.title}
                </Link>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    post.status === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900",
                  )}
                >
                  {post.status ?? "published"}
                </span>
                {post.featured && (
                  <span className="rounded-full bg-[var(--marketing-teal)]/10 px-2 py-0.5 text-xs font-medium text-[var(--marketing-teal)]">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                /blog/{post.slug} · {post.category} · {formatBlogDate(post.publishedAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.status === "published" && (
                <Link
                  href={`/blog/${post.slug}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  target="_blank"
                >
                  View live
                </Link>
              )}
              <Link
                href={editHref(post.id!)}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                Edit
              </Link>
              <form action={deleteBlogPost}>
                <input type="hidden" name="id" value={post.id} />
                <Button type="submit" variant="outline" size="sm">
                  Delete
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
