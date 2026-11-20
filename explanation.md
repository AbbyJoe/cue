# How Cue is wired

A page does not talk to Supabase, ElevenLabs, or xAI by itself.

1. The page calls a composable in `app/composables`.
2. The composable calls an API route in `server/api/v1`.
3. The route calls a helper in `server/utils`.
4. The helper talks to the database or an outside service.

Sign-in is the exception. The browser talks to Supabase Auth directly through `useSupabase`. The secret keys never leave the server.

There is no `server/services` folder. The helpers in `server/utils` are the services.

## One interview, end to end

1. Practise opens `/interview` with the role, level, category, difficulty, duration, and style.
2. The interview page loads the profile and the open workspace, then `useInterviewVoice` asks `POST /api/v1/interviews/session` for a short-lived voice token.
3. The browser starts an ElevenLabs call. The agent hears the role, level, job description, CV text, and goals. `user_id` and `workspace_id` go along so the result can be saved. They are not for the agent to say.
4. The microphone and camera stay in the browser. Nothing is uploaded while you talk.
5. Ending the call after more than 3 minutes sends the transcript to `POST /api/v1/interviews`.
6. `storeInterview` asks xAI to score it and writes one row in `interviews`.
7. History calls `GET /api/v1/interviews` and shows that row.
8. ElevenLabs may also POST the transcript to `/api/v1/webhooks/elevenlabs`. If the row is already saved, that second delivery is ignored. A call of 3 minutes or less is not saved.

## Composables

These are the functions pages use. Most of them share state with `useState`, so one load is seen everywhere.

| File | What it does | What it calls |
| --- | --- | --- |
| `useSupabase.ts` | The browser Supabase client. The session lives in cookies, so the server can read it. Returns nothing on the server. | Supabase Auth |
| `useAuth.ts` | Sign up, log in, Google, log out, resend confirmation, reset password. Builds the link back to `/auth/callback`. | `useSupabase`, then clears `useProfile` and `useWorkspaces` on log out |
| `useProfile.ts` | The signed-in person's name, role, goals, job description, and CV. Loaded once, then kept. | `GET` and `PATCH /api/v1/profiles`, `POST` and `DELETE /api/v1/profiles/cv` |
| `useWorkspaces.ts` | The list of workspaces and which one is open. Creating one opens it. | `/api/v1/workspaces` |
| `useInterviews.ts` | Past interviews for the open workspace. General practice means no workspace. Reloads when the open workspace changes. | `GET /api/v1/interviews` |
| `useInterviewVoice.ts` | Starts and ends the ElevenLabs call, keeps the live transcript, mute, and pause. Pause mutes the mic and freezes the timer. It cannot stop the agent mid-sentence. | `POST /api/v1/interviews/session`, then the ElevenLabs browser SDK |
| `useCamera.ts` | Turns the camera on and off for the interview tile. The video never leaves the browser. | The browser camera |
| `useMicrophone.ts` | A demo microphone on the marketing page. It only moves the orb. It does not record or send audio. | The browser microphone |
| `useToast.ts` | The small messages in the corner. They stay up across a page change. | Nothing |
| `useInterviewDemo.ts` | The scripted interview on the homepage and the log-in panel. It is not a real call. | Nothing |
| `useScramble.ts` | The shuffling words in the homepage headline. | Nothing |
| `useApi.ts` | An old Axios client. Nothing in the app calls it. Real requests use `$fetch`. | Nothing |

## API routes

Every route under `server/api/v1` checks that the person is signed in, except the ElevenLabs webhook. The webhook has no browser session, so it checks a signature instead.

### Profile

| Route | What it does |
| --- | --- |
| `GET /api/v1/profiles` | Returns the signed-in profile. |
| `PATCH /api/v1/profiles` | Saves name, specialisation, level, target role, goals, and job description. |
| `POST /api/v1/profiles/cv` | Stores the CV file in a private bucket and reads the words out of it. |
| `DELETE /api/v1/profiles/cv` | Removes that file and the saved text. |

### Workspaces

| Route | What it does |
| --- | --- |
| `GET /api/v1/workspaces` | Lists this person's workspaces and which one is open. |
| `POST /api/v1/workspaces` | Creates one and opens it. |
| `PATCH /api/v1/workspaces/:id` | Updates name, role, level, goals, and job description. |
| `DELETE /api/v1/workspaces/:id` | Deletes it. Its interviews stay, filed under General practice. |
| `POST /api/v1/workspaces/active` | Opens a workspace, or General practice when the id is empty. |
| `POST /api/v1/workspaces/:id/cv` | Reads a PDF or DOCX and saves the text on that workspace. The file itself is not kept. |
| `DELETE /api/v1/workspaces/:id/cv` | Clears that workspace CV. The interview then uses the profile CV. |

### Interviews

| Route | What it does |
| --- | --- |
| `POST /api/v1/interviews/session` | Asks ElevenLabs for a voice token. The API key stays here. |
| `POST /api/v1/interviews` | Scores the transcript from the call you just ended and stores it. A call of 3 minutes or less is marked skipped and is not stored. |
| `GET /api/v1/interviews` | Lists your saved interviews. `?workspace=general` is General practice. A workspace id returns only that workspace. |
| `POST /api/v1/webhooks/elevenlabs` | ElevenLabs calls this after a conversation. Only `post_call_transcription` is scored. The same conversation is not scored twice. |

### Auth route

`GET /auth/callback` is not under `/api`. Google and email links land here. The server trades the one-time code for a session cookie, then sends the browser to `next` (the dashboard, or the new-password page).

## Server helpers

| File | What it does | Used by |
| --- | --- | --- |
| `auth.ts` | `requireUser` stops a request with 401 when nobody is signed in. | Every API route except the webhook |
| `supabase.ts` | `serverSupabase` uses the person's cookie, so database rules apply. `serviceSupabase` uses the secret key and bypasses those rules. Only the interview save uses the secret, because the webhook has no cookie. | Auth, profile, workspaces, interviews |
| `profile.ts` | Reads and shapes the profile row, including CV text. If an old database is missing a column, it reads the rest of the row anyway. | Profile routes |
| `workspaces.ts` | Lists, creates, updates, deletes, and opens workspaces. Checks that a role and level are real options. | Workspace routes, and the interview save when it checks the workspace belongs to this person |
| `cvText.ts` | Reads the words from a PDF or DOCX, up to 8000 characters. A scan, a photo, or an old `.doc` comes back empty. | Profile CV upload and workspace CV upload |
| `xai.ts` | Sends the transcript to Grok. Gets back a summary, strengths, improvements, and five scores from 1 to 5: Relevance, Structure, Depth, Clarity, Evidence. It does not run the live interview. | `interviews.ts` |
| `interviews.ts` | Turns a transcript into one saved interview. Scores it with xAI, attaches the workspace when it belongs to the person, and skips a second save for the same conversation. Also skips a call of 3 minutes or less. | `POST /api/v1/interviews` and the ElevenLabs webhook |
| `middleware/auth.ts` | On a full page load, sends guests from `/dashboard` and `/interview` to log in, and sends signed-in people away from log in and sign up. | The browser, before the page renders |

## Small files the pages share

These are not services and not API routes. Pages import them directly.

| File | What it does |
| --- | --- |
| `app/utils/interview.ts` | The role, level, category, difficulty, duration, and style options, and the labels sent to the agent. |
| `app/utils/coaching.ts` | Averages the five scores and picks the lesson that matches the weakest one. |
| `app/utils/validation.ts` | Checks first and last names on sign up and settings. |

## Who owns which screen

| Screen | Composable | API |
| --- | --- | --- |
| Sign up, log in, forgot password | `useAuth` | Supabase Auth, then `/auth/callback` |
| Settings | `useProfile` | `/api/v1/profiles` and `/api/v1/profiles/cv` |
| Workspaces | `useWorkspaces` | `/api/v1/workspaces` |
| Practise and the interview room | `useInterviewVoice`, `useProfile`, `useWorkspaces` | `/api/v1/interviews/session`, then `POST /api/v1/interviews` |
| Past interviews, progress, overview scores | `useInterviews` | `GET /api/v1/interviews` |
| Homepage and log-in demo | `useInterviewDemo`, `useMicrophone`, `useScramble` | None |
