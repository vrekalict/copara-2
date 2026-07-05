import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  visual,
  variant = "dark",
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  visual?: React.ReactNode;
  variant?: "cream" | "default" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "page-hero-panel sm:p-10",
        isDark && "page-hero-panel--dark",
        variant === "cream" && "bg-cream",
        variant === "default" && "bg-background",
      )}
    >
      <div
        className={cn(
          "grid items-center gap-10",
          visual ? "lg:grid-cols-2 lg:gap-14" : "max-w-3xl",
        )}
      >
        <div className={isDark ? "border-l-[3px] border-[var(--marketing-teal-light)] pl-5" : "accent-rule"}>
          <p className={cn("eyebrow", isDark && "eyebrow--light")}>{eyebrow}</p>
          <h1 className={cn("display mt-4", isDark && "display--light")}>{title}</h1>
          <p className={cn("lead mt-5 max-w-2xl", isDark && "lead--light")}>{description}</p>
          {(primaryHref || secondaryHref) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryHref && primaryLabel && (
                <Link
                  href={primaryHref}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "min-h-12 px-8 font-semibold",
                    isDark &&
                      "border-0 bg-white text-[var(--marketing-navy)] hover:bg-white/92",
                  )}
                >
                  {primaryLabel}
                </Link>
              )}
              {secondaryHref && secondaryLabel && (
                <Link
                  href={secondaryHref}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-h-12 border-2 px-8",
                    isDark &&
                      "border-white/35 bg-transparent text-white hover:bg-white/10",
                  )}
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          )}
        </div>
        {visual && (
          <div className="app-mockup-slot flex justify-center lg:justify-end">{visual}</div>
        )}
      </div>
    </div>
  );
}

export function ProSegmentBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-navy)] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow eyebrow--light">For professionals</p>
        <p className="mt-2 text-lg font-semibold">
          Mediators, family lawyers, and parenting coordinators
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
          Design partner access . Read-only visibility where parents
          permit, organized exports, and dual-parent invites.
        </p>
      </div>
      <Link
        href="/professionals"
        className={cn(
          buttonVariants(),
          "min-h-11 shrink-0 border-0 bg-white px-6 text-[var(--marketing-navy)] hover:bg-white/92",
        )}
      >
        Learn more
      </Link>
    </div>
  );
}

export function LegalDisclaimer({
  children = "Copara does not provide legal advice. Exports are tamper-evident records suitable for review by legal professionals. They are not certified, court-approved, or guaranteed admissible.",
}: {
  children?: string;
}) {
  return (
    <p className="rounded-lg border border-[var(--marketing-border)] bg-mist px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
