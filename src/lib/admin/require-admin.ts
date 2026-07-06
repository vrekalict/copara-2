import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/pro/partner";
import { getStaffBasePath } from "@/lib/admin/staff-path";

export async function requireAdmin() {
  if (!getStaffBasePath()) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    notFound();
  }

  return { user };
}
