import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBand({
  title,
  description,
  primaryHref = "/early-access",
  primaryLabel = "Join early access",
  secondaryHref,
  secondaryLabel,
  dark = true,
}: {
  title: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-8 py-14 text-center sm:px-12 sm:py-16",
        dark
          ? "bg-[var(--marketing-navy)] text-white"
          : "border-2 border-[var(--marketing-border)] bg-mist",
      )}
    >
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg",
            dark ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "min-h-12 px-8 text-base font-semibold w-full sm:w-auto",
            dark && "bg-white text-[var(--marketing-slate)] hover:bg-white/90",
          )}
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-h-11 w-full sm:w-auto",
              dark && "border-white/30 bg-transparent text-white hover:bg-white/10",
            )}
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
