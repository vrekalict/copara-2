"use client";

import Link from "next/link";
import { canQuebecPaidSignup, LEGAL_LINKS } from "@/lib/legal/config";
import { cn } from "@/lib/utils";

const checkboxClass =
  "mt-1 size-4 shrink-0 rounded border border-input accent-primary";

export function LegalAcceptanceFields({
  province,
  idPrefix = "legal",
  compact = false,
}: {
  province: string;
  idPrefix?: string;
  compact?: boolean;
}) {
  const isQuebec = province.trim().toLowerCase() === "quebec";

  return (
    <div className={cn("flex flex-col gap-4", compact ? "gap-3" : "gap-4")}>
      {isQuebec && (
        <div className="rounded-xl border border-[var(--marketing-border)] bg-muted/30 p-4 text-sm leading-relaxed">
          <p className="font-medium text-foreground">
            Les conditions d&apos;utilisation et la politique de confidentialité
            sont disponibles en français.
          </p>
          <p className="mt-2 text-muted-foreground">
            Before continuing in English, please review the French version of the
            Terms and Privacy Policy.
          </p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            <li>
              <Link href={LEGAL_LINKS.termsFr} className="text-primary underline-offset-4 hover:underline">
                Conditions d&apos;utilisation (Français)
              </Link>
            </li>
            <li>
              <Link href={LEGAL_LINKS.privacyFr} className="text-primary underline-offset-4 hover:underline">
                Politique de confidentialité (Français)
              </Link>
            </li>
            <li>
              <Link href={LEGAL_LINKS.termsEn} className="text-primary underline-offset-4 hover:underline">
                Terms and Conditions (English)
              </Link>
            </li>
            <li>
              <Link href={LEGAL_LINKS.privacyEn} className="text-primary underline-offset-4 hover:underline">
                Privacy Policy (English)
              </Link>
            </li>
          </ul>
        </div>
      )}

      {!isQuebec && (
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href={LEGAL_LINKS.termsEn} className="text-primary underline-offset-4 hover:underline">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href={LEGAL_LINKS.privacyEn} className="text-primary underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      )}

      {isQuebec && (
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="confirmedFrenchAccess"
            value="true"
            required
            className={checkboxClass}
            id={`${idPrefix}-french-access`}
          />
          <span>
            I have been given access to the French version of the Terms and Privacy
            Policy and choose to continue in English.
          </span>
        </label>
      )}

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          name="acceptedLegal"
          value="true"
          required
          className={checkboxClass}
          id={`${idPrefix}-accept-legal`}
        />
        <span>I agree to the Terms and Privacy Policy.</span>
      </label>

      {isQuebec && !canQuebecPaidSignup() && (
        <input type="hidden" name="quebecPaidBlocked" value="true" />
      )}
    </div>
  );
}

export function QuebecPaidSignupBlocked() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
      <p className="font-semibold">Quebec launch coming soon</p>
      <p className="mt-2 text-sm leading-relaxed">
        Copara is preparing French legal documents for Quebec users. Paid signup in
        Quebec is not available yet. Join the waitlist and we&apos;ll notify you when
        Quebec access opens.
      </p>
    </div>
  );
}
