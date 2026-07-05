import Link from "next/link";
import {
  FileText,
  HeartPulse,
  Lock,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";
import { FeatureCapabilityGrid } from "@/components/marketing/feature-capability-grid";
import { VaultMockup } from "@/components/marketing/mockups/app-mockups";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: HeartPulse,
    title: "Medical notes",
    body: "Keep allergies, medications, and care instructions in one place per child, visible to both parents in the circle.",
  },
  {
    icon: School,
    title: "School details",
    body: "Store teacher contacts, schedules, and school-specific notes so handoffs do not depend on memory or text threads.",
  },
  {
    icon: Users,
    title: "Emergency contacts",
    body: "List who to call in an urgent situation, formatted clearly for both parents and professionals when needed.",
  },
  {
    icon: FileText,
    title: "Documents",
    body: "Upload reports, forms, and other files per child or for the whole circle, with optional sharing to professionals.",
  },
  {
    icon: Lock,
    title: "Circle-scoped privacy",
    body: "The vault lives inside your co-parenting circle. It is not a hidden channel or a public profile.",
  },
  {
    icon: ShieldCheck,
    title: "Professional sharing controls",
    body: "Choose which documents professionals in your circle can view, without exposing everything by default.",
  },
];

export function VaultShowcaseSection() {
  return (
    <section className="feature-showcase-band bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="feature-showcase__eyebrow">Share information</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-heading sm:text-4xl">
              Child info vault for both parents
            </h2>
            <p className="lead mt-5 max-w-lg">
              Medical notes, school details, emergency contacts, and documents organized
              per child. Parents control what professionals can see, with everything kept
              inside your co-parenting circle.
            </p>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), "mt-8 min-h-11 px-6")}
            >
              Open the vault with a free trial
            </Link>
          </div>
          <VaultMockup variant="desktop" />
        </div>
        <FeatureCapabilityGrid items={CAPABILITIES} />
      </div>
    </section>
  );
}
