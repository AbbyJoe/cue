<template>
  <section class="mx-auto max-w-6xl">
    <PageHeader
      :title="greeting"
      description="Your AI interviewer is ready. Practise out loud, then review the evidence in your answers."
    />

    <!-- Hero: next session -->
    <article class="card mt-8 grid animate-rise overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div class="p-7 lg:flex lg:flex-col lg:justify-center lg:p-10">
        <h2 class="mt-5 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em] sm:text-[2rem]">
          A {{ labelFor('category', setup.category).toLowerCase() }} interview for
          <span class="text-accent">{{ roleText }}</span>
        </h2>
        <p class="mt-3 max-w-md text-[15px] leading-6 text-ink-soft">
          Realistic questions at {{ labelFor('level', setup.level).toLowerCase() }} depth, with follow-ups that adapt to what you actually say.
        </p>

        <ul class="mt-6 flex flex-wrap gap-2">
          <li v-for="item in setupChips" :key="item.label" class="chip">
            <Icon :name="item.icon" :size="14" class="text-ink-faint" />
            {{ item.label }}
          </li>
        </ul>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <Button :to="{ path: '/interview', query: setupQuery(setup) }">
            <Icon name="Microphone2" :size="18" />
            Start interview
          </Button>
          <Button to="/dashboard/practise" variant="secondary">
            Customise
          </Button>
        </div>
      </div>

      <div class="relative isolate flex min-h-[22rem] flex-col items-center justify-center gap-2 overflow-hidden border-t border-line bg-sunken px-6 pb-7 pt-10 lg:border-l lg:border-t-0">
        <div class="aurora -z-10 animate-drift" aria-hidden="true" />
        <span class="glass absolute left-4 top-4 inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-ink-soft !shadow-xs">
          <span class="h-1.5 w-1.5 animate-blink rounded-full bg-accent" />
          Live preview
        </span>
        <VoiceOrb state="speaking" :size="orbSize" />
        <div class="glass min-h-[4.25rem] w-full max-w-[22rem] rounded-2xl px-[0.9rem] py-[0.7rem]">
          <p class="text-[13px] font-medium text-accent-strong">Interviewer</p>
          <p class="mt-[0.2rem] text-sm leading-[1.45] text-ink">{{ typed }}<span class="caret" /></p>
        </div>
      </div>
    </article>

    <!-- Quick start by category -->
    <div class="mt-12 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-base font-semibold">Quick start</h2>
        <p class="mt-1 text-sm text-ink-soft">Jump straight into a focused conversation.</p>
      </div>
      <NuxtLink to="/dashboard/practise" class="hidden items-center gap-1 text-[13px] font-medium text-ink-soft hover:text-ink sm:inline-flex">
        All options
        <Icon name="ArrowRight2" :size="14" />
      </NuxtLink>
    </div>
    <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="(mode, index) in modes"
        :key="mode.value"
        :to="{ path: '/interview', query: setupQuery({ ...setup, category: mode.value }) }"
        class="card group block animate-rise p-5 transition duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft"
        :style="{ animationDelay: `${80 + index * 60}ms` }"
      >
        <div class="flex items-start justify-between">
          <span :class="['grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors duration-150 group-hover:bg-accent-solid group-hover:text-white', mode.tint]">
            <Icon :name="mode.icon" :size="20" />
          </span>
          <Icon name="ArrowRight" :size="18" class="text-ink-faint transition duration-150 group-hover:translate-x-[3px] group-hover:text-ink" />
        </div>
        <h3 class="mt-6 text-[15px] font-semibold">{{ mode.title }}</h3>
        <p class="mt-1.5 text-[13px] leading-5 text-ink-soft">{{ mode.description }}</p>
        <p class="mt-5 text-xs text-ink-faint">
          {{ setup.duration }} min · Focus on {{ mode.focus.toLowerCase() }}
        </p>
      </NuxtLink>
    </div>

    <!-- Learning + rubric -->
    <div class="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section class="card overflow-hidden">
        <header class="flex items-center justify-between gap-4 px-5 py-[1.1rem]">
          <div>
            <h2 class="text-base font-semibold">Continue learning</h2>
            <p class="mt-0.5 text-[13px] text-ink-soft">Learn what interviewers listen for.</p>
          </div>
          <Button to="/dashboard/learning" variant="ghost" size="sm">
            View all
          </Button>
        </header>
        <ul>
          <li v-for="(lesson, index) in lessons" :key="lesson.slug" class="border-t border-line">
            <NuxtLink :to="`/dashboard/learning/${lesson.slug}`" class="group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-surface-hover">
              <span class="grid h-7 w-7 flex-none place-items-center rounded-full bg-sunken text-xs font-medium tabular-nums text-ink-soft transition-colors duration-150 group-hover:bg-accent-solid group-hover:text-white">{{ index + 1 }}</span>
              <span class="min-w-0 flex-1">
                <span class="flex flex-wrap items-center gap-2">
                  <span class="text-[15px] font-medium text-ink">{{ lesson.title }}</span>
                  <span class="rounded-full bg-sunken px-2 text-[11px] leading-5 text-ink-soft">{{ lesson.category }}</span>
                </span>
                <span class="mt-1 block truncate text-[13px] text-ink-soft">{{ lesson.summary }}</span>
              </span>
              <Icon name="ArrowRight2" :size="16" class="text-ink-faint transition duration-150 group-hover:translate-x-[3px] group-hover:text-ink" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section class="card overflow-hidden">
        <header class="flex items-center justify-between gap-4 px-5 py-[1.1rem]">
          <div>
            <h2 class="text-base font-semibold">How you are evaluated</h2>
            <p class="mt-0.5 text-[13px] text-ink-soft">Scores appear after your first interview.</p>
          </div>
          <span class="chip">
            <Icon name="Chart2" :size="14" />
            0 sessions
          </span>
        </header>
        <ul class="space-y-4 border-t border-line px-5 py-5">
          <li v-for="dimension in rubric" :key="dimension.name">
            <div class="flex items-baseline justify-between gap-3">
              <span class="text-[13px] font-medium text-ink">{{ dimension.name }}</span>
              <span class="text-xs tabular-nums text-ink-faint">–/5</span>
            </div>
            <p class="mt-0.5 text-xs text-ink-faint">{{ dimension.question }}</p>
            <div class="mt-2 grid grid-cols-5 gap-[3px]">
              <span v-for="step in 5" :key="step" class="h-1 rounded-full bg-panel" />
            </div>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { lessons as allLessons } from '~/data/lessons'
import { defaultSetup, labelFor, levels, roles, setupQuery } from '~/utils/interview'
import type { InterviewSetup } from '~/utils/interview'
import { readProfile } from '~/utils/profile'

definePageMeta({ layout: 'app' })
useHead({ title: 'Overview' })

const setup = reactive<InterviewSetup>({ ...defaultSetup })
const targetRole = ref('')
const greeting = ref('Welcome back')
const today = ref('Overview')
const orbSize = ref(240)

const lessons = allLessons.slice(0, 4)

const roleText = computed(() => targetRole.value || labelFor('role', setup.role).toLowerCase())

const setupChips = computed(() => [
  { icon: 'Briefcase', label: labelFor('role', setup.role) },
  { icon: 'Award', label: labelFor('level', setup.level) },
  { icon: 'Timer1', label: `${setup.duration} minutes` },
  { icon: 'Profile2User', label: labelFor('style', setup.style) },
])

const modes = [
  { value: 'general', title: 'General & HR', icon: 'MessageQuestion', tint: 'bg-aura-peach', focus: 'Story', description: 'Introductions, motivation, strengths and the questions recruiters always ask.' },
  { value: 'behavioural', title: 'Behavioural', icon: 'People', tint: 'bg-aura-sky', focus: 'Evidence', description: 'Real situations, your decisions, and what changed because of them.' },
  { value: 'technical', title: 'Technical', icon: 'Code1', tint: 'bg-aura-mint', focus: 'Depth', description: 'Explain concepts, trade-offs and how you would build or debug it.' },
  { value: 'leadership', title: 'Leadership', icon: 'Lamp', tint: 'bg-aura-sun', focus: 'Influence', description: 'Mentoring, direction and raising the quality of other people’s work.' },
]

const rubric = [
  { name: 'Relevance', question: 'Did you answer the question that was asked?' },
  { name: 'Structure', question: 'Was the response organised logically?' },
  { name: 'Depth', question: 'Did you show enough understanding for your level?' },
  { name: 'Clarity', question: 'Was the explanation easy to follow?' },
  { name: 'Evidence', question: 'Did you support it with real examples?' },
]

const questions = [
  'Walk me through a performance problem you solved recently.',
  'Tell me about a decision you made with incomplete information.',
  'How would you explain caching to a new engineer on your team?',
  'What would you do differently if you started that project again?',
]

const typed = ref('')
let typing: ReturnType<typeof setTimeout> | undefined

function typeQuestion(index: number, chars = 0) {
  const text = questions[index % questions.length] 
  if (text && chars <= text.length) {
    typed.value = text.slice(0, chars)
    typing = setTimeout(() => typeQuestion(index, chars + 1), 38)
    return
  }
  typing = setTimeout(() => typeQuestion(index + 1, 0), 2600)
}

function setOrbSize() {
  orbSize.value = window.innerWidth < 640 ? 200 : 240
}

onMounted(() => {
  const profile = readProfile()
  if (roles.some((option) => option.value === profile.specialisation)) {
    setup.role = profile.specialisation
  }
  if (levels.some((option) => option.value === profile.level)) {
    setup.level = profile.level
  }
  targetRole.value = profile.targetRole

  const now = new Date()
  const hour = now.getHours()
  const salutation = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  greeting.value = profile.firstName ? `${salutation}, ${profile.firstName}` : salutation

  setOrbSize()
  window.addEventListener('resize', setOrbSize)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = questions[0]
  } else {
    typeQuestion(0)
  }
})

onBeforeUnmount(() => {
  clearTimeout(typing)
  window.removeEventListener('resize', setOrbSize)
})
</script>
