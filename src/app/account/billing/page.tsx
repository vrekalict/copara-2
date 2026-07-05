import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAppAccess } from "@/lib/stripe/access";
import { BillingPanel } from "@/components/billing/billing-panel";

export default async function AccountBillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account/billing");
  }

  const access = await getAppAccess(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <h1 className="text-xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your subscription, payment method, and invoices.
      </p>
      <div className="mt-6">
        <BillingPanel access={access} />
      </div>
    </main>
  );
}
