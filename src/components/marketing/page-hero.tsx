import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MARKETING_INNER = "mx-auto w-full max-w-6xl px-5 sm:px-6";

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
  leading,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  visual?: React.ReactNode;
  variant?: "cream" | "default" | "dark";
  leading?: React.ReactNode;
  className?: string;
}) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "py-12 md:py-16 lg:py-20",
        isDark && "marketing-page-hero text-white",
        variant === "cream" && "bg-cream",
        variant === "default" && "bg-background",
        className,
      )}
    >
      <div className={MARKETING_INNER}>
        {leading}
        <div
          className={cn(
            "grid items-center gap-10",
            visual ? "lg:grid-cols-2 lg:gap-14" : "max-w-3xl",
            leading && "mt-6",
          )}
        >
          <div className={isDark ? "border-l-[3px] border-[var(--marketing-accent-light)] pl-5" : "accent-rule"}>
            {eyebrow ? (
              <p className={cn("eyebrow", isDark && "eyebrow--light")}>{eyebrow}</p>
            ) : null}
            <h1 className={cn("display", eyebrow ? "mt-4" : undefined, isDark && "display--light")}>
              {title}
            </h1>
            <p className={cn("lead mt-5 max-w-2xl", isDark && "lead--light")}>{description}</p>
            {(primaryHref || secondaryHref) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primaryHref && primaryLabel && (
                  <Link
                    href={primaryHref}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "min-h-12 px-8 font-semibold",
                      isDark
                        ? "btn-marketing-primary-on-dark hover:bg-white"
                        : "btn-marketing-primary",
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
                        "border-[var(--marketing-lilac)]/40 bg-transparent text-[var(--marketing-lilac)] hover:bg-[var(--marketing-lilac)]/10",
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
    </section>
  );
}

export function ProSegmentBanner() {
  return (
    <section className="marketing-page-hero py-14 text-white md:py-20">
      <div
        className={cn(
          MARKETING_INNER,
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div>
          <p className="text-lg font-semibold">
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
            "btn-marketing-primary-on-dark min-h-11 shrink-0 border-0 px-6 hover:bg-white",
          )}
        >
          Learn more
        </Link>
      </div>
    </section>
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
