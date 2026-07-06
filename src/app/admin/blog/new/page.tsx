import {
  AdminCard,
  AdminInfoBox,
  AdminShell,
} from "@/components/admin/admin-shell";
import { getStaffBlogPaths } from "@/lib/admin/staff-blog-paths";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminBlogNewPage() {
  await requireAdmin();

  const paths = getStaffBlogPaths();

  return (
    <AdminShell
      active="blog"
      eyebrow="Content"
      title="New article"
      description="Draft a post for the public blog. Save as draft first, then publish when the copy, SEO fields, and cover image are ready."
      backHref={paths.index}
      backLabel="All posts"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <AdminInfoBox title="Before you publish">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>
              <strong className="font-medium text-foreground">Title & slug</strong> — the slug becomes the URL (
              <code className="text-xs">/blog/your-slug</code>).
            </li>
            <li>
              <strong className="font-medium text-foreground">Excerpt</strong> — shown on the blog index and category pages.
            </li>
            <li>
              <strong className="font-medium text-foreground">SEO description</strong> — aim for 150–160 characters for Google snippets.
            </li>
            <li>
              <strong className="font-medium text-foreground">Body</strong> — markdown: blank lines,{" "}
              <code className="text-xs">## </code> headings, <code className="text-xs">- </code> lists,{" "}
              <code className="text-xs">**bold**</code>, <code className="text-xs">[links](url)</code>.
            </li>
          </ul>
        </AdminInfoBox>

        <AdminCard>
          <BlogPostForm cancelHref={paths.index} />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
