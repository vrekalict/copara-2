import { ProPortalCard } from "@/components/pro/pro-portal-shell";

export function ProGettingStarted({
  title,
  steps,
}: {
  title: string;
  steps: readonly { title: string; body: string }[];
}) {
  return (
    <ProPortalCard>
      <h2 className="text-lg font-semibold text-[var(--marketing-slate)]">{title}</h2>
      <ol className="mt-6 flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--marketing-teal)]/10 text-sm font-semibold text-[var(--marketing-teal)]">
              {index + 1}
            </span>
            <div>
              <p className="font-medium text-[var(--marketing-slate)]">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </ProPortalCard>
  );
}
