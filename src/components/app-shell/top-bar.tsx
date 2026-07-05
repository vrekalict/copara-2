"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CoparaMark } from "@/components/marketing/copara-logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";

export function TopBar({ displayName }: { displayName: string }) {
  const t = useTranslations("common");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Link href="/app" className="inline-flex items-center" aria-label="Copara home">
        <CoparaMark variant="dark" priority />
      </Link>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
