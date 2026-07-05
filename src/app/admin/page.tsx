import { redirect } from "next/navigation";
import { staffPath } from "@/lib/admin/staff-path";

export default function AdminIndexPage() {
  redirect(staffPath("/blog"));
}
