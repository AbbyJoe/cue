<template>
  <div class="grid min-h-screen grid-rows-[auto_1fr_auto] gap-6 bg-canvas px-5 pb-7 pt-5">
    <header class="flex items-center justify-between gap-4">
      <div :class="pill">
        <span
          class="h-[0.45rem] w-[0.45rem] rounded-full"
          :class="micOn && !paused ? 'bg-accent shadow-[0_0_0_3px_rgba(47,107,255,0.18)]' : 'bg-ink-faint'"
        />
        {{ status }}
      </div>
      <p class="hidden text-center text-sm text-ink-soft lg:block">{{ summary }}</p>
      <p :class="pill">{{ setup.duration }}:00</p>
    </header>

    <div class="grid content-center gap-4" :class="{ 'lg:grid-cols-[minmax(0,1fr)_20rem]': transcriptOpen }">
      <section class="grid gap-4 lg:grid-cols-2">
        <!-- Candidate tile -->
        <article>
          <div
            :class="[tile, speaking ? 'border-accent shadow-focus' : 'border-line']"
          >
            <video
              v-show="cameraOn"
              ref="videoEl"
              class="h-full w-full object-cover"
              autoplay
              muted
              playsinline
            />

            <!-- Camera on: speaking badge over the video -->
            <Transition v-bind="fade">
              <span
                v-if="cameraOn && speaking"
                class="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur"
              >
                <VoiceBars :level="micLevel" :count="4" :height="10" class="text-accent" />
                Speaking
              </span>
            </Transition>

            <!-- Camera off: avatar with live sound indicator -->
            <div v-if="!cameraOn" class="grid justify-items-center gap-5">
              <div class="relative grid place-items-center" :style="{ width: `${avatarSize}px`, height: `${avatarSize}px` }">
                <!-- Ripples while speaking -->
                <template v-if="speaking">
                  <span class="absolute inset-0 animate-ripple rounded-full border border-accent" />
                  <span class="absolute inset-0 animate-ripple rounded-full border border-accent [animation-delay:0.9s]" />
                </template>
                <!-- Level ring: follows the microphone volume -->
                <span
                  class="absolute inset-0 rounded-full border-2 transition-[transform,opacity,border-color] duration-100 ease-out"
                  :class="speaking ? 'border-accent' : 'border-line-strong'"
                  :style="{ transform: `scale(${ringScale})`, opacity: micOn ? 1 : 0.5 }"
                />
                <!-- Avatar -->
                <span
                  class="relative grid h-full w-full place-items-center rounded-full border transition-colors duration-200"
                  :class="speaking ? 'border-accent-solid bg-accent-soft text-accent-strong' : 'border-line-strong bg-elevated text-ink-soft'"
                >
                  <span v-if="initials" class="text-[1.65rem] font-semibold tracking-[-0.02em]">{{ initials }}</span>
                  <Icon v-else name="Profile" :size="40" />
                </span>
                <!-- Muted marker -->
                <span
                  v-if="!micOn"
                  class="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-danger text-white"
                  title="Microphone off"
                >
                  <Icon name="MicrophoneSlash" :size="14" />
                </span>
              </div>

              <p class="inline-flex h-7 items-center gap-2 text-[13px]" :class="speaking ? 'text-ink' : 'text-ink-faint'">
                <VoiceBars v-if="speaking" :level="micLevel" :count="5" :height="12" class="text-accent" />
                {{ candidateCaption }}
              </p>
            </div>
          </div>
          <p class="mt-2.5 text-[13px] text-ink-soft">You</p>
        </article>

        <!-- AI interviewer tile -->
        <article>
          <div :class="[tile, 'isolate bg-sunken border-line']">
            <div class="aurora -z-10 animate-drift" aria-hidden="true" />
            <VoiceOrb :state="orbState" :level="speaking ? micLevel : 0" :size="pulseSize" />
            <p class="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium text-accent-strong">
              {{ voiceCaption }}
            </p>
          </div>
          <p class="mt-2.5 text-[13px] text-ink-soft">AI interviewer</p>
        </article>
      </section>

      <aside v-if="transcriptOpen" class="flex min-h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface">
        <div class="border-b border-line px-5 pb-4 pt-[1.1rem]">
          <h2 class="text-base font-semibold">Transcript</h2>
          <p class="mt-0.5 text-xs text-ink-faint">Live conversation</p>
        </div>
        <div class="flex-1 p-5">
          <p class="text-sm leading-relaxed text-ink-soft">
            {{ message || 'Questions and answers will appear here once the voice session is connected.' }}
          </p>
        </div>
      </aside>
    </div>

    <footer class="flex justify-center gap-[0.85rem]">
      <button type="button" :class="round(micOn)" :aria-pressed="micOn" :title="micOn ? 'Mute' : 'Unmute'" @click="toggleMic()">
        <Icon :name="micOn ? 'Microphone' : 'MicrophoneSlash'" :size="20" />
      </button>
      <button type="button" :class="round(cameraOn)" :aria-pressed="cameraOn" :title="cameraOn ? 'Turn camera off' : 'Turn camera on'" @click="toggleCamera()">
        <Icon :name="cameraOn ? 'Video' : 'VideoSlash'" :size="20" />
      </button>
      <button type="button" :class="round(transcriptOpen)" :aria-pressed="transcriptOpen" title="Transcript" @click="transcriptOpen = !transcriptOpen">
        <Icon name="MessageText" :size="20" />
      </button>
      <button
        type="button"
        class="grid h-[3.4rem] w-[3.4rem] place-items-center rounded-full border border-danger bg-danger text-white shadow-button transition-colors duration-150 hover:bg-danger-hover"
        title="End interview"
        @click="leave"
      >
        <Icon name="CallSlash" :size="20" />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { labelFor, readSetup } from '~/utils/interview'
import { readProfile } from '~/utils/profile'

definePageMeta({ layout: 'interview' })
useHead({ title: 'Interview' })

const route = useRoute()
const setup = computed(() => readSetup(route.query))
const summary = computed(() => {
  return `${labelFor('role', setup.value.role)} · ${labelFor('level', setup.value.level)} · ${labelFor('category', setup.value.category)}`
})

const {
  active: micOn,
  level: micLevel,
  error: micError,
  toggle: toggleMic,
  release: releaseMic,
} = useMicrophone()
const videoEl = ref<HTMLVideoElement | null>(null)
const {
  active: cameraOn,
  error: cameraError,
  toggle: toggleCamera,
  release: releaseCamera,
} = useCamera(videoEl)
const paused = ref(false)
const transcriptOpen = ref(false)
const pulseSize = ref(240)
const avatarSize = ref(112)
const initials = ref('')

// Shared class strings
const pill = 'inline-flex min-h-8 items-center gap-[0.45rem] rounded-full border border-line bg-surface px-[0.8rem] text-xs font-medium text-ink shadow-xs'
const tile = 'relative grid min-h-[clamp(16rem,48vh,26rem)] place-items-center overflow-hidden rounded-[1.25rem] border bg-surface text-ink transition-colors duration-200'
const fade = {
  enterActiveClass: 'transition duration-150',
  leaveActiveClass: 'transition duration-150',
  enterFromClass: 'opacity-0',
  leaveToClass: 'opacity-0',
}

function round(on: boolean) {
  return [
    'grid h-[3.4rem] w-[3.4rem] place-items-center rounded-full border transition-colors duration-150',
    on
      ? 'border-accent-solid bg-accent-solid text-white shadow-button hover:bg-accent-hover'
      : 'border-line bg-surface text-ink shadow-xs hover:border-line-strong hover:bg-surface-hover',
  ]
}

const SPEAKING_THRESHOLD = 0.06

/** True while the candidate's microphone picks up speech. */
const speaking = computed(() => micOn.value && !paused.value && micLevel.value > SPEAKING_THRESHOLD)

/** Level ring grows with volume: 1.0 at silence, up to ~1.35 when loud. */
const ringScale = computed(() => {
  if (!micOn.value || paused.value) {
    return 1
  }
  return 1.04 + Math.min(micLevel.value * 2.2, 1) * 0.32
})

const orbState = computed(() => {
  if (micError.value) {
    return 'error' as const
  }
  if (paused.value) {
    return 'idle' as const
  }
  return speaking.value ? 'listening' as const : 'idle' as const
})

const status = computed(() => {
  if (micError.value) {
    return 'Mic blocked'
  }
  if (paused.value) {
    return 'Paused'
  }
  if (speaking.value) {
    return 'Live'
  }
  if (micOn.value) {
    return 'Ready'
  }
  return 'Standby'
})

const candidateCaption = computed(() => {
  if (micError.value) {
    return 'Microphone unavailable'
  }
  if (!micOn.value) {
    return 'Microphone is off'
  }
  if (speaking.value) {
    return 'You’re speaking'
  }
  return 'Mic on, waiting for you'
})

const voiceCaption = computed(() => {
  if (micError.value) {
    return 'Microphone unavailable'
  }
  if (speaking.value) {
    return 'Listening…'
  }
  if (micOn.value) {
    return 'Listening for your answer'
  }
  return 'Waiting for microphone'
})

const message = computed(() => micError.value || cameraError.value)

function setSizes() {
  const small = window.innerWidth < 720
  pulseSize.value = small ? 200 : 260
  avatarSize.value = small ? 96 : 112
}

function leave() {
  releaseMic()
  releaseCamera()
  navigateTo('/dashboard/practise')
}

onMounted(() => {
  const profile = readProfile()
  initials.value = (profile.targetRole || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')
  setSizes()
  window.addEventListener('resize', setSizes)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setSizes)
})
</script>
