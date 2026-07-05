import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { ProCaseBillingNote } from "@/components/pro/pro-partner-guide";
import { ProPortalShell } from "@/components/pro/pro-portal-shell";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";

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
      <div className="flex flex-col gap-6">
        <ProCaseBillingNote
          title={t("setupBillingTitle")}
          body={t("setupBillingBody", { trialDays: STRIPE_TRIAL_DAYS })}
        />
        <ProSetupForm />
      </div>
    </ProPortalShell>
  );
}
