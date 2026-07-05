import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { LegalDisclaimer } from "@/components/marketing/page-hero";
import { PageHero } from "@/components/marketing/page-hero";
import { MessagesMockup } from "@/components/marketing/mockups/app-mockups";
import { Section, SectionHeader } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { SITE } from "@/lib/marketing/site";

export const metadata = pageMetadata({
  title: "Steady Send neutral rewrite suggestions",
  description:
    "Copara Steady Send offers optional tone review and neutral rewrite suggestions before you send co-parenting messages. You stay in control and can always send as-is.",
  path: "/features/steady-send",
});

export default function SteadySendPage() {
  return (
    <>
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Steady Send"
          title="Pause before you send something you might regret"
          description={`When a draft might escalate tension, ${SITE.name} offers optional rewrite suggestions that preserve what you need to say. You choose whether to use a suggestion, edit it, or send your original message.`}
          visual={<MessagesMockup variant="desktop" />}
        />
      </Section>
      <Section variant="cream">
        <SectionHeader title="How Steady Send works" align="left" />
        <ol className="max-w-3xl space-y-6">
          {[
            "Type your message in the composer as you normally would.",
            "After a brief pause, Steady Send analyzes tone and flags phrases that may escalate conflict.",
            "You receive one to three full rewrite suggestions, not just tone labels.",
            "Tap a suggestion to replace your draft, or send as-is. Steady Send never blocks sending.",
          ].map((step, i) => (
            <li key={i} className="flex gap-4 text-muted-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-1 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Section>
      <Section>
        <SectionHeader
          title="What Steady Send is not"
          description="Clear boundaries keep the tool trustworthy for both parents and professionals."
        />
        <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {[
            "Not legal advice. Consult your lawyer for legal questions.",
            "Not side-taking. Rewrites aim for neutrality, not advocacy.",
            "Not automatic. Nothing sends without your explicit action.",
            "Not a substitute for thoughtful co-parenting when you have time to reflect.",
          ].map((item) => (
            <li
              key={item}
              className="routine-panel text-sm text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-8 max-w-3xl">
          <LegalDisclaimer />
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/blog/calm-messaging-during-high-conflict-weeks" className="font-medium text-primary hover:underline">
            Read: calm messaging during high-conflict weeks
          </Link>
        </p>
      </Section>
      <Section variant="mist" className="pb-20">
        <CtaBand title="Try Steady Send in early access" />
      </Section>
    </>
  );
}
