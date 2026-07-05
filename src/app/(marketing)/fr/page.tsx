import Link from "next/link";
import { MessagesMockup } from "@/components/marketing/mockups/app-mockups";
import { Section, SectionHeader } from "@/components/marketing/section";
import { buttonVariants } from "@/components/ui/button";
import { pageMetadata } from "@/lib/marketing/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Coparentalité plus calme et plus claire",
  description:
    "Copara aide les parents séparés au Canada à communiquer de façon neutre, gérer les horaires de garde, suivre les dépenses partagées et conserver des dossiers organisés.",
  path: "/fr",
  locale: "fr",
  languageAlternates: { en: "/", fr: "/fr" },
  ogTitle: "Coparentalité plus calme et plus claire",
  ogDescription:
    "Plateforme canadienne de coparentalité: messagerie neutre, calendrier partagé, dépenses et dossiers inviolables pour examen par des professionnels du droit.",
});

export default function FrenchLandingPage() {
  return (
    <>
      <Section variant="cream" className="pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="accent-rule">
            <p className="eyebrow">Plateforme canadienne</p>
            <h1 className="display mt-5">Coparentalité plus calme et plus claire.</h1>
            <p className="lead mt-6 max-w-xl">
              Copara aide les parents séparés à échanger de façon neutre, gérer les
              horaires de garde, suivre les dépenses communes et conserver des dossiers
              organisés, sans transformer chaque conversation en conflit.
            </p>
            <ul className="mt-8 space-y-2 text-sm font-medium text-muted-foreground">
              <li>Anglais et français</li>
              <li>Dossiers inviolables pour examen par des professionnels du droit</li>
              <li>PWA sur iOS, Android et le web</li>
              <li>Tarification simple en dollars canadiens</li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "min-h-12 px-8 font-semibold")}
              >
                Rejoindre l&apos;accès anticipé
              </Link>
              <Link
                href="/professionals"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "min-h-12 border-2 px-8",
                )}
              >
                Médiateurs et avocats
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              L&apos;interface complète en français est en cours de déploiement.{" "}
              <Link href="/" className="font-medium text-primary hover:underline">
                English site →
              </Link>
            </p>
          </div>
          <MessagesMockup variant="desktop" />
        </div>
      </Section>

      <Section variant="cream">
        <SectionHeader
          title="Conçu pour les familles canadiennes"
          description="Messagerie avec suggestions Steady Send, calendrier de garde partagé, suivi des dépenses, coffre-fort d'information et exports PDF vérifiables."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "Steady Send", body: "Suggestions de reformulation neutre avant l'envoi." },
            { title: "Calendrier", body: "Demandes de changement d'horaire et confirmations d'échange." },
            { title: "Dossiers", body: "Exports inviolables, non certifiés ni approuvés par un tribunal." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--marketing-border)] bg-background p-5"
            >
              <h2 className="font-semibold text-slate-heading">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
