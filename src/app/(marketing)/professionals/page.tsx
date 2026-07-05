import Link from "next/link";
import { ProAccessForm } from "@/components/marketing/pro-access-form";
import { ProBenefitGrid } from "@/components/pro/referral-dashboard";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { JsonLd } from "@/components/marketing/json-ld";
import { Section, SectionHeader } from "@/components/marketing/section";
import { FAQ_PROFESSIONALS } from "@/content/marketing/faq";
import { PRO_PARTNER_BENEFITS, PRO_WHY_COPARA } from "@/lib/pro/config";
import { pageMetadata } from "@/lib/marketing/metadata";
import { faqSchema, professionalServiceSchema } from "@/lib/marketing/schema";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Copara for family law professionals",
  description:
    "Partner with Copara: read-only case access, client follow-up tools, professional materials, and referral bonuses for mediators, family lawyers, and parenting coordinators in Canada.",
  path: "/professionals",
});

export default function ProfessionalsPage() {
  return (
    <>
      <JsonLd data={[professionalServiceSchema(), faqSchema(FAQ_PROFESSIONALS)]} />

      <Section className="relative overflow-hidden pt-12 md:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 md:size-[28rem]"
        />
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Become a Copara partner</p>
            <h1 className="display mt-4 text-slate-heading">
              Are you a professional working with separated parents?
            </h1>
            <p className="lead mt-5 max-w-xl">
              Through your partner account, you can invite client families, follow cases from one
              dashboard, access read-only records where permitted, and earn referral bonuses when
              clients subscribe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#request-access" className={cn(buttonVariants({ size: "lg" }), "min-h-12 px-8")}>
                Request my free professional access
              </a>
              <Link
                href="/pro"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-h-12 px-8")}
              >
                Partner sign in
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--marketing-border)] bg-background/80 p-6 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-semibold text-primary">Partner referral program</p>
            <p className="mt-3 text-lg font-semibold text-slate-heading">
              Refer client families, earn when they subscribe
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Approved partners receive a unique referral link. Bonus terms and tracking are
              available in your partner dashboard after approval.
            </p>
          </div>
        </div>
      </Section>

      <Section variant="cream">
        <SectionHeader
          eyebrow="Partner benefits"
          title="Tools built for how professionals actually practice"
          description="Copara helps you spend less time sorting screenshots and more time on substance."
        />
        <ProBenefitGrid benefits={PRO_PARTNER_BENEFITS} />
      </Section>

      <Section id="request-access">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Request your pro access</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-heading md:text-4xl">
              Partner with Copara
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Free for approved partners. We will set up your partner dashboard, referral link, and
              onboarding materials.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>Read-only visibility where parents permit</li>
              <li>Dual-parent invite links for faster adoption</li>
              <li>Dispute summaries and organized exports</li>
              <li>Referral bonus tracking in your dashboard</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--marketing-border)] bg-background p-6 md:p-8">
            <ProAccessForm />
          </div>
        </div>
      </Section>

      <Section variant="mist">
        <SectionHeader
          eyebrow="Why Copara"
          title="We are a co-parenting facilitator"
          description="Calendar, finance, messages, journal, and more — organized for Canadian families in English and French."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {PRO_WHY_COPARA.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-[var(--marketing-border)] bg-background p-6 transition-colors hover:border-primary/30"
            >
              <h3 className="text-lg font-semibold text-slate-heading">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <p className="mt-3 text-sm font-medium text-primary">Learn more →</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/features" className="font-semibold text-primary hover:underline">
            And many more features
          </Link>
        </p>
      </Section>

      <Section>
        <SectionHeader title="Professional FAQ" align="left" />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={FAQ_PROFESSIONALS} />
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/blog/records-mediators-want-to-see" className="font-semibold text-primary hover:underline">
            Read: records mediators want to see first
          </Link>
        </p>
      </Section>
    </>
  );
}
