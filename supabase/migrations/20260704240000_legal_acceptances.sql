-- Legal acceptance records and Quebec waitlist support.

create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  province text,
  country text not null default 'CA',
  selected_language text not null default 'en',
  terms_version text not null,
  privacy_version text not null,
  french_terms_available boolean not null default false,
  french_privacy_available boolean not null default false,
  confirmed_french_access boolean not null default false,
  accepted_terms boolean not null default false,
  accepted_privacy boolean not null default false,
  accepted_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists legal_acceptances_user_id_idx on public.legal_acceptances (user_id);
create index if not exists legal_acceptances_email_idx on public.legal_acceptances (email);
create index if not exists legal_acceptances_accepted_at_idx on public.legal_acceptances (accepted_at desc);
create index if not exists legal_acceptances_province_idx on public.legal_acceptances (province);

alter table public.legal_acceptances enable row level security;

drop policy if exists "legal_acceptances_insert_own" on public.legal_acceptances;
create policy "legal_acceptances_insert_own"
  on public.legal_acceptances
  for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "legal_acceptances_select_own" on public.legal_acceptances;
create policy "legal_acceptances_select_own"
  on public.legal_acceptances
  for select
  to authenticated
  using (user_id = auth.uid());

-- Compliance audit events (legal acceptance and related events).
create table if not exists public.compliance_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists compliance_events_user_id_idx on public.compliance_events (user_id);
create index if not exists compliance_events_event_type_idx on public.compliance_events (event_type);
create index if not exists compliance_events_created_at_idx on public.compliance_events (created_at desc);

alter table public.compliance_events enable row level security;

drop policy if exists "compliance_events_insert_own" on public.compliance_events;
create policy "compliance_events_insert_own"
  on public.compliance_events
  for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

-- Quebec waitlist / marketing leads: add source tracking.
alter table public.early_access_leads
  add column if not exists source text not null default 'early_access';

create index if not exists early_access_leads_source_idx
  on public.early_access_leads (source);

create index if not exists early_access_leads_email_idx
  on public.early_access_leads (email);

-- Dedicated Quebec legal-gate waitlist (email-only capture).
create table if not exists public.quebec_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  province text not null default 'Quebec',
  source text not null default 'quebec_legal_gate',
  created_at timestamptz not null default now()
);

create index if not exists quebec_waitlist_email_idx on public.quebec_waitlist (email);
create index if not exists quebec_waitlist_created_at_idx on public.quebec_waitlist (created_at desc);

alter table public.quebec_waitlist enable row level security;
