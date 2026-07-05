import Link from "next/link";
import { AudiencePaths } from "@/components/marketing/audience-paths";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ExpensesShowcaseSection } from "@/components/marketing/expenses-showcase-section";
import { FeatureShowcase, FeatureShowcaseBand } from "@/components/marketing/feature-showcase";
import { JsonLd } from "@/components/marketing/json-ld";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import {
  AlbumsMockup,
  CalendarMockup,
  ExportsMockup,
  JournalMockup,
  MessagesMockup,
  VaultMockup,
} from "@/components/marketing/mockups/app-mockups";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { ProSegmentBanner } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { BlogPostsScroll } from "@/components/blog/blog-posts-scroll";
import { HOME_FAQ } from "@/content/marketing/faq";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/marketing/metadata";
import {
  faqSchema,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/marketing/schema";
import { SITE } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = pageMetadata({
  title: "Co-parenting records for separated Canadian families",
  description: SITE.description,
  path: "/",
  languageAlternates: { en: "/", fr: "/fr" },
});

export default async function HomePage() {
  const blogPosts = await getAllPosts();

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          softwareApplicationSchema(),
          faqSchema(HOME_FAQ),
        ]}
      />

      <MarketingHero />

      <Section className="py-14 md:py-20">
        <SectionHeader
          eyebrow="Who it is for"
          title="Parents and professionals on the same organized record"
          description="Choose the path that fits your role. Both sides see the same shared facts when they need to."
          align="left"
        />
        <AudiencePaths />
      </Section>

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Communicate calmly"
          title="Neutral messaging with optional Steady Send"
          description="When a pickup thread starts to escalate, Steady Send can suggest a calmer rewrite before you send. You stay in control and can always send your original message. Every message is append-only with server timestamps."
          href="/features/steady-send"
          ctaLabel="See messaging"
          visual={<MessagesMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand>
        <FeatureShowcase
          eyebrow="Get organised"
          title="Co-parent calendar"
          description="A shared schedule for parenting time, exchanges, and change requests. Apply schedule templates, approve or decline swaps, and check in at exchanges without sharing raw GPS between parents."
          href="/features/calendar"
          ctaLabel="See calendar"
          visual={<CalendarMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand variant="mist">
        <FeatureShowcase
          eyebrow="Share updates"
          title="Journal"
          description="The journal is your circle's shared space for family updates. Share news, photos, videos, and those funny quotes from your children. Both parents stay connected to everyday moments, with everything kept inside your co-parenting circle."
          href="/features/journal"
          ctaLabel="See journal"
          visual={<JournalMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Share memories"
          title="Albums"
          description="Albums let you share and download photos at full resolution in a closed, secure environment. A private gallery for your circle, not a public feed."
          href="/features/albums"
          ctaLabel="See albums"
          visual={<AlbumsMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <ExpensesShowcaseSection />

      <FeatureShowcaseBand variant="warm">
        <FeatureShowcase
          eyebrow="Share information"
          title="Child info vault"
          description="Store medical notes, school details, emergency contacts, and documents per child. Parents control what professionals can see. The vault is part of your circle, not a hidden channel."
          href="/features/vault"
          ctaLabel="See the vault"
          visual={<VaultMockup variant="desktop" />}
          reverse
        />
      </FeatureShowcaseBand>

      <FeatureShowcaseBand>
        <FeatureShowcase
          eyebrow="Keep proof"
          title="Tamper-evident records and exports"
          description="Generate PDF exports with hash-chain verification anyone can check. Dispute summaries organize records by date range or topic with citations back to original messages. Not certified or court-approved."
          href="/features/records"
          ctaLabel="See records"
          visual={<ExportsMockup variant="desktop" />}
        />
      </FeatureShowcaseBand>

      <ProSegmentBanner />

      <Section>
        <SectionHeader
          title="Security and privacy by design"
          description="Built for sensitive family records, with clear limits on what Copara tracks and shares."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Append-only messages", body: "Sent messages cannot be edited or deleted, supporting record integrity." },
            { title: "Server timestamps", body: "Delivery and read receipts use server time, not device clocks." },
            { title: "Hash-chain verification", body: "Exports include a digest anyone can verify at a public link." },
            { title: "No hidden GPS tracking", body: "Check-ins can record whether GPS was provided; raw coordinates are not stored or shared between parents." },
            { title: "Row-level security", body: "Database policies restrict access to your circle members only." },
            { title: "PIPEDA-aware", body: "Privacy framing is designed for Canadian users. See our Privacy Policy." },
          ].map((item) => (
            <div key={item.title} className="routine-panel">
              <h3 className="font-semibold text-slate-heading">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/security" className="text-sm font-medium text-primary hover:underline">
            Read our security overview
          </Link>
        </p>
      </Section>

      <Section variant="cream">
        <SectionHeader
          title="Simple, affordable pricing in CAD"
          description="Intentionally priced below many established co-parenting tools. No per-export fees ."
        />
        <PricingPlans compact />
        <p className="mt-8 text-center">
          <Link href="/pricing" className={cn(buttonVariants(), "min-h-11")}>
            See pricing
          </Link>
        </p>
      </Section>

      <Section>
        <SectionHeader title="Common questions" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={HOME_FAQ} />
          <p className="mt-6 text-center text-sm">
            <Link href="/faq" className="font-medium text-primary hover:underline">
              View all FAQs
            </Link>
          </p>
        </div>
      </Section>

      <Section variant="mist">
        <SectionHeader
          eyebrow="From the blog"
          title="Making co-parenting life a little easier"
          description="Practical guides on communication, schedules, expenses, and records."
        />
        <BlogPostsScroll posts={blogPosts} />
        {blogPosts.length > 0 && (
          <p className="mt-10 text-center">
            <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}>
              View all posts
            </Link>
          </p>
        )}
      </Section>

      <CtaBand
        className="pb-20"
        title="Keep the focus on your child, not the conflict."
        description="Start free trial and help shape a calmer co-parenting tool for Canadian families."
      />
    </>
  );
}
