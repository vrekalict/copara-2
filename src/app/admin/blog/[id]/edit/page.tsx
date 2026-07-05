import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { getStaffBlogPaths } from "@/lib/admin/staff-blog-paths";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdmin } from "@/lib/admin/require-admin";
import { fetchPostByIdFromDb } from "@/lib/blog/repository";

export default async function AdminBlogEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const auth = await requireAdmin("/blog");
  if (!auth.ok) {
    return (
      <main className="mx-auto max-w-lg p-6">
        <h1 className="text-xl font-semibold">Access denied</h1>
      </main>
    );
  }

  const { id } = await params;
  const query = await searchParams;
  const post = await fetchPostByIdFromDb(id);
  if (!post) notFound();

  const paths = getStaffBlogPaths();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <AdminNav active="blog" />
      <Link href={paths.index} className="text-sm font-medium text-primary hover:underline">
        ← All posts
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Edit post</h1>
      {query.created && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Post created. You can keep editing or publish when ready.
        </p>
      )}
      <div className="mt-8">
        <BlogPostForm post={post} cancelHref={paths.index} />
      </div>
    </main>
  );
}
