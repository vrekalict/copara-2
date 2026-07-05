-- Track partner approval email sends for admin resend workflow.

alter table public.professional_partner_applications
  add column if not exists approval_email_sent_count integer not null default 0,
  add column if not exists approval_email_last_sent_at timestamptz;
