-- Vault document storage (25 MB max; images + PDF + Word).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vault-files',
  'vault-files',
  false,
  26214400,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "vault_files_select" on storage.objects;
create policy "vault_files_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'vault-files'
    and public.is_circle_member(public.storage_circle_id(name))
  );

drop policy if exists "vault_files_insert" on storage.objects;
create policy "vault_files_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'vault-files'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

drop policy if exists "vault_files_delete" on storage.objects;
create policy "vault_files_delete" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'vault-files'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

drop policy if exists "vault_items_delete" on public.vault_items;
create policy "vault_items_delete" on public.vault_items for delete
  using (public.circle_role(circle_id) = 'parent');

-- Marketing lead capture (service-role inserts only; RLS blocks client access).
create table if not exists public.early_access_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null,
  province text not null,
  interest text not null,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.early_access_leads enable row level security;
alter table public.contact_messages enable row level security;
