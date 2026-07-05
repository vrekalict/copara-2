import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function FeatureShowcase({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  visual,
  reverse = false,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  visual: React.ReactNode;
  reverse?: boolean;
  variant?: "default" | "warm";
}) {
  return (
    <div
      className={cn(
        "feature-showcase grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "feature-showcase--reverse",
      )}
    >
      <div
        className={cn(
          "feature-showcase__visual order-2 lg:order-none",
          reverse ? "lg:order-2" : "lg:order-1",
        )}
      >
        {visual}
      </div>
      <div
        className={cn(
          "feature-showcase__copy order-1 lg:order-none",
          reverse ? "lg:order-1" : "lg:order-2",
        )}
      >
        <p className="feature-showcase__eyebrow">{eyebrow}</p>
        <h2
          className={cn(
            "mt-3 text-3xl font-bold tracking-tight sm:text-4xl",
            variant === "warm" ? "text-[var(--marketing-navy)]" : "text-slate-heading",
          )}
        >
          {title}
        </h2>
        <p className="lead mt-5 max-w-lg">{description}</p>
        <Link
          href={href}
          className={cn(buttonVariants({ variant: "outline" }), "mt-8 min-h-11 border-2 px-6")}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

export function FeatureShowcaseBand({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warm" | "mist";
}) {
  return (
    <section
      className={cn(
        "feature-showcase-band py-16 md:py-24",
        variant === "warm" && "bg-cream",
        variant === "mist" && "bg-mist",
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">{children}</div>
    </section>
  );
}
