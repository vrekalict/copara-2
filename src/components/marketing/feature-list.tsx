import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function FeatureList({
  items,
}: {
  items: {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
  }[];
}) {
  return (
    <div className="feature-list">
      {items.map((item, index) => (
        <Link
          key={item.title}
          href={item.href}
          className="feature-list__row group"
        >
          <span className="feature-list__index">{String(index + 1).padStart(2, "0")}</span>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--marketing-border)] bg-cream text-primary">
            <item.icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-heading">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
          <ArrowRight
            className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </Link>
      ))}
    </div>
  );
}
