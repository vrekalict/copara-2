import { notFound, redirect } from "next/navigation";
import { buildStaffPath } from "@/lib/admin/staff-path";

export default function AdminIndexPage() {
  const blogPath = buildStaffPath("/blog");
  if (!blogPath) {
    notFound();
  }
  redirect(blogPath);
}
