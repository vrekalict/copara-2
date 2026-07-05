import { redirect } from "next/navigation";
import { buildStaffPath } from "@/lib/admin/staff-path";

export default function AdminIndexPage() {
  const blogPath = buildStaffPath("/blog");
  if (!blogPath) {
    redirect("/sign-in");
  }
  redirect(blogPath);
}
