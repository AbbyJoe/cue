import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { DemoScenario } from '~/data/demo'

export type DemoPhase = 'asking' | 'answering' | 'thinking' | 'feedback'

/**
 * Plays a scripted mini interview on a loop: the interviewer asks,
 * the candidate answers, the evaluator thinks, feedback appears.
 * Drives VoiceOrb state so the visual matches the conversation.
 */
export function useInterviewDemo(scenarios: DemoScenario[]) {
  const index = ref(0)
  const phase = ref<DemoPhase>('asking')
  const question = ref('')
  const answer = ref('')
  const level = ref(0)
  const paused = ref(false)

  let timer: ReturnType<typeof setTimeout> | undefined
  let meter: ReturnType<typeof setInterval> | undefined
  let reduced = false
  let clock = 0

  const scenario = computed(() => {
    const current = scenarios[index.value] ?? scenarios[0]
    if (!current) {
      throw new Error('Demo scenario is missing')
    }
    return current
  })

  const orbState = computed(() => ({
    asking: 'speaking',
    answering: 'listening',
    thinking: 'processing',
    feedback: 'idle',
  } as const)[phase.value])

  function schedule(fn: () => void, ms: number) {
    clearTimeout(timer)
    const run = () => {
      if (paused.value) {
        timer = setTimeout(run, 150)
        return
      }
      fn()
    }
    timer = setTimeout(run, ms)
  }

  function typeQuestion(chars = 0) {
    const text = scenario.value.question
    question.value = text.slice(0, chars)
    if (chars < text.length) {
      schedule(() => typeQuestion(chars + 1), 30)
    } else {
      schedule(startAnswer, 900)
    }
  }

  function startAnswer() {
    phase.value = 'answering'
    typeAnswer(0)
  }

  function typeAnswer(chars: number) {
    const text = scenario.value.answer
    answer.value = text.slice(0, chars)
    if (chars < text.length) {
      schedule(() => typeAnswer(chars + 2), 34)
    } else {
      answer.value = text
      schedule(() => {
        phase.value = 'thinking'
        schedule(() => {
          phase.value = 'feedback'
          schedule(() => play((index.value + 1) % scenarios.length), 4200)
        }, 1400)
      }, 600)
    }
  }

  function play(next: number) {
    clearTimeout(timer)
    index.value = next
    if (reduced) {
      question.value = scenario.value.question
      answer.value = scenario.value.answer
      phase.value = 'feedback'
      return
    }
    phase.value = 'asking'
    question.value = ''
    answer.value = ''
    schedule(() => typeQuestion(0), 400)
  }

  function select(next: number) {
    paused.value = false
    play(next)
  }

  onMounted(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    play(0)
    meter = setInterval(() => {
      clock += 0.07
      level.value = phase.value === 'answering' && !paused.value
        ? 0.06 + Math.abs(Math.sin(clock * 9)) * 0.12 + Math.random() * 0.06
        : 0
    }, 70)
  })

  onBeforeUnmount(() => {
    clearTimeout(timer)
    clearInterval(meter)
  })

  return { index, scenario, phase, question, answer, level, orbState, paused, select }
}
