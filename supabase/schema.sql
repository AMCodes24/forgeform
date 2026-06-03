-- ForgeForm database schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Run

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prompt text not null,
  width numeric default 50,
  height numeric default 50,
  depth numeric default 50,
  style text default 'modern',
  material text default 'pla',
  detail_level text default 'medium',
  intended_use text default 'decorative',
  model_data jsonb not null default '{}',
  printability jsonb not null default '{}',
  printability_score integer default 0,
  thumbnail_color text default '#f97316',
  export_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  format text not null check (format in ('stl', 'obj', 'glb')),
  file_name text not null,
  created_at timestamptz default now()
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(created_at desc);
create index if not exists exports_project_id_idx on public.exports(project_id);
create index if not exists exports_user_id_idx on public.exports(user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.exports enable row level security;

drop policy if exists "Users can view own projects" on public.projects;
drop policy if exists "Users can insert own projects" on public.projects;
drop policy if exists "Users can update own projects" on public.projects;
drop policy if exists "Users can delete own projects" on public.projects;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view own exports" on public.exports;
drop policy if exists "Users can insert own exports" on public.exports;
drop policy if exists "Users can delete own exports" on public.exports;

create policy "Users can view own exports"
  on public.exports for select
  using (auth.uid() = user_id);

create policy "Users can insert own exports"
  on public.exports for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own exports"
  on public.exports for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Updated timestamp trigger
-- ---------------------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();
