"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, stripeConfigured } from "@/lib/stripe/client";
import {
  getStripePriceId,
  isPlanKey,
  PLAN_LABELS,
  STRIPE_TRIAL_DAYS,
  type PlanKey,
} from "@/lib/stripe/config";
import { getAppAccess } from "@/lib/stripe/access";
import { SITE } from "@/lib/marketing/site";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url).replace(/\/$/, "");
}

async function getOrCreateStripeCustomer(userId: string, email: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id as string;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
}

export async function createCheckoutSession(planKey: string, referralCode?: string) {
  if (!stripeConfigured()) {
    return { error: "Billing is not configured yet. Please contact support." };
  }

  if (!isPlanKey(planKey)) {
    return { error: "Invalid plan selected." };
  }

  const priceId = getStripePriceId(planKey);
  if (!priceId) {
    return { error: "This plan is not available yet. Please contact support." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(`/sign-in?next=${encodeURIComponent(`/subscribe?plan=${planKey}`)}`);
  }

  const access = await getAppAccess(supabase, user.id);
  if (access.hasAccess) {
    redirect("/onboarding/circle");
  }

  const customerId = await getOrCreateStripeCustomer(user.id, user.email);
  const stripe = getStripe();
  const origin = (await headers()).get("origin") ?? siteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: STRIPE_TRIAL_DAYS,
      metadata: {
        userId: user.id,
        planKey,
        ...(referralCode ? { referralCode: referralCode.trim().toLowerCase() } : {}),
      },
    },
    metadata: {
      userId: user.id,
      planKey,
      ...(referralCode ? { referralCode: referralCode.trim().toLowerCase() } : {}),
    },
    success_url: `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/subscribe?plan=${planKey}`,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return { error: "Could not start checkout. Please try again." };
  }

  redirect(session.url);
}

export async function createBillingPortalSession() {
  if (!stripeConfigured()) {
    return { error: "Billing is not configured yet." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/account/billing");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return { error: "No billing account found. Start a subscription first." };
  }

  const stripe = getStripe();
  const origin = (await headers()).get("origin") ?? siteUrl();

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id as string,
    return_url: `${origin}/account/billing`,
  });

  redirect(session.url);
}

export async function getSubscribePlanDetails(planKey: string) {
  if (!isPlanKey(planKey)) return null;
  return {
    key: planKey,
    label: PLAN_LABELS[planKey],
    trialDays: STRIPE_TRIAL_DAYS,
  };
}
