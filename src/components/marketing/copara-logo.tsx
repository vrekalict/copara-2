import { cn } from "@/lib/utils";

export function CoparaLogo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  const markFill = variant === "light" ? "white" : "var(--marketing-navy)";
  const textClass =
    variant === "light" ? "text-white" : "text-[var(--marketing-navy)]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill={variant === "light" ? "white" : "var(--marketing-accent)"} fillOpacity={variant === "light" ? "0.12" : "1"} />
        <circle cx="12" cy="16" r="5.5" stroke={markFill} strokeWidth="2" fill="none" />
        <circle cx="20" cy="16" r="5.5" stroke={markFill} strokeWidth="2" fill="none" />
        <path
          d="M12 16h8"
          stroke={variant === "light" ? "var(--marketing-accent-light)" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("text-xl font-semibold tracking-tight", textClass)}>
        Copara
      </span>
    </span>
  );
}
