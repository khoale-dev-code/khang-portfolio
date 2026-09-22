-- KHANG Portfolio CMS / Supabase schema
-- Run this file once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  content jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Existing-install compatibility: CREATE TABLE IF NOT EXISTS does not
-- add new columns to an already-created table.
alter table public.site_sections
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

alter table public.site_sections
  add column if not exists updated_at timestamptz not null default now();
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  secure_url text not null,
  resource_type text not null default 'image',
  width integer,
  height integer,
  bytes bigint,
  original_filename text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists site_sections_sort_idx on public.site_sections(sort_order);
create index if not exists media_assets_created_idx on public.media_assets(created_at desc);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.site_sections enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists "admin users can read own row" on public.admin_users;
create policy "admin users can read own row"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "admins can read sections" on public.site_sections;
create policy "admins can read sections"
on public.site_sections
for select
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "admins can insert sections" on public.site_sections;
create policy "admins can insert sections"
on public.site_sections
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "admins can update sections" on public.site_sections;
create policy "admins can update sections"
on public.site_sections
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "admins can delete sections" on public.site_sections;
create policy "admins can delete sections"
on public.site_sections
for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "admins can read media" on public.media_assets;
create policy "admins can read media"
on public.media_assets
for select
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "admins can insert media" on public.media_assets;
create policy "admins can insert media"
on public.media_assets
for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "admins can update media" on public.media_assets;
create policy "admins can update media"
on public.media_assets
for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "admins can delete media" on public.media_assets;
create policy "admins can delete media"
on public.media_assets
for delete
to authenticated
using (public.is_portfolio_admin());

-- Public-safe RPC: hidden section content is never returned.
create or replace function public.get_public_site_sections()
returns table (
  key text,
  label text,
  content jsonb,
  is_visible boolean,
  sort_order integer,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.key,
    s.label,
    case when s.is_visible then s.content else null::jsonb end as content,
    s.is_visible,
    s.sort_order,
    s.updated_at
  from public.site_sections s
  order by s.sort_order asc;
$$;

grant execute on function public.get_public_site_sections() to anon, authenticated;

-- FIRST ADMIN SETUP
-- 1) Supabase Dashboard -> Authentication -> Users -> Add user.
-- 2) Copy that user's UUID and run:
-- insert into public.admin_users (user_id, display_name)
-- values ('PASTE_AUTH_USER_UUID_HERE', 'Khang Admin');
