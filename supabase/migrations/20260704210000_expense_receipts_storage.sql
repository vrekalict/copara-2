-- Expense receipt images/PDFs (25 MB max).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'expense-receipts',
  'expense-receipts',
  false,
  26214400,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path layout: {circle_id}/{file_id}.{ext}
create or replace function public.storage_circle_id(object_path text)
returns uuid
language sql
immutable
as $$
  select split_part(object_path, '/', 1)::uuid;
$$;

drop policy if exists "expense_receipts_select" on storage.objects;
create policy "expense_receipts_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'expense-receipts'
    and public.is_circle_member(public.storage_circle_id(name))
    and public.can_view_finance(public.storage_circle_id(name))
  );

drop policy if exists "expense_receipts_insert" on storage.objects;
create policy "expense_receipts_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'expense-receipts'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

drop policy if exists "expense_receipts_delete" on storage.objects;
create policy "expense_receipts_delete" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'expense-receipts'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );
