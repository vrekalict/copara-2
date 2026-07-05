import Link from "next/link";
import { Shield } from "lucide-react";
import { HeroAppPreview } from "@/components/marketing/mockups/app-mockups";
import { PwaInstallBadges } from "@/components/pwa/pwa-install-badges";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  "Built for Canadian families",
  "English and French",
  "Tamper-evident exports",
  "No app store install required",
];

export function MarketingHero() {
  return (
    <section className="marketing-hero">
      <div className="marketing-hero__grid mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-18">
        <div className="marketing-hero__copy">
          <h1 className="display display--light">{SITE.tagline}</h1>
          <p className="lead lead--light mt-6 max-w-xl">
            {SITE.name} gives you one calm place for messages, parenting schedules,
            shared expenses, child information, and tamper-evident records suitable
            for review by legal professionals.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "lg" }),
                "btn-marketing-primary-on-dark min-h-12 px-8 text-base font-semibold",
              )}
            >
              Get started
            </Link>
            <Link
              href="/professionals"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-12 border border-white/20 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10",
              )}
            >
              For mediators & lawyers
            </Link>
          </div>
          <PwaInstallBadges className="mt-6" />
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85"
              >
                <Shield
                  className="size-3.5 shrink-0 text-[var(--marketing-accent-light)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="marketing-hero__visual">
          <HeroAppPreview />
        </div>
      </div>
    </section>
  );
}
