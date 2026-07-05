import Link from "next/link";
import { buildStaffPath, getStaffBasePath } from "@/lib/admin/staff-path";
import { cn } from "@/lib/utils";

export function AdminNav({ active }: { active: "blog" | "partners" }) {
  const base = getStaffBasePath();
  if (!base) return null;

  const links = [
    { href: buildStaffPath("/blog")!, label: "Blog", key: "blog" as const },
    { href: buildStaffPath("/partners")!, label: "Partners", key: "partners" as const },
  ];

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active === link.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function getStaffBlogPaths() {
  const index = buildStaffPath("/blog");
  const newPost = buildStaffPath("/blog/new");
  if (!index || !newPost) {
    throw new Error("COPARA_STAFF_PATH is not configured.");
  }

  return {
    index,
    new: newPost,
    edit: (id: string) => buildStaffPath(`/blog/${id}/edit`) ?? index,
  };
}
