-- Message attachments bucket (25 MB max; images, PDF, Word docs).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'message-attachments',
  'message-attachments',
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

-- Path layout: {circle_id}/{thread_id}/{file_id}.{ext}
create or replace function public.storage_thread_id(object_path text)
returns uuid
language sql
immutable
as $$
  select split_part(object_path, '/', 2)::uuid;
$$;

drop policy if exists "message_attachments_select" on storage.objects;
create policy "message_attachments_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'message-attachments'
    and public.is_thread_participant(public.storage_thread_id(name))
  );

drop policy if exists "message_attachments_insert" on storage.objects;
create policy "message_attachments_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'message-attachments'
    and public.is_thread_participant(public.storage_thread_id(name))
  );

drop policy if exists "message_attachments_update" on storage.objects;
create policy "message_attachments_update" on storage.objects for update
  to authenticated
  using (
    bucket_id = 'message-attachments'
    and public.is_thread_participant(public.storage_thread_id(name))
  );

drop policy if exists "message_attachments_delete" on storage.objects;
create policy "message_attachments_delete" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'message-attachments'
    and public.is_thread_participant(public.storage_thread_id(name))
  );
