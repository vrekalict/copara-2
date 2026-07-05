-- Stripe subscriptions for parent and family plans.

alter table public.profiles
  add column if not exists stripe_customer_id text;

create unique index if not exists profiles_stripe_customer_id_unique
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  circle_id uuid references public.circles (id) on delete set null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  stripe_price_id text not null,
  plan_key text not null check (
    plan_key in ('parent_monthly', 'parent_yearly', 'family_monthly', 'family_yearly')
  ),
  status text not null,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists subscriptions_stripe_subscription_id_unique
  on public.subscriptions (stripe_subscription_id);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_circle_id_idx on public.subscriptions (circle_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "subscriptions_select_circle_member"
  on public.subscriptions for select
  using (
    circle_id is not null
    and exists (
      select 1
      from public.circle_members cm
      where cm.circle_id = subscriptions.circle_id
        and cm.user_id = auth.uid()
        and cm.status = 'active'
    )
  );
