import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { CopyTextBlock } from "@/components/pro/copy-text-block";
import { ProPortalCard } from "@/components/pro/pro-portal-shell";
import {
  getPartnerMaterials,
  type PartnerMaterialId,
  type PartnerMaterialItem,
} from "@/lib/pro/materials";
import { STRIPE_TRIAL_DAYS } from "@/lib/stripe/config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MATERIAL_LABELS: Record<
  PartnerMaterialId,
  { titleKey: string; descriptionKey: string }
> = {
  "client-handout": {
    titleKey: "items.clientHandout.title",
    descriptionKey: "items.clientHandout.description",
  },
  "referral-handout": {
    titleKey: "items.referralHandout.title",
    descriptionKey: "items.referralHandout.description",
  },
  "partner-one-pager": {
    titleKey: "items.partnerOnePager.title",
    descriptionKey: "items.partnerOnePager.description",
  },
  "brand-guidelines": {
    titleKey: "items.brandGuidelines.title",
    descriptionKey: "items.brandGuidelines.description",
  },
  "logo-pack": {
    titleKey: "items.logoPack.title",
    descriptionKey: "items.logoPack.description",
  },
};

function MaterialRow({
  item,
  title,
  description,
  downloadLabel,
  comingSoonLabel,
  englishFallbackLabel,
}: {
  item: PartnerMaterialItem;
  title: string;
  description: string;
  downloadLabel: string;
  comingSoonLabel: string;
  englishFallbackLabel: string;
}) {
  const Icon = item.kind === "zip" ? Download : FileText;

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-[var(--marketing-border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--marketing-teal)]/10">
          <Icon className="size-5 text-[var(--marketing-teal)]" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--marketing-slate)]">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {englishFallbackLabel ? (
            <p className="mt-1 text-xs text-muted-foreground">{englishFallbackLabel}</p>
          ) : null}
        </div>
      </div>
      {item.available && item.downloadHref ? (
        <Link
          href={item.downloadHref}
          download
          className={cn(buttonVariants({ variant: "outline" }), "min-h-10 shrink-0 gap-2")}
        >
          <Download className="size-4" aria-hidden />
          {downloadLabel}
        </Link>
      ) : (
        <span className="inline-flex min-h-10 shrink-0 items-center rounded-lg border border-dashed border-[var(--marketing-border)] px-4 text-sm text-muted-foreground">
          {comingSoonLabel}
        </span>
      )}
    </li>
  );
}

export async function ProPartnerMaterials({ referralUrl }: { referralUrl: string }) {
  const locale = await getLocale();
  const t = await getTranslations("pro.materials");
  const items = getPartnerMaterials(locale);
  const isFrench = locale.startsWith("fr");

  const emailVars = { referralUrl, trialDays: STRIPE_TRIAL_DAYS };

  return (
    <div className="flex flex-col gap-6">
      <ProPortalCard>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("downloadsIntro")}</p>
        <ul className="mt-5 flex flex-col gap-3">
          {items.map((item) => {
            const labels = MATERIAL_LABELS[item.id];
            return (
              <MaterialRow
                key={item.id}
                item={item}
                title={t(labels.titleKey)}
                description={t(labels.descriptionKey)}
                downloadLabel={t("download")}
                comingSoonLabel={t("comingSoon")}
                englishFallbackLabel={
                  isFrench && item.usedLocale === "en" ? t("englishFallback") : ""
                }
              />
            );
          })}
        </ul>
      </ProPortalCard>

      <div>
        <h3 className="mb-3 text-base font-semibold text-[var(--marketing-slate)]">
          {t("emailTemplatesTitle")}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">{t("emailTemplatesIntro")}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CopyTextBlock
            title={t("emailCaseTitle")}
            description={t("emailCaseDescription")}
            text={t("emailCaseBody", emailVars)}
            copyLabel={t("copy")}
            copiedLabel={t("copied")}
          />
          <CopyTextBlock
            title={t("emailReferralTitle")}
            description={t("emailReferralDescription")}
            text={t("emailReferralBody", emailVars)}
            copyLabel={t("copy")}
            copiedLabel={t("copied")}
          />
        </div>
      </div>
    </div>
  );
}
