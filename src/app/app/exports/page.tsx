import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveCircleForUser } from "@/lib/circle";
import { ExportWizard } from "@/components/exports/export-wizard";

export default async function ExportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const circle = await getActiveCircleForUser(user.id);
  if (!circle) redirect("/onboarding/circle");

  const locale = await getLocale();

  const { data: threads } = await supabase
    .from("threads")
    .select("id, title")
    .eq("circle_id", circle.circleId)
    .order("created_at", { ascending: false });

  const { data: exports } = await supabase
    .from("exports")
    .select("id, kind, chain_digest, created_at")
    .eq("circle_id", circle.circleId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <ExportWizard
      circleId={circle.circleId}
      threads={(threads ?? []).map((t) => ({
        id: t.id as string,
        title: t.title as string | null,
      }))}
      locale={locale}
      initialHistory={(exports ?? []) as Parameters<typeof ExportWizard>[0]["initialHistory"]}
    />
  );
}
