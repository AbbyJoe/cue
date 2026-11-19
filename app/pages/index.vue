<template>
  <div class="relative isolate min-h-screen overflow-x-hidden bg-canvas">
    <!-- Aurora wash behind the hero, fading out into the page -->
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" aria-hidden="true">
      <div class="aurora animate-drift" />
    </div>

    <!-- Top bar -->
    <header :class="[wrap, 'flex items-center justify-between py-5 lg:py-6']">
      <Wordmark animated />
      <div class="flex items-center gap-2">
        <Button to="/auth/login" variant="ghost" size="sm">Log in</Button>
        <Button to="/auth/signup" size="sm">Get started</Button>
      </div>
    </header>

    <!-- Hero -->
    <section :class="[wrap, 'grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-16 pt-8 lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:pt-4']">
      <div>
        <p class="glass inline-flex animate-rise items-center gap-2 rounded-full py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-ink-soft !shadow-xs">
          <Icon name="MagicStar" :size="14" class="text-accent" />
          Voice-first AI interview coach
        </p>

        <h1 class="mt-6 animate-rise text-[clamp(2.6rem,6.2vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] [animation-delay:60ms]">
          Rehearse the
          <span class="block min-h-[1.05em] whitespace-nowrap text-accent [font-variant-ligatures:none]" aria-live="polite">{{ word }}</span>
          before it counts.
        </h1>

        <p class="mt-6 max-w-lg animate-rise text-[17px] leading-[1.7] text-ink-soft [animation-delay:120ms]">
          Have real spoken conversations with an AI interviewer that listens, follows up,
          and shows you exactly where your answers land, and where they slip.
        </p>

        <div class="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">
          <Button to="/auth/signup" size="lg">
            Start practising free
            <Icon name="ArrowRight" :size="18" />
          </Button>
          <Button variant="secondary" size="lg" @click="toggleTalk">
            <Icon :name="talking ? 'MicrophoneSlash' : 'Microphone2'" :size="18" />
            {{ talking ? 'Stop listening' : 'Talk to the orb' }}
          </Button>
        </div>

        <ul class="mt-8 flex animate-rise flex-wrap gap-x-[1.4rem] gap-y-2.5 [animation-delay:240ms]">
          <li v-for="item in assurances" :key="item" class="inline-flex items-center gap-[0.45rem] text-[13px] text-ink-soft">
            <Icon name="TickCircle" :size="15" class="text-accent" />
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- Stage -->
      <div class="grid animate-rise justify-items-center gap-5 [animation-delay:120ms]">
        <div
          class="relative grid aspect-square w-full max-w-xl place-items-center"
          @mouseenter="demo.paused.value = true"
          @mouseleave="demo.paused.value = talking"
        >
          <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 600 600" aria-hidden="true">
            <circle cx="300" cy="300" r="296" class="fill-none stroke-line" />
            <circle cx="300" cy="300" r="236" class="fill-none stroke-line-faint" />
            <line
              v-for="i in 72"
              :key="i"
              x1="300"
              :y1="i % 6 === 0 ? 4 : 10"
              x2="300"
              y2="18"
              stroke-width="1.5"
              :class="i % 6 === 0 ? 'stroke-line-hover' : 'stroke-line'"
              :transform="`rotate(${i * 5} 300 300)`"
            />
            <circle
              cx="300"
              cy="300"
              r="236"
              class="origin-center animate-spin-slow fill-none stroke-line-strong [stroke-dasharray:48_28] [transform-box:fill-box]"
            />
            <circle
              cx="300"
              cy="300"
              r="296"
              stroke-width="2"
              stroke-linecap="round"
              class="origin-center animate-spin-fast fill-none stroke-accent [stroke-dasharray:120_1740] [transform-box:fill-box]"
            />
          </svg>

          <button
            type="button"
            class="relative z-[1] cursor-pointer rounded-full"
            :aria-label="talking ? 'Stop listening' : 'Talk to the orb'"
            @click="toggleTalk"
          >
            <VoiceOrb :state="orbState" :level="orbLevel" :size="orbSize" interactive />
          </button>

          <p class="glass absolute bottom-[13%] z-[2] hidden items-center gap-[0.45rem] rounded-full px-3 py-1 !shadow-xs text-xs font-medium text-ink-soft sm:inline-flex">
            <VoiceBars v-if="orbState === 'listening'" :level="orbLevel" :count="5" :height="10" class="text-ink" />
            <Icon v-else :name="phaseIcon" :size="13" />
            {{ phaseLabel }}
          </p>

          <!-- Floating conversation cards -->
          <Transition v-bind="floatIn">
            <div v-if="!talking" :class="[floatCard, '-top-[2%] left-0 w-[78%] sm:left-[-2%] sm:top-[2%] sm:w-[min(17rem,70%)]']">
              <p :class="cardLabel">
                <CueLogo :size="14" />
                Interviewer
                <span class="font-normal text-ink-faint">{{ demo.scenario.value.role }}</span>
              </p>
              <p class="mt-1.5 min-h-[2.6em] text-sm leading-[1.45] text-ink">
                {{ demo.question.value }}<span v-if="demo.phase.value === 'asking'" class="caret" />
              </p>
            </div>
          </Transition>

          <Transition v-bind="floatIn">
            <div v-if="!talking && demo.phase.value !== 'asking'" :class="[floatCard, '-bottom-[4%] right-0 w-[78%] sm:bottom-[2%] sm:right-[-2%] sm:w-[min(17rem,70%)]']">
              <p :class="cardLabel">
                <VoiceBars :level="demo.level.value" :count="8" :height="10" :active="demo.phase.value === 'answering'" class="text-ink" />
                You
              </p>
              <p class="mt-1.5 min-h-[2.6em] text-sm leading-[1.45] text-ink-soft">{{ demo.answer.value }}</p>
            </div>
          </Transition>

          <Transition v-bind="floatIn">
            <div
              v-if="!talking && (demo.phase.value === 'thinking' || demo.phase.value === 'feedback')"
              :class="[floatCard, 'right-[-6%] top-[22%] hidden w-[min(14rem,60%)] lg:block']"
            >
              <p :class="cardLabel">
                <Icon name="Chart2" :size="13" class="text-accent" />
                {{ demo.phase.value === 'thinking' ? 'Evaluating answer' : 'Feedback' }}
              </p>
              <ScoreList :scores="demo.scenario.value.scores" :shown="demo.phase.value === 'feedback'" class="mt-3" />
              <p v-if="demo.phase.value === 'feedback'" class="mt-3 border-t border-line pt-2.5 text-xs leading-[1.45] text-ink-soft">
                {{ demo.scenario.value.tip }}
              </p>
            </div>
          </Transition>

          <Transition v-bind="floatIn">
            <div v-if="talking" :class="[floatCard, 'bottom-0 w-[min(20rem,90%)] text-center']">
              <p class="text-sm font-medium text-ink">{{ micError || 'Go ahead, say something.' }}</p>
              <p class="mt-1 text-xs text-ink-faint">Your voice is only used to animate the orb. Nothing is recorded or sent.</p>
            </div>
          </Transition>
        </div>

        <div class="glass flex max-w-full flex-wrap gap-1 rounded-[1.25rem] p-1 !shadow-xs" role="tablist" aria-label="Example interviews">
          <button
            v-for="(scenario, i) in demoScenarios"
            :key="scenario.id"
            type="button"
            role="tab"
            class="h-8 rounded-full px-[0.95rem] text-[13px] font-medium transition-colors duration-150"
            :class="demo.index.value === i && !talking ? 'bg-accent-solid text-white shadow-button' : 'text-ink-soft hover:text-ink'"
            :aria-selected="demo.index.value === i"
            @click="pick(i)"
          >
            {{ scenario.track }}
          </button>
        </div>
      </div>
    </section>

    <!-- Question ticker -->
    <section class="group grid gap-3 py-6 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" aria-label="Example interview questions">
      <div v-for="(row, r) in tickerRows" :key="r" class="overflow-hidden">
        <div
          class="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]"
          :class="{ '[animation-direction:reverse]': r === 1 }"
        >
          <span
            v-for="(item, i) in [...row, ...row]"
            :key="i"
            class="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-sm text-ink shadow-xs"
          >
            <span class="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-strong">{{ item.tag }}</span>
            {{ item.q }}
          </span>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section :class="[wrap, 'pb-16 pt-24']">
      <p class="badge">How a session works</p>
      <h2 class="mt-5 max-w-[34rem] text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.035em]">
        Ten minutes. One conversation. A clear next step.
      </h2>
      <ol class="mt-12 grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in steps" :key="step.title" class="card group relative p-7 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
          <span :class="['grid h-11 w-11 place-items-center rounded-xl text-ink', step.tint]">
            <Icon :name="step.icon" :size="20" />
          </span>
          <p class="mt-6 text-[13px] text-ink-faint">Step {{ i + 1 }}</p>
          <h3 class="mt-1 text-[17px] font-semibold">{{ step.title }}</h3>
          <p class="mt-2 max-w-[22rem] text-[15px] leading-[1.6] text-ink-soft">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <!-- Closing CTA -->
    <section :class="[wrap, 'pb-24 pt-10']">
      <div class="relative isolate grid justify-items-center gap-7 overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-20 text-center">
        <div class="aurora -z-10 bg-aurora-soft opacity-90" aria-hidden="true" />
        <span class="glass grid h-20 w-20 place-items-center rounded-[1.4rem]"><CueLogo :size="44" animated /></span>
        <h2 class="text-[clamp(1.9rem,4.4vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
          Your next interview is a conversation.<br><span class="text-accent">Practise it out loud.</span>
        </h2>
        <Button to="/auth/signup" size="lg">
          Get started
          <Icon name="ArrowRight" :size="18" />
        </Button>
      </div>
    </section>

    <footer :class="[wrap, 'flex flex-wrap items-center justify-between gap-4 border-t border-line pb-9 pt-7 text-[13px] text-ink-faint']">
      <Wordmark :size="22" />
      <p>© {{ year }} Cue. Practise interviews with AI.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { demoScenarios } from '~/data/demo'

useHead({ title: 'Practise interviews out loud' })

const word = useScramble(['case interview', 'hard follow-up', 'salary talk', 'panel round', 'first five minutes'])
const demo = useInterviewDemo(demoScenarios)
const { active: talking, level: micLevel, error: micError, toggle: toggleMic, release: releaseMic } = useMicrophone()

const orbSize = ref(320)
const year = new Date().getFullYear()

// Shared class strings
const wrap = 'mx-auto max-w-7xl px-5 lg:px-10'
const floatCard = 'glass absolute z-[3] rounded-2xl px-4 py-3.5'
const cardLabel = 'flex flex-wrap items-center gap-x-[0.45rem] gap-y-0.5 text-[13px] font-medium text-ink'
const floatIn = {
  enterActiveClass: 'transition duration-300 ease-out',
  leaveActiveClass: 'transition duration-300 ease-in',
  enterFromClass: 'opacity-0 translate-y-2 scale-[0.97]',
  leaveToClass: 'opacity-0 translate-y-2 scale-[0.97]',
}

const orbState = computed(() => {
  if (micError.value) {
    return 'error' as const
  }
  return talking.value ? 'listening' as const : demo.orbState.value
})
const orbLevel = computed(() => (talking.value ? micLevel.value : demo.level.value))

const phaseLabel = computed(() => {
  if (micError.value) {
    return 'Microphone blocked'
  }
  if (talking.value) {
    return 'Listening to you'
  }
  return {
    asking: 'Interviewer speaking',
    answering: 'Candidate answering',
    thinking: 'Evaluating',
    feedback: 'Feedback ready',
  }[demo.phase.value]
})

const phaseIcon = computed(() => {
  if (micError.value) {
    return 'Warning2'
  }
  return { asking: 'Sound', answering: 'Microphone2', thinking: 'Cpu', feedback: 'TickCircle' }[demo.phase.value]
})

const assurances = ['No CV needed to start', 'Adaptive follow-ups', 'Evidence-based feedback']

const steps = [
  { icon: 'Briefcase', tint: 'bg-aura-peach', title: 'Pick the room', body: 'Choose your role, level and the kind of interview. Add a CV or job description if you have one.' },
  { icon: 'Microphone2', tint: 'bg-aura-sky', title: 'Talk it through', body: 'Answer out loud. The interviewer listens and follows up on what you actually said.' },
  { icon: 'Chart2', tint: 'bg-aura-mint', title: 'Read the evidence', body: 'See scores for structure, depth and evidence, each one tied to quotes from your answer.' },
]

const tickerRows = [
  [
    { tag: 'Behavioural', q: 'Tell me about a time you disagreed with your manager.' },
    { tag: 'Consulting', q: 'A client wants the answer before the analysis. What do you do?' },
    { tag: 'HR', q: 'Why are you leaving your current role?' },
    { tag: 'Marketing', q: 'A campaign missed its target. How do you explain that?' },
    { tag: 'Engineering', q: 'Explain the trade-offs of server-side rendering.' },
    { tag: 'Sales', q: 'Tell me about a deal you lost and what you changed.' },
  ],
  [
    { tag: 'Product', q: 'How do you prioritise a roadmap with no data?' },
    { tag: 'Finance', q: 'Walk me through a forecast that turned out wrong.' },
    { tag: 'Operations', q: 'A process is late every week. Where do you start?' },
    { tag: 'HR', q: 'What are your salary expectations?' },
    { tag: 'Customer success', q: 'A long-term customer is about to leave. What do you do?' },
    { tag: 'Leadership', q: 'How do you grow someone who is new to the team?' },
  ],
]

function pick(i: number) {
  if (talking.value) {
    releaseMic()
  }
  demo.select(i)
}

async function toggleTalk() {
  await toggleMic()
  demo.paused.value = talking.value
}

function setOrbSize() {
  const w = window.innerWidth
  orbSize.value = w < 640 ? 230 : w < 1024 ? 290 : 330
}

onMounted(() => {
  setOrbSize()
  window.addEventListener('resize', setOrbSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setOrbSize)
})
</script>
