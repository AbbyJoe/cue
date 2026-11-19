-- Completed voice interviews and the xAI assessment of each transcript.
-- Run once in Supabase → SQL Editor, after the profiles migrations.

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  conversation_id text not null unique,
  role text not null default '',
  level text not null default '',
  category text not null default '',
  difficulty text not null default '',
  duration text not null default '',
  style text not null default '',
  transcript jsonb not null default '[]'::jsonb,
  feedback jsonb,
  created_at timestamptz not null default now()
);

comment on table public.interviews is 'One row per completed ElevenLabs conversation, written by the webhook.';

create index if not exists interviews_user_created_idx
  on public.interviews (user_id, created_at desc);

alter table public.interviews enable row level security;

drop policy if exists "Interviews: owner can read" on public.interviews;
create policy "Interviews: owner can read"
  on public.interviews for select
  to authenticated
  using ((select auth.uid()) = user_id);
