import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/pro/partner";
import { getStaffBasePath, staffPath } from "@/lib/admin/staff-path";

export async function requireAdmin(nextSuffix = "/blog") {
  if (!getStaffBasePath()) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextPath = staffPath(nextSuffix);

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  if (!isAdminEmail(user.email)) {
    return { ok: false as const, user };
  }

  return { ok: true as const, user };
}
