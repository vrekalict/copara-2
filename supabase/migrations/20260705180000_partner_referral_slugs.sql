-- Vanity partner referral slugs for /r/{slug} links.

alter table public.profiles
  add column if not exists referral_slug text;

create unique index if not exists profiles_referral_slug_unique
  on public.profiles (referral_slug)
  where referral_slug is not null;

-- Backfill practice_name from partner applications where missing.
update public.profiles p
set practice_name = a.practice
from public.professional_partner_applications a
where p.partner_application_id = a.id
  and p.partner_approved_at is not null
  and (p.practice_name is null or trim(p.practice_name) = '');

-- Slug assignment runs in app (ensureReferralSlugForUser) to avoid name collisions.
