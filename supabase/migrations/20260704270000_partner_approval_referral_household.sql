-- Partner approval workflow + referral household bonus tracking.

alter table public.profiles
  add column if not exists partner_approved_at timestamptz,
  add column if not exists partner_application_id uuid;

alter table public.professional_partner_applications
  add column if not exists status text not null default 'pending',
  add column if not exists user_id uuid references public.profiles (id) on delete set null,
  add column if not exists approval_token text,
  add column if not exists approval_token_expires_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists rejection_reason text;

alter table public.professional_partner_applications
  drop constraint if exists professional_partner_applications_status_check;

alter table public.professional_partner_applications
  add constraint professional_partner_applications_status_check
  check (status in ('pending', 'approved', 'rejected', 'activated'));

create unique index if not exists professional_partner_applications_approval_token_unique
  on public.professional_partner_applications (approval_token)
  where approval_token is not null;

create index if not exists professional_partner_applications_status_idx
  on public.professional_partner_applications (status);

alter table public.professional_referrals
  add column if not exists referred_user_id uuid references public.profiles (id) on delete set null,
  add column if not exists household_key text,
  add column if not exists first_invoice_cents integer,
  add column if not exists bonus_ineligible_reason text;

create index if not exists professional_referrals_referred_user_id_idx
  on public.professional_referrals (referred_user_id);

create index if not exists professional_referrals_household_key_idx
  on public.professional_referrals (professional_id, household_key);

-- One paid bonus claim per professional per household.
create unique index if not exists professional_referrals_one_bonus_per_household
  on public.professional_referrals (professional_id, household_key)
  where household_key is not null
    and bonus_status in ('eligible', 'paid');
