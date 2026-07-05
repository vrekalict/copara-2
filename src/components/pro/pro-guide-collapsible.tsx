"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProGuideCollapsible({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[var(--marketing-border)] bg-white shadow-[0_16px_48px_-28px_oklch(0.24_0.03_252_/_0.35)]"
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="text-lg font-semibold text-[var(--marketing-slate)]">{title}</span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-[var(--marketing-border)] px-6 pb-6 pt-2">{children}</div>
    </details>
  );
}
