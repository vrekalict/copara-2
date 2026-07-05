import Link from "next/link";
import { CoparaLogo } from "@/components/marketing/copara-logo";
import { FOOTER_LINKS, SITE } from "@/lib/marketing/site";

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CoparaLogo variant="light" layout="desktop" className="hidden sm:inline-flex" />
          <CoparaLogo variant="light" layout="mobile" className="sm:hidden" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Calmer co-parenting communication for Canadian families. English and
            French. Tamper-evident records suitable for review by legal
            professionals.
          </p>
          <p className="mt-5 text-sm text-white/60">
            <Link href="/" className="underline-offset-4 hover:text-white hover:underline">
              English
            </Link>
            {" · "}
            <Link href="/fr" className="underline-offset-4 hover:text-white hover:underline">
              Français
            </Link>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Product</p>
          <ul className="mt-4 flex flex-col gap-1">
            {FOOTER_LINKS.product.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-sm text-white/65 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Resources</p>
          <ul className="mt-4 flex flex-col gap-1">
            {FOOTER_LINKS.resources.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-sm text-white/65 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Legal</p>
          <ul className="mt-4 flex flex-col gap-1">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-sm text-white/65 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 sm:px-6">
        <p className="mx-auto max-w-6xl text-center text-xs leading-relaxed text-white/50">
          © {new Date().getFullYear()} {SITE.name}. Not legal advice. Exports are
          tamper-evident records suitable for review by legal professionals.
        </p>
      </div>
    </footer>
  );
}
