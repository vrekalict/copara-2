# Stripe setup for Copara

Copara uses **Stripe Checkout** for subscriptions with a **14-day free trial**, plus a **Customer Portal** for billing management. Webhooks keep subscription status in Supabase.

## 1. Create products and prices (Stripe Dashboard)

In [Stripe Dashboard → Products](https://dashboard.stripe.com/products), create **four recurring prices in CAD**:

| Copara plan        | Billing   | Amount   | Env variable                    |
| ------------------ | --------- | -------- | ------------------------------- |
| Parent Monthly     | Monthly   | $8 CAD   | `STRIPE_PRICE_PARENT_MONTHLY`   |
| Parent Yearly      | Yearly    | $72 CAD  | `STRIPE_PRICE_PARENT_YEARLY`    |
| Family Circle      | Monthly   | $12 CAD  | `STRIPE_PRICE_FAMILY_MONTHLY`   |
| Family Circle      | Yearly    | $108 CAD | `STRIPE_PRICE_FAMILY_YEARLY`    |

**Recommended product structure**

- One product: **Copara Parent** → two prices (monthly + yearly)
- One product: **Copara Family Circle** → two prices (monthly + yearly)

For each price:

1. Currency: **CAD**
2. Recurring billing interval: month or year
3. Copy the **Price ID** (`price_...`) into the matching env var

You do **not** need to configure the trial in the Dashboard — the app sets `trial_period_days: 14` on Checkout.

## 2. Environment variables

Add to `.env.local` (and Vercel/hosting env):

```env
# Stripe — server only
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe — client (optional; reserved for future Payment Element use)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (from Dashboard → Products → each price)
STRIPE_PRICE_PARENT_MONTHLY=price_...
STRIPE_PRICE_PARENT_YEARLY=price_...
STRIPE_PRICE_FAMILY_MONTHLY=price_...
STRIPE_PRICE_FAMILY_YEARLY=price_...

# Trial length (days). Default: 14
STRIPE_TRIAL_DAYS=14
```

**Security**

- Never commit real keys. `.env.example` uses placeholders only.
- Prefer a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys) in production with only the permissions you need (Customers, Checkout Sessions, Subscriptions, Billing Portal, Webhooks read).

## 3. Customer Portal

In [Stripe Dashboard → Settings → Billing → Customer portal](https://dashboard.stripe.com/settings/billing/portal):

1. Enable the portal
2. Allow customers to **update payment methods**
3. Allow **cancel subscriptions** (at period end recommended)
4. Allow **switch plans** if you want self-serve upgrades (optional)

Return URL is set in code to `{SITE_URL}/account/billing`.

## 4. Webhook endpoint

### Production (e.g. `https://copara.ca`)

1. [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint**: `https://copara.ca/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. Copy the **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Local development (Stripe CLI)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the `whsec_...` secret printed by `stripe listen` as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

Trigger test events:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## 5. Signup flow (how it works in the app)

1. User picks a plan on `/pricing` → `/sign-up?plan=parent_monthly` (etc.)
2. Account created → `/subscribe?plan=...` → Stripe Checkout (14-day trial, card required)
3. Webhook writes row to `subscriptions` and sets `profiles.stripe_customer_id`
4. User completes onboarding → `/app` (gated on active/trialing subscription)
5. **Family Circle**: paying parent’s subscription is linked to their circle after circle creation; co-parent gets access without a separate subscription
6. **Referrals**: pro links use `/sign-up?ref=CODE`; bonus marks eligible on first paid invoice after trial (`invoice.paid` with `billing_reason=subscription_cycle`)

## 6. Apply database migration

```bash
supabase db push
```

Migration: `supabase/migrations/20260704260000_stripe_subscriptions.sql`

## 7. Go-live checklist

- [ ] Switch Stripe to **Live mode**; use live `sk_live_`, `pk_live_`, and live price IDs
- [ ] Create production webhook pointing to production URL
- [ ] Set all env vars on Vercel (or your host)
- [ ] Enable Stripe Tax for Canadian GST/HST if required ([Stripe Tax](https://docs.stripe.com/tax))
- [ ] Test full flow: sign up → checkout → trial → onboarding → app → Customer Portal cancel
- [ ] Test co-parent invite with Family Circle plan (second parent should not need checkout)

## 8. Without Stripe keys (local dev only)

If `STRIPE_SECRET_KEY` is unset, subscription gating is **disabled** so you can develop other features. Add keys when testing billing.
