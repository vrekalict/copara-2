import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureCapabilityGrid } from "@/components/marketing/feature-capability-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { JournalMockup } from "@/components/marketing/mockups/app-mockups";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { SITE } from "@/lib/marketing/site";
import { BookOpen, Camera, Lock, Users } from "lucide-react";

export const metadata = pageMetadata({
  title: "Circle journal for co-parent updates",
  description:
    "Copara Journal lets separated parents share family news, photos, videos, and updates inside a private co-parenting circle.",
  path: "/features/journal",
});

const CAPABILITIES = [
  {
    icon: BookOpen,
    title: "Family updates",
    body: "Share school news, funny quotes, and everyday moments in a feed both parents can read.",
  },
  {
    icon: Camera,
    title: "Photos and video",
    body: "Attach images or short clips to an entry so the other parent sees context, not just text.",
  },
  {
    icon: Lock,
    title: "Circle-only",
    body: "Journal entries stay inside your co-parenting circle. No public feed, no broadcasting.",
  },
  {
    icon: Users,
    title: "Per-child context",
    body: "Optionally link an entry to a child so updates stay organized as your family grows.",
  },
];

export default function JournalFeaturePage() {
  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Stay connected to everyday family moments"
        description="The journal is your circle's shared space for family updates. Share news, photos, videos, and those funny quotes from your children. Both parents stay in the loop, even when you are in different homes."
        visual={<JournalMockup variant="desktop" />}
      />
      <Section variant="cream">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Unlike a public social feed, {SITE.name} Journal is scoped to your co-parenting
            circle. Entries stay with the same record as your messages, calendar, and
            expenses.
          </p>
        </div>
        <div className="mt-10">
          <FeatureCapabilityGrid items={CAPABILITIES} />
        </div>
      </Section>
      <CtaBand className="pb-20" title="Try the journal with a free trial" primaryLabel="Get started" />
    </>
  );
}
