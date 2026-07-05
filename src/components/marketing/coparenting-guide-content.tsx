import Link from "next/link";
import type { GuideSection } from "@/content/marketing/coparenting-guide.en";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CoparentingGuideContent({
  intro,
  sections,
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
  sections: GuideSection[];
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

      <div className="mt-14 space-y-12">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-t border-[var(--marketing-border)] pt-10 first:border-t-0 first:pt-0"
          >
            <h2 className="text-xl font-semibold text-slate-heading md:text-2xl">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-[var(--marketing-border)] bg-muted/30 p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-slate-heading">{closing.title}</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">
          {closing.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
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
