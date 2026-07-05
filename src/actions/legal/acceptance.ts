"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  FRENCH_PRIVACY_AVAILABLE,
  FRENCH_TERMS_AVAILABLE,
  isQuebecProvince,
  PRIVACY_VERSION,
  TERMS_VERSION,
} from "@/lib/legal/config";

export type LegalAcceptanceInput = {
  email?: string;
  province: string;
  selectedLanguage?: string;
  confirmedFrenchAccess?: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  userId?: string | null;
};

async function requestMeta() {
  const h = await headers();
  return {
    ipAddress:
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null,
    userAgent: h.get("user-agent"),
  };
}

export async function recordLegalAcceptance(input: LegalAcceptanceInput) {
  const {
    email,
    province,
    selectedLanguage = "en",
    confirmedFrenchAccess = false,
    acceptedTerms,
    acceptedPrivacy,
    userId,
  } = input;

  if (!acceptedTerms || !acceptedPrivacy) {
    return { error: "You must agree to the Terms and Privacy Policy." };
  }

  if (isQuebecProvince(province) && !confirmedFrenchAccess) {
    return {
      error:
        "Quebec users must confirm access to the French legal documents before continuing in English.",
    };
  }

  const { ipAddress, userAgent } = await requestMeta();
  const acceptedAt = new Date().toISOString();

  const row = {
    user_id: userId ?? null,
    email: email ?? null,
    province,
    country: "CA",
    selected_language: selectedLanguage,
    terms_version: TERMS_VERSION,
    privacy_version: PRIVACY_VERSION,
    french_terms_available: FRENCH_TERMS_AVAILABLE,
    french_privacy_available: FRENCH_PRIVACY_AVAILABLE,
    confirmed_french_access: confirmedFrenchAccess,
    accepted_terms: acceptedTerms,
    accepted_privacy: acceptedPrivacy,
    accepted_at: acceptedAt,
    ip_address: ipAddress,
    user_agent: userAgent,
  };

  const supabase = userId ? await createClient() : createServiceClient();

  const { data, error } = await supabase
    .from("legal_acceptances")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[legal] acceptance persist failed:", error.message);
    return { error: "Could not record legal acceptance. Please try again." };
  }

  const auditPayload = {
    terms_version: TERMS_VERSION,
    privacy_version: PRIVACY_VERSION,
    province,
    selected_language: selectedLanguage,
    confirmed_french_access: confirmedFrenchAccess,
    timestamp: acceptedAt,
    acceptance_id: data.id,
  };

  const auditClient = userId ? supabase : createServiceClient();
  const { error: auditError } = await auditClient.from("compliance_events").insert({
    user_id: userId ?? null,
    event_type: "legal_terms_accepted",
    payload: auditPayload,
  });

  if (auditError) {
    console.warn("[legal] compliance event failed:", auditError.message);
  }

  return { success: true, id: data.id };
}

export async function submitQuebecWaitlist(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  const province = String(formData.get("province") ?? "Quebec").trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("quebec_waitlist").insert({
    email,
    province,
    source: "quebec_legal_gate",
  });

  if (error) {
    console.error("[quebec-waitlist] persist failed:", error.message);
    return { error: "Could not save your request. Please try again." };
  }

  await supabase.from("early_access_leads").insert({
    name: "Quebec waitlist",
    email,
    role: "parent",
    province,
    interest: "parent_app",
    message: "Joined via Quebec legal gate — paid signup not yet available.",
    source: "quebec_legal_gate",
  });

  return { success: true };
}
