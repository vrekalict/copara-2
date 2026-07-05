import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requirePaidAccess } from "@/lib/stripe/guard";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/onboarding/circle");
  }

  const paid = await requirePaidAccess(supabase, user.id);
  if (!paid.ok) {
    redirect(paid.redirectTo);
  }

  return children;
}
