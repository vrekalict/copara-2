import { getAllPosts } from "@/lib/blog";
import { FAQ_ALL } from "@/content/marketing/faq";
import { PRIVACY_SECTIONS } from "@/content/legal/privacy.en";
import { TERMS_SECTIONS } from "@/content/legal/terms.en";
import { MARKETING_ROUTES } from "@/lib/marketing/routes";
import { SITE } from "@/lib/marketing/site";

export type LlmsPageDoc = {
  path: string;
  title: string;
  summary: string;
  body: string;
};

/** Short index entries for routes without dedicated long-form body content. */
const ROUTE_INDEX: Record<string, { title: string; summary: string }> = {
  "/features/steady-send": {
    title: "Steady Send neutral rewrite suggestions",
    summary:
      "Optional tone review and neutral rewrite suggestions before sending co-parenting messages.",
  },
  "/features/calendar": {
    title: "Shared custody calendar and exchange tracking",
    summary:
      "Parenting-time schedules, change requests, and exchange check-ins without sharing raw GPS between parents.",
  },
  "/features/expenses": {
    title: "Shared expense tracking for co-parents",
    summary: "Log shared child expenses, attach receipts, and track running balances.",
  },
  "/features/journal": {
    title: "Circle journal for co-parent updates",
    summary: "Share family news, photos, and updates inside a private co-parenting circle.",
  },
  "/features/albums": {
    title: "Private photo albums for co-parents",
    summary: "Full-resolution photo albums in a closed, secure circle.",
  },
  "/features/vault": {
    title: "Child info vault for co-parents",
    summary: "Medical notes, school details, emergency contacts, and documents per child.",
  },
  "/features/records": {
    title: "Tamper-evident record exports",
    summary:
      "Export messages, schedules, and expenses as tamper-evident PDFs with hash-chain verification.",
  },
  "/coparenting-guide": {
    title: "Co-parenting guide",
    summary:
      "Practical guide for Canadian separated parents: calendars, documented messages, expenses, and exports.",
  },
  "/blog": {
    title: "Blog & guides",
    summary: "Articles and resources for Canadian co-parenting.",
  },
  "/fr/conditions": {
    title: "Conditions d'utilisation (FR)",
    summary: "Conditions d'utilisation de Copara en français pour les utilisateurs québécois.",
  },
  "/fr/confidentialite": {
    title: "Politique de confidentialité (FR)",
    summary: "Politique de confidentialité de Copara en français.",
  },
  "/fr/guide-coparentalite": {
    title: "Guide de coparentalité (FR)",
    summary: "Guide pratique de coparentalité pour parents séparés au Canada.",
  },
};

const LLMS_SECTIONS: { heading: string; paths: string[] }[] = [
  {
    heading: "Product",
    paths: [
      "/",
      "/features",
      "/features/steady-send",
      "/features/calendar",
      "/features/expenses",
      "/features/journal",
      "/features/albums",
      "/features/vault",
      "/features/records",
      "/pricing",
      "/professionals",
      "/security",
      "/sign-up",
    ],
  },
  {
    heading: "Resources",
    paths: [
      "/blog",
      "/faq",
      "/contact",
      "/coparenting-guide",
      "/fr",
      "/fr/guide-coparentalite",
    ],
  },
  {
    heading: "Legal",
    paths: ["/legal", "/privacy", "/terms", "/fr/conditions", "/fr/confidentialite"],
  },
];

function joinSections(
  sections: { title: string; paragraphs?: string[]; bullets?: string[] }[],
): string {
  return sections
    .map((s) => {
      const parts = [...(s.paragraphs ?? [])];
      if (s.bullets?.length) {
        parts.push(s.bullets.map((b) => `- ${b}`).join("\n"));
      }
      return `## ${s.title}\n\n${parts.join("\n\n")}`;
    })
    .join("\n\n");
}

function routeUrl(path: string) {
  return `- ${SITE.url}${path}`;
}

/** Full-text marketing page docs for llms-full.txt */
export function getMarketingPageDocs(): LlmsPageDoc[] {
  const faqBody = FAQ_ALL.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  const detailed: LlmsPageDoc[] = [
    {
      path: "/",
      title: SITE.name,
      summary: SITE.description,
      body: `${SITE.tagline}\n\n${SITE.description}\n\nCopara is Canadian-focused. English and French. Tamper-evident records suitable for review by legal professionals. PWA on iOS, Android, and web.`,
    },
    {
      path: "/features",
      title: "Features",
      summary: "Messaging, calendar, expenses, journal, albums, vault, exports, and professional access.",
      body: "Steady Send optional rewrites. Shared custody calendar with change requests. Expense tracking with receipts. Journal for circle family updates. Albums for private full-resolution photos. Info Vault for child medical, school, and emergency details. Tamper-evident exports. Professional dashboard for design partners.",
    },
    {
      path: "/pricing",
      title: "Pricing",
      summary: "CAD pricing for parents and free design partner access.",
      body: "Parent Monthly CAD $8. Parent Yearly CAD $72. Family Circle CAD $12/month or CAD $108/year. No per-export fees. Priced below many established co-parenting tools.",
    },
    {
      path: "/professionals",
      title: "For Professionals",
      summary: "Design partner program for mediators, family lawyers, and parenting coordinators.",
      body: "Read-only access where permitted. Dispute summaries with citations. Dual-parent invite links. Free.",
    },
    {
      path: "/security",
      title: "Security",
      summary: "Append-only messages, hash-chain exports, no raw GPS sharing between parents.",
      body: "Row-level security. Exchange check-ins record whether GPS coordinates were provided without sharing coordinates. Exports are tamper-evident, not certified or court-approved.",
    },
    {
      path: "/faq",
      title: "FAQ",
      summary: "Frequently asked questions about Copara.",
      body: faqBody,
    },
    {
      path: "/legal",
      title: "Legal documents",
      summary: "Terms, Privacy Policy, and French versions for Quebec users.",
      body: "English Terms and Privacy Policy. French versions for Quebec consumers.",
    },
    {
      path: "/privacy",
      title: "Privacy Policy",
      summary: "How Copara handles personal and co-parenting data for Canadian users.",
      body: joinSections(PRIVACY_SECTIONS),
    },
    {
      path: "/terms",
      title: "Terms and Conditions",
      summary: "Terms of use for Copara.",
      body: joinSections(TERMS_SECTIONS),
    },
    {
      path: "/contact",
      title: "Contact",
      summary: `Contact ${SITE.name}.`,
      body: `General: ${SITE.contactEmail}\nSupport: ${SITE.supportEmail}\nPrivacy: privacy@copara.ca`,
    },
    {
      path: "/sign-up",
      title: "Sign up",
      summary: "Create a Copara account.",
      body: "Sign up for Canadian parents and professional design partners.",
    },
    {
      path: "/fr",
      title: "Copara (Français)",
      summary: "Page d'accueil française pour Copara.",
      body: "Coparentalité plus calme et plus claire. Plateforme canadienne en anglais et français.",
    },
  ];

  const detailedPaths = new Set(detailed.map((d) => d.path));
  const stubs: LlmsPageDoc[] = MARKETING_ROUTES.filter(
    (r) => !detailedPaths.has(r.path) && ROUTE_INDEX[r.path],
  ).map((r) => ({
    path: r.path,
    title: ROUTE_INDEX[r.path]!.title,
    summary: ROUTE_INDEX[r.path]!.summary,
    body: ROUTE_INDEX[r.path]!.summary,
  }));

  return [...detailed, ...stubs].sort((a, b) => a.path.localeCompare(b.path));
}

export async function buildLlmsTxt(): Promise<string> {
  const posts = await getAllPosts();
  const indexedPaths = new Set(LLMS_SECTIONS.flatMap((s) => s.paths));

  const sectionLines = LLMS_SECTIONS.flatMap(({ heading, paths }) => [
    `## ${heading}`,
    ...paths.map(routeUrl),
    "",
  ]);

  const extraRoutes = MARKETING_ROUTES.map((r) => r.path).filter((p) => !indexedPaths.has(p));

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Canonical: ${SITE.url}`,
    "",
    ...sectionLines,
    ...(extraRoutes.length > 0
      ? ["## Additional pages", ...extraRoutes.map(routeUrl), ""]
      : []),
    "## Blog posts",
    ...posts.map(
      (p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`,
    ),
    "",
    "## Full text",
    `See ${SITE.url}/llms-full.txt for complete page and article text.`,
    "",
    "Copara does not provide legal advice. Exports are tamper-evident records suitable for review by legal professionals, not certified or court-approved.",
  ];
  return lines.join("\n");
}

export async function buildLlmsFullTxt(): Promise<string> {
  const docs = getMarketingPageDocs();
  const posts = await getAllPosts();
  const chunks: string[] = [
    `# ${SITE.name} full public index`,
    "",
    `Generated from Copara marketing and blog content sources.`,
    `Canonical: ${SITE.url}`,
    "",
    "---",
    "",
  ];

  for (const doc of docs) {
    chunks.push(`# ${doc.title}`, `URL: ${SITE.url}${doc.path}`, "", doc.summary, "", doc.body, "", "---", "");
  }

  for (const post of posts) {
    chunks.push(
      `# ${post.title}`,
      `URL: ${SITE.url}/blog/${post.slug}`,
      `Category: ${post.category}`,
      `Published: ${post.publishedAt}`,
      `Author: ${post.author}`,
      "",
      post.excerpt,
      "",
      post.body,
      "",
      "Disclaimer: Copara editorial content is general information, not legal advice.",
      "",
      "---",
      "",
    );
  }

  return chunks.join("\n");
}

export async function getAllPublicPaths(): Promise<string[]> {
  const posts = await getAllPosts();
  return [
    ...MARKETING_ROUTES.map((r) => r.path),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
}
