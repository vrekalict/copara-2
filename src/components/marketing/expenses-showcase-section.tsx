import Link from "next/link";
import {
  FileDown,
  PieChart,
  Receipt,
  Scale,
  Send,
  Tags,
} from "lucide-react";
import { FeatureCapabilityGrid } from "@/components/marketing/feature-capability-grid";
import { ExpensesMarketingVisual } from "@/components/marketing/mockups/app-mockups";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: Scale,
    title: "Running balance",
    body: "The balance always shows what needs to be settled and by whom, so both parents start from the same numbers.",
  },
  {
    icon: Send,
    title: "Reimbursement requests",
    body: "Request repayment on shared costs. The other parent can approve or decline, and every decision stays in the record.",
  },
  {
    icon: Receipt,
    title: "Receipt attachments",
    body: "Attach proof to each expense so disagreements do not turn into a search through text threads.",
  },
  {
    icon: Tags,
    title: "Categories",
    body: "Sort spending into categories like activities, medical, and school for a clear history over time.",
  },
  {
    icon: PieChart,
    title: "Shared splits",
    body: "Track 50/50 and other split arrangements on each line item so partial responsibility stays visible.",
  },
  {
    icon: FileDown,
    title: "Export ready",
    body: "Include expense history in tamper-evident PDF exports when a mediator, lawyer, or accountant asks for documentation.",
  },
];

export function ExpensesShowcaseSection() {
  return (
    <section className="feature-showcase-band bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="feature-showcase__eyebrow">Manage finances</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-heading sm:text-4xl">
              An easy and clear way to manage shared expenses
            </h2>
            <p className="lead mt-5 max-w-lg">
              For many separated parents, money becomes another conflict topic. Copara
              logs expenses from each parent, tracks approvals, and keeps a running balance
              you can review day by day.
            </p>
            <Link
              href="/features/expenses"
              className={cn(buttonVariants(), "mt-8 min-h-11 px-6")}
            >
              Manage your expenses
            </Link>
          </div>
          <ExpensesMarketingVisual />
        </div>
        <FeatureCapabilityGrid items={CAPABILITIES} />
      </div>
    </section>
  );
}
