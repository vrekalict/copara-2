import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStaffBasePath } from "@/lib/admin/staff-path";
import { marketingFont } from "@/lib/fonts/marketing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!getStaffBasePath()) {
    notFound();
  }

  return (
    <div
      className={cn(
        "admin-shell min-h-svh bg-[var(--marketing-cream)] text-foreground",
        marketingFont.variable,
      )}
    >
      {children}
    </div>
  );
}
