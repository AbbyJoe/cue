-- Profiles: one row per account, holding the person's name.
-- Run once in Supabase → SQL Editor (or `supabase db push` if you use the CLI).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 50),
  last_name text not null default '' check (char_length(last_name) <= 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Candidate profile. One row per auth user, created by trigger on sign-up.';

-- Row Level Security: people can only see and change their own row.
alter table public.profiles enable row level security;

drop policy if exists "Profiles: owner can read" on public.profiles;
create policy "Profiles: owner can read"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Profiles: owner can insert" on public.profiles;
create policy "Profiles: owner can insert"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Profiles: owner can update" on public.profiles;
create policy "Profiles: owner can update"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No delete policy: rows are removed with the account (on delete cascade).

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Read a first and last name from auth user metadata.
-- Email sign-up sends first_name / last_name. Google and LinkedIn (OIDC) send
-- given_name / family_name, or only a full name, which is split on the first space.
create or replace function public.profile_names_from_metadata(meta jsonb, out first_name text, out last_name text)
language plpgsql
immutable
set search_path = ''
as $$
declare
  full_name text;
begin
  meta := coalesce(meta, '{}'::jsonb);
  first_name := coalesce(nullif(btrim(meta ->> 'first_name'), ''), nullif(btrim(meta ->> 'given_name'), ''));
  last_name := coalesce(nullif(btrim(meta ->> 'last_name'), ''), nullif(btrim(meta ->> 'family_name'), ''));

  if first_name is null and last_name is null then
    full_name := btrim(coalesce(meta ->> 'full_name', meta ->> 'name', ''));
    if full_name <> '' then
      first_name := split_part(full_name, ' ', 1);
      last_name := nullif(btrim(substr(full_name, char_length(first_name) + 1)), '');
    end if;
  end if;

  first_name := left(coalesce(first_name, ''), 50);
  last_name := left(coalesce(last_name, ''), 50);
end;
$$;

-- Create the profile row whenever an account is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  names record;
begin
  names := public.profile_names_from_metadata(new.raw_user_meta_data);
  insert into public.profiles (id, first_name, last_name)
  values (new.id, names.first_name, names.last_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill accounts created before this migration.
insert into public.profiles (id, first_name, last_name)
select u.id, n.first_name, n.last_name
from auth.users u
cross join lateral public.profile_names_from_metadata(u.raw_user_meta_data) n
on conflict (id) do nothing;
