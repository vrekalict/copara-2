import Link from "next/link";
import { Briefcase, Gift, LayoutDashboard } from "lucide-react";
import { CoparaLogo } from "@/components/marketing/copara-logo";
import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  lg: "max-w-lg",
  xl: "max-w-xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

export function ProPortalHeader() {
  return (
    <header className="border-b border-[var(--marketing-border)] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="w-fit shrink-0" aria-label="Copara home">
            <CoparaLogo />
          </Link>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Partner dashboard">
            <Link
              href="/pro/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--marketing-slate)] hover:bg-[var(--marketing-mist)]/80"
            >
              <LayoutDashboard className="size-4" aria-hidden />
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-[var(--marketing-navy)] px-2.5 py-1 text-xs font-medium text-white sm:inline">
            Partner
          </span>
          <Link
            href="/professionals"
            className="hidden text-xs font-medium text-muted-foreground hover:text-[var(--marketing-slate)] hover:underline sm:inline"
          >
            Program info
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-medium text-muted-foreground hover:text-[var(--marketing-slate)] hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function ProPortalShell({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  maxWidth = "4xl",
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  maxWidth?: keyof typeof MAX_WIDTH;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="pro-portal-shell flex min-h-svh flex-col">
      <ProPortalHeader />
      <div className="mx-auto w-full flex-1 px-5 py-8 sm:px-8">
        <div className={cn("mx-auto w-full", MAX_WIDTH[maxWidth])}>
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
                    "text-2xl font-semibold tracking-tight text-[var(--marketing-slate)] sm:text-3xl",
                    eyebrow && "mt-2",
                  )}
                >
                  {title}
                </h1>
                {description && (
                  <div className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </div>
                )}
              </div>
              {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
            </div>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProPortalCard({
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

export function ProPortalStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon?: typeof Briefcase;
}) {
  return (
    <div className="rounded-xl border border-[var(--marketing-border)] bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-[var(--marketing-teal)]" aria-hidden />}
      </div>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--marketing-slate)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProSectionHeading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: typeof Gift;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {Icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--marketing-teal)]/10">
          <Icon className="size-4 text-[var(--marketing-teal)]" aria-hidden />
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-[var(--marketing-slate)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
