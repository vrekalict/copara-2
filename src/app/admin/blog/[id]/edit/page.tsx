import { notFound } from "next/navigation";
import {
  AdminBanner,
  AdminCard,
  AdminInfoBox,
  AdminShell,
} from "@/components/admin/admin-shell";
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
  await requireAdmin();

  const { id } = await params;
  const query = await searchParams;
  const post = await fetchPostByIdFromDb(id);
  if (!post) notFound();

  const paths = getStaffBlogPaths();
  const isPublished = post.status === "published";
  const formPost: typeof post = {
    ...post,
    body: post.body.replace(/\r\n/g, "\n"),
  };

  return (
    <AdminShell
      active="blog"
      eyebrow="Content"
      title="Edit article"
      description={
        isPublished
          ? `This post is live at /blog/${post.slug}. Changes save immediately when you publish.`
          : "This post is a draft — visitors cannot see it until you set status to Published."
      }
      backHref={paths.index}
      backLabel="All posts"
      maxWidth="3xl"
      banner={
        query.created ? (
          <AdminBanner>Post created. Keep editing, then publish when ready.</AdminBanner>
        ) : undefined
      }
    >
      <AdminCard>
        <BlogPostForm post={formPost} cancelHref={paths.index} />
      </AdminCard>
    </AdminShell>
  );
}
