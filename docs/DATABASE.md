# Database

Cue uses Supabase Postgres. Schema changes live in `supabase/migrations/` as plain SQL, applied in filename order. Run each one in Supabase → SQL Editor, or with `supabase db push` if the project is linked to the Supabase CLI.

The full planned data model is in [PRD.md](PRD.md), section 7. This file documents what exists so far.

## `public.profiles`

One row per account. It is created automatically when someone signs up.

Migrations: `20261119000000_profiles.sql` (table, names, trigger) and `20261119010000_profile_details_and_cv.sql` (preparation details, CV, storage bucket).

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. References `auth.users(id)` with `on delete cascade`, so deleting the account deletes the profile. |
| `first_name` | `text` | Required at sign-up. Up to 50 characters. Defaults to `''`. |
| `last_name` | `text` | Required at sign-up. Up to 50 characters. Defaults to `''`. |
| `specialisation` | `text` | Defaults to `frontend`. |
| `level` | `text` | Defaults to `senior`. |
| `target_role` | `text` | Up to 100 characters. |
| `goals` | `text` | Up to 1000 characters. |
| `job_description` | `text` | Optional. Up to 4000 characters. Added in `20261119130000_job_description.sql` and sent into the interview. |
| `cv_text` | `text` | Words read from the CV, up to 8000 characters. Added in `20261119150000_cv_text.sql`. |
| `cv_path` | `text` | Path in the `cvs` bucket, e.g. `<user id>/cv.pdf`. `null` when there is no CV. |
| `cv_name` | `text` | Original file name, shown in Settings. |
| `cv_size` | `integer` | Bytes. |
| `cv_uploaded_at` | `timestamptz` | When the current CV was uploaded. |
| `created_at` | `timestamptz` | Set on insert. |
| `updated_at` | `timestamptz` | Kept current by the `profiles_set_updated_at` trigger. |

### Row level security

RLS is on. Signed-in users can **select**, **insert** and **update** only the row whose `id` matches `auth.uid()`. There is no delete policy: profiles go away with the account.

### How rows are created

The trigger `on_auth_user_created` runs `public.handle_new_user()` after every insert into `auth.users`. It reads the name from the new user's metadata through `public.profile_names_from_metadata()`:

| Sign-up method | Metadata used |
| --- | --- |
| Email and password | `first_name`, `last_name` (sent by the sign-up form) |
| Google, LinkedIn (OIDC) | `given_name`, `family_name`, or else `full_name` / `name` split on the first space |

The function runs as `security definer` with an empty `search_path`, so it can write to `public.profiles` during sign-up without opening the table to anyone else.

The migration also backfills a row for every account created before it was run.

### Validation

The database only limits length (50 characters). The rule that names use letters, spaces, hyphens and apostrophes lives in `shared/utils/names.ts`. Both the forms and `PATCH /api/v1/profiles` use it.

### API

| Endpoint | What it does |
| --- | --- |
| `GET /api/v1/profiles` | Returns the profile: names, preparation details and `cv` (`name`, `size`, `uploadedAt`, `url`) or `null`. |
| `PATCH /api/v1/profiles` | Saves names and preparation details. Returns 422 with field messages if a name is invalid. |
| `POST /api/v1/profiles/cv` | Multipart upload (field `file`). PDF, DOC or DOCX up to 5 MB. Replaces the current CV. |
| `DELETE /api/v1/profiles/cv` | Deletes the file and clears the CV columns. |

Every endpoint returns the full, updated profile. In the app, `useProfile()` (`app/composables/useProfile.ts`) wraps them and shares one copy of the profile across pages.

All profile endpoints run as the signed-in user (`serverSupabase(event)`), so RLS and storage policies apply.

## `public.workspaces`

One preparation goal, such as a role at a company. Migration: `20261119140000_workspaces.sql`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `user_id` | `uuid` | References `auth.users(id)` with `on delete cascade`. |
| `name` | `text` | 1–80 characters. |
| `role`, `level` | `text` | Starting point for sessions in this workspace. |
| `goals` | `text` | Up to 1000 characters. |
| `job_description` | `text` | Up to 4000 characters. |
| `cv_name` | `text` | File name of a CV uploaded for this workspace. Empty means the profile CV is used. |
| `cv_text` | `text` | Words read from that CV, up to 8000 characters. |
| `created_at` | `timestamptz` | Set on insert. |

`profiles.active_workspace_id` is the workspace that is open. `interviews.workspace_id` files a completed session there. Both are cleared when the workspace is deleted, and those sessions return to General practice.

RLS lets the owner select, insert, update and delete their own rows.

## `public.interviews`

One row per completed voice interview. Migration: `20261119120000_interviews.sql`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key. |
| `user_id` | `uuid` | References `auth.users(id)` with `on delete cascade`. |
| `conversation_id` | `text` | ElevenLabs conversation id. Unique, so a retried webhook updates the same row. |
| `role`, `level`, `category`, `difficulty`, `duration`, `style` | `text` | The setup labels sent into the agent. |
| `transcript` | `jsonb` | `[{ "from": "you" \| "interviewer", "text": "..." }]`. |
| `feedback` | `jsonb` | xAI assessment: `summary`, `scores`, `strengths`, `improvements`. Null until scoring finishes. |
| `created_at` | `timestamptz` | Set on insert. |

RLS lets a signed-in user **select** only their own rows. The ElevenLabs webhook writes with the Supabase secret key (`NUXT_SUPABASE_SECRET_KEY`), because the request has no user session.

`GET /api/v1/interviews` returns the signed-in person's rows, newest first.

## Storage: `cvs` bucket

Private bucket, 5 MB limit, PDF and Word files only. Each CV lives at `cvs/<user id>/cv.<ext>`, so a person has at most one file. A new upload replaces the old one.

Storage policies let signed-in users read, upload, replace and delete only files in the folder named after their own user id. Files are never public: the API returns a **signed URL** that expires after one hour, and it is regenerated each time the profile is loaded.
