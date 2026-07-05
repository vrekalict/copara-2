/** Central legal version and Quebec rollout configuration. */

export const TERMS_VERSION = "2026-07-04";
export const PRIVACY_VERSION = "2026-07-04";

/**
 * Set to true only after final French Terms are reviewed and published by a
 * qualified translator or lawyer. Do not enable Quebec paid signup until French
 * legal documents are finalized and Law 25 transfer/privacy review is complete.
 */
export const FRENCH_TERMS_AVAILABLE = true;

/**
 * Set to true when the French Privacy Policy is published.
 */
export const FRENCH_PRIVACY_AVAILABLE = true;

/**
 * Master switch for Quebec paid signup. Requires both French legal documents
 * to be available. Do not disable French pages once published.
 */
export const QUEBEC_PAID_SIGNUP_ENABLED = true;

export const LEGAL_LAST_UPDATED = "July 4, 2026";
export const LEGAL_LAST_UPDATED_FR = "4 juillet 2026";

export const QUEBEC_PROVINCE = "Quebec";

export function isQuebecProvince(province: string): boolean {
  return province.trim().toLowerCase() === "quebec";
}

export function canQuebecPaidSignup(): boolean {
  return (
    FRENCH_TERMS_AVAILABLE &&
    FRENCH_PRIVACY_AVAILABLE &&
    QUEBEC_PAID_SIGNUP_ENABLED
  );
}

export const LEGAL_LINKS = {
  termsEn: "/terms",
  privacyEn: "/privacy",
  termsFr: "/fr/conditions",
  privacyFr: "/fr/confidentialite",
  hub: "/legal",
} as const;
