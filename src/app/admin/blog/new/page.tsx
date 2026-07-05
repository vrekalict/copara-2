import {
  AdminCard,
  AdminInfoBox,
  AdminShell,
} from "@/components/admin/admin-shell";
import { getStaffBlogPaths } from "@/lib/admin/staff-blog-paths";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminBlogNewPage() {
  const auth = await requireAdmin("/blog/new");
  if (!auth.ok) {
    return (
      <AdminShell title="Access denied" maxWidth="lg">
        <AdminInfoBox title="Admin access required">
          Sign in with an email listed in <code className="text-xs">COPARA_ADMIN_EMAILS</code>.
        </AdminInfoBox>
      </AdminShell>
    );
  }

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
              <strong className="font-medium text-foreground">Body</strong> — use blank lines between paragraphs;{" "}
              <code className="text-xs">## </code> for headings and <code className="text-xs">- </code> for lists.
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
