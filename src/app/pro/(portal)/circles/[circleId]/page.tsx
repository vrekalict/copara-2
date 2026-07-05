import Link from "next/link";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ExportWizard } from "@/components/exports/export-wizard";
import { ProCaseBillingNote } from "@/components/pro/pro-partner-guide";
import { ProPortalCard, ProPortalShell } from "@/components/pro/pro-portal-shell";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://copara.ca";
  const fullCaseLink = `${origin.replace(/\/$/, "")}${caseLink}`;
  const clientHandoutHref = `/pro/materials/client-handout?circleId=${encodeURIComponent(circleId)}`;

  return (
    <ProPortalShell
      eyebrow="Client case"
      title={circle?.name ?? t("case")}
      description={t("casePageDescription")}
      backHref="/pro/dashboard"
      backLabel={t("back")}
      maxWidth="6xl"
    >
      <div className="flex flex-col gap-6">
        <ProCaseBillingNote
          title={t("caseBillingTitle")}
          body={t("caseBillingBody", { trialDays: STRIPE_TRIAL_DAYS })}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <ProPortalCard>
            <p className="font-semibold text-[var(--marketing-slate)]">{t("dualInviteLink")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("dualInviteHint")}</p>
            <code className="mt-4 block break-all rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/50 p-3 text-xs">
              {fullCaseLink}
            </code>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href={fullCaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "min-h-10 inline-flex")}
              >
                {t("openInviteLink")}
              </Link>
              <Link
                href={clientHandoutHref}
                download
                className={cn(buttonVariants({ variant: "outline" }), "min-h-10 inline-flex gap-2")}
              >
                <Download className="size-4" aria-hidden />
                {t("downloadClientHandout")}
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("clientHandoutHint")}</p>
          </ProPortalCard>

          <ProPortalCard>
            <p className="font-semibold text-[var(--marketing-slate)]">{t("members")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("memberStatusHint")}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {(members ?? []).map((m) => {
                const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
                const label =
                  profile?.display_name ?? m.invited_email ?? m.role;
                return (
                  <li
                    key={`${m.role}-${m.invited_email ?? profile?.display_name}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/30 px-3 py-2"
                  >
                    <span className="font-medium text-[var(--marketing-slate)]">{label}</span>
                    <span className="text-xs capitalize text-muted-foreground">
                      {m.role} · {m.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </ProPortalCard>
        </div>

        <ProPortalCard className="p-0 sm:p-0">
          <ExportWizard
            circleId={circleId}
            threads={(threads ?? []).map((th) => ({
              id: th.id as string,
              title: th.title as string | null,
            }))}
            locale={locale}
            initialHistory={(exports ?? []) as Parameters<typeof ExportWizard>[0]["initialHistory"]}
          />
        </ProPortalCard>
      </div>
    </ProPortalShell>
  );
}
