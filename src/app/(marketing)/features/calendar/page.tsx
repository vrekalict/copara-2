import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { CalendarMockup } from "@/components/marketing/mockups/app-mockups";
import { Section, SectionHeader } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { SITE } from "@/lib/marketing/site";

export const metadata = pageMetadata({
  title: "Shared custody calendar and exchange tracking",
  description:
    "Copara shared calendar for parenting-time schedules, change requests, and exchange check-ins with location verification that never shares raw GPS between parents.",
  path: "/features/calendar",
});

export default function CalendarFeaturePage() {
  return (
    <>
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Calendar"
          title="One schedule both parents can see"
          description={`Stop negotiating pickup times only in message threads. ${SITE.name} keeps parenting-time blocks, appointments, and change requests in a shared calendar with a clear approval trail.`}
          visual={<CalendarMockup variant="desktop" />}
        />
      </Section>
      <Section variant="cream">
        <SectionHeader title="Calendar capabilities" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: "Parenting-time templates",
              body: "Week-on/week-off, 2-2-3, alternating weekends, or custom patterns. Generate blocks ahead so both parents start from the same baseline.",
            },
            {
              title: "Change requests",
              body: "Propose a swap or time adjustment. The other parent approves or declines. Every decision stays in the record.",
            },
            {
              title: "Exchange check-ins",
              body: "Tap check-in at handoff. Copara verifies arrival without sharing raw GPS coordinates with your co-parent.",
            },
            {
              title: "Violation flags",
              body: "Late or missed exchanges compared to the plan can appear in your weekly digest. Rules-based flags, not punitive UI.",
            },
          ].map((item) => (
            <article key={item.title} className="routine-panel">
              <h2 className="text-lg font-semibold text-slate-heading">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="pb-20">
        <CtaBand title="Coordinate schedules in early access" />
      </Section>
    </>
  );
}
