import Link from "next/link";
import { staffPath } from "@/lib/admin/staff-path";
import { cn } from "@/lib/utils";

export function AdminNav({ active }: { active: "blog" | "partners" }) {
  const links = [
    { href: staffPath("/blog"), label: "Blog", key: "blog" as const },
    { href: staffPath("/partners"), label: "Partners", key: "partners" as const },
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
  return {
    index: staffPath("/blog"),
    new: staffPath("/blog/new"),
    edit: (id: string) => staffPath(`/blog/${id}/edit`),
  };
}
