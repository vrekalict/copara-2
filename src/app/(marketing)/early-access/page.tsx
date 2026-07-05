import { EarlyAccessForm } from "@/components/marketing/early-access-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Early access",
  description:
    "Request early access to Copara, the Canadian co-parenting platform for calmer communication, shared schedules, and tamper-evident records.",
  path: "/early-access",
});

export default async function EarlyAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role === "professional" ? "mediator" : undefined;

  return (
    <Section className="pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-xl">
        <PageHero
          eyebrow="Early access"
          title="Join the first Canadian families on Copara"
          description="Tell us a bit about yourself. We will reach out when early access opens for your province. Parents and professional design partners welcome."
        />
        <div className="mt-10">
          <EarlyAccessForm defaultRole={defaultRole} />
        </div>
      </div>
    </Section>
  );
}
