import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { getPartnerActivation } from "@/actions/pro/partner";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { PartnerSignUpForm } from "@/components/pro/partner-sign-up-form";

export default async function ProActivateSignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const activation = token ? await getPartnerActivation(token) : null;

  if (!activation || ("expired" in activation && activation.expired)) {
    redirect("/pro/activate?token=" + encodeURIComponent(token));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/pro/activate?token=${encodeURIComponent(token)}`);
  }

  const { data: application } = await createServiceClient()
    .from("professional_partner_applications")
    .select("location")
    .eq("id", activation.applicationId)
    .maybeSingle();

  return (
    <AuthShell
      variant="partner"
      eyebrow="Partner access"
      title="Create your partner account"
      description={`Set a password for ${activation.email}. You do not need an existing Copara account — this email must match your approved application.`}
    >
      <PartnerSignUpForm
        token={token}
        email={activation.email}
        province={(application?.location as string | undefined) ?? undefined}
      />
    </AuthShell>
  );
}
