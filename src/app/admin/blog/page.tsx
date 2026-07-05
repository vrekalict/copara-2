import { AdminNav, getStaffBlogPaths } from "@/components/admin/admin-nav";
import { BlogPostsPanel } from "@/components/admin/blog-posts-panel";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getAllPostsForAdmin } from "@/lib/blog";
import { isServiceClientConfigured } from "@/lib/supabase/service";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; created?: string }>;
}) {
  const auth = await requireAdmin("/blog");
  const params = await searchParams;

  if (!auth.ok) {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is not configured as a Copara admin. Set{" "}
          <code className="text-xs">COPARA_ADMIN_EMAILS</code> in your environment to include your
          email ({auth.user.email ?? "unknown"}).
        </p>
      </main>
    );
  }

  if (!isServiceClientConfigured()) {
    return (
      <main className="mx-auto max-w-lg p-6">
        <AdminNav active="blog" />
        <h1 className="text-xl font-semibold">Blog CMS unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This deployment is missing{" "}
          <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code>. Add it in Vercel environment
          variables, then redeploy.
        </p>
      </main>
    );
  }

  const paths = getStaffBlogPaths();
  const posts = await getAllPostsForAdmin();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <AdminNav active="blog" />
      <h1 className="text-2xl font-semibold">Blog CMS</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create and publish articles for copara.ca/blog. Sign in with an admin email (
        {auth.user.email}).
      </p>

      {(params.saved || params.deleted || params.created) && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {params.deleted ? "Post deleted." : params.created ? "Post created." : "Post saved."}
        </p>
      )}

      <div className="mt-8">
        <BlogPostsPanel posts={posts} showImport={posts.length === 0} paths={paths} />
      </div>
    </main>
  );
}
