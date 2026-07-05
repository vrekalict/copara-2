-- Exports PDF bucket (50 MB max; PDF only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exports',
  'exports',
  false,
  52428800,
  array['application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path layout: {circle_id}/{export_id}.pdf
drop policy if exists "exports_storage_select" on storage.objects;
create policy "exports_storage_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'exports'
    and public.is_circle_member(split_part(name, '/', 1)::uuid)
  );

drop policy if exists "exports_storage_insert" on storage.objects;
create policy "exports_storage_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'exports'
    and public.is_circle_member(split_part(name, '/', 1)::uuid)
  );

-- Allow circle creator to bootstrap themselves as professional (pro signup flow).
drop policy if exists "circle_members_insert" on public.circle_members;
create policy "circle_members_insert" on public.circle_members for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    or (
      user_id = auth.uid()
      and role = 'parent'
      and exists (
        select 1 from public.circles
        where id = circle_id
          and created_by = auth.uid()
      )
    )
    or (
      user_id = auth.uid()
      and role = 'professional'
      and exists (
        select 1 from public.circles
        where id = circle_id
          and created_by = auth.uid()
      )
    )
  );

-- Professionals: read-only access to all circle threads and messages.
drop policy if exists "threads_select" on public.threads;
create policy "threads_select" on public.threads for select
  using (
    public.is_thread_participant(id)
    or (
      public.is_circle_member(circle_id)
      and public.circle_role(circle_id) = 'professional'
    )
  );

drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select
  using (
    public.is_thread_participant(thread_id)
    or exists (
      select 1 from public.threads
      where threads.id = thread_id
        and public.is_circle_member(threads.circle_id)
        and public.circle_role(threads.circle_id) = 'professional'
    )
  );

drop policy if exists "thread_participants_select" on public.thread_participants;
create policy "thread_participants_select" on public.thread_participants for select
  using (
    public.is_thread_participant(thread_id)
    or exists (
      select 1 from public.threads
      where threads.id = thread_id
        and public.is_circle_member(threads.circle_id)
        and public.circle_role(threads.circle_id) = 'professional'
    )
  );
