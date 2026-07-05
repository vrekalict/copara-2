import Link from "next/link";
import { AdminNav, getStaffBlogPaths } from "@/components/admin/admin-nav";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminBlogNewPage() {
  const auth = await requireAdmin("/blog/new");
  if (!auth.ok) {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
      </main>
    );
  }

  const paths = getStaffBlogPaths();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <AdminNav active="blog" />
      <Link href={paths.index} className="text-sm font-medium text-primary hover:underline">
        ← All posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">New blog post</h1>
      <div className="mt-8">
        <BlogPostForm cancelHref={paths.index} />
      </div>
    </main>
  );
}
