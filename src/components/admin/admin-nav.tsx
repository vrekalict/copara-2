import Link from "next/link";
import { FileText, Users } from "lucide-react";
import { buildStaffPath, getStaffBasePath } from "@/lib/admin/staff-path";
import { cn } from "@/lib/utils";

const LINKS = [
  {
    href: "/blog",
    label: "Blog",
    key: "blog" as const,
    description: "Publish articles for copara.ca/blog",
    icon: FileText,
  },
  {
    href: "/partners",
    label: "Partners",
    key: "partners" as const,
    description: "Review applications and track referral payouts",
    icon: Users,
  },
];

export function AdminNav({ active }: { active: "blog" | "partners" }) {
  const base = getStaffBasePath();
  if (!base) return null;

  return (
    <nav className="mb-8 grid gap-2 sm:grid-cols-2" aria-label="Staff sections">
      {LINKS.map((link) => {
        const href = buildStaffPath(link.href)!;
        const Icon = link.icon;
        const isActive = active === link.key;

        return (
          <Link
            key={link.href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col rounded-xl border p-4 transition-colors",
              isActive
                ? "border-[var(--marketing-teal)] bg-[var(--marketing-teal)]/5 shadow-sm"
                : "border-[var(--marketing-border)] bg-white hover:border-[var(--marketing-teal)]/40",
            )}
          >
            <Icon
              className={cn(
                "size-4",
                isActive ? "text-[var(--marketing-teal)]" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span className="mt-2 text-sm font-semibold text-[var(--marketing-slate)]">{link.label}</span>
            <span className="mt-0.5 text-xs leading-snug text-muted-foreground">{link.description}</span>
          </Link>
        );
      })}
    </nav>
  );
}
