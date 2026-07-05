import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { ExpensesShowcaseSection } from "@/components/marketing/expenses-showcase-section";
import { FeatureShowcase, FeatureShowcaseBand } from "@/components/marketing/feature-showcase";
import { PageHero, ProSegmentBanner } from "@/components/marketing/page-hero";
import {
  AlbumsMockup,
  CalendarMockup,
  ExportsMockup,
  JournalMockup,
  MessagesMockup,
  VaultMockup,
} from "@/components/marketing/mockups/app-mockups";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Features for Canadian co-parents",
  description:
    "Copara features: Steady Send messaging, shared custody calendar, expense tracking, journal, albums, Info Vault, tamper-evident exports, and professional dashboard access.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        title="Tools built for the work co-parents actually do"
        description="Copara focuses on communication, coordination, records, and professional access. No social feed, no in-app money movement, no hidden location tracking."
        primaryHref="/sign-up"
        primaryLabel="Start free trial"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Communicate calmly"
          title="Steady Send"
          description="Optional tone review and neutral rewrite suggestions before you send. You stay in control and can always send as-is."
          href="/features/steady-send"
          ctaLabel="Learn about Steady Send"
          visual={<MessagesMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand>
        <FeatureShowcase
          eyebrow="Get organised"
          title="Custody Calendar"
          description="Parenting-time templates, change requests, and exchange check-ins without hidden location tracking."
          href="/features/calendar"
          ctaLabel="Learn about calendar"
          visual={<CalendarMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <ExpensesShowcaseSection />

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Share updates"
          title="Journal"
          description="Share family news, photos, videos, and updates inside your co-parenting circle."
          href="/features/journal"
          ctaLabel="Learn about journal"
          visual={<JournalMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand variant="mist">
        <FeatureShowcase
          eyebrow="Share memories"
          title="Albums"
          description="Private full-resolution photo albums for your circle, not a public feed."
          href="/features/albums"
          ctaLabel="Learn about albums"
          visual={<AlbumsMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Share information"
          title="Info Vault"
          description="Medical, school, and emergency information per child with sharing controls."
          href="/features/vault"
          ctaLabel="Learn about vault"
          visual={<VaultMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand>
        <FeatureShowcase
          eyebrow="Keep proof"
          title="Tamper-Evident Records"
          description="PDF exports with hash-chain verification for professional review. Not certified or court-approved."
          href="/features/records"
          ctaLabel="Learn about records"
          visual={<ExportsMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <ProSegmentBanner />

      <Section variant="mist" className="pb-20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Read practical guides on calm communication, schedules, expenses, and records.
          </p>
          <Link href="/blog" className="mt-4 inline-block font-medium text-primary hover:underline">
            Visit the blog
          </Link>
        </div>
      </Section>

      <CtaBand title="Start free trial" dark={false} className="pb-20" />
    </>
  );
}
