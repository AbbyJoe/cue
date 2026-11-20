<template>
  <PageLoading v-if="pending" />
  <section v-else class="mx-auto max-w-6xl">
    <PageHeader
      title="Past interviews"
      :description="active ? `Sessions in ${active.name}, with the transcript and assessment.` : 'Sessions outside a workspace, with the transcript and assessment.'"
    />
    <div v-if="waiting" class="card mt-8 flex items-center gap-4 px-5 py-4">
      <CueLogo :size="32" animated />
      <p class="text-sm text-ink-soft">Scoring this interview. It will show up here in a moment.</p>
    </div>
    <p v-else-if="scoreMissed" class="card mt-8 px-5 py-4 text-sm text-ink-soft">
      This interview could not be saved. Practise again when you are ready.
    </p>
    <p v-if="loadError" class="mt-8 text-sm text-danger">
      {{ loadError }}
    </p>
    <div v-else-if="interviews.length === 0 && !waiting" class="mt-8">
      <EmptyState
        icon="Clock"
        title="No interviews yet"
        description="Completed voice sessions will be listed here, with the role, the category, and the date."
      >
        <Button to="/dashboard/practise">
          <Icon name="Microphone2" :size="18" />
          Practise an interview
        </Button>
      </EmptyState>
    </div>
    <div v-else class="mt-8 grid gap-4">
      <article v-for="interview in interviews" :key="interview.id" class="card p-6">
        <header class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-base font-semibold">
            {{ interview.role || 'Interview' }}
          </h2>
          <p class="text-xs text-ink-soft">
            {{ when(interview.createdAt) }}
          </p>
        </header>
        <p class="mt-1 text-sm text-ink-soft">
          {{ [interview.level, interview.category].filter(Boolean).join(' · ') }}
        </p>

        <template v-if="interview.feedback">
          <p class="mt-4 text-sm leading-6">
            {{ interview.feedback.summary }}
          </p>
          <ul v-if="interview.feedback.scores.length" class="mt-5 grid gap-4 sm:grid-cols-2">
            <li v-for="score in interview.feedback.scores" :key="score.name">
              <div class="flex items-baseline justify-between text-xs">
                <span class="text-ink-soft">{{ score.name }}</span>
                <span class="font-medium tabular-nums">{{ score.value }}/5</span>
              </div>
              <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-subtle">
                <span class="block h-full rounded-full bg-accent" :style="{ width: `${score.value * 20}%` }" />
              </div>
              <p v-if="score.note" class="mt-1.5 text-xs leading-5 text-ink-soft">
                {{ score.note }}
              </p>
            </li>
          </ul>
          <div v-if="interview.feedback.strengths.length || interview.feedback.improvements.length" class="mt-5 grid gap-4 sm:grid-cols-2">
            <div v-if="interview.feedback.strengths.length">
              <h3 class="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Strengths
              </h3>
              <ul class="mt-2 space-y-1.5 text-sm leading-6">
                <li v-for="item in interview.feedback.strengths" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div v-if="interview.feedback.improvements.length">
              <h3 class="text-xs font-medium uppercase tracking-wide text-ink-soft">
                To work on
              </h3>
              <ul class="mt-2 space-y-1.5 text-sm leading-6">
                <li v-for="item in interview.feedback.improvements" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </template>

        <div class="mt-5 flex flex-wrap gap-3">
          <Button :to="again(interview)" variant="secondary" size="sm">
            Practise this again
          </Button>
          <Button v-if="nextLesson(interview)" :to="`/dashboard/learning/${nextLesson(interview)?.slug}`" variant="ghost" size="sm">
            Review {{ nextLesson(interview)?.title }}
          </Button>
        </div>

        <details v-if="interview.transcript.length" class="mt-5">
          <summary class="cursor-pointer text-sm font-medium">
            Transcript
          </summary>
          <ol class="mt-3 space-y-3">
            <li v-for="(line, index) in interview.transcript" :key="index" class="text-sm leading-6">
              <span class="text-xs font-medium uppercase tracking-wide text-ink-soft">
                {{ line.from === 'you' ? 'You' : 'Interviewer' }}
              </span>
              <p>{{ line.text }}</p>
            </li>
          </ol>
        </details>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { InterviewRecord } from '#shared/types/interview'
import { lessonFor, weakestScore } from '~/utils/coaching'
import { valueFor } from '~/utils/interview'

definePageMeta({ layout: 'app' })
useHead({ title: 'History' })

const { active } = useWorkspaces()
const route = useRoute()
const waiting = ref(route.query.pending === '1')
const scoreMissed = ref(false)
const { interviews, pending, error: loadError, load } = useInterviews()
let poll = 0

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function again(interview: InterviewRecord) {
  const query: Record<string, string> = {}
  const role = valueFor('role', interview.role)
  const level = valueFor('level', interview.level)
  const category = valueFor('category', interview.category)
  if (role) query.role = role
  if (level) query.level = level
  if (category) query.category = category
  return { path: '/interview', query }
}

function nextLesson(interview: InterviewRecord) {
  const weak = weakestScore([interview])
  return weak ? lessonFor(weak.name) : null
}

onMounted(async () => {
  await load()
  if (!waiting.value) {
    return
  }
  const fresh = interviews.value.some((interview: InterviewRecord) => Date.now() - new Date(interview.createdAt).getTime() < 20 * 1000)
  if (fresh) {
    waiting.value = false
    return
  }
  const known = new Set(interviews.value.map((interview: InterviewRecord) => interview.id as string))
  let tries = 0
  poll = window.setInterval(async () => {
    tries += 1
    await load(true)
    const arrived = interviews.value.some((interview: InterviewRecord) => !known.has(interview.id as string) || Date.now() - new Date(interview.createdAt).getTime() < 20 * 1000)
    if (arrived || tries >= 15) {
      window.clearInterval(poll)
      waiting.value = false
      scoreMissed.value = !arrived
    }
  }, 4000)
})

onBeforeUnmount(() => {
  window.clearInterval(poll)
})
</script>
