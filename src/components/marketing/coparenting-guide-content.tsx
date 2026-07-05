import Link from "next/link";
import {
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutList,
  MessageSquare,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { LegalDisclaimer, PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import type {
  GuideHighlight,
  GuideMistake,
  GuideSection,
} from "@/content/marketing/coparenting-guide.en";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "scattered-info": LayoutList,
  "shared-calendar": CalendarDays,
  "messages-as-records": MessageSquare,
  "expense-paper-trail": Receipt,
  "documents-vault": FolderOpen,
  "exports-professionals": FileText,
};

export function CoparentingGuidePageContent({
  intro,
  highlights,
  quickWins,
  sections,
  mistakes,
  closing,
  langSwitch,
  quickWinsTitle,
  mistakesTitle,
  tocTitle,
  checklistTitle,
  disclaimer,
}: {
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  highlights: GuideHighlight[];
  quickWins: string[];
  sections: GuideSection[];
  mistakes: GuideMistake[];
  closing: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  langSwitch?: { label: string; href: string };
  quickWinsTitle: string;
  mistakesTitle: string;
  tocTitle: string;
  checklistTitle: string;
  disclaimer?: string;
}) {
  return (
    <>
      <Section className="pt-12 md:pt-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {langSwitch && (
            <Link href={langSwitch.href} className="text-sm font-medium text-primary hover:underline">
              {langSwitch.label}
            </Link>
          )}
        </div>
        <PageHero
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={`${intro.subtitle}. ${intro.description}`}
          primaryHref={intro.primaryHref}
          primaryLabel={intro.primaryLabel}
          secondaryHref={intro.secondaryHref}
          secondaryLabel={intro.secondaryLabel}
          variant="dark"
        />
      </Section>

      <Section variant="cream" className="py-14 md:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold tracking-tight text-[var(--marketing-teal)]">{item.value}</p>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--marketing-border)] bg-white p-6 md:p-8">
          <h2 className="text-lg font-semibold text-slate-heading">{quickWinsTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickWins.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--marketing-teal)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="py-14 md:py-20">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="mb-10 lg:mb-0">
            <nav
              className="lg:sticky lg:top-24 rounded-2xl border border-[var(--marketing-border)] bg-mist p-5"
              aria-label={tocTitle}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--marketing-teal)]">
                {tocTitle}
              </p>
              <ol className="mt-4 space-y-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-sm leading-snug text-muted-foreground transition-colors hover:text-[var(--marketing-slate)]"
                    >
                      <span className="mr-2 font-medium text-[var(--marketing-teal)]">{index + 1}.</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="space-y-8">
            {sections.map((section) => (
              <GuideSectionCard key={section.id} section={section} checklistTitle={checklistTitle} />
            ))}
          </div>
        </div>
      </Section>

      <Section variant="cream" className="py-14 md:py-20">
        <SectionHeader title={mistakesTitle} align="left" />
        <div className="grid gap-5 sm:grid-cols-2">
          {mistakes.map((mistake) => (
            <article key={mistake.title} className="routine-panel h-full">
              <h3 className="text-lg font-semibold text-slate-heading">{mistake.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mistake.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <CtaBand
          title={closing.title}
          description={closing.description}
          primaryHref={closing.primaryHref}
          primaryLabel={closing.primaryLabel}
          secondaryHref={closing.secondaryHref}
          secondaryLabel={closing.secondaryLabel}
        />
        <div className="mt-8">
          <LegalDisclaimer>{disclaimer}</LegalDisclaimer>
        </div>
      </Section>
    </>
  );
}

function GuideSectionCard({
  section,
  checklistTitle,
}: {
  section: GuideSection;
  checklistTitle: string;
}) {
  const Icon = SECTION_ICONS[section.id] ?? LayoutList;

  return (
    <section id={section.id} className="scroll-mt-28 routine-panel">
      <div className="flex items-start gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--marketing-teal)]/10 text-[var(--marketing-teal)]"
          aria-hidden
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-slate-heading md:text-2xl">{section.title}</h2>
          <p className="mt-2 text-base font-medium leading-relaxed text-foreground/80">{section.summary}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px]">
        {section.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-cream)] p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--marketing-slate)]">
          {checklistTitle}
        </h3>
        <ul className="mt-3 space-y-2.5">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--marketing-teal)]" aria-hidden />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {section.tip && (
        <blockquote className="mt-5 border-l-4 border-[var(--marketing-teal)] bg-[var(--marketing-mist)]/50 py-3 pl-4 pr-3 text-sm italic leading-relaxed text-foreground/85">
          {section.tip}
        </blockquote>
      )}

      {section.relatedLink && (
        <Link
          href={section.relatedLink.href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}
        >
          {section.relatedLink.label} →
        </Link>
      )}
    </section>
  );
}
