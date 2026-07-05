import type { LucideIcon } from "lucide-react";

export function FeatureCapabilityGrid({
  items,
}: {
  items: { icon: LucideIcon; title: string; body: string }[];
}) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="capability-card">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="size-5" aria-hidden />
          </span>
          <h3 className="mt-4 font-semibold text-slate-heading">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
