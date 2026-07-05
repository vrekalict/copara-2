import { getTranslations } from "next-intl/server";

type Section = {
  title: string;
  paragraphs: string[];
};

export async function LegalDocument({
  namespace,
}: {
  namespace: "legal.terms" | "legal.privacy";
}) {
  const t = await getTranslations(namespace);

  const sections = t.raw("sections") as Section[];

  return (
    <article className="prose prose-sm max-w-none dark:prose-invert">
      <h1 className="text-2xl font-semibold not-prose">{t("title")}</h1>
      <p className="text-sm text-muted-foreground not-prose">{t("lastUpdated")}</p>
      <p className="text-muted-foreground">{t("intro")}</p>

      {sections.map((section, i) => (
        <section key={i} className="mt-8">
          <h2 className="text-lg font-medium">{section.title}</h2>
          {section.paragraphs.map((paragraph, j) => (
            <p key={j}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
