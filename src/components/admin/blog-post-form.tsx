"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { saveBlogPost } from "@/actions/admin/blog";
import { BLOG_CATEGORIES } from "@/lib/blog/constants";
import { slugifyTitle } from "@/lib/blog/slugify";
import type { BlogPost } from "@/lib/blog/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_COVER_BYTES = 5 * 1024 * 1024;

function normalizeBodyText(body: string | undefined): string {
  return (body ?? "").replace(/\r\n/g, "\n");
}

function coverPathFromUrl(url: string | undefined): string {
  if (!url) return "";
  const marker = "/blog-images/";
  const index = url.indexOf(marker);
  if (index === -1) return "";
  return url.slice(index + marker.length);
}

export function BlogPostForm({
  post,
  cancelHref,
}: {
  post?: BlogPost;
  cancelHref: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveBlogPost, null);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(() => normalizeBodyText(post?.body));
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.coverImageUrl ?? null);

  useEffect(() => {
    if (state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state?.redirectTo, router]);

  function handleTitleChange(title: string) {
    if (!slugTouched) {
      setSlug(slugifyTitle(title));
    }
  }

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCoverError(null);
    const file = event.target.files?.[0];
    if (!file) {
      setCoverPreview(post?.coverImageUrl ?? null);
      return;
    }

    if (file.size > MAX_COVER_BYTES) {
      setCoverError("Cover image must be 5 MB or smaller.");
      event.target.value = "";
      setCoverPreview(post?.coverImageUrl ?? null);
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
  }

  const publishedAtDefault =
    post?.publishedAt?.slice(0, 10) ??
    new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-6" key={post?.id ?? "new"}>
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      {coverPathFromUrl(post?.coverImageUrl) && (
        <input
          type="hidden"
          name="existingCoverPath"
          value={coverPathFromUrl(post?.coverImageUrl)}
        />
      )}

      {(state?.error || coverError) && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {coverError ?? state?.error}
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
            defaultValue={publishedAtDefault}
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
          <Input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleCoverChange}
          />
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, or GIF · max 5 MB</p>
          {coverPreview && (
            <img
              src={coverPreview}
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
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-relaxed"
          />
          <p className="text-xs text-muted-foreground">
            Markdown supported: blank lines for paragraphs, <code>## </code> / <code>### </code> for
            headings, <code>- </code> for lists, <code>**bold**</code>, and{" "}
            <code>[link text](url)</code> for links.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending || Boolean(coverError)}>
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
