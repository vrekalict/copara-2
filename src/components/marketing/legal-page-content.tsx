"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import type { LegalSection } from "@/content/legal/types";
import { cn } from "@/lib/utils";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalPageContent({
  title,
  lastUpdated,
  preamble,
  intro,
  sections,
  showTableOfContents = true,
}: {
  title: string;
  lastUpdated: string;
  preamble?: string[];
  intro?: string;
  sections: LegalSection[];
  showTableOfContents?: boolean;
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tocItems = sections.map((section) => ({
    id: section.id || slugify(section.title),
    title: section.title,
  }));

  return (
    <article className="relative">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-heading md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm font-medium text-muted-foreground">{lastUpdated}</p>
        {intro && (
          <p className="mt-6 text-base leading-relaxed text-foreground/90 md:text-lg md:leading-relaxed">
            {intro}
          </p>
        )}
        {preamble && preamble.length > 0 && (
          <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
            {preamble.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </header>

      {showTableOfContents && tocItems.length >= 4 && (
        <nav
          aria-label="Table of contents"
          className="mt-10 rounded-xl border border-[var(--marketing-border)] bg-muted/30 p-5 md:p-6"
        >
          <p className="text-sm font-semibold text-slate-heading">On this page</p>
          <ol className="mt-3 columns-1 gap-x-8 space-y-2 text-sm sm:columns-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {sections.map((section) => {
        const sectionId = section.id || slugify(section.title);
        return (
          <section key={sectionId} id={sectionId} className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-semibold text-slate-heading md:text-2xl">
              {section.title}
            </h2>
            {section.paragraphs && section.paragraphs.length > 0 && (
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
                {section.bullets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <div className="mt-12 border-t border-[var(--marketing-border)] pt-6">
        <Link
          href="/legal"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← All legal documents
        </Link>
      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-[var(--marketing-border)] bg-background shadow-lg transition-all hover:bg-muted",
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="size-5 text-slate-heading" aria-hidden />
      </button>
    </article>
  );
}
