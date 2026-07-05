import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ExportWizard } from "@/components/exports/export-wizard";
import { Card } from "@/components/ui/card";

export default async function ProCirclePage({
  params,
}: {
  params: Promise<{ circleId: string }>;
}) {
  const { circleId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/pro");

  const { data: membership } = await supabase
    .from("circle_members")
    .select("id")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .eq("role", "professional")
    .eq("status", "active")
    .maybeSingle();

  if (!membership) redirect("/pro/dashboard");

  const t = await getTranslations("pro");
  const locale = await getLocale();

  const { data: circle } = await supabase
    .from("circles")
    .select("name")
    .eq("id", circleId)
    .single();

  const { data: threads } = await supabase
    .from("threads")
    .select("id, title")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false });

  const { data: members } = await supabase
    .from("circle_members")
    .select("role, status, invited_email, profiles(display_name)")
    .eq("circle_id", circleId);

  const { data: exports } = await supabase
    .from("exports")
    .select("id, kind, chain_digest, created_at")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false })
    .limit(20);

  const caseLink = `/join/case/${circleId}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <Link href="/pro/dashboard" className="text-sm text-muted-foreground">
            ← {t("back")}
          </Link>
          <h1 className="text-lg font-semibold">{circle?.name ?? t("case")}</h1>
        </div>
      </div>

      <div className="px-4">
        <Card className="mb-4 p-4 text-sm">
          <p className="mb-1 font-medium">{t("dualInviteLink")}</p>
          <p className="mb-2 text-muted-foreground">{t("dualInviteHint")}</p>
          <code className="block break-all rounded bg-muted p-2 text-xs">{caseLink}</code>
        </Card>

        <Card className="mb-4 p-4 text-sm">
          <p className="mb-2 font-medium">{t("members")}</p>
          {(members ?? []).map((m) => {
            const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
            return (
              <p key={m.invited_email ?? profile?.display_name} className="text-muted-foreground">
                {m.role} · {m.status}
                {profile?.display_name ? ` · ${profile.display_name}` : ""}
                {m.invited_email ? ` · ${m.invited_email}` : ""}
              </p>
            );
          })}
        </Card>
      </div>

      <ExportWizard
        circleId={circleId}
        threads={(threads ?? []).map((th) => ({
          id: th.id as string,
          title: th.title as string | null,
        }))}
        locale={locale}
        initialHistory={(exports ?? []) as Parameters<typeof ExportWizard>[0]["initialHistory"]}
      />
    </div>
  );
}
