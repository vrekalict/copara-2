/** Shared product brand constants for app UI, emails, exports, and PWA. */
export const BRAND = {
  name: "Copara",
  defaultCircleName: "Co-parenting circle",
  offlineDbName: "copara-offline",
  emails: {
    support: "support@copara.ca",
    hello: "hello@copara.ca",
    invites: "invites@copara.ca",
    digest: "digest@copara.ca",
  },
} as const;

export function brandEmailFrom(kind: keyof typeof BRAND.emails) {
  return `${BRAND.name} <${BRAND.emails[kind]}>`;
}
