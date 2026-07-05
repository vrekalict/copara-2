import Link from "next/link";
import { CoparaLogo } from "@/components/marketing/copara-logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
} as const;

export function AdminShell({
  active,
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  maxWidth = "4xl",
  banner,
  actions,
  children,
}: {
  active?: "blog" | "partners";
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  maxWidth?: keyof typeof MAX_WIDTH;
  banner?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell flex min-h-svh flex-col">
      <header className="border-b border-[var(--marketing-border)] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="w-fit" aria-label="Copara home">
            <CoparaLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--marketing-navy)] px-2.5 py-1 text-xs font-medium text-white">
              Staff tools
            </span>
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-[var(--marketing-slate)] hover:underline"
            >
              View site →
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full flex-1 px-5 py-8 sm:px-8">
        <div className={cn("mx-auto w-full", MAX_WIDTH[maxWidth])}>
          {active && <AdminNav active={active} />}

          {backHref && (
            <Link
              href={backHref}
              className="text-sm font-medium text-[var(--marketing-teal)] hover:underline"
            >
              ← {backLabel}
            </Link>
          )}

          <div className={cn(backHref && "mt-4")}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--marketing-teal)]">
                {eyebrow}
              </p>
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1
                  className={cn(
                    "text-2xl font-semibold tracking-tight text-[var(--marketing-slate)]",
                    eyebrow && "mt-2",
                  )}
                >
                  {title}
                </h1>
                {description && (
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</div>
                )}
              </div>
              {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
            </div>
          </div>

          {banner && <div className="mt-6">{banner}</div>}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--marketing-border)] bg-background p-6 shadow-[0_16px_48px_-28px_oklch(0.24_0.03_252_/_0.35)] sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminInfoBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--marketing-border)] bg-[var(--marketing-mist)]/60 p-4 text-sm leading-relaxed text-muted-foreground">
      {title && <p className="mb-2 font-medium text-[var(--marketing-slate)]">{title}</p>}
      {children}
    </div>
  );
}

export function AdminBanner({
  variant = "success",
  children,
}: {
  variant?: "success" | "warning";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
        variant === "warning" && "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      {children}
    </p>
  );
}

export function AdminStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--marketing-border)] bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--marketing-slate)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
