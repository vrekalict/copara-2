import { SITE, PRICING } from "./site";
import type { BlogPost } from "@/lib/blog/types";

export type FaqItem = { question: string; answer: string };

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icons/512`,
    description: SITE.description,
    areaServed: { "@type": "Country", name: "Canada" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.supportEmail,
      availableLanguage: ["English", "French"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: ["en-CA", "fr-CA"],
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: String(PRICING.parentMonthly.amount),
      priceCurrency: PRICING.currency,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(PRICING.parentMonthly.amount),
        priceCurrency: PRICING.currency,
        billingDuration: "P1M",
      },
    },
    description: SITE.description,
    featureList: [
      "AI-assisted neutral messaging",
      "Shared custody calendar",
      "Expense tracking",
      "Tamper-evident record exports",
      "Professional dashboard",
      "English and French support",
      "Progressive Web App",
    ],
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${SITE.name}`,
    url: `${SITE.url}/contact`,
    mainEntity: organizationSchema(),
  };
}

export function webPageSchema(title: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${SITE.url}${path}`,
    description,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${SITE.name} for Professionals`,
    url: `${SITE.url}/professionals`,
    description:
      "Design partner access for mediators, family lawyers, and parenting coordinators: view connected circles where permitted, generate summaries, and export organized records.",
    areaServed: { "@type": "Country", name: "Canada" },
    serviceType: "Co-parenting record management for legal professionals",
  };
}

export function pricingProductSchema() {
  const makeOffer = (name: string, price: number, billing: "month" | "year") => ({
    "@type": "Offer",
    name,
    price: String(price),
    priceCurrency: PRICING.currency,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(price),
      priceCurrency: PRICING.currency,
      billingDuration: billing === "month" ? "P1M" : "P1Y",
    },
    availability: "https://schema.org/PreOrder",
    url: `${SITE.url}/pricing`,
  });

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE.name} Co-Parenting Platform`,
    description: "Simple, affordable co-parenting coordination for Canadian families.",
    brand: { "@type": "Brand", name: SITE.name },
    offers: [
      makeOffer("Parent Monthly", PRICING.parentMonthly.amount, "month"),
      makeOffer("Parent Yearly", PRICING.parentYearly.amount, "year"),
      makeOffer("Family Circle Monthly", PRICING.familyMonthly.amount, "month"),
      makeOffer("Family Circle Yearly", PRICING.familyYearly.amount, "year"),
    ],
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    url: `${SITE.url}/blog/${post.slug}`,
    inLanguage: "en-CA",
    articleSection: post.category,
  };
}
