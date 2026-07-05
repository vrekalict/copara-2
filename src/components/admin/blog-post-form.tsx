"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveBlogPost } from "@/actions/admin/blog";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { slugifyTitle } from "@/lib/blog/repository";
import type { BlogPost } from "@/lib/blog/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function BlogPostForm({
  post,
  cancelHref,
}: {
  post?: BlogPost;
  cancelHref: string;
}) {
  const [state, formAction, isPending] = useActionState(saveBlogPost, null);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  function handleTitleChange(title: string) {
    if (!slugTouched) {
      setSlug(slugifyTitle(title));
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      {post?.coverImageUrl && (
        <input type="hidden" name="existingCoverPath" value={post.coverImageUrl.split("/blog-images/")[1] ?? ""} />
      )}

      {state?.error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug">URL slug</Label>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>/blog/</span>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            defaultValue={post?.excerpt}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="seoDescription">SEO meta description</Label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            required
            rows={2}
            maxLength={320}
            defaultValue={post?.seoDescription}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">Aim for 150–160 characters for search results.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={post?.category ?? "Communication"}
            className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" defaultValue={post?.author ?? "Copara Editorial"} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishedAt">Publish date</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            required
            defaultValue={post?.publishedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={post?.featured}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="featured">Feature on blog index</Label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="coverImage">Cover image (optional)</Label>
          <Input id="coverImage" name="coverImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          {post?.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt=""
              className="mt-2 max-h-40 rounded-lg border object-cover"
            />
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="body">Body</Label>
          <textarea
            id="body"
            name="body"
            required
            rows={18}
            defaultValue={post?.body}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-sm leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            Use blank lines between paragraphs. Start lines with <code>## </code> for headings and{" "}
            <code>- </code> for bullet lists. Wrap text in <code>**</code> for bold.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
        {post?.status === "published" && (
          <Link
            href={`/blog/${post.slug}`}
            className={cn(buttonVariants({ variant: "outline" }))}
            target="_blank"
          >
            View live
          </Link>
        )}
        <Link href={cancelHref} className={cn(buttonVariants({ variant: "ghost" }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
