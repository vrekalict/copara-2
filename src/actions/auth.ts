"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { recordLegalAcceptance } from "@/actions/legal/acceptance";
import { createClient } from "@/lib/supabase/server";

function nextPath(formData: FormData) {
  const value = String(formData.get("next") ?? "");
  return value.startsWith("/") ? value : "/app";
}

function parseLegalFromForm(formData: FormData) {
  const province = String(formData.get("province") ?? "").trim();
  const acceptedLegal = formData.get("acceptedLegal") === "true";
  const confirmedFrenchAccess = formData.get("confirmedFrenchAccess") === "true";

  return { province, acceptedTerms: acceptedLegal, acceptedPrivacy: acceptedLegal, confirmedFrenchAccess };
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = nextPath(formData);
  const origin = (await headers()).get("origin");
  const legal = parseLegalFromForm(formData);

  if (!legal.province) {
    return { error: "Please select your province or territory." };
  }

  if (!legal.acceptedTerms || !legal.acceptedPrivacy) {
    return { error: "You must agree to the Terms and Privacy Policy." };
  }

  if (
    legal.province.trim().toLowerCase() === "quebec" &&
    !legal.confirmedFrenchAccess
  ) {
    return {
      error:
        "Quebec users must confirm access to the French legal documents before continuing in English.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });

  if (error) {
    return { error: error.message };
  }

  await recordLegalAcceptance({
    email,
    province: legal.province,
    confirmedFrenchAccess: legal.confirmedFrenchAccess,
    acceptedTerms: legal.acceptedTerms,
    acceptedPrivacy: legal.acceptedPrivacy,
    userId: data.user?.id ?? null,
  }).then((result) => {
    if (result.error) {
      console.error("[auth] legal acceptance failed after signup:", result.error);
    }
  });

  if (!data.session) {
    return { confirmEmail: true };
  }

  redirect(next);
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = nextPath(formData);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next);
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const next = nextPath(formData);
  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });

  if (error) {
    return { error: error.message };
  }

  return { sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
