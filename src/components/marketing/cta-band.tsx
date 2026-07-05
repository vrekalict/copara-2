import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MARKETING_INNER = "mx-auto w-full max-w-6xl px-5 sm:px-6";

export function CtaBand({
  title,
  description,
  primaryHref = "/sign-up",
  primaryLabel = "Start free trial",
  secondaryHref,
  secondaryLabel,
  dark = true,
  footer,
  className,
}: {
  title: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  dark?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "py-14 text-center md:py-20",
        dark ? "marketing-page-hero text-white" : "bg-mist",
        className,
      )}
    >
      <div className={MARKETING_INNER}>
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
              "min-h-12 w-full px-8 text-base font-semibold sm:w-auto",
              dark && "btn-marketing-gradient border-0 hover:opacity-90",
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
        {footer && <div className="mt-8 text-left">{footer}</div>}
      </div>
    </section>
  );
}
