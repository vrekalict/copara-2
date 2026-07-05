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

/** Full-text marketing page docs for llms-full.txt */
export function getMarketingPageDocs(): LlmsPageDoc[] {
  const faqBody = FAQ_ALL.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return [
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
      summary: "CAD pricing for parents and free design partner access during early access.",
      body: "Parent Monthly CAD $8. Parent Yearly CAD $72. Family Circle CAD $12/month or CAD $108/year. No per-export fees during early access. Priced below many established co-parenting tools.",
    },
    {
      path: "/professionals",
      title: "For Professionals",
      summary: "Design partner program for mediators, family lawyers, and parenting coordinators.",
      body: "Read-only access where permitted. Dispute summaries with citations. Dual-parent invite links. Free during early access.",
    },
    {
      path: "/security",
      title: "Security",
      summary: "Append-only messages, hash-chain exports, no raw GPS sharing between parents.",
      body: "Row-level security. Exchange check-ins verify arrival without sharing coordinates. Exports are tamper-evident, not certified or court-approved.",
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
      body: "English Terms and Privacy Policy. French versions for Quebec consumers when published.",
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
      path: "/early-access",
      title: "Early Access",
      summary: "Request early access to Copara.",
      body: "Early access signup for Canadian parents and professional design partners.",
    },
    {
      path: "/fr",
      title: "Copara (Français)",
      summary: "Page d'accueil française pour Copara.",
      body: "Coparentalité plus calme et plus claire. Plateforme canadienne en anglais et français.",
    },
  ];
}

export function buildLlmsTxt(): string {
  const posts = getAllPosts();
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Canonical: ${SITE.url}`,
    "",
    "## Product",
    `- ${SITE.url}/`,
    `- ${SITE.url}/features`,
    `- ${SITE.url}/pricing`,
    `- ${SITE.url}/professionals`,
    `- ${SITE.url}/security`,
    `- ${SITE.url}/early-access`,
    "",
    "## Resources",
    `- ${SITE.url}/blog`,
    `- ${SITE.url}/faq`,
    `- ${SITE.url}/contact`,
    "",
    "## Legal",
    `- ${SITE.url}/legal`,
    `- ${SITE.url}/privacy`,
    `- ${SITE.url}/terms`,
    `- ${SITE.url}/fr/conditions`,
    `- ${SITE.url}/fr/confidentialite`,
    "",
    "## Blog posts",
    ...posts.map(
      (p) =>
        `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`,
    ),
    "",
    "## Full text",
    `See ${SITE.url}/llms-full.txt for complete page and article text.`,
    "",
    "Copara does not provide legal advice. Exports are tamper-evident records suitable for review by legal professionals, not certified or court-approved.",
  ];
  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  const docs = getMarketingPageDocs();
  const posts = getAllPosts();
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

export function getAllPublicPaths(): string[] {
  const posts = getAllPosts();
  return [
    ...MARKETING_ROUTES.map((r) => r.path),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
}
