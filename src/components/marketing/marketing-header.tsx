"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CoparaLogo } from "@/components/marketing/copara-logo";
import { buttonVariants } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/marketing/site";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="marketing-header">
      <div className="marketing-header__bar">
        <p className="mx-auto max-w-6xl px-5 text-center text-xs font-medium sm:px-6">
          Canadian co-parenting platform · Live signup · Pricing in CAD
        </p>
      </div>

      <div className="marketing-header__main">
        <div className="mx-auto grid h-[4.25rem] max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-6">
          <Link href="/" aria-label="Copara home" className="inline-flex shrink-0 items-center">
            <CoparaLogo variant="dark" layout="desktop" priority />
          </Link>

          <nav className="hidden items-center justify-center gap-0.5 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "min-h-10 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "bg-[var(--marketing-navy)]/8 text-[var(--marketing-navy)]"
                    : "text-[var(--marketing-slate-muted)] hover:bg-[var(--marketing-navy)]/5 hover:text-[var(--marketing-navy)]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-end md:flex">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "btn-marketing-primary min-h-10 px-5 text-sm font-semibold",
              )}
            >
              Start free trial
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center justify-self-end rounded-lg border border-[var(--marketing-border)] text-[var(--marketing-navy)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-[var(--marketing-border)] bg-[var(--marketing-lilac)] px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-[var(--marketing-navy)] hover:bg-[var(--marketing-navy)]/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "btn-marketing-primary flex min-h-11 w-full justify-center",
                )}
                onClick={() => setOpen(false)}
              >
                Start free trial
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
