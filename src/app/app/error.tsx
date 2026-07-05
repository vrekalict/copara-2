"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
      <h1 className="text-lg font-semibold">{t("title")}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t("description")}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>{t("retry")}</Button>
        <Link href="/app/messages" className={buttonVariants({ variant: "outline" })}>
          {t("goHome")}
        </Link>
      </div>
    </main>
  );
}
