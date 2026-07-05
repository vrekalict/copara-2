import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { VaultShowcaseSection } from "@/components/marketing/vault-showcase-section";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Child info vault for co-parents",
  description:
    "Store medical notes, school details, emergency contacts, and documents per child in Copara. Parents control professional sharing inside a private co-parenting circle.",
  path: "/features/vault",
});

export default function VaultFeaturePage() {
  return (
    <>
      <PageHero
        title="Organized child information both parents can trust"
        description="The vault keeps medical, school, and emergency information per child, plus documents you choose to upload. Everything stays inside your circle with sharing controls for professionals."
      />
      <VaultShowcaseSection />
      <CtaBand className="pb-20" title="Use the vault with a free trial" primaryLabel="Get started" />
    </>
  );
}
