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
          Canadian co-parenting platform · Early access open · Pricing in CAD
        </p>
      </div>

      <div className="marketing-header__main">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
          <Link href="/" aria-label="Copara home">
            <CoparaLogo variant="light" />
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "min-h-10 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "bg-white/12 text-white"
                    : "text-white/75 hover:bg-white/8 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/early-access"
              className={cn(
                buttonVariants(),
                "ml-3 min-h-10 border-0 bg-white px-5 text-sm font-semibold text-[var(--marketing-navy)] hover:bg-white/92",
              )}
            >
              Early access
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 text-white md:hidden"
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
          className="border-t border-white/10 bg-[var(--marketing-navy)] px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-white/90 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/early-access"
                className={cn(
                  buttonVariants(),
                  "flex min-h-11 w-full justify-center border-0 bg-white text-[var(--marketing-navy)] hover:bg-white/92",
                )}
                onClick={() => setOpen(false)}
              >
                Early access
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
