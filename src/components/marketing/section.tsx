import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "cream" | "mist" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        variant === "cream" && "bg-cream",
        variant === "mist" && "bg-mist",
        variant === "dark" && "bg-[var(--marketing-navy)] text-white",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-14 max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow mb-4", dark && "text-white/60")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-[1.875rem] font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
          dark ? "text-white" : "text-slate-heading",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "lead mt-5 max-w-2xl",
            align === "center" && "mx-auto",
            dark && "text-white/75",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
