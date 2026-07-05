-- Admin tracking for partner referral bonus payouts.

alter table public.professional_referrals
  add column if not exists bonus_paid_at timestamptz,
  add column if not exists bonus_paid_by uuid references public.profiles (id) on delete set null;

create index if not exists professional_referrals_bonus_status_idx
  on public.professional_referrals (bonus_status);

create index if not exists professional_referrals_bonus_paid_at_idx
  on public.professional_referrals (bonus_paid_at desc)
  where bonus_paid_at is not null;
