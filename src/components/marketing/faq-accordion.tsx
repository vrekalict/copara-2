"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/marketing/schema";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className="divide-y divide-[var(--marketing-border)] rounded-xl border border-[var(--marketing-border)] bg-background">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <dt>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-slate-heading hover:bg-muted/40"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </dt>
            {open && (
              <dd className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
