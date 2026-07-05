import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureCapabilityGrid } from "@/components/marketing/feature-capability-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { AlbumsMockup } from "@/components/marketing/mockups/app-mockups";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { SITE } from "@/lib/marketing/site";
import { Download, Images, Lock, ShieldCheck } from "lucide-react";

export const metadata = pageMetadata({
  title: "Private photo albums for co-parents",
  description:
    "Copara Albums let co-parents share and download full-resolution photos in a closed, secure circle. Private family galleries, not public feeds.",
  path: "/features/albums",
});

const CAPABILITIES = [
  {
    icon: Images,
    title: "Albums per circle",
    body: "Create albums for soccer season, birthdays, or school events without posting publicly.",
  },
  {
    icon: Download,
    title: "Full resolution",
    body: "Download originals when you need them for printing, sharing with grandparents, or your own records.",
  },
  {
    icon: Lock,
    title: "Private gallery",
    body: "Photos are visible only to active members of your co-parenting circle.",
  },
  {
    icon: ShieldCheck,
    title: "Same trust model",
    body: "Albums use the same secure storage and access rules as the rest of Copara.",
  },
];

export default function AlbumsFeaturePage() {
  return (
    <>
      <Section className="pt-12 md:pt-16">
        <PageHero
          eyebrow="Albums"
          title="Private photo albums for your circle"
          description="Albums let you share and download photos at full resolution in a closed, secure environment. Keep school events, milestones, and everyday memories where both parents can see them."
          visual={<AlbumsMockup variant="desktop" />}
        />
      </Section>
      <Section variant="cream">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            {SITE.name} Albums are designed for co-parenting, not broadcasting. Photos stay
            inside your circle with the same privacy expectations as the rest of the product.
          </p>
        </div>
        <div className="mt-10">
          <FeatureCapabilityGrid items={CAPABILITIES} />
        </div>
      </Section>
      <Section className="pb-20">
        <CtaBand title="Try albums in early access" primaryLabel="Get started" />
      </Section>
    </>
  );
}
