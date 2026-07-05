import fs from "fs";
import path from "path";

export type PartnerMaterialKind = "pdf" | "zip";

export type PartnerMaterialId =
  | "referral-handout"
  | "partner-one-pager"
  | "brand-guidelines"
  | "logo-pack";

type PartnerMaterialDef = {
  id: PartnerMaterialId;
  filename: string;
  kind: PartnerMaterialKind;
  /** `locale` → public/partner/{en|fr}/ ; `brand` → public/partner/brand/ */
  folder: "locale" | "brand";
};

export const PARTNER_MATERIALS: PartnerMaterialDef[] = [
  {
    id: "referral-handout",
    filename: "referral-handout.pdf",
    kind: "pdf",
    folder: "locale",
  },
  {
    id: "partner-one-pager",
    filename: "partner-one-pager.pdf",
    kind: "pdf",
    folder: "locale",
  },
  {
    id: "brand-guidelines",
    filename: "brand-guidelines.pdf",
    kind: "pdf",
    folder: "brand",
  },
  {
    id: "logo-pack",
    filename: "copara-logo-pack.zip",
    kind: "zip",
    folder: "brand",
  },
];

const PUBLIC_PARTNER = path.join(process.cwd(), "public", "partner");

function materialAbsolutePath(def: PartnerMaterialDef, locale: string): string {
  if (def.folder === "brand") {
    return path.join(PUBLIC_PARTNER, "brand", def.filename);
  }
  return path.join(PUBLIC_PARTNER, locale, def.filename);
}

function materialPublicUrl(def: PartnerMaterialDef, locale: string): string {
  if (def.folder === "brand") {
    return `/partner/brand/${def.filename}`;
  }
  return `/partner/${locale}/${def.filename}`;
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export type PartnerMaterialItem = {
  id: PartnerMaterialId;
  kind: PartnerMaterialKind;
  available: boolean;
  downloadHref: string | null;
  usedLocale: string | null;
  /** Generated per partner (not a static file in public/partner/). */
  personalized?: boolean;
};

const REFERRAL_HANDOUT_ROUTE = "/pro/materials/referral-handout";

export function getPartnerMaterials(locale: string): PartnerMaterialItem[] {
  const normalizedLocale = locale.startsWith("fr") ? "fr" : "en";

  return PARTNER_MATERIALS.map((def) => {
    if (def.id === "referral-handout") {
      return {
        id: def.id,
        kind: def.kind,
        available: true,
        downloadHref: REFERRAL_HANDOUT_ROUTE,
        usedLocale: normalizedLocale,
        personalized: true,
      };
    }

    if (def.folder === "brand") {
      const absolute = materialAbsolutePath(def, normalizedLocale);
      const available = fileExists(absolute);
      return {
        id: def.id,
        kind: def.kind,
        available,
        downloadHref: available ? materialPublicUrl(def, normalizedLocale) : null,
        usedLocale: null,
      };
    }

    const localizedPath = materialAbsolutePath(def, normalizedLocale);
    if (fileExists(localizedPath)) {
      return {
        id: def.id,
        kind: def.kind,
        available: true,
        downloadHref: materialPublicUrl(def, normalizedLocale),
        usedLocale: normalizedLocale,
      };
    }

    if (normalizedLocale !== "en") {
      const enPath = materialAbsolutePath(def, "en");
      if (fileExists(enPath)) {
        return {
          id: def.id,
          kind: def.kind,
          available: true,
          downloadHref: materialPublicUrl(def, "en"),
          usedLocale: "en",
        };
      }
    }

    return {
      id: def.id,
      kind: def.kind,
      available: false,
      downloadHref: null,
      usedLocale: null,
    };
  });
}
