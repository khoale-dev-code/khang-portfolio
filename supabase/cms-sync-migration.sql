-- KHANG Portfolio CMS schema sync.
-- Safe to run multiple times in Supabase SQL Editor.

create extension if not exists pgcrypto;

alter table public.site_sections
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

alter table public.site_sections
  add column if not exists updated_at timestamptz not null default now();

create index if not exists site_sections_sort_idx
  on public.site_sections(sort_order);

drop function if exists public.get_public_site_sections();

create function public.get_public_site_sections()
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
    case
      when s.is_visible then s.content
      else null::jsonb
    end as content,
    s.is_visible,
    s.sort_order,
    s.updated_at
  from public.site_sections s
  order by s.sort_order asc;
$$;

grant execute on function public.get_public_site_sections()
to anon, authenticated;

notify pgrst, 'reload schema';
