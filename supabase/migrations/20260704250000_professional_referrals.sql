-- Professional partner referral program.

alter table public.profiles
  add column if not exists referral_code text,
  add column if not exists practice_name text,
  add column if not exists practice_location text;

create unique index if not exists profiles_referral_code_unique
  on public.profiles (referral_code)
  where referral_code is not null;

create table if not exists public.professional_referrals (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.profiles (id) on delete cascade,
  referral_code text not null,
  referred_email text not null,
  referred_name text,
  status text not null default 'pending',
  bonus_amount_cad numeric,
  bonus_status text not null default 'pending',
  source text not null default 'referral_link',
  notes text,
  created_at timestamptz not null default now(),
  signed_up_at timestamptz,
  subscribed_at timestamptz
);

create index if not exists professional_referrals_professional_id_idx
  on public.professional_referrals (professional_id);

create index if not exists professional_referrals_referral_code_idx
  on public.professional_referrals (referral_code);

create index if not exists professional_referrals_referred_email_idx
  on public.professional_referrals (referred_email);

create index if not exists professional_referrals_status_idx
  on public.professional_referrals (status);

alter table public.professional_referrals enable row level security;

drop policy if exists "professional_referrals_select_own" on public.professional_referrals;
create policy "professional_referrals_select_own"
  on public.professional_referrals
  for select
  to authenticated
  using (professional_id = auth.uid());

-- Partner access applications (separate from parent early access).
create table if not exists public.professional_partner_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null,
  last_name text not null,
  location text not null,
  practice text not null,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists professional_partner_applications_email_idx
  on public.professional_partner_applications (email);

alter table public.professional_partner_applications enable row level security;
