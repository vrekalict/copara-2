-- Accord MVP — initial schema, RLS policies, and triggers.
-- See .claude/PRD.md section 6 for the data model this implements.

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'en',
  role_default text,
  created_at timestamptz not null default now()
);

create table public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id),
  expense_split_default numeric not null default 50,
  timezone text not null default 'America/Toronto',
  created_at timestamptz not null default now()
);

create table public.circle_members (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  role text not null check (role in ('parent', 'third_party', 'professional')),
  invited_email text,
  status text not null default 'invited' check (status in ('invited', 'active', 'removed')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index circle_members_circle_id_idx on public.circle_members (circle_id);
create index circle_members_user_id_idx on public.circle_members (user_id);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  first_name text not null,
  dob date,
  notes_medical text,
  notes_school text,
  emergency_contacts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index children_circle_id_idx on public.children (circle_id);

-- Messaging (append-only)

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  title text,
  is_group boolean not null default false,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);
create index threads_circle_id_idx on public.threads (circle_id);

create table public.thread_participants (
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text,
  added_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);
create index thread_participants_user_id_idx on public.thread_participants (user_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text,
  attachments jsonb not null default '[]'::jsonb,
  prev_hash text,
  hash text not null,
  created_at timestamptz not null default now()
);
create index messages_thread_id_created_at_idx on public.messages (thread_id, created_at);
create index messages_body_fts_idx on public.messages using gin (to_tsvector('simple', coalesce(body, '')));

create table public.message_receipts (
  message_id uuid not null references public.messages (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  delivered_at timestamptz,
  read_at timestamptz,
  primary key (message_id, user_id)
);

-- Calendar

create table public.schedule_templates (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  name text not null,
  rrule text,
  parent_a_blocks jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index schedule_templates_circle_id_idx on public.schedule_templates (circle_id);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  type text not null check (type in ('event', 'parenting_time', 'exchange')),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  responsible_parent uuid references public.profiles (id),
  notes text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);
create index events_circle_id_starts_at_idx on public.events (circle_id, starts_at);

create table public.change_requests (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  event_id uuid references public.events (id) on delete set null,
  type text not null check (type in ('swap_day', 'time_change', 'location_change', 'other')),
  details jsonb not null default '{}'::jsonb,
  requested_by uuid not null references public.profiles (id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  responded_by uuid references public.profiles (id),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);
create index change_requests_circle_id_idx on public.change_requests (circle_id);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  checked_at timestamptz not null default now(),
  location_verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index checkins_circle_id_idx on public.checkins (circle_id);
create index checkins_event_id_idx on public.checkins (event_id);

create table public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  kind text not null check (kind in ('late', 'missed', 'unlogged', 'on_time')),
  delta_minutes int,
  detected_at timestamptz not null default now()
);
create index schedule_events_circle_id_idx on public.schedule_events (circle_id);

-- Expenses

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  created_by uuid not null references public.profiles (id),
  amount_cents int not null check (amount_cents >= 0),
  currency text not null default 'CAD',
  category text not null check (category in ('medical', 'school', 'activities', 'clothing', 'other')),
  description text,
  receipt_url text,
  split_pct numeric,
  incurred_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index expenses_circle_id_idx on public.expenses (circle_id);

create table public.reimbursement_requests (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references public.expenses (id) on delete cascade,
  requested_by uuid not null references public.profiles (id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'disputed', 'settled')),
  status_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index reimbursement_requests_expense_id_idx on public.reimbursement_requests (expense_id);

-- Vault

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  kind text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  file_url text,
  visibility jsonb not null default '{}'::jsonb,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);
create index vault_items_circle_id_idx on public.vault_items (circle_id);

-- AI + exports

create table public.ai_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  circle_id uuid not null references public.circles (id) on delete cascade,
  kind text not null check (kind in ('tone_review', 'rewrite_accepted', 'rewrite_rejected', 'summary')),
  input_hash text,
  output jsonb,
  model text,
  created_at timestamptz not null default now()
);
create index ai_events_circle_id_idx on public.ai_events (circle_id);
create index ai_events_user_id_idx on public.ai_events (user_id);

create table public.exports (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  requested_by uuid not null references public.profiles (id),
  kind text not null,
  params jsonb not null default '{}'::jsonb,
  file_url text,
  chain_digest text,
  created_at timestamptz not null default now()
);
create index exports_circle_id_idx on public.exports (circle_id);

-- Settings & push

create table public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  pwa_prompt_snoozed_until timestamptz,
  notif_prefs jsonb not null default '{}'::jsonb
);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  created_at timestamptz not null default now()
);
create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

-- ============================================================
-- Helper functions (security definer, used by RLS policies)
-- ============================================================

create or replace function public.is_circle_member(p_circle_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.circle_members
    where circle_id = p_circle_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.circle_role(p_circle_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.circle_members
  where circle_id = p_circle_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

create or replace function public.circle_permissions(p_circle_id uuid)
returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select permissions from public.circle_members
  where circle_id = p_circle_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

-- A professional's access to calendar/expense tables additionally requires
-- their circle_members.permissions ->> 'view_finance' = 'true' (PRD section 6).
create or replace function public.can_view_finance(p_circle_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select
    public.circle_role(p_circle_id) is distinct from 'professional'
    or coalesce(public.circle_permissions(p_circle_id) ->> 'view_finance', 'false') = 'true';
$$;

create or replace function public.is_thread_participant(p_thread_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.thread_participants
    where thread_id = p_thread_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create a profile (and default settings row) when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'locale', 'en')
  );

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- At most 2 parent members per circle.
create or replace function public.enforce_parent_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'parent' and new.status <> 'removed' then
    if (
      select count(*) from public.circle_members
      where circle_id = new.circle_id
        and role = 'parent'
        and status <> 'removed'
        and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) >= 2 then
      raise exception 'a circle can have at most 2 parent members';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_enforce_parent_limit
before insert or update on public.circle_members
for each row execute function public.enforce_parent_limit();

-- Messages: hash-chain computation, making exports tamper-evident.
create or replace function public.compute_message_hash()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prev_hash text;
begin
  select hash into v_prev_hash
  from public.messages
  where thread_id = new.thread_id
  order by created_at desc, id desc
  limit 1;

  new.prev_hash := coalesce(v_prev_hash, 'genesis');
  new.created_at := coalesce(new.created_at, now());
  new.hash := encode(
    digest(
      new.prev_hash || new.id::text || new.sender_id::text || coalesce(new.body, '') || new.created_at::text,
      'sha256'
    ),
    'hex'
  );
  return new;
end;
$$;

create trigger trg_compute_message_hash
before insert on public.messages
for each row execute function public.compute_message_hash();

-- Messages are append-only: block UPDATE/DELETE outright, even for the owner.
create or replace function public.block_message_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'messages are append-only and cannot be updated or deleted';
end;
$$;

create trigger trg_block_message_update
before update on public.messages
for each row execute function public.block_message_mutation();

create trigger trg_block_message_delete
before delete on public.messages
for each row execute function public.block_message_mutation();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.children enable row level security;
alter table public.threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.messages enable row level security;
alter table public.message_receipts enable row level security;
alter table public.schedule_templates enable row level security;
alter table public.events enable row level security;
alter table public.change_requests enable row level security;
alter table public.checkins enable row level security;
alter table public.schedule_events enable row level security;
alter table public.expenses enable row level security;
alter table public.reimbursement_requests enable row level security;
alter table public.vault_items enable row level security;
alter table public.ai_events enable row level security;
alter table public.exports enable row level security;
alter table public.user_settings enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles: visible to self and to anyone who shares a circle.
create policy "profiles_select" on public.profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.circle_members me
      join public.circle_members them on them.circle_id = me.circle_id
      where me.user_id = auth.uid()
        and me.status = 'active'
        and them.user_id = public.profiles.id
        and them.status = 'active'
    )
  );
create policy "profiles_insert_self" on public.profiles for insert
  with check (id = auth.uid());
create policy "profiles_update_self" on public.profiles for update
  using (id = auth.uid());

-- circles
create policy "circles_select" on public.circles for select
  using (public.is_circle_member(id));
create policy "circles_insert" on public.circles for insert
  with check (created_by = auth.uid());
create policy "circles_update" on public.circles for update
  using (public.circle_role(id) = 'parent');

-- circle_members: parents manage membership; members can see their circle roster.
create policy "circle_members_select" on public.circle_members for select
  using (public.is_circle_member(circle_id));
create policy "circle_members_insert" on public.circle_members for insert
  with check (public.circle_role(circle_id) = 'parent');
create policy "circle_members_update" on public.circle_members for update
  using (public.circle_role(circle_id) = 'parent');

-- children: parents manage; all active members can view.
create policy "children_select" on public.children for select
  using (public.is_circle_member(circle_id));
create policy "children_insert" on public.children for insert
  with check (public.circle_role(circle_id) = 'parent');
create policy "children_update" on public.children for update
  using (public.circle_role(circle_id) = 'parent');

-- threads
create policy "threads_select" on public.threads for select
  using (public.is_thread_participant(id));
create policy "threads_insert" on public.threads for insert
  with check (public.circle_role(circle_id) in ('parent', 'third_party'));

-- thread_participants
create policy "thread_participants_select" on public.thread_participants for select
  using (public.is_thread_participant(thread_id));
create policy "thread_participants_insert" on public.thread_participants for insert
  with check (
    exists (
      select 1 from public.threads
      where threads.id = thread_id
        and public.circle_role(threads.circle_id) = 'parent'
    )
  );

-- messages: append-only, participants only.
create policy "messages_select" on public.messages for select
  using (public.is_thread_participant(thread_id));
create policy "messages_insert" on public.messages for insert
  with check (public.is_thread_participant(thread_id) and sender_id = auth.uid());

-- message_receipts
create policy "message_receipts_select" on public.message_receipts for select
  using (
    exists (
      select 1 from public.messages
      where messages.id = message_id
        and public.is_thread_participant(messages.thread_id)
    )
  );
create policy "message_receipts_upsert" on public.message_receipts for insert
  with check (user_id = auth.uid());
create policy "message_receipts_update" on public.message_receipts for update
  using (user_id = auth.uid());

-- schedule_templates
create policy "schedule_templates_select" on public.schedule_templates for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));
create policy "schedule_templates_insert" on public.schedule_templates for insert
  with check (public.circle_role(circle_id) = 'parent');
create policy "schedule_templates_update" on public.schedule_templates for update
  using (public.circle_role(circle_id) = 'parent');

-- events
create policy "events_select" on public.events for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));
create policy "events_insert" on public.events for insert
  with check (public.circle_role(circle_id) in ('parent', 'third_party'));
create policy "events_update" on public.events for update
  using (public.circle_role(circle_id) in ('parent', 'third_party'));

-- change_requests
create policy "change_requests_select" on public.change_requests for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));
create policy "change_requests_insert" on public.change_requests for insert
  with check (public.circle_role(circle_id) = 'parent' and requested_by = auth.uid());
create policy "change_requests_update" on public.change_requests for update
  using (public.circle_role(circle_id) = 'parent');

-- checkins
create policy "checkins_select" on public.checkins for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));
create policy "checkins_insert" on public.checkins for insert
  with check (public.circle_role(circle_id) = 'parent' and user_id = auth.uid());

-- schedule_events: system-written (service role); members read only.
create policy "schedule_events_select" on public.schedule_events for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));

-- expenses: immutable once logged.
create policy "expenses_select" on public.expenses for select
  using (public.is_circle_member(circle_id) and public.can_view_finance(circle_id));
create policy "expenses_insert" on public.expenses for insert
  with check (public.circle_role(circle_id) = 'parent' and created_by = auth.uid());

-- reimbursement_requests
create policy "reimbursement_requests_select" on public.reimbursement_requests for select
  using (
    exists (
      select 1 from public.expenses
      where expenses.id = expense_id
        and public.is_circle_member(expenses.circle_id)
        and public.can_view_finance(expenses.circle_id)
    )
  );
create policy "reimbursement_requests_insert" on public.reimbursement_requests for insert
  with check (
    requested_by = auth.uid()
    and exists (
      select 1 from public.expenses
      where expenses.id = expense_id
        and public.circle_role(expenses.circle_id) = 'parent'
    )
  );
create policy "reimbursement_requests_update" on public.reimbursement_requests for update
  using (
    exists (
      select 1 from public.expenses
      where expenses.id = expense_id
        and public.circle_role(expenses.circle_id) = 'parent'
    )
  );

-- vault_items: parents have full access; others per per-item visibility.
create policy "vault_items_select" on public.vault_items for select
  using (
    public.is_circle_member(circle_id)
    and (
      public.circle_role(circle_id) = 'parent'
      or (visibility -> 'roles') ? public.circle_role(circle_id)
      or (visibility -> 'user_ids') ? auth.uid()::text
    )
  );
create policy "vault_items_insert" on public.vault_items for insert
  with check (public.circle_role(circle_id) = 'parent');
create policy "vault_items_update" on public.vault_items for update
  using (public.circle_role(circle_id) = 'parent');

-- ai_events: own events, or parents auditing their circle's AI usage.
create policy "ai_events_select" on public.ai_events for select
  using (user_id = auth.uid() or public.circle_role(circle_id) = 'parent');
create policy "ai_events_insert" on public.ai_events for insert
  with check (user_id = auth.uid());

-- exports: immutable log, any active circle member can generate/view.
create policy "exports_select" on public.exports for select
  using (public.is_circle_member(circle_id));
create policy "exports_insert" on public.exports for insert
  with check (public.is_circle_member(circle_id) and requested_by = auth.uid());

-- user_settings / push_subscriptions: strictly own-row.
create policy "user_settings_select" on public.user_settings for select
  using (user_id = auth.uid());
create policy "user_settings_update" on public.user_settings for update
  using (user_id = auth.uid());
create policy "user_settings_insert" on public.user_settings for insert
  with check (user_id = auth.uid());

create policy "push_subscriptions_select" on public.push_subscriptions for select
  using (user_id = auth.uid());
create policy "push_subscriptions_insert" on public.push_subscriptions for insert
  with check (user_id = auth.uid());
create policy "push_subscriptions_delete" on public.push_subscriptions for delete
  using (user_id = auth.uid());
