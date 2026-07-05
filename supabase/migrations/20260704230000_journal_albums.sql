-- Journal: circle-scoped family updates with optional media.
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  child_id uuid references public.children (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists journal_entries_circle_id_created_at_idx
  on public.journal_entries (circle_id, created_at desc);

create table if not exists public.journal_media (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.journal_entries (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  file_path text not null,
  mime text not null,
  created_at timestamptz not null default now()
);
create index if not exists journal_media_entry_id_idx on public.journal_media (entry_id);

-- Albums: private photo galleries per circle.
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references public.circles (id) on delete cascade,
  title text not null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists albums_circle_id_idx on public.albums (circle_id);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  circle_id uuid not null references public.circles (id) on delete cascade,
  file_path text not null,
  mime text not null,
  caption text,
  uploaded_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);
create index if not exists album_photos_album_id_idx on public.album_photos (album_id);

alter table public.journal_entries enable row level security;
alter table public.journal_media enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;

drop policy if exists "journal_entries_select" on public.journal_entries;
create policy "journal_entries_select" on public.journal_entries for select
  using (public.is_circle_member(circle_id));

drop policy if exists "journal_entries_insert" on public.journal_entries;
create policy "journal_entries_insert" on public.journal_entries for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    and created_by = auth.uid()
  );

drop policy if exists "journal_entries_delete" on public.journal_entries;
create policy "journal_entries_delete" on public.journal_entries for delete
  using (
    public.circle_role(circle_id) = 'parent'
    and created_by = auth.uid()
  );

drop policy if exists "journal_media_select" on public.journal_media;
create policy "journal_media_select" on public.journal_media for select
  using (public.is_circle_member(circle_id));

drop policy if exists "journal_media_insert" on public.journal_media;
create policy "journal_media_insert" on public.journal_media for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    and exists (
      select 1 from public.journal_entries e
      where e.id = entry_id
        and e.circle_id = circle_id
        and e.created_by = auth.uid()
    )
  );

drop policy if exists "journal_media_delete" on public.journal_media;
create policy "journal_media_delete" on public.journal_media for delete
  using (public.circle_role(circle_id) = 'parent');

drop policy if exists "albums_select" on public.albums;
create policy "albums_select" on public.albums for select
  using (public.is_circle_member(circle_id));

drop policy if exists "albums_insert" on public.albums;
create policy "albums_insert" on public.albums for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    and created_by = auth.uid()
  );

drop policy if exists "albums_update" on public.albums;
create policy "albums_update" on public.albums for update
  using (public.circle_role(circle_id) = 'parent');

drop policy if exists "albums_delete" on public.albums;
create policy "albums_delete" on public.albums for delete
  using (public.circle_role(circle_id) = 'parent');

drop policy if exists "album_photos_select" on public.album_photos;
create policy "album_photos_select" on public.album_photos for select
  using (public.is_circle_member(circle_id));

drop policy if exists "album_photos_insert" on public.album_photos;
create policy "album_photos_insert" on public.album_photos for insert
  with check (
    public.circle_role(circle_id) = 'parent'
    and uploaded_by = auth.uid()
  );

drop policy if exists "album_photos_delete" on public.album_photos;
create policy "album_photos_delete" on public.album_photos for delete
  using (public.circle_role(circle_id) = 'parent');

-- Journal media bucket (images + short video clips, 25 MB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'journal-media',
  'journal-media',
  false,
  26214400,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "journal_media_storage_select" on storage.objects;
create policy "journal_media_storage_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'journal-media'
    and public.is_circle_member(public.storage_circle_id(name))
  );

drop policy if exists "journal_media_storage_insert" on storage.objects;
create policy "journal_media_storage_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'journal-media'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

drop policy if exists "journal_media_storage_delete" on storage.objects;
create policy "journal_media_storage_delete" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'journal-media'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

-- Album photos bucket (images only, 25 MB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'album-photos',
  'album-photos',
  false,
  26214400,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "album_photos_storage_select" on storage.objects;
create policy "album_photos_storage_select" on storage.objects for select
  to authenticated
  using (
    bucket_id = 'album-photos'
    and public.is_circle_member(public.storage_circle_id(name))
  );

drop policy if exists "album_photos_storage_insert" on storage.objects;
create policy "album_photos_storage_insert" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'album-photos'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );

drop policy if exists "album_photos_storage_delete" on storage.objects;
create policy "album_photos_storage_delete" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'album-photos'
    and public.circle_role(public.storage_circle_id(name)) = 'parent'
  );
