export const SITE = {
  name: "Copara",
  tagline: "Co-parenting communication, made calmer and clearer.",
  description:
    "Copara helps separated parents message neutrally, manage parenting schedules, track shared expenses, and keep organized records without turning every conversation into a conflict.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://copara.ca",
  locale: "en_CA",
  contactEmail: "hello@copara.ca",
  supportEmail: "support@copara.ca",
} as const;

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/professionals", label: "For Professionals" },
  { href: "/blog", label: "Resources" },
  { href: "/security", label: "Security" },
  { href: "/faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/professionals", label: "Professionals" },
    { href: "/security", label: "Security" },
    { href: "/faq", label: "FAQ" },
  ],
  resources: [
    { href: "/blog", label: "Blog & guides" },
    { href: "/coparenting-guide", label: "Co-parenting guide" },
    { href: "/early-access", label: "Early access" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/legal", label: "Legal hub" },
    { href: "/terms", label: "Terms and Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/fr/conditions", label: "Conditions (FR)" },
    { href: "/fr/confidentialite", label: "Confidentialité (FR)" },
  ],
} as const;

export const PRICING = {
  parentMonthly: { amount: 8, period: "month" as const },
  parentYearly: { amount: 72, period: "year" as const, monthlyEquivalent: 6 },
  familyMonthly: { amount: 12, period: "month" as const },
  familyYearly: { amount: 108, period: "year" as const, monthlyEquivalent: 9 },
  currency: "CAD",
} as const;

export const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
] as const;
