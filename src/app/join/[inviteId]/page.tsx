import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getInvitePreview } from "@/actions/invites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { AcceptInviteButton } from "@/components/onboarding/accept-invite-button";

export default async function JoinInvitePage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = await params;
  const t = await getTranslations("join");

  const invite = await getInvitePreview(inviteId);

  if (!invite || invite.status !== "invited") {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("invalid")}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("title", { circleName: invite.circleName })}</CardTitle>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>
        <CardContent>
          {user ? (
            <AcceptInviteButton inviteId={inviteId} />
          ) : (
            <Link
              href={`/sign-up?next=${encodeURIComponent(`/join/${inviteId}`)}`}
              className={buttonVariants({ className: "w-full" })}
            >
              {t("signUpFirst")}
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
