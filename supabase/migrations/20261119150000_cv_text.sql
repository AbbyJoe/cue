-- Text read from an uploaded CV, so the interviewer can ask about it.
-- Run once in Supabase → SQL Editor, after the workspaces migration.

alter table public.profiles
  add column if not exists cv_text text not null default '' check (char_length(cv_text) <= 8000);

alter table public.workspaces
  add column if not exists cv_name text not null default '',
  add column if not exists cv_text text not null default '' check (char_length(cv_text) <= 8000);
