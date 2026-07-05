import Link from "next/link";
import { buildStaffPath, getStaffBasePath } from "@/lib/admin/staff-path";
import { cn } from "@/lib/utils";

export type StaffBlogPaths = {
  index: string;
  new: string;
};

export function getStaffBlogPaths(): StaffBlogPaths {
  return {
    index: buildStaffPath("/blog") ?? "/",
    new: buildStaffPath("/blog/new") ?? "/",
  };
}

export function staffBlogEditPath(paths: StaffBlogPaths, id: string) {
  return `${paths.index}/${id}/edit`;
}

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
