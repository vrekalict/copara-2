"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { activatePartnerAccount } from "@/actions/pro/partner";
import { SignInForm } from "@/components/auth/sign-in-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PartnerActivatePanel({
  token,
  email,
  firstName,
  isSignedIn,
  emailMatches,
}: {
  token: string;
  email: string;
  firstName: string;
  isSignedIn: boolean;
  emailMatches: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (isSignedIn && emailMatches) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Signed in as <strong>{email}</strong>. Activate your approved partner dashboard.
        </p>
        <button
          type="button"
          className={cn(buttonVariants(), "min-h-11")}
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await activatePartnerAccount(token);
              if (result?.error) {
                alert(result.error);
                return;
              }
              router.refresh();
            });
          }}
        >
          {pending ? "Activating…" : "Activate partner dashboard"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Hi {firstName}. Sign in with <strong>{email}</strong> to activate your partner account.
      </p>
      <SignInForm next={`/pro/activate?token=${encodeURIComponent(token)}`} />
      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href={`/pro/activate/sign-up?token=${encodeURIComponent(token)}`}
          className="font-medium text-foreground underline"
        >
          Create your partner account
        </Link>
      </p>
    </div>
  );
}
