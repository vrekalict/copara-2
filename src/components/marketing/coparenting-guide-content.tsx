import Link from "next/link";
import type { GuideRule } from "@/content/marketing/coparenting-guide.en";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CoparentingGuideContent({
  intro,
  rules,
  closing,
  langSwitch,
  disclaimer = "Copara does not provide legal advice. This guide is general information for parents, not a substitute for counselling, mediation, or legal advice.",
}: {
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
  };
  rules: GuideRule[];
  closing: {
    title: string;
    paragraphs: string[];
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  langSwitch?: { label: string; href: string };
  disclaimer?: string;
}) {
  return (
    <article>
      {langSwitch && (
        <p className="mb-8 text-sm text-muted-foreground">
          <Link href={langSwitch.href} className="text-primary underline-offset-4 hover:underline">
            {langSwitch.label}
          </Link>
        </p>
      )}

      <header className="max-w-3xl">
        <p className="eyebrow">{intro.eyebrow}</p>
        <h1 className="display mt-4 text-slate-heading">{intro.title}</h1>
        <p className="mt-3 text-lg font-medium text-primary">{intro.subtitle}</p>
        <p className="lead mt-5 max-w-2xl">{intro.description}</p>
      </header>

      <ol className="mt-14 space-y-14">
        {rules.map((rule) => (
          <li key={rule.number} id={`rule-${rule.number}`} className="scroll-mt-24">
            <GuideRuleBlock rule={rule} />
          </li>
        ))}
      </ol>

      <section className="mt-16 rounded-2xl border border-[var(--marketing-border)] bg-muted/30 p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-heading">{closing.title}</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">
          {closing.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={closing.primaryHref}
            className={cn(buttonVariants({ size: "lg" }), "min-h-12 px-8")}
          >
            {closing.primaryLabel}
          </Link>
          <Link
            href={closing.secondaryHref}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-h-12 px-8")}
          >
            {closing.secondaryLabel}
          </Link>
        </div>
      </section>

      <p className="mt-10 rounded-lg border border-[var(--marketing-border)] bg-mist px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {disclaimer}
      </p>
    </article>
  );
}

function GuideRuleBlock({ rule }: { rule: GuideRule }) {
  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary md:size-14 md:text-xl"
      >
        {rule.number}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-heading md:text-2xl">{rule.title}</h2>
        {rule.pullQuote && (
          <blockquote className="mt-4 border-l-4 border-primary/40 pl-4 text-base italic leading-relaxed text-foreground/85 md:text-lg">
            {rule.pullQuote}
          </blockquote>
        )}
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
          {rule.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
