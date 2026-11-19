-- Preparation details and CV on the profile, plus a private bucket for CV files.
-- Run once in Supabase → SQL Editor, after 20261119000000_profiles.sql.

alter table public.profiles
  add column if not exists specialisation text not null default 'frontend',
  add column if not exists level text not null default 'senior',
  add column if not exists target_role text not null default '' check (char_length(target_role) <= 100),
  add column if not exists goals text not null default '' check (char_length(goals) <= 1000),
  add column if not exists cv_path text,
  add column if not exists cv_name text,
  add column if not exists cv_size integer,
  add column if not exists cv_uploaded_at timestamptz;

-- Private bucket: files are only reachable through short-lived signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs',
  'cvs',
  false,
  5242880, -- 5 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- Each person can only touch files inside their own folder: cvs/<user id>/...
drop policy if exists "CVs: owner can read" on storage.objects;
create policy "CVs: owner can read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "CVs: owner can upload" on storage.objects;
create policy "CVs: owner can upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Needed for upsert (replacing cv.pdf with a new cv.pdf).
drop policy if exists "CVs: owner can replace" on storage.objects;
create policy "CVs: owner can replace"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "CVs: owner can delete" on storage.objects;
create policy "CVs: owner can delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);
