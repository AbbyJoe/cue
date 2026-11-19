<template>
  <PageLoading v-if="pending" />
  <section v-else class="mx-auto max-w-6xl">
    <PageHeader
      title="Improvement over time"
      :description="active ? `Repeated attempts in ${active.name}.` : 'Repeated attempts outside a workspace.'"
    />

    <p v-if="error" class="mt-8 text-sm text-danger">
      {{ error }}
    </p>
    <div v-else-if="interviews.length === 0" class="mt-8">
      <EmptyState
        icon="Chart2"
        title="Nothing to compare yet"
        description="Progress comes from repeating the same kind of interview and reading the evidence. It will not average unrelated scores."
      >
        <Button to="/dashboard/practise">
          Start a session
        </Button>
      </EmptyState>
    </div>
    <div v-else class="mt-8 grid gap-4">
      <div class="grid gap-3 sm:grid-cols-3">
        <article class="card p-5">
          <p class="text-xs text-ink-faint">Sessions</p>
          <p class="mt-2 text-2xl font-semibold tabular-nums">{{ interviews.length }}</p>
        </article>
        <article class="card p-5">
          <p class="text-xs text-ink-faint">This week</p>
          <p class="mt-2 text-2xl font-semibold tabular-nums">{{ thisWeek }}</p>
        </article>
        <article class="card p-5">
          <p class="text-xs text-ink-faint">Focus next</p>
          <p class="mt-2 text-base font-semibold">{{ focus?.name ?? 'Keep practising' }}</p>
          <NuxtLink v-if="focusLesson" :to="`/dashboard/learning/${focusLesson.slug}`" class="mt-2 inline-flex text-sm font-medium text-accent hover:text-ink">
            {{ focusLesson.title }}
          </NuxtLink>
        </article>
      </div>

      <article v-for="group in groups" :key="group.category" class="card p-6">
        <header class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-base font-semibold">{{ group.category || 'Interview' }}</h2>
          <p class="text-xs text-ink-soft">{{ group.count }} {{ group.count === 1 ? 'session' : 'sessions' }}</p>
        </header>
        <ul class="mt-5 grid gap-4 sm:grid-cols-2">
          <li v-for="score in group.scores" :key="score.name">
            <div class="flex items-baseline justify-between text-xs">
              <span class="text-ink-soft">{{ score.name }}</span>
              <span class="font-medium tabular-nums">{{ score.label }}</span>
            </div>
            <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-subtle">
              <span class="block h-full rounded-full bg-accent" :style="{ width: score.width }" />
            </div>
          </li>
        </ul>
        <p v-if="group.change" class="mt-4 text-sm text-ink-soft">
          {{ group.change }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { InterviewRecord } from '#shared/types/interview'
import { averageScore, lessonFor, rubric, weakestScore } from '~/utils/coaching'

definePageMeta({ layout: 'app' })
useHead({ title: 'Progress' })

const { active } = useWorkspaces()
const { interviews, pending, error, load } = useInterviews()

const thisWeek = computed(() => interviews.value.filter((interview) => Date.now() - new Date(interview.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length)
const focus = computed(() => weakestScore(interviews.value))
const focusLesson = computed(() => focus.value ? lessonFor(focus.value.name) : null)

const groups = computed(() => {
  const byCategory = new Map<string, InterviewRecord[]>()
  for (const interview of interviews.value) {
    const key = interview.category || 'Interview'
    byCategory.set(key, [...(byCategory.get(key) ?? []), interview])
  }
  return [...byCategory.entries()].map(([category, rows]) => ({
    category,
    count: rows.length,
    scores: rubric.map((item) => {
      const value = averageScore(rows, item.name)
      return {
        name: item.name,
        label: value == null ? '–/5' : `${value.toFixed(1)}/5`,
        width: value == null ? '0%' : `${value * 20}%`,
      }
    }),
    change: compared(rows),
  }))
})

function overall(interview: InterviewRecord) {
  const scores = interview.feedback?.scores ?? []
  if (scores.length === 0) {
    return null
  }
  return scores.reduce((total, score) => total + score.value, 0) / scores.length
}

function compared(rows: InterviewRecord[]) {
  const [latest, previous] = rows
  if (!latest || !previous) {
    return ''
  }
  const next = overall(latest)
  const prior = overall(previous)
  if (next == null || prior == null) {
    return ''
  }
  const delta = next - prior
  if (Math.abs(delta) < 0.05) {
    return 'The latest session scored about the same as the one before it.'
  }
  const direction = delta > 0 ? 'higher' : 'lower'
  return `The latest session scored ${Math.abs(delta).toFixed(1)} ${direction} than the one before it.`
}

onMounted(() => {
  load()
})
</script>
