import Link from "next/link";
import { Shield } from "lucide-react";
import { CoparaLogo } from "@/components/marketing/copara-logo";
import { SITE } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  "Built for Canadian families",
  "English and French",
  "14-day free trial on paid plans",
  "Tamper-evident records",
];

const PARTNER_TRUST_ITEMS = [
  "For mediators, lawyers & parenting coordinators",
  "Read-only access where parents permit",
  "Organized exports with citations",
  "Client referral program",
];

export function AuthShell({
  title,
  description,
  eyebrow,
  children,
  className,
  variant = "parent",
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "parent" | "partner";
}) {
  const isPartner = variant === "partner";
  const trustItems = isPartner ? PARTNER_TRUST_ITEMS : TRUST_ITEMS;

  return (
    <div className={cn("auth-shell flex min-h-svh flex-1 flex-col lg:grid lg:grid-cols-2", className)}>
      <aside className="auth-shell__brand relative overflow-hidden px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="relative z-10 flex h-full flex-col">
          <Link href="/" className="w-fit" aria-label="Copara home">
            <CoparaLogo variant="light" layout="desktop" className="hidden sm:inline-flex" />
            <CoparaLogo variant="light" layout="mobile" className="sm:hidden" />
          </Link>

          <div className="mt-10 max-w-md lg:mt-auto lg:pb-4">
            <p className="text-sm font-medium text-[var(--marketing-teal-light)]">
              {isPartner ? "Partner program" : "Canadian co-parenting"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              {isPartner
                ? "Professional tools for separated families"
                : SITE.tagline}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {isPartner
                ? "Follow client cases from one dashboard, access read-only records where permitted, and share organized exports — without sorting through screenshots."
                : "Message neutrally, share schedules, track expenses, and keep organized records — without turning every conversation into a conflict."}
            </p>
          </div>

          <ul className="mt-8 hidden gap-2.5 sm:grid sm:grid-cols-2 lg:mt-10">
            {trustItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/85"
              >
                <Shield
                  className="size-3.5 shrink-0 text-[var(--marketing-teal-light)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:mb-8">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--marketing-teal)]">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--marketing-slate)]">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--marketing-border)] bg-card p-6 shadow-[0_16px_48px_-28px_oklch(0.24_0.03_252_/_0.35)] sm:p-7">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              ← Back to copara.ca
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
