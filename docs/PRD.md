# CUE - AI Interview Coach

## Product Requirements Document & Engineering Blueprint

**Document status:** Revised product specification

**Product name:** Working title — CUE

**Product category:** AI-powered interview preparation and coaching

**Platform:** Web application

**Initial audience:** Technology professionals

**Experience levels:** Entry-level, junior, mid-level, senior and leadership

**Core technology:** Nuxt 3, Vue 3, TypeScript, Supabase and ElevenLabs

---

# 1. Product Overview

## 1.1 Product vision

Build an AI-powered interview preparation platform that helps people become better at handling professional interviews through structured learning, realistic voice-based mock interviews and personalised feedback.

The platform should provide an environment where candidates can practise interviews across different professional roles, experience levels and interview categories.

Users should be able to start practising immediately by selecting their professional role and experience level. Those preparing for a specific job opportunity can optionally upload their CV and provide the job description to make their preparation more relevant.

The goal is to simulate meaningful interview experiences, evaluate candidate responses and help users continuously improve their ability to demonstrate their knowledge, experience and professional value.

## 1.2 The problem

Many qualified professionals struggle during interviews, not necessarily because they lack the required knowledge or experience, but because they struggle to communicate their abilities effectively.

Common challenges include:

- Difficulty explaining technical concepts.
- Inability to structure interview responses.
- Poor communication of personal contributions and achievements.
- Difficulty answering situational and behavioural questions.
- Lack of understanding of what recruiters and hiring managers evaluate.
- Anxiety and nervousness during interviews.
- Limited access to realistic interview practice.
- Lack of useful feedback after interviews.
- Repeated mistakes across multiple interview experiences.

Most candidates prepare by reading interview questions, watching YouTube videos or memorising suggested answers.

These approaches provide information but don't necessarily develop interview competence.

## 1.3 Our solution

An interactive AI interview coach that allows candidates to learn interview techniques, participate in realistic voice-based mock interviews and receive detailed assessments of their responses.

The platform combines three core experiences:

**Learning:** Candidates learn interview expectations, answer frameworks, technical concepts and communication strategies.

**Practice:** Candidates participate in realistic voice conversations with an AI interviewer that asks relevant questions and adapts its follow-ups to their responses.

**Evaluation and coaching:** Candidates receive structured, evidence-based feedback, identify weaknesses and get personalised recommendations for improvement.

## 1.4 Product philosophy

> Don't teach people what to say. Teach them how to think, structure and communicate their answers.
> 

The product should help candidates develop genuine competence rather than memorise AI-generated responses.

## 1.5 Core product promise

**Practise interviews with AI. Become better at showing what you know, what you can do and the value you can bring to a team.**

---

# 2. Target Audience

## 2.1 Initial market

Technology professionals across different career stages and specialisations.

Initial professional categories:

- Software engineering (frontend, backend and full-stack).
- Product management.
- Product design and UX/UI.
- Data analytics and data science.
- Quality assurance and software testing.
- DevOps, cloud and infrastructure.
- Cybersecurity.
- Technical project management.

The initial product should have particular depth in software engineering, while its architecture and content model should support additional technology disciplines.

## 2.2 Experience levels

| Level | Preparation focus |
| --- | --- |
| Entry-level | Fundamentals, communication, projects and problem-solving |
| Junior | Practical skills, implementation and learning ability |
| Mid-level | Ownership, technical decisions and independent delivery |
| Senior | Architecture, trade-offs, mentoring and leadership |
| Lead / Principal | Strategy, technical direction, influence and organisational impact |

Question selection, difficulty, evaluation criteria and expected depth must adapt to the selected experience level.

## 2.3 Primary user personas

**Persona A: The beginner**

Has completed a degree, bootcamp or self-learning programme. Understands basic concepts but struggles to explain projects and answer interview questions.

**Persona B: The transitioning professional**

Has professional experience but is changing roles, specialisations or industries. Needs help positioning existing skills and identifying knowledge gaps.

**Persona C: The experienced professional**

Has several years of experience but struggles with senior-level interviews, system design, leadership questions and communicating technical decisions.

**Persona D: The returning candidate**

Has been away from interviewing for a while and needs to rebuild confidence, refresh knowledge and practise realistic interview scenarios.

**Persona E: The active job seeker**

Is currently applying for specific roles and wants to practise using the CV and job description submitted to prospective employers.

---

# 3. Core Product Modules

## 3.1 User onboarding and candidate profile

Candidates create a profile that establishes their preparation context.

Required capabilities:

- Registration and authentication.
- First and last name, collected at sign-up.
- Professional specialisation.
- Current experience level.
- Target role.
- Preferred interview categories.
- Preparation goals.
- Optional CV upload.
- Optional job description submission.

A user should not be required to upload a CV or job description to start practising.

The onboarding process should remain simple and avoid asking for information that isn't necessary to begin.

### Sign-up

The sign-up form asks for:

- First name (required).
- Last name (required).
- Email address.
- Password and confirmation.

Names accept letters from any language, spaces, hyphens and apostrophes, up to 50 characters each. The first name is used to address the candidate in the dashboard and in interview reports. Role, level and a CV are not requested at sign-up.

### Settings

Candidates manage their details from a single Settings page with three sections:

1. **Personal details:** first and last name. Both are required and can be edited at any time.
2. **Preparation profile:** specialisation, experience level, target role and preparation goals.
3. **CV:** an optional upload area for the candidate's CV.

### CV upload

- Accepted formats: PDF, DOC and DOCX, up to 5 MB.
- Candidates can drag and drop a file or browse for one.
- One current CV per profile. Uploading a new file replaces the current one.
- Candidates can remove their CV at any time. Practice works without one.
- Clear errors are shown for unsupported types, empty files and files over the limit.
- After upload, the CV is shown with its name, size and upload date, with options to replace or remove it.
- The CV is private to the candidate and is never shared with employers.
- The uploaded CV feeds the CV analysis described in section 3.3.

## 3.2 Interview setup and personalisation

Candidates should be able to configure an interview before starting a session.

Initial configuration options:

- Professional role.
- Experience level.
- Interview category.
- Interview difficulty.
- Interview duration.
- Interviewer personality or style.

Suggested interview categories:

**General and HR interviews**

- Introduction and career history.
- Motivation and career goals.
- Strengths and weaknesses.
- Salary expectations.
- General professional questions.

**Behavioural interviews**

- Handling difficult situations.
- Conflict resolution.
- Team collaboration.
- Failure and lessons learned.
- Ownership and achievements.
- Decision-making.

**Technical interviews**

- Technical fundamentals.
- Concept explanation.
- Practical implementation.
- Problem-solving.
- Debugging and troubleshooting.
- Architecture and system design.
- Technical trade-offs.

**Leadership interviews**

- Mentorship.
- Team management.
- Technical direction.
- Strategic decision-making.
- Handling disagreements.
- Organisational impact.

Candidates should be able to select a specific interview category or request a mixed interview that combines relevant categories.

## 3.3 Optional CV and job description personalisation

Candidates preparing for an actual job opportunity can provide additional information to make their practice more relevant.

Optional inputs:

- The CV used when applying for the position.
- The job description.
- Company name.
- Company website.
- Interview stage.
- Additional information about the interview.

The platform should analyse the submitted information and generate an interview context.

### CV analysis

Identify:

- Professional experience.
- Technical skills.
- Projects and achievements.
- Responsibilities and ownership.
- Technologies used.
- Claims that an interviewer could reasonably explore.

### Job description analysis

Identify:

- Required skills.
- Preferred skills.
- Experience expectations.
- Key responsibilities.
- Technical competencies.
- Behavioural expectations.
- Potential interview areas.

### Combined preparation context

The platform should compare the candidate's experience with the job requirements.

For example:

A candidate applying for a Senior Frontend Engineer role submits a CV demonstrating Vue.js experience and a job description requiring Vue 3, TypeScript, performance optimisation and scalable frontend architecture.

The system can identify:

- Areas where the candidate has demonstrated experience.
- Skills that are explicitly required by the employer.
- Potential gaps to prepare for.
- Projects from the CV that may attract follow-up questions.
- Relevant technical and behavioural interview categories.

The AI interviewer can then ask questions such as:

"You mentioned working on a banking application. Can you describe a challenging technical problem you encountered and how you approached solving it?"

Important principles:

- CV and job description uploads must remain optional.
- The AI should not limit questions to the submitted job description.
- General professional interview expectations must still inform question selection.
- The platform must not claim to know the actual questions a company will ask.
- The candidate should be able to review and update their interview context.

## 3.4 Learning centre

A structured learning experience that teaches candidates how to approach different interview scenarios.

Learning categories:

**Behavioural interviews**

- Tell me about yourself.
- Describe a difficult situation.
- Tell me about a failure.
- Explain how you handle conflict.
- Describe a significant achievement.

**Technical interviews**

- Explaining technical concepts.
- Problem-solving approaches.
- Architecture and system design.
- Debugging and troubleshooting.
- Technical decision-making.
- Trade-offs and engineering principles.

**Recruitment and HR interviews**

- Career history.
- Salary expectations.
- Motivation and career goals.
- Strengths and weaknesses.
- Questions to ask recruiters.

**Leadership interviews**

- Team management.
- Mentorship.
- Conflict resolution.
- Technical direction.
- Decision-making under uncertainty.

Each lesson should contain:

1. The purpose of the question.
2. What the interviewer is evaluating.
3. Common mistakes candidates make.
4. Recommended answer structures.
5. A good illustrative example.
6. A practice exercise.

The content should teach transferable principles rather than prescribe one perfect answer.

Frameworks such as STAR should be introduced where appropriate, particularly for behavioural questions, without forcing candidates into a rigid response format.

## 3.5 AI voice interviewer

This is the primary product experience and the main integration with ElevenLabs.

Candidates should be able to participate in natural, voice-based interview simulations.

Core capabilities:

- Natural spoken questions.
- Speech recognition.
- Voice synthesis.
- Conversational turn-taking.
- Contextual follow-up questions.
- Interruption handling.
- Interview timer.
- Live transcript.
- Ability to pause or end an interview.
- Session persistence.
- Session completion and transcript processing.

The interviewer should adapt questions based on previous responses.

Example:

**Question:** "How do you approach performance optimisation in a large Vue application?"

**Candidate:** "I usually start with lazy loading and caching."

**Follow-up:** "How would you determine whether lazy loading or caching would provide the greatest benefit in this particular situation?"

The agent should assess the depth of the answer before deciding what to ask next.

### Interviewer personalities

Possible interviewer styles:

- Friendly recruiter.
- Professional technical interviewer.
- Hiring manager.
- Challenging interviewer.

These styles should influence conversational behaviour, not the underlying evaluation standards.

### Interviewer behaviour

The AI should:

- Maintain the context of the interview.
- Ask questions appropriate to the selected role and seniority.
- Ask relevant follow-up questions.
- Request clarification when answers are vague.
- Challenge unsupported claims where appropriate.
- Avoid revealing evaluation scores during a formal mock interview.
- Avoid giving coaching advice in the middle of a formal simulation.
- Maintain a natural and professional conversational flow.

## 3.6 Interview room and voice visualisation

The interview room should provide a clean, modern and immersive experience.

The primary visual focus should be an animated voice orb representing the AI interviewer.

The interface should communicate the state of the conversation through visual feedback.

### Voice orb states

| State | Visual behaviour |
| --- | --- |
| Idle | Gentle breathing animation |
| AI speaking | Expanding and contracting sound waves |
| User speaking | Waveform responds to microphone activity |
| AI processing | Subtle rotating or flowing animation |
| Connecting | Connection indicator or loading animation |
| Connection error | Clear warning and recovery option |

The animation should respond to actual audio activity or conversation events rather than run continuously without meaning.

### Interview room controls

Required controls:

- Microphone on/off.
- Camera on/off.
- Pause interview.
- End interview.
- Transcript visibility.
- Session timer.
- Connection status.

### Optional user video

The candidate should have the option to enable their webcam during the interview.

When enabled:

- The user's camera feed appears in a video tile.
- The video tile can be positioned alongside the AI voice visualisation.
- The user can turn the camera off at any point.
- The interview must remain fully functional without camera access.

The browser's native media APIs should handle camera access and local video display.

The initial MVP does not require a dedicated real-time video conferencing infrastructure.

There is no requirement for a live video feed of an AI avatar.

The voice orb remains the primary representation of the interviewer.

### Interview transcript

Candidates should be able to view the conversation transcript during or after an interview.

The transcript panel should:

- Display the interviewer's questions.
- Display the candidate's recognised responses.
- Clearly distinguish speakers.
- Update as conversation events arrive.
- Be collapsible to preserve interview room space.

Video should not be used to infer personality, intelligence, confidence or employability. Camera access is optional and should not be required for assessment.

## 3.7 Interview assessment engine

The assessment engine evaluates completed interviews independently from the live interviewer.

Each answer should be evaluated against a defined rubric.

Suggested evaluation dimensions:

| Dimension | What is evaluated |
| --- | --- |
| Relevance | Did the candidate answer the question? |
| Structure | Was the response organised logically? |
| Technical accuracy | Were technical explanations correct? |
| Depth | Did the candidate demonstrate sufficient understanding? |
| Practical application | Could the candidate connect concepts to real experience? |
| Clarity | Was the explanation understandable? |
| Evidence | Did the candidate provide examples or supporting details? |

Not every dimension applies equally to every question. The rubric must adapt to the question category and seniority.

Assessment outputs:

- Overall session summary.
- Question-by-question assessment.
- Identified strengths.
- Missing information.
- Technical inaccuracies.
- Suggested answer improvements.
- Recommended learning resources.
- Personalised next steps.

Scores should be accompanied by evidence from the actual response and clear explanations.

They should be treated as coaching estimates, not objective predictions of hiring outcomes.

Technical factual correctness must be assessed separately from communication quality.

## 3.8 Personalised coaching

The coaching engine converts assessment results into actionable learning activities.

Examples:

- Candidate repeatedly struggles with STAR responses.
- Candidate understands frontend concepts but cannot explain architectural trade-offs.
- Candidate gives lengthy answers without addressing the question.
- Candidate struggles to explain personal contributions to team projects.
- Candidate provides technically correct answers but insufficient practical examples.

The system should recommend relevant lessons and targeted practice.

Candidates should also be able to retry questions and compare their new responses with previous attempts.

## 3.9 Progress tracking

The dashboard should provide:

- Interview history.
- Preparation progress.
- Strength and weakness trends.
- Practice frequency.
- Performance by interview category.
- Frequently missed concepts.
- Recommended next exercises.
- Progress across repeated attempts.

Progress should be based on comparable assessment rubrics and repeated attempts, not simply an average of unrelated scores.

## 3.10 Interview preparation workspaces

Candidates should be able to save and organise their preparation sessions.

A workspace represents a particular preparation goal or job opportunity.

Examples:

- General Senior Frontend Engineer preparation.
- Company X — Senior Frontend Engineer.
- Company Y — Full-stack Engineer.
- System Design Practice.

Each workspace can contain:

- Role and experience level.
- Optional CV.
- Optional job description.
- Interview context.
- Preparation plan.
- Practice sessions.
- Assessment reports.
- Learning recommendations.

This allows candidates to prepare for multiple opportunities without mixing their preparation history.

A user should also be able to practise without creating a company-specific workspace.

---

# 4. User Journey

## 4.1 First-time user

1. Creates an account with their first name, last name, email and password.
2. Selects a professional specialisation.
3. Selects experience level.
4. Identifies target role.
5. Selects preparation goals.
6. Optionally uploads a CV and provides a job description.
7. Receives a recommended preparation plan.
8. Starts with a recommended learning module or mock interview.

## 4.2 Returning user

1. Opens their preparation dashboard.
2. Reviews recommended learning activities.
3. Selects an existing preparation workspace or creates a new one.
4. Configures a mock interview.
5. Completes a voice-based interview.
6. Receives a detailed assessment.
7. Reviews areas for improvement.
8. Repeats relevant questions or lessons.
9. Tracks progress over time.

## 4.3 Core coaching cycle

LEARN → PRACTISE → EVALUATE → IMPROVE → REPEAT

This cycle is central to the product experience.

---

# 5. MVP Definition

The first release should focus on proving that candidates can practise realistic interviews and receive genuinely useful coaching.

## 5.1 MVP features

| Feature | Priority |
| --- | --- |
| User registration and authentication | Must have |
| Candidate profile | Must have |
| Role and experience selection | Must have |
| Interview configuration | Must have |
| CV upload | Should have |
| Job description input and analysis | Should have |
| Foundational learning centre | Must have |
| ElevenLabs voice interviewer | Must have |
| Contextual follow-up questions | Must have |
| Animated voice orb | Must have |
| Microphone controls | Must have |
| Optional user webcam | Should have |
| Live transcript | Must have |
| Post-interview evaluation | Must have |
| Personalised improvement suggestions | Must have |
| Interview history | Must have |
| Basic progress dashboard | Must have |
| Interview preparation workspaces | Should have |
| Question retry and comparison | Should have |

## 5.2 Later features

- Real-time AI video avatar.
- Advanced video interview experiences.
- Multiple languages.
- Human interview coaching.
- Recruiter and employer portal.
- Community features.
- Subscription and payment infrastructure.
- Additional professional industries.
- Advanced progress analytics.

## 5.3 MVP boundaries

We should deliberately avoid:

- Building a full recruitment marketplace.
- Connecting to real employer applicant tracking systems.
- Supporting every professional industry immediately.
- Developing our own speech recognition or voice synthesis engine.
- Building dedicated video conferencing infrastructure.
- Implementing AI facial-expression or emotion detection.
- Claiming to predict whether someone will get hired.
- Introducing complex subscription infrastructure before validating demand.

The first version should support technology professionals and deliver an excellent voice-interview experience.

---

# 6. Technical Architecture

## 6.1 Proposed technology stack

| Layer | Technology |
| --- | --- |
| Frontend | Nuxt 3 |
| UI framework | Vue 3 Composition API |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Server/backend | Nuxt server routes and server utilities |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage |
| Data access security | Supabase Row Level Security |
| LLM provider | xAI — Grok |
| Voice infrastructure | ElevenLabs Agents |
| Browser audio/video | Browser Media APIs |
| Background processing | Supabase Queues or a suitable background worker |
| Deployment | Nuxt-compatible hosting |
| Monitoring | Structured logging and error tracking |

### AI and voice responsibilities

**xAI (Grok) — Intelligence layer**

Responsible for:

- CV extraction and analysis.
- Job description analysis.
- Candidate and job requirement matching.
- Interview context generation.
- Interview question generation.
- Answer evaluation.
- Structured assessment reports.
- Coaching feedback.
- Personalised learning recommendations.

**ElevenLabs — Voice interaction layer**

Responsible for:

- AI interviewer voice.
- Speech recognition and synthesis.
- Real-time conversational interaction.
- Turn-taking and interruption handling.
- Voice session management.
- Conversation events and transcripts.

The two providers should have clearly separated responsibilities. xAI powers the application's reasoning and assessment capabilities, while ElevenLabs provides the conversational voice experience.

All xAI and ElevenLabs API calls involving private credentials should be managed through the Nuxt server.

### AI service architecture

Create a dedicated AI service abstraction:

```
server/services/ai/
├── xai/
│   ├── client.ts
│   ├── cv-analysis.ts
│   ├── job-analysis.ts
│   ├── question-generation.ts
│   ├── answer-evaluation.ts
│   └── coaching.ts
│
├── prompts/
│   ├── interview-context.ts
│   ├── question-generation.ts
│   ├── evaluation.ts
│   └── coaching.ts
│
└── types/
    └── ai-responses.ts
```

Keep model names and provider-specific configuration centralised. This allows us to change Grok models or introduce another LLM provider later without rewriting the application.

**Important:** The live interviewer should not depend on a separate, unnecessary LLM call for every interaction if ElevenLabs is already handling its conversational intelligence. We should deliberately decide which reasoning happens inside the ElevenLabs agent and which happens through our xAI services.

## 6.2 Architecture overview

### Presentation layer — Nuxt 3

Responsibilities:

- Onboarding and candidate dashboard.
- Learning centre.
- Interview setup.
- Live voice interview interface.
- Animated voice orb.
- Optional webcam interface.
- Real-time transcript display.
- Feedback and assessment screens.
- Progress visualisation.

### Application layer — Nuxt server

Responsibilities:

- Application business logic.
- Authentication and authorisation checks.
- Candidate profile management.
- Job description processing.
- Interview configuration.
- Question and rubric management.
- Secure ElevenLabs integration.
- Interview session management.
- Transcript ingestion.
- Assessment orchestration.
- Learning recommendations.
- Progress tracking.

### Voice layer — ElevenLabs

Responsibilities:

- Conversational voice interaction.
- Speech recognition and synthesis.
- Real-time conversational turn management.
- Dynamic interview context.
- Tool invocation.
- Conversation events.
- Post-call transcription and analysis where configured.

### Intelligence layer — AI services

Responsibilities:

- CV extraction.
- Job description analysis.
- Interview context generation.
- Question generation.
- Answer evaluation.
- Coaching feedback.
- Personalised learning recommendations.

Keep this layer provider-independent so the underlying language model can be changed without rewriting the application.

### Data layer — Supabase

Responsibilities:

- User authentication.
- Candidate profiles.
- Uploaded documents.
- Job descriptions.
- Interview sessions.
- Conversation transcripts.
- Questions and evaluation rubrics.
- Assessment reports.
- Learning progress.
- Preparation workspaces.

## 6.3 Suggested application structure

```
ai-interview-coach/
│
├── app/
│   ├── components/
│   │   ├── ui/
│   │   ├── interview/
│   │   ├── voice/
│   │   ├── assessment/
│   │   ├── learning/
│   │   └── dashboard/
│   │
│   ├── composables/
│   │   ├── useInterview.ts
│   │   ├── useVoiceSession.ts
│   │   ├── useTranscript.ts
│   │   ├── useMediaDevices.ts
│   │   └── useAssessment.ts
│   │
│   ├── features/
│   │   ├── onboarding/
│   │   ├── preparation/
│   │   ├── interviews/
│   │   ├── learning/
│   │   ├── assessments/
│   │   └── progress/
│   │
│   ├── pages/
│   ├── layouts/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── server/
│   ├── api/
│   │   ├── auth/
│   │   ├── profiles/
│   │   ├── documents/
│   │   ├── job-descriptions/
│   │   ├── preparation/
│   │   ├── learning/
│   │   ├── interviews/
│   │   ├── assessments/
│   │   └── webhooks/
│   │
│   ├── services/
│   │   ├── ai/
│   │   ├── elevenlabs/
│   │   ├── interview/
│   │   ├── assessment/
│   │   ├── coaching/
│   │   └── preparation/
│   │
│   ├── utils/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   │
│   └── middleware/
│
├── shared/
│   ├── types/
│   └── schemas/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
├── public/
└── docs/
    ├── product-requirements.md
    ├── architecture.md
    ├── database-design.md
    └── evaluation-framework.md
```

## 6.4 Backend design principles

Even though Nuxt handles both frontend and backend responsibilities, the application should maintain clear separation of concerns.

- API routes should remain relatively thin.
- Business logic should live in service modules.
- Database access should be organised and reusable.
- Input validation should happen on the server.
- AI integrations should be isolated.
- External provider credentials must remain server-side.
- Long-running tasks should be handled asynchronously.

The application should begin as a modular monolith rather than unnecessary microservices.

## 6.5 Separate the interviewer from the evaluator

This is a fundamental architectural decision.

### Interviewer agent

The interviewer should be optimised for real-time conversational performance.

It should:

- Conduct interviews.
- Follow the configured interview structure.
- Ask relevant follow-up questions.
- Maintain context.
- Manage conversational flow.
- Avoid providing coaching feedback during formal simulations.

### Evaluation engine

The evaluator should operate after an interview or practice exercise.

It should:

- Retrieve the transcript.
- Identify individual questions and answers.
- Match responses against the relevant evaluation rubric.
- Generate evidence-based assessments.
- Identify gaps and misconceptions.
- Return structured evaluation data.

### Coaching engine

The coaching engine uses assessment results to:

- Explain what was missing.
- Teach relevant answer frameworks.
- Provide illustrative improvements.
- Recommend targeted lessons.
- Generate retry exercises.

These should be separate logical services, even if they initially share the same Nuxt server application.

## 6.6 ElevenLabs integration

The backend must securely manage the ElevenLabs integration.

Recommended connection flow:

1. Candidate starts an interview.
2. Nuxt server validates the authenticated user and interview session.
3. Nuxt server requests a signed connection URL from ElevenLabs.
4. Browser establishes the voice session using the temporary signed URL.
5. Conversation events and transcript updates are processed.
6. Session completion triggers persistence and post-interview assessment.

Important requirements:

- Never expose the ElevenLabs API key in the browser.
- Use temporary signed URLs for client-side connections.
- Validate that users can access the interview session.
- Configure agent instructions with the interview context.
- Use appropriate server-side tools for backend actions.
- Validate incoming webhooks.
- Make webhook processing idempotent.

## 6.7 Browser camera and audio handling

The initial interview room should use browser media capabilities.

Responsibilities:

- Request microphone permissions.
- Request webcam permissions only when the user enables video.
- Display the user's local camera feed.
- Allow camera and microphone controls.
- Clean up media streams when the session ends.
- Handle permission denial and device errors gracefully.

No dedicated video conferencing service is required for the initial implementation.

---

# 7. Initial Database Design

Supabase PostgreSQL will serve as the primary application database.

Suggested entities:

| Entity | Purpose |
| --- | --- |
| Profiles | Candidate first and last name, profile and professional preferences |
| CandidateSkills | Skills and proficiency information |
| Documents | Uploaded CVs and document metadata (file name, size, type, storage path, upload date) |
| JobDescriptions | Submitted job opportunity information |
| JobRequirements | Extracted skills and competencies |
| PreparationWorkspaces | Saved preparation goals or job opportunities |
| PreparationPlans | Personalised preparation plans |
| LearningModules | Educational content |
| LearningProgress | Completed lessons and exercises |
| InterviewSessions | Interview configuration and lifecycle |
| InterviewQuestions | Questions used during sessions |
| InterviewAnswers | Candidate responses and transcript segments |
| EvaluationRubrics | Assessment criteria and weights |
| AnswerEvaluations | Per-answer evaluation results |
| InterviewReports | Aggregated session feedback |
| CoachingRecommendations | Suggested improvements |
| PracticeAttempts | Repeated attempts and comparisons |

## 7.1 Important relationships

- One authenticated user has one candidate profile.
- One profile has at most one current CV. Replacing a CV supersedes the previous document. Removing it deletes the file from storage.
- One candidate can have multiple preparation workspaces.
- One workspace can contain optional documents and job descriptions.
- One workspace can contain multiple preparation plans and interview sessions.
- One candidate can also create general practice sessions without a workspace.
- One interview session contains multiple questions and answers.
- One answer can have one or more evaluation records.
- One assessment can produce multiple coaching recommendations.

The database should support historical evaluation versions so that changing an assessment rubric does not silently rewrite previous reports.

## 7.2 Security requirements

Use Supabase Row Level Security to ensure that candidates can only access their own:

- Profiles.
- Documents.
- Preparation workspaces.
- Interview sessions.
- Transcripts.
- Assessment reports.
- Learning progress.

Use server-side access for privileged operations. Never expose the Supabase service-role key in client-side code.

Uploaded CVs should be stored in private storage buckets with appropriately restricted access.

---

# 8. API Design

Initial REST-style Nuxt server endpoints:

```
/api/v1/profiles
/api/v1/documents
/api/v1/job-descriptions
/api/v1/preparation
/api/v1/workspaces
/api/v1/learning
/api/v1/interviews
/api/v1/interviews/{id}
/api/v1/interviews/{id}/start
/api/v1/interviews/{id}/complete
/api/v1/interviews/{id}/transcript
/api/v1/assessments
/api/v1/assessments/{id}
/api/v1/coaching
/api/v1/progress
/api/v1/integrations/elevenlabs
/api/v1/webhooks/elevenlabs
```

Important backend operations:

**Upload CV**

`POST /api/v1/documents` accepts one PDF, DOC or DOCX file up to 5 MB. Validate the type and size on the server, store the file in a private bucket, replace any existing CV for the profile and return the document metadata. `DELETE /api/v1/documents/{id}` removes it.

**Update profile**

`PATCH /api/v1/profiles` updates first name, last name and preparation preferences. Apply the same name rules as sign-up.

**Create preparation plan**

Accept candidate profile and optional job requirements, then return a structured preparation plan.

**Create interview session**

Accept role, experience level, interview type, duration, difficulty and optional preparation workspace.

**Start voice session**

Validate candidate access and issue temporary ElevenLabs connection credentials.

**Complete interview**

Validate the session and trigger transcript processing and evaluation.

**Receive conversation webhook**

Receive completed conversation data from ElevenLabs, verify authenticity, deduplicate events and persist relevant information.

**Generate assessment**

Run the evaluation engine against the stored transcript and the appropriate rubric.

**Retrieve progress**

Return historical performance and improvement trends.

---

# 9. Interview Evaluation Framework

The assessment engine must not rely on a single generic score.

Every question should have a defined evaluation rubric.

Example:

Question: "Describe a challenging technical problem you solved."

Applicable dimensions:

- Context and problem definition.
- Ownership and responsibility.
- Investigation and reasoning.
- Technical solution.
- Trade-off awareness.
- Outcome and reflection.

Each dimension should have clearly defined performance levels.

Example scoring:

| Score | Description |
| --- | --- |
| 1 | Missing or fundamentally incorrect |
| 2 | Limited understanding or explanation |
| 3 | Adequate response with some gaps |
| 4 | Strong, relevant and well-supported response |
| 5 | Excellent depth, clarity and evidence |

The evaluation output should include:

- Score per dimension.
- Supporting transcript excerpts.
- Explanation of the score.
- Missing elements.
- Suggested improvements.
- Recommended practice.

For technical questions, factual correctness should be assessed separately from communication quality.

For behavioural questions, use appropriate frameworks such as STAR, but don't require candidates to follow one rigid format when another clear structure is effective.

The system should never penalise a candidate for their accent or infer intelligence, personality or employability from their voice.

## 9.1 Evaluation output structure

The assessment engine should return structured data that can be stored and rendered consistently.

Example:

```
{
  "question": "How do you approach performance optimisation?",
  "scores": {
    "relevance": 4,
    "technical_accuracy": 3,
    "depth": 3,
    "practical_application": 4,
    "clarity": 4
  },
  "strengths": [
    "Mentioned relevant optimisation techniques",
    "Connected the answer to practical experience"
  ],
  "improvements": [
    "Explain how performance bottlenecks are identified",
    "Discuss trade-offs between caching and lazy loading"
  ],
  "evidence": [
    {
      "excerpt": "I usually start with lazy loading and caching",
      "observation": "Relevant techniques were identified, but the reasoning behind choosing them was not explained."
    }
  ]
}
```

This is an illustrative contract, not a final schema.

---

# 10. Security, Privacy and Reliability

Important requirements:

- Never expose ElevenLabs API keys in the browser.
- Generate authenticated voice session credentials server-side.
- Validate access to interview sessions.
- Validate incoming webhooks.
- Store uploaded CVs securely.
- Restrict access to candidate documents and transcripts.
- Apply rate limits to expensive AI operations.
- Implement conversation and assessment failure handling.
- Use idempotency for webhook processing.
- Provide a way for candidates to delete uploaded documents and conversation data.
- Establish explicit consent and retention policies for audio recordings.

Audio storage should be optional where possible. The initial MVP should prioritise transcripts and assessment data rather than retaining every recording indefinitely.

The application should communicate that its AI assessments are guidance, not definitive recruitment decisions.

## 10.1 Reliability considerations

- Recover gracefully from interrupted voice sessions.
- Persist conversation events where appropriate.
- Prevent duplicate interview completion processing.
- Retry failed assessment jobs safely.
- Allow candidates to retrieve completed sessions.
- Handle temporary failures from ElevenLabs and AI providers.
- Communicate clearly when a session cannot be recovered.

---

# 11. Non-functional Requirements

**Performance**

- Fast initial application load.
- Responsive interview interface.
- Low-latency voice interaction.
- Background processing for expensive assessments.
- Efficient database queries.

**Reliability**

- Recover gracefully from interrupted voice sessions.
- Persist completed conversation data.
- Prevent duplicate assessments.
- Allow users to retry failed processing jobs.

**Scalability**

- Separate live voice sessions from post-interview processing.
- Use background processing for assessment jobs.
- Avoid unnecessary synchronous calls to language models.
- Keep application modules modular and provider-independent.

**Accessibility**

- Keyboard-accessible interface.
- Text-based interview alternative.
- Captions and transcripts.
- Clear microphone permissions and status indicators.
- Support for users with different accessibility requirements.

**Privacy**

- Explicit microphone and camera permission.
- Camera remains optional.
- Clear data retention policies.
- Secure document access.
- Candidate control over uploaded information and interview history.

---

# 12. Product Success Metrics

We should measure actual improvement, not just usage.

Initial metrics:

| Metric | What it tells us |
| --- | --- |
| Interview completion rate | Whether users complete practice sessions |
| Feedback usefulness rating | Whether coaching is valuable |
| Repeat practice rate | Whether users return to improve |
| Answer improvement | Whether repeated attempts demonstrate progress |
| Learning-to-practice conversion | Whether lessons lead to practice |
| Voice session failure rate | Reliability of the voice experience |
| Assessment processing time | Backend performance |
| Cost per completed interview | Economic sustainability |

A particularly important experiment:

Give candidates an initial assessment, assign targeted learning exercises, then conduct a comparable second assessment.

Compare the results using the same rubric.

This gives us an early indication of whether the platform is actually improving interview performance.

---

# 13. Development Roadmap

## Phase 1 — Product and engineering foundation

- Finalise interview categories.
- Define question taxonomy.
- Design evaluation rubrics.
- Create initial question bank.
- Establish design system.
- Set up Nuxt application.
- Configure Supabase project.
- Create initial database schema.
- Implement authentication.

**Deliverable:** Working application foundation.

## Phase 2 — Interview preparation and learning

- Build candidate onboarding.
- Implement role and experience selection.
- Build interview configuration.
- Implement foundational learning modules.
- Create optional CV upload.
- Create optional job description input.
- Implement job requirement extraction.
- Generate personalised preparation context.

**Deliverable:** Candidates can configure practice sessions and access relevant learning content.

## Phase 3 — Voice interviewer and interview room

- Create ElevenLabs agent.
- Configure interviewer instructions.
- Implement secure signed URL generation.
- Build microphone controls.
- Build animated voice orb.
- Implement live transcript.
- Add optional webcam support through browser APIs.
- Implement contextual follow-ups.
- Add session timer and controls.
- Persist interview sessions.

**Deliverable:** Candidates can complete realistic voice-based interviews with optional self-video.

## Phase 4 — Assessment and coaching

- Build transcript processing.
- Implement evaluation rubrics.
- Generate structured assessments.
- Build feedback interface.
- Implement personalised coaching.
- Implement question retry.
- Compare multiple attempts.

**Deliverable:** Candidates can understand their mistakes and practise improving them.

## Phase 5 — Progress and refinement

- Build interview history.
- Implement preparation workspaces.
- Add progress dashboard.
- Implement personalised recommendations.
- Add reliability monitoring.
- Improve agent prompts and evaluations.
- Conduct real-user testing.

**Deliverable:** A complete initial MVP ready for controlled public testing.

---

# 14. Initial Acceptance Criteria

The MVP is ready for initial release when:

1. A candidate can create an account with their first and last name and complete their professional profile.
2. A candidate can select a technology role and experience level.
3. A candidate can configure an interview category, duration and difficulty.
4. A candidate can practise without uploading a CV or job description.
5. A candidate can optionally submit a CV and job description for personalised preparation.
   - A candidate can edit their name and upload, replace or remove a CV from Settings.
6. The platform can generate relevant interview questions.
7. A candidate can start and complete a voice interview.
8. The AI interviewer can ask relevant contextual follow-up questions.
9. The candidate can see an animated voice orb reflecting conversation states.
10. The candidate can enable or disable their webcam.
11. The candidate can access the interview transcript.
12. The evaluation engine can produce structured, evidence-supported feedback.
13. The candidate can retry questions and receive a new assessment.
14. The platform can save and retrieve interview history.
15. Candidate data is protected and sessions are securely authenticated.
16. The application can handle interrupted sessions and failed background processing gracefully.

---

# 15. Guiding Product Principles

1. **Learning over memorisation:** Teach transferable interview skills.
2. **Evidence over generic scoring:** Explain why feedback was given.
3. **Personalisation without friction:** CVs and job descriptions improve preparation but are not prerequisites.
4. **Practice over passive consumption:** Encourage candidates to speak, explain and demonstrate understanding.
5. **Improvement over judgement:** Make feedback constructive and actionable.
6. **Transparency over false certainty:** Never claim to know exactly what a recruiter expects or guarantee hiring outcomes.
7. **Accessibility over assumptions:** Make voice a powerful option, not the only way to use the product.
8. **Simplicity over premature complexity:** Build only the infrastructure needed to deliver the core experience.

---

# 16. Immediate Engineering Priorities

Before building the full application, validate the most important product experience.

## First engineering milestone: End-to-end voice interview

Build a vertical slice where a user can:

1. Select Senior Frontend Engineer.
2. Choose an interview difficulty and duration.
3. Start a voice interview.
4. Hear the AI interviewer ask a relevant question.
5. Respond through their microphone.
6. Receive a contextual follow-up question.
7. Interrupt or pause the conversation.
8. See the voice orb respond to conversation activity.
9. Optionally enable their webcam.
10. View the transcript.
11. End the interview.
12. Receive a post-interview evaluation.

This should be the first major proof of concept.

It will validate the most important technical and product assumptions before investing heavily in dashboards, advanced analytics or other secondary features.

## First product validation

Recruit 5–10 technology professionals to test the initial experience.

Observe:

- Whether the interview feels natural.
- Whether follow-up questions are relevant.
- Whether users find the evaluation useful.
- Whether feedback identifies things they hadn't considered.
- Whether targeted practice improves subsequent responses.
- Whether users want to return for another session.

The goal is to validate that the platform helps people become better at interviews, not simply that they enjoy talking to an AI.

---

# 17. Final Product Definition

An AI-powered interview preparation and coaching platform that helps professionals learn interview techniques, practise realistic interviews through natural voice conversations and continuously improve through personalised, evidence-based feedback.

Candidates can practise using a selected professional role and experience level, or optionally provide their CV and a job description to make preparation more specific to an actual opportunity.

The platform combines structured learning, adaptive AI interviewing, voice interaction, optional webcam support and post-interview coaching.

**The product's central promise:**

Practise interviews with AI. Become better at showing what you know, what you can do and the value you can bring to a team.