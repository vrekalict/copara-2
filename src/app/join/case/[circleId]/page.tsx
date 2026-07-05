import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { acceptCaseInvite, getCasePreview } from "@/actions/case-invite";
import { AcceptCaseInviteButton } from "@/components/pro/accept-case-invite-button";
import { buttonVariants } from "@/components/ui/button";

export default async function JoinCasePage({
  params,
}: {
  params: Promise<{ circleId: string }>;
}) {
  const { circleId } = await params;
  const preview = await getCasePreview(circleId);
  const t = await getTranslations("pro");

  if (!preview) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12 text-center">
        <p>{t("invalidCase")}</p>
        <Link href="/" className={buttonVariants({ className: "mt-4" })}>
          {t("goHome")}
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pendingInvites = preview.invites.filter((i) => i.status === "invited");

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">
        {t("caseInviteTitle", { caseName: preview.circleName })}
      </h1>
      <p className="text-muted-foreground">{t("caseInviteSubtitle")}</p>

      {pendingInvites.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("allAccepted")}</p>
      ) : user ? (
        <AcceptCaseInviteButton circleId={circleId} />
      ) : (
        <Link
          href={`/sign-up?next=${encodeURIComponent(`/join/case/${circleId}`)}`}
          className={buttonVariants()}
        >
          {t("signUpToAccept")}
        </Link>
      )}
    </div>
  );
}
