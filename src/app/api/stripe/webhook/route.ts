import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe/client";
import {
  ensureStripeCustomerOnProfile,
  subscriptionRowFromStripe,
  upsertSubscription,
} from "@/lib/stripe/sync";
import { findProfessionalByReferralRef } from "@/lib/pro/referrals";
import { linkReferralToUser, processReferralFirstInvoice } from "@/lib/pro/referral-bonus";

export const runtime = "nodejs";

async function markReferralSignedUp(
  email: string,
  referralCode: string | undefined,
  userId?: string | null,
) {
  if (!referralCode) return;

  const supabase = createServiceClient();
  const professional = await findProfessionalByReferralRef(supabase, referralCode);
  if (!professional) return;

  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("professional_referrals")
    .select("id, status")
    .eq("professional_id", professional.id)
    .eq("referred_email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    if (existing.status === "pending") {
      await supabase
        .from("professional_referrals")
        .update({
          status: "signed_up",
          signed_up_at: now,
          ...(userId ? { referred_user_id: userId } : {}),
        })
        .eq("id", existing.id as string);
    }
    return;
  }

  await supabase.from("professional_referrals").insert({
    professional_id: professional.id,
    referral_code: professional.referralSlug,
    referred_email: normalizedEmail,
    referred_user_id: userId ?? null,
    status: "signed_up",
    signed_up_at: now,
    source: "referral_link",
    bonus_status: "pending",
  });
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  userId: string,
  circleId: string | null = null,
) {
  const supabase = createServiceClient();
  const row = subscriptionRowFromStripe(subscription, userId, circleId);
  await upsertSubscription(supabase, row);
  await ensureStripeCustomerOnProfile(supabase, userId, row.stripe_customer_id);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          session.client_reference_id ?? session.metadata?.userId ?? null;
        const referralCode = session.metadata?.referralCode;

        if (session.customer_email && referralCode) {
          await markReferralSignedUp(session.customer_email, referralCode, userId);
        }

        if (userId && session.customer_email) {
          await linkReferralToUser(supabase, session.customer_email, userId);
        }

        if (userId && typeof session.subscription === "string") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await syncSubscription(subscription, userId);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await syncSubscription(subscription, userId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await syncSubscription(subscription, userId);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.amount_paid > 0) {
          await processReferralFirstInvoice(supabase, invoice);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
