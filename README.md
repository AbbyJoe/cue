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

Voice, evaluation, and accounts will use ElevenLabs, xAI, and Supabase. Those calls stay on the server. They are not wired up yet.

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

Copy `.env.example` to `.env`. Leave the values empty until the server work starts.

| Variable | Where it is used |
| --- | --- |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser. Supabase project URL. |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Browser. Supabase anon key. |
| `NUXT_SUPABASE_SERVICE_ROLE_KEY` | Server only. Privileged database access. |
| `NUXT_XAI_API_KEY` | Server only. Evaluation and document analysis. |
| `NUXT_XAI_MODEL` | Server only. Model name. |
| `NUXT_ELEVENLABS_API_KEY` | Server only. Voice session setup. |
| `NUXT_ELEVENLABS_AGENT_ID` | Server only. Interviewer agent. |
| `NUXT_ELEVENLABS_WEBHOOK_SECRET` | Server only. Post-call webhook verification. |

Anything prefixed with `NUXT_PUBLIC_` is visible in the browser. The service role key and the provider keys must not use that prefix.

## Frontend

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/auth/login` | Log in |
| `/auth/signup` | Create an account (first name, last name, email, password) |
| `/auth/forgot-password` | Password reset |
| `/dashboard` | Overview |
| `/dashboard/practise` | Interview setup |
| `/dashboard/learning` | Lessons |
| `/dashboard/history` | Completed sessions, empty until interviews are stored |
| `/dashboard/progress` | Comparable progress, empty until evaluations exist |
| `/dashboard/settings` | Personal details, preparation profile and CV upload, saved in this browser |
| `/interview` | Two-tile interview room with voice visualiser |

The interview room can request the microphone and camera. It does not start an AI voice session yet. There is no login with Google, LinkedIn, or any other provider.

## Server structure

These folders are reserved. Do not put provider keys in client code.

```text
server/
  api/v1/
    profiles/
    documents/
    job-descriptions/
    preparation/
    workspaces/
    learning/
    interviews/
    assessments/
    coaching/
    progress/
    webhooks/elevenlabs/
  services/
    ai/
    elevenlabs/
    interview/
    assessment/
    coaching/
    preparation/
  utils/
  middleware/
```

## Product notes

- A person can practise with a role and experience level. A CV is optional and is uploaded from Settings. Until the documents API exists, only the file details (name, size, type, date) are kept in the browser, not the file itself. The job description screen is not in this frontend pass.
- Feedback is coaching. It does not predict hiring.
- The camera stays in the browser. Video is not uploaded.
- The voice orb is the interviewer.
