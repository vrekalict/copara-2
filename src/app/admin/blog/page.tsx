import Link from "next/link";
import { BlogJsonImport } from "@/components/admin/blog-json-import";
import { BlogPostsPanel } from "@/components/admin/blog-posts-panel";
import {
  AdminBanner,
  AdminInfoBox,
  AdminShell,
  AdminStat,
} from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getStaffBlogPaths } from "@/lib/admin/staff-blog-paths";
import { getAllPostsForAdmin } from "@/lib/blog";
import { isServiceClientConfigured } from "@/lib/supabase/service";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; created?: string }>;
}) {
  const auth = await requireAdmin();
  const params = await searchParams;

  if (!isServiceClientConfigured()) {
    return (
      <AdminShell active="blog" eyebrow="Content" title="Blog CMS unavailable" maxWidth="lg">
        <AdminInfoBox title="Missing configuration">
          This deployment needs <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel
          environment variables. Add it, redeploy, then return here to manage posts.
        </AdminInfoBox>
      </AdminShell>
    );
  }

  const paths = getStaffBlogPaths();
  let posts: Awaited<ReturnType<typeof getAllPostsForAdmin>> = [];
  try {
    posts = await getAllPostsForAdmin();
  } catch (error) {
    console.error("[admin/blog] failed to load posts:", error);
  }

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status !== "published").length;
  const featuredCount = posts.filter((p) => p.featured).length;

  const flashMessage = params.deleted
    ? "Post deleted."
    : params.created
      ? "Post created."
      : params.saved
        ? "Post saved."
        : null;

  return (
    <AdminShell
      active="blog"
      eyebrow="Content"
      title="Blog CMS"
      description={
        <>
          Write and publish articles for{" "}
          <Link href="/blog" className="font-medium text-[var(--marketing-teal)] hover:underline">
            copara.ca/blog
          </Link>
          . Signed in as <span className="font-medium text-foreground">{auth.user.email}</span>.
        </>
      }
      actions={
        <Link href={paths.new} className={cn(buttonVariants())}>
          New post
        </Link>
      }
      banner={flashMessage ? <AdminBanner>{flashMessage}</AdminBanner> : undefined}
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminStat label="Published" value={publishedCount} hint="Live on the public blog" />
          <AdminStat label="Drafts" value={draftCount} hint="Hidden until you publish" />
          <AdminStat label="Featured" value={featuredCount} hint="Shown on the blog index" />
        </div>

        <AdminInfoBox title="How publishing works">
          <ol className="list-decimal space-y-1.5 pl-4">
            <li>Create a post and save it as a draft while you write.</li>
            <li>Set status to <strong className="font-medium text-foreground">Published</strong> when ready — it appears on the site immediately.</li>
            <li>Use <strong className="font-medium text-foreground">Featured</strong> to highlight one article on the blog homepage.</li>
          </ol>
        </AdminInfoBox>

        <BlogJsonImport />

        <BlogPostsPanel posts={posts} showImport={posts.length === 0} paths={paths} />
      </div>
    </AdminShell>
  );
}
