-- Optional job description used to focus later interviews.
-- Run once in Supabase → SQL Editor, after the interviews migration.

alter table public.profiles
  add column if not exists job_description text not null default '' check (char_length(job_description) <= 4000);
