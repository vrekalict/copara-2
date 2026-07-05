import Link from "next/link";
import { FileText, Shield } from "lucide-react";
import { Section } from "@/components/marketing/section";
import { LEGAL_LINKS } from "@/lib/legal/config";
import { pageMetadata } from "@/lib/marketing/metadata";

export const metadata = pageMetadata({
  title: "Legal documents",
  description:
    "Copara legal documents: Terms and Conditions, Privacy Policy, and French versions for Quebec users.",
  path: "/legal",
});

const DOCUMENTS = [
  {
    href: LEGAL_LINKS.termsEn,
    title: "Terms and Conditions",
    description: "English terms governing your use of Copara.",
    icon: FileText,
    lang: "English",
  },
  {
    href: LEGAL_LINKS.privacyEn,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information.",
    icon: Shield,
    lang: "English",
  },
  {
    href: LEGAL_LINKS.termsFr,
    title: "Conditions d'utilisation",
    description: "Version française des conditions d'utilisation.",
    icon: FileText,
    lang: "Français",
  },
  {
    href: LEGAL_LINKS.privacyFr,
    title: "Politique de confidentialité",
    description: "Version française de la politique de confidentialité.",
    icon: Shield,
    lang: "Français",
  },
] as const;

export default function LegalHubPage() {
  return (
    <Section className="pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-heading md:text-4xl">
            Legal documents
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Copara provides Terms and Conditions and a Privacy Policy in English and French
            for Canadian users, including Quebec consumers.
          </p>
        </header>

        <div className="mt-10 grid gap-4">
          {DOCUMENTS.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group flex gap-4 rounded-xl border border-[var(--marketing-border)] bg-background p-5 transition-colors hover:border-primary/30 hover:bg-muted/20 md:p-6"
            >
              <doc.icon
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-heading group-hover:text-primary">
                    {doc.title}
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {doc.lang}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {doc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          Questions? Contact{" "}
          <a
            href="mailto:legal@copara.ca"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            legal@copara.ca
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
