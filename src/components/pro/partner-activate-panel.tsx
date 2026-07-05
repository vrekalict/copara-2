"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutTo } from "@/actions/auth";
import { activatePartnerAccount } from "@/actions/pro/partner";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PartnerActivatePanel({
  token,
  email,
  firstName,
  mode,
}: {
  token: string;
  email: string;
  firstName: string;
  mode: "activate" | "sign-in" | "wrong-account";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = `/pro/activate?token=${encodeURIComponent(token)}`;
  const signUpNext = `/pro/activate/sign-up?token=${encodeURIComponent(token)}`;
  const signInNext = `/pro/activate?token=${encodeURIComponent(token)}&sign-in=1`;

  if (mode === "wrong-account") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          You are signed in with a different email than <strong>{email}</strong>. Sign out, then
          create or sign in with the email from your approved application.
        </p>
        <form action={signOutTo}>
          <input type="hidden" name="next" value={signUpNext} />
          <Button type="submit" className="min-h-11 w-full">
            Sign out and create partner account
          </Button>
        </form>
        <form action={signOutTo}>
          <input type="hidden" name="next" value={signInNext} />
          <Button type="submit" variant="outline" className="min-h-11 w-full">
            Sign out and sign in with {email}
          </Button>
        </form>
      </div>
    );
  }

  if (mode === "activate") {
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
        Hi {firstName}. Sign in with <strong>{email}</strong> — the email on your approved
        application.
      </p>
      <SignInForm next={next} defaultEmail={email} hideSignUpLink />
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
