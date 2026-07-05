-- Blog CMS: posts stored in Supabase, edited via /admin/blog

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  category text not null check (
    category in ('Communication', 'Schedules', 'Expenses', 'Records', 'Professionals')
  ),
  author text not null default 'Copara Editorial',
  seo_description text not null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  cover_image_path text,
  published_at date not null default current_date,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts
  for select
  using (status = 'published');

-- Public blog cover images (optional; uploads via admin service role)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_images_public_read" on storage.objects;
create policy "blog_images_public_read" on storage.objects
  for select
  using (bucket_id = 'blog-images');
