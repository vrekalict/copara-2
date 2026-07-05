"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBlogPost, importLegacyBlogPosts } from "@/actions/admin/blog";
import type { BlogPost } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogPostsPanel({
  posts,
  showImport,
  paths,
}: {
  posts: BlogPost[];
  showImport: boolean;
  paths: ReturnType<typeof import("@/components/admin/admin-nav").getStaffBlogPaths>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleImport() {
    startTransition(async () => {
      await importLegacyBlogPosts();
      window.location.reload();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {posts.length} post{posts.length === 1 ? "" : "s"} in the CMS
        </p>
        <div className="flex flex-wrap gap-2">
          {showImport && (
            <Button type="button" variant="outline" disabled={isPending} onClick={handleImport}>
              Import existing file-based posts
            </Button>
          )}
          <Link href={paths.new} className={cn(buttonVariants())}>
            New post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No posts yet. Create one or import the legacy articles.</p>
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {posts.map((post) => (
            <li key={post.id ?? post.slug} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={paths.edit(post.id!)} className="font-medium hover:text-primary">
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
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
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
                    View
                  </Link>
                )}
                <Link
                  href={paths.edit(post.id!)}
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
      )}
    </div>
  );
}
