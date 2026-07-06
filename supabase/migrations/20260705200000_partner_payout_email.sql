-- Partner e-transfer payout email (may differ from sign-in email).

alter table public.profiles
  add column if not exists payout_email text;

create index if not exists profiles_payout_email_idx
  on public.profiles (payout_email)
  where payout_email is not null;
