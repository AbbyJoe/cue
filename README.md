# Cue

Cue is an interview practice product. People learn how answers are evaluated, practise in a voice conversation, and then review evidence-based feedback.

This repository currently contains the frontend. The server folders are in place, and the API is not implemented yet.

## Stack

- Nuxt 3 and Vue 3
- TypeScript
- Tailwind CSS
- Onest
- Iconsax, linear style, through `vue-iconsax`
- Axios for HTTP requests (`useApi()`)

Voice interviews use ElevenLabs, accounts use Supabase, and xAI scores the transcript after the call. Those calls stay on the server.

## Requirements

- Node 20 or newer
- Yarn

## Setup

```bash
yarn install
cp .env.example .env
yarn dev
```

The app runs at `http://localhost:3000`. Log in and sign up open the product so the interface can be reviewed. They do not create an account yet.

## Scripts

```bash
yarn dev
yarn build
yarn preview
```

## Environment

Copy `.env.example` to `.env`. The two Supabase values are required: the app needs an account and keeps profiles in Supabase.

| Variable | Where it is used |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Browser. Full live address, e.g. `https://cue.app`. Used for share previews, canonical links and the sitemap. Defaults to `http://localhost:3000`. |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser. Supabase project URL. |
| `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser. Supabase publishable key. |
| `NUXT_SUPABASE_SECRET_KEY` | Server only. Privileged database access. |
| `NUXT_XAI_API_KEY` | Server only. Evaluation and document analysis. |
| `NUXT_XAI_MODEL` | Server only. Model name. |
| `NUXT_ELEVENLABS_API_KEY` | Server only. Voice session setup. |
| `NUXT_ELEVENLABS_AGENT_ID` | Server only. Interviewer agent. |
| `NUXT_ELEVENLABS_WEBHOOK_SECRET` | Server only. Post-call webhook verification. |

Anything prefixed with `NUXT_PUBLIC_` is visible in the browser. The secret key and the provider keys must not use that prefix.

## Authentication

Supabase Auth handles email and password, plus Google. LinkedIn is built, but its button is shown disabled with a "Coming soon" label. Sessions are kept in cookies, so both the server and the browser can read them.

How it works:

1. **Sign up with email** (`/auth/signup`): first name, last name, email and password go to `supabase.auth.signUp()`. The names travel as user metadata, and a database trigger copies them into `public.profiles`. With email confirmation on (the Supabase default), the page switches to "Check your inbox", with a resend button limited to once a minute.
2. **Confirm email:** the link in the email opens `/auth/callback?flow=email`, which signs the person in and continues to the dashboard. If the link has expired or is opened in another browser, the login page explains this and asks them to log in.
3. **Log in with email** (`/auth/login`): `signInWithPassword()`. A wrong password and an unconfirmed email each get their own message, and an unconfirmed account can resend the link from the login page.
4. **Google:** `signInWithOAuth()`. Google returns to `/auth/callback`, which exchanges the one-time code for a session. On first sign-in the trigger takes the name from the Google profile.
5. **Access:** `/dashboard/**` and `/interview` require a session. Full page loads are checked in `server/middleware/auth.ts`, and in-app navigation in `app/middleware/auth.global.ts`. Signed-in visitors to log in or sign up are sent to the dashboard.
6. **Profile:** names, preparation details and the CV are read and saved through `/api/v1/profiles` (`useProfile()`). The endpoints run as the signed-in user, so row level security applies. CV files go to the private `cvs` storage bucket.
7. **Log out:** ends the session in this browser.

The code is in `app/composables/useAuth.ts`, `server/routes/auth/callback.get.ts`, `server/api/v1/profiles/` and `supabase/migrations/`.

Password reset (`/auth/forgot-password`) isn't connected yet.

### Database setup

Run the files in `supabase/migrations/` in order, once each, in Supabase → SQL Editor:

1. `20261119000000_profiles.sql`: the `profiles` table, its policies, the sign-up trigger and rows for existing accounts.
2. `20261119010000_profile_details_and_cv.sql`: preparation details and CV columns, plus the private `cvs` storage bucket and its policies.

See [docs/DATABASE.md](docs/DATABASE.md).

### Provider setup

Do this once in the Supabase dashboard and with each provider.

**Supabase → Authentication → Sign In / Providers → Email**

- Keep "Confirm email" on. Sign-up then shows "Check your inbox". With it off, people go straight to the dashboard.

**Supabase → Authentication → URL configuration**

- Site URL: your production URL.
- Redirect URLs: add `http://localhost:3000/**` and `https://<your-domain>/**`.

**Google** (Supabase provider `google`)

1. In Google Cloud Console, go to APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.
2. Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Set up the OAuth consent screen with the `email`, `profile` and `openid` scopes.
4. Paste the client ID and secret into Supabase → Authentication → Providers → Google, and turn it on.

**LinkedIn** (Supabase provider `linkedin_oidc`, shown as "Coming soon")

To turn it on, set `enabled: true` for LinkedIn in `app/components/auth/SocialAuth.vue`, then:

1. In the LinkedIn Developer Portal, create an app and add the product "Sign In with LinkedIn using OpenID Connect".
2. Under Auth, add the redirect URL `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Paste the client ID and secret into Supabase → Authentication → Providers → LinkedIn (OIDC), and turn it on.

Provider secrets live only in Supabase. They never go in `.env` or client code.

## SEO and link previews

- **Defaults** (`app/app.vue`): the title pattern `Page · Cue`, description, canonical URL, Open Graph and Twitter tags, and the share image `public/og-image.jpg` (1200 × 630).
- **Per page:** `usePageSeo({ title, description })`. Pass `index: false` to keep a page out of search results. The app and interview layouts are always `noindex`.
- **Search engines:** `/robots.txt` and `/sitemap.xml` are generated from `NUXT_PUBLIC_SITE_URL` (`server/routes/`). The landing page also includes `WebApplication` structured data.
- **Icons:** `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` and `site.webmanifest` in `public/`.

Set `NUXT_PUBLIC_SITE_URL` in production. Share previews need a full image address, so they won't show without it.

## Frontend

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/auth/login` | Log in with email and password, or Google |
| `/auth/signup` | Create an account with first name, last name, email and password, or Google |
| `/auth/forgot-password` | Password reset |
| `/dashboard` | Overview |
| `/dashboard/practise` | Interview setup |
| `/dashboard/learning` | Lessons |
| `/dashboard/history` | Completed sessions, empty until interviews are stored |
| `/dashboard/progress` | Comparable progress, empty until evaluations exist |
| `/dashboard/settings` | Personal details, preparation profile and CV upload, all saved to Supabase |
| `/interview` | Two-tile interview room with voice visualiser |

The interview room can request the microphone and camera. It does not start an AI voice session yet. See Authentication above for sign-in.

## Server structure

Do not put provider keys in client code.

```text
server/
  api/v1/
    profiles/
    workspaces/
    interviews/
    webhooks/elevenlabs/
  utils/
  middleware/
```

## Product notes

- A person can practise with a role and experience level. A CV is optional and is uploaded from Settings to private Supabase storage. The job description screen is not in this frontend pass.
- Feedback is coaching. It does not predict hiring.
- The camera stays in the browser. Video is not uploaded.
- The voice orb is the interviewer.
