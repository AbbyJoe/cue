-- A workspace is one preparation goal. Interviews inside it stay separate from the others.
-- Run once in Supabase → SQL Editor, after the job description migration.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  role text not null default 'frontend',
  level text not null default 'senior',
  goals text not null default '' check (char_length(goals) <= 1000),
  job_description text not null default '' check (char_length(job_description) <= 4000),
  created_at timestamptz not null default now()
);

comment on table public.workspaces is 'One preparation goal per row. The person owns many; each interview belongs to at most one.';

create index if not exists workspaces_user_created_idx
  on public.workspaces (user_id, created_at);

alter table public.workspaces enable row level security;

drop policy if exists "Workspaces: owner can read" on public.workspaces;
create policy "Workspaces: owner can read"
  on public.workspaces for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Workspaces: owner can insert" on public.workspaces;
create policy "Workspaces: owner can insert"
  on public.workspaces for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Workspaces: owner can update" on public.workspaces;
create policy "Workspaces: owner can update"
  on public.workspaces for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Workspaces: owner can delete" on public.workspaces;
create policy "Workspaces: owner can delete"
  on public.workspaces for delete
  to authenticated
  using ((select auth.uid()) = user_id);

alter table public.profiles
  add column if not exists active_workspace_id uuid references public.workspaces (id) on delete set null;

alter table public.interviews
  add column if not exists workspace_id uuid references public.workspaces (id) on delete set null;

create index if not exists interviews_workspace_idx
  on public.interviews (workspace_id);
