import { notFound } from "next/navigation";
import { getStaffBasePath } from "@/lib/admin/staff-path";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!getStaffBasePath()) {
    notFound();
  }

  return <div className="min-h-svh bg-background text-foreground">{children}</div>;
}
