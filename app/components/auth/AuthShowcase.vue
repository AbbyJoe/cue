<template>
  <aside class="relative isolate flex overflow-hidden border-r border-line bg-sunken px-10 py-12">
    <div class="aurora -z-10 animate-drift" aria-hidden="true" />
    <div class="m-auto grid w-full max-w-md gap-8">
      <!-- Headline -->
      <div>
        <h2 class="mt-[0.85rem] text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] xl:text-[2.35rem]">
          Rehearse the
          <span class="block min-h-[1.15em] whitespace-nowrap text-accent [font-variant-ligatures:none]">{{ word }}</span>
          <span class="block text-ink-soft">Walk in ready.</span>
        </h2>
      </div>

      <!-- Live session card -->
      <div
        class="glass overflow-hidden rounded-[1.25rem] transition-shadow duration-200"
        @mouseenter="demo.paused.value = true"
        @mouseleave="demo.paused.value = false"
      >
        <header class="flex items-center gap-[0.85rem] border-b border-white/70 py-3 pl-[0.6rem] pr-4">
          <VoiceOrb :state="demo.orbState.value" :level="demo.level.value" :size="64" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-ink">{{ demo.scenario.value.role }}</p>
            <p class="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
              <Icon :name="phaseIcon" :size="12" />
              {{ demo.paused.value ? 'Paused, move away to resume' : phaseLabel }}
            </p>
          </div>
          <span class="rounded-full border border-line-strong bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-soft">
            {{ demo.scenario.value.track }}
          </span>
        </header>

        <div class="grid min-h-[19rem] content-start gap-4 px-4 py-[1.1rem]">
          <div class="flex gap-3">
            <span :class="[avatar, 'border-accent-line bg-accent-soft']"><CueLogo :size="14" /></span>
            <div class="min-w-0">
              <p :class="who">Interviewer</p>
              <p class="mt-0.5 text-sm leading-normal text-ink">
                {{ demo.question.value }}<span v-if="demo.phase.value === 'asking'" class="caret" />
              </p>
            </div>
          </div>

          <Transition v-bind="rise">
            <div v-if="demo.phase.value !== 'asking'" class="flex gap-3">
              <span :class="[avatar, 'border-line-strong bg-elevated']">
                <VoiceBars :level="demo.level.value" :count="4" :height="12" :active="demo.phase.value === 'answering'" />
              </span>
              <div class="min-w-0">
                <p :class="who">You</p>
                <p class="mt-0.5 text-sm leading-normal text-ink-soft">{{ demo.answer.value }}</p>
              </div>
            </div>
          </Transition>

          <Transition v-bind="rise">
            <div
              v-if="demo.phase.value === 'thinking' || demo.phase.value === 'feedback'"
              class="rounded-xl border border-line bg-surface px-[0.9rem] py-[0.85rem] shadow-xs"
            >
              <div class="flex items-center justify-between">
                <p :class="who" class="!text-accent">
                  {{ demo.phase.value === 'thinking' ? 'Evaluating your answer' : 'Feedback' }}
                </p>
                <Icon v-if="demo.phase.value === 'thinking'" name="Cpu" :size="14" class="animate-spin text-accent" />
              </div>
              <ScoreList :scores="demo.scenario.value.scores" :shown="demo.phase.value === 'feedback'" class="mt-3" />
              <Transition v-bind="rise">
                <p
                  v-if="demo.phase.value === 'feedback'"
                  class="mt-[0.85rem] flex gap-2 border-t border-line pt-[0.7rem] text-[13px] leading-[1.45] text-ink-soft"
                >
                  <Icon name="MagicStar" :size="14" class="shrink-0 text-accent" />
                  {{ demo.scenario.value.tip }}
                </p>
              </Transition>
            </div>
          </Transition>
        </div>

        <!-- Progress through the coaching cycle -->
        <footer class="grid grid-cols-4 gap-2 border-t border-white/70 px-4 pb-[0.85rem] pt-3">
          <div v-for="(step, i) in cycle" :key="step" class="grid gap-1.5">
            <span class="relative h-[3px] overflow-hidden rounded-full bg-subtle">
              <span
                :key="`${demo.index.value}-${i === stepIndex}`"
                class="absolute inset-y-0 left-0 bg-accent"
                :class="i < stepIndex ? 'w-full' : i === stepIndex ? 'w-0 animate-fill' : 'w-0'"
              />
            </span>
            <span class="text-[11px] font-medium" :class="i <= stepIndex ? 'text-ink' : 'text-ink-faint'">{{ step }}</span>
          </div>
        </footer>
      </div>

      <!-- Scenario picker -->
      <div>
        <p class="text-xs text-ink-faint">Try a different room</p>
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <button
            v-for="(scenario, i) in demoScenarios"
            :key="scenario.id"
            type="button"
            class="h-8 rounded-full border px-[0.9rem] text-[13px] font-medium transition-colors duration-150"
            :class="demo.index.value === i
              ? 'border-accent-solid bg-accent-solid text-white shadow-button'
              : 'border-white/80 bg-white/60 text-ink-soft backdrop-blur hover:text-ink'"
            :aria-pressed="demo.index.value === i"
            @click="demo.select(i)"
          >
            {{ scenario.track }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { demoScenarios } from '~/data/demo'

const word = useScramble(['hard question', 'follow-up', 'salary talk', 'system design round', 'first five minutes'])
const demo = useInterviewDemo(demoScenarios)

const cycle = ['Ask', 'Answer', 'Evaluate', 'Coach']

const avatar = 'grid h-7 w-7 flex-none place-items-center rounded-full border text-ink'
const who = 'text-[13px] font-medium text-ink'
const rise = {
  enterActiveClass: 'transition duration-300 ease-out',
  enterFromClass: 'opacity-0 translate-y-1.5',
}

const stepIndex = computed(() => ({ asking: 0, answering: 1, thinking: 2, feedback: 3 })[demo.phase.value])

const phaseLabel = computed(() => ({
  asking: 'Interviewer is asking',
  answering: 'Listening to your answer',
  thinking: 'Evaluating against the rubric',
  feedback: 'Feedback ready',
})[demo.phase.value])

const phaseIcon = computed(() => (demo.paused.value
  ? 'Pause'
  : { asking: 'Sound', answering: 'Microphone2', thinking: 'Cpu', feedback: 'TickCircle' }[demo.phase.value]))
</script>
