import Link from "next/link";
import { redirect } from "next/navigation";
import { getPartnerActivation } from "@/actions/pro/partner";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { PartnerSignUpForm } from "@/components/pro/partner-sign-up-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create partner account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Use the email address from your approved application: {activation.email}
          </p>
        </CardHeader>
        <CardContent>
          <PartnerSignUpForm
            token={token}
            email={activation.email}
            province={(application?.location as string | undefined) ?? undefined}
          />
        </CardContent>
      </Card>
    </main>
  );
}
