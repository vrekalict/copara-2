import { CtaBand } from "@/components/marketing/cta-band";
import { ExpensesShowcaseSection } from "@/components/marketing/expenses-showcase-section";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Shared expense tracking for co-parents",
  description:
    "Log shared child expenses, attach receipts, request reimbursement, and track running balances in Copara. No in-app payments. Clear records for both parents.",
  path: "/features/expenses",
});

export default function ExpensesFeaturePage() {
  return (
    <>
      <ExpensesShowcaseSection />
      <Section className="pb-20">
        <CtaBand title="Track expenses with a free trial" />
      </Section>
    </>
  );
}
