import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProSetupForm } from "@/components/pro/pro-setup-form";
import { buttonVariants } from "@/components/ui/button";

export default async function ProSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/pro/setup");

  const t = await getTranslations("pro");

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-12">
      <Link href="/pro" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        ← {t("back")}
      </Link>
      <h1 className="text-2xl font-semibold">{t("newCase")}</h1>
      <ProSetupForm />
    </div>
  );
}
