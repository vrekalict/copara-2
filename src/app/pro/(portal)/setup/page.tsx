import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { ProPortalShell } from "@/components/pro/pro-portal-shell";

export default async function ProSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/pro");

  const t = await getTranslations("pro");

  return (
    <ProPortalShell
      eyebrow="Partner program"
      title={t("newCase")}
      description={t("newCaseDescription")}
      backHref="/pro/dashboard"
      backLabel={t("back")}
      maxWidth="3xl"
    >
      <ProSetupForm />
    </ProPortalShell>
  );
}
