import type { SupabaseClient } from "@supabase/supabase-js";
import { isApprovedPartner } from "@/lib/pro/partner";
import {
  generateUniqueReferralSlug,
  isLegacyReferralCode,
  isReferralSlugAvailable,
  slugifyReferralSource,
  validateReferralSlug,
} from "@/lib/pro/referral-slug";

export type ReferralStatus = "pending" | "signed_up" | "subscribed" | "ineligible";
export type BonusStatus = "pending" | "eligible" | "paid" | "ineligible";

export type ProfessionalReferral = {
  id: string;
  referredEmail: string;
  referredName: string | null;
  status: ReferralStatus;
  bonusAmountCad: number | null;
  bonusStatus: BonusStatus;
  bonusIneligibleReason: string | null;
  source: string;
  createdAt: string;
  signedUpAt: string | null;
  subscribedAt: string | null;
};

function normalizeRef(ref: string) {
  return ref.trim().toLowerCase();
}

async function getPracticeNameForUser(
  supabase: SupabaseClient,
  userId: string,
  profile: {
    practice_name?: string | null;
    partner_application_id?: string | null;
    display_name?: string | null;
  },
): Promise<string> {
  if (profile.practice_name?.trim()) {
    return profile.practice_name.trim();
  }

  if (profile.partner_application_id) {
    const { data: app } = await supabase
      .from("professional_partner_applications")
      .select("practice")
      .eq("id", profile.partner_application_id)
      .maybeSingle();

    if (app?.practice) {
      return app.practice as string;
    }
  }

  if (profile.display_name?.trim()) {
    return profile.display_name.trim();
  }

  return `partner-${userId.slice(0, 8)}`;
}

/** Practice name for dashboard form — empty when unset (no generated fallback). */
export async function getPartnerPracticeNameForDisplay(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("practice_name, partner_application_id")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.practice_name?.trim()) {
    return profile.practice_name.trim();
  }

  if (profile?.partner_application_id) {
    const { data: app } = await supabase
      .from("professional_partner_applications")
      .select("practice")
      .eq("id", profile.partner_application_id)
      .maybeSingle();

    if (app?.practice) {
      return app.practice as string;
    }
  }

  return "";
}

export async function updatePartnerPracticeProfile(
  supabase: SupabaseClient,
  userId: string,
  input: { practiceName: string; slug: string },
): Promise<{ success: true; slug: string } | { error: string }> {
  const practiceName = input.practiceName.trim();
  if (!practiceName) {
    return { error: "Company name is required." };
  }

  let slug = slugifyReferralSource(input.slug);
  if (!slug || slug.length < 3) {
    try {
      slug = await generateUniqueReferralSlug(supabase, practiceName, userId);
    } catch {
      return { error: "Could not generate a referral link from your company name." };
    }
  } else {
    const check = await checkReferralSlugAvailability(supabase, slug, userId);
    if (!check.available) {
      return { error: check.error ?? "This link is unavailable." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      practice_name: practiceName,
      referral_slug: slug,
      referral_code: slug,
    })
    .eq("id", userId);

  if (error) {
    console.error("[referrals] practice profile update failed:", error.message);
    return { error: "Could not save your profile." };
  }

  return { success: true, slug };
}

export async function ensureReferralSlugForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "referral_slug, referral_code, practice_name, partner_application_id, partner_approved_at, display_name",
    )
    .eq("id", userId)
    .maybeSingle();

  if (!isApprovedPartner(profile)) {
    throw new Error("Partner access is not approved.");
  }

  if (profile?.referral_slug) {
    return profile.referral_slug as string;
  }

  const practiceName = await getPracticeNameForUser(supabase, userId, profile ?? {});
  const slug = await generateUniqueReferralSlug(supabase, practiceName, userId);

  const { error } = await supabase
    .from("profiles")
    .update({ referral_slug: slug, referral_code: slug })
    .eq("id", userId);

  if (error) {
    throw new Error("Could not assign referral slug.");
  }

  return slug;
}

/** @deprecated Use getReferralSlugForUser */
export async function getReferralCodeForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  return ensureReferralSlugForUser(supabase, userId);
}

export async function getReferralSlugForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  return ensureReferralSlugForUser(supabase, userId);
}

export async function findProfessionalByReferralRef(
  supabase: SupabaseClient,
  ref: string,
): Promise<{ id: string; referralSlug: string } | null> {
  const normalized = normalizeRef(ref);

  const { data: bySlug } = await supabase
    .from("profiles")
    .select("id, referral_slug, partner_approved_at")
    .eq("referral_slug", normalized)
    .maybeSingle();

  if (bySlug?.partner_approved_at && bySlug.referral_slug) {
    return { id: bySlug.id as string, referralSlug: bySlug.referral_slug as string };
  }

  const { data: byCode } = await supabase
    .from("profiles")
    .select("id, referral_code, referral_slug, partner_approved_at")
    .eq("referral_code", normalized)
    .maybeSingle();

  if (!byCode?.partner_approved_at) return null;

  const slug =
    (byCode.referral_slug as string | null) ??
    (isLegacyReferralCode(normalized) ? null : normalized);

  if (!slug && byCode.referral_code) {
    return {
      id: byCode.id as string,
      referralSlug: byCode.referral_code as string,
    };
  }

  if (slug) {
    return { id: byCode.id as string, referralSlug: slug };
  }

  return null;
}

export async function findProfessionalByReferralCode(
  supabase: SupabaseClient,
  code: string,
): Promise<{ id: string; referralCode: string } | null> {
  const professional = await findProfessionalByReferralRef(supabase, code);
  if (!professional) return null;
  return { id: professional.id, referralCode: professional.referralSlug };
}

export async function checkReferralSlugAvailability(
  supabase: SupabaseClient,
  slug: string,
  userId: string,
): Promise<{ available: boolean; error?: string }> {
  const validation = validateReferralSlug(slug);
  if (validation) return { available: false, error: validation };

  const available = await isReferralSlugAvailable(supabase, slug, userId);
  if (!available) {
    return { available: false, error: "This link is already taken. Try another." };
  }

  return { available: true };
}

export async function updatePartnerReferralSlug(
  supabase: SupabaseClient,
  userId: string,
  slugInput: string,
): Promise<{ success: true; slug: string } | { error: string }> {
  const slug = slugifyReferralSource(slugInput);
  const check = await checkReferralSlugAvailability(supabase, slug, userId);
  if (!check.available) {
    return { error: check.error ?? "This link is unavailable." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ referral_slug: slug, referral_code: slug })
    .eq("id", userId);

  if (error) {
    console.error("[referrals] slug update failed:", error.message);
    return { error: "Could not update your referral link." };
  }

  return { success: true, slug };
}

export async function recordProfessionalReferral(
  supabase: SupabaseClient,
  input: {
    professionalId: string;
    referralCode: string;
    referredEmail: string;
    referredName?: string;
    source?: string;
    initialStatus?: ReferralStatus;
  },
) {
  const email = input.referredEmail.trim().toLowerCase();
  if (!email) return { error: "Email required." };

  const { data: existing } = await supabase
    .from("professional_referrals")
    .select("id, status")
    .eq("professional_id", input.professionalId)
    .eq("referred_email", email)
    .maybeSingle();

  if (existing) {
    if (input.initialStatus === "signed_up" && existing.status === "pending") {
      await supabase
        .from("professional_referrals")
        .update({ status: "signed_up", signed_up_at: new Date().toISOString() })
        .eq("id", existing.id as string);
    }
    return { success: true, id: existing.id as string, duplicate: true };
  }

  const status = input.initialStatus ?? "pending";
  const now = status === "signed_up" ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from("professional_referrals")
    .insert({
      professional_id: input.professionalId,
      referral_code: normalizeRef(input.referralCode),
      referred_email: email,
      referred_name: input.referredName?.trim() || null,
      source: input.source ?? "referral_link",
      status,
      signed_up_at: now,
      bonus_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[referrals] insert failed:", error.message);
    return { error: "Could not record referral." };
  }

  return { success: true, id: data.id as string };
}

export async function getProfessionalReferrals(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfessionalReferral[]> {
  const { data, error } = await supabase
    .from("professional_referrals")
    .select(
      "id, referred_email, referred_name, status, bonus_amount_cad, bonus_status, bonus_ineligible_reason, source, created_at, signed_up_at, subscribed_at",
    )
    .eq("professional_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[referrals] list failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    referredEmail: row.referred_email as string,
    referredName: (row.referred_name as string | null) ?? null,
    status: row.status as ReferralStatus,
    bonusAmountCad: row.bonus_amount_cad != null ? Number(row.bonus_amount_cad) : null,
    bonusStatus: row.bonus_status as BonusStatus,
    bonusIneligibleReason: (row.bonus_ineligible_reason as string | null) ?? null,
    source: row.source as string,
    createdAt: row.created_at as string,
    signedUpAt: (row.signed_up_at as string | null) ?? null,
    subscribedAt: (row.subscribed_at as string | null) ?? null,
  }));
}

export function referralStats(referrals: ProfessionalReferral[]) {
  const pending = referrals.filter((r) => r.status === "pending").length;
  const signedUp = referrals.filter((r) => r.status === "signed_up").length;
  const subscribed = referrals.filter((r) => r.status === "subscribed").length;
  const bonusEligible = referrals.filter((r) => r.bonusStatus === "eligible").length;
  const bonusPaid = referrals.filter((r) => r.bonusStatus === "paid").length;
  const potentialBonus = referrals
    .filter((r) => r.bonusStatus === "eligible")
    .reduce((sum, r) => sum + (r.bonusAmountCad ?? 0), 0);

  return { pending, signedUp, subscribed, bonusEligible, bonusPaid, potentialBonus, total: referrals.length };
}

export function buildReferralUrl(siteUrl: string, slug: string) {
  const base = siteUrl.replace(/\/$/, "");
  const normalized = slugifyReferralSource(slug);
  return `${base}/r/${encodeURIComponent(normalized)}`;
}

export function buildLegacyReferralSignupUrl(siteUrl: string, ref: string) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/sign-up?ref=${encodeURIComponent(ref.trim().toLowerCase())}`;
}
