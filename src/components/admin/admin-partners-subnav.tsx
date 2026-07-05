import Link from "next/link";
import { buildStaffPath } from "@/lib/admin/staff-path";
import { cn } from "@/lib/utils";

export function AdminPartnersSubnav({
  active,
}: {
  active: "applications" | "payouts";
}) {
  const base = buildStaffPath("/partners");
  if (!base) return null;

  const links = [
    { key: "applications" as const, href: base, label: "Applications" },
    { key: "payouts" as const, href: `${base}/payouts`, label: "Referral payouts" },
  ];

  return (
    <nav
      className="mb-6 flex flex-wrap gap-2 border-b border-[var(--marketing-border)] pb-4"
      aria-label="Partner admin sections"
    >
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          aria-current={active === link.key ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active === link.key
              ? "bg-[var(--marketing-navy)] text-white"
              : "text-muted-foreground hover:bg-[var(--marketing-mist)]/60 hover:text-[var(--marketing-slate)]",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
