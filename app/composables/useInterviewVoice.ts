import type { VoiceConversation } from '@elevenlabs/client'
import type { InterviewSetup } from '~/utils/interview'
import { labelFor } from '~/utils/interview'

export interface TranscriptLine {
  from: 'you' | 'interviewer'
  text: string
}

export interface InterviewContext {
  targetRole?: string
  goals?: string
  jobDescription?: string
  cv?: string
  workspaceId?: string
}

/**
 * Opens one ElevenLabs voice session for this interview setup.
 * The agent prompt can read {{role}}, {{level}}, {{category}}, {{difficulty}}, {{duration}}, {{style}},
 * {{target_role}}, {{goals}}, {{job_description}} and {{cv}}.
 * user_id and workspace_id are only so the webhook can save the result. Leave them out of the prompt.
 */
export function useInterviewVoice(
  setup: MaybeRefOrGetter<InterviewSetup>,
  context: MaybeRefOrGetter<InterviewContext> = {},
) {
  const status = ref<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const mode = ref<'speaking' | 'listening' | null>(null)
  const muted = ref(false)
  const level = ref(0)
  const error = ref('')
  const paused = ref(false)
  const lines = ref<TranscriptLine[]>([])
  let resumeUnmuted = false

  let session: VoiceConversation | null = null
  let meter = 0
  let stopped = false

  function stopMeter() {
    if (meter) {
      cancelAnimationFrame(meter)
      meter = 0
    }
    level.value = 0
  }

  function startMeter() {
    const tick = () => {
      if (!session) {
        return
      }
      level.value = mode.value === 'speaking' ? session.getOutputVolume() : session.getInputVolume()
      meter = requestAnimationFrame(tick)
    }
    tick()
  }

  async function start() {
    if (session || status.value === 'connecting') {
      return
    }
    stopped = false
    error.value = ''
    status.value = 'connecting'

    try {
      const current = toValue(setup)
      const extra = toValue(context)
      const userId = (await useSupabase()?.auth.getUser())?.data.user?.id
      const { token } = await $fetch<{ token: string }>('/api/v1/interviews/session', { method: 'POST' })
      const { Conversation } = await import('@elevenlabs/client')
      const started = await Conversation.startSession({
        conversationToken: token,
        textOnly: false,
        userId,
        dynamicVariables: {
          role: labelFor('role', current.role),
          level: labelFor('level', current.level),
          category: labelFor('category', current.category),
          difficulty: labelFor('difficulty', current.difficulty),
          duration: labelFor('duration', current.duration),
          style: labelFor('style', current.style),
          target_role: (extra.targetRole ?? '').slice(0, 200),
          goals: (extra.goals ?? '').slice(0, 1000),
          job_description: (extra.jobDescription ?? '').slice(0, 2000),
          cv: (extra.cv ?? '').slice(0, 4000),
          ...(extra.workspaceId ? { workspace_id: extra.workspaceId } : {}),
          ...(userId ? { user_id: userId } : {}),
        },
        onModeChange: ({ mode: next }) => {
          mode.value = next
        },
        onMessage: ({ role, message }) => {
          const text = message.trim()
          if (!text) {
            return
          }
          lines.value = [...lines.value, { from: role === 'user' ? 'you' : 'interviewer', text }].slice(-40)
        },
        onError: (message) => {
          error.value = message || 'The interviewer disconnected.'
          status.value = 'error'
        },
        onDisconnect: () => {
          session = null
          stopMeter()
          mode.value = null
          if (status.value !== 'error') {
            status.value = 'idle'
          }
        },
      })

      if (stopped) {
        await started.endSession()
        return
      }
      session = started
      if (status.value !== 'error') {
        status.value = 'connected'
      }
      startMeter()
    } catch (caught) {
      if (stopped) {
        return
      }
      status.value = 'error'
      error.value = failureMessage(caught)
    }
  }

  async function end() {
    stopped = true
    const current = session
    session = null
    stopMeter()
    mode.value = null
    muted.value = false
    paused.value = false
    if (!current) {
      if (status.value === 'connecting') {
        status.value = 'idle'
      }
      return
    }
    await current.endSession()
  }

  function toggleMute() {
    if (!session || paused.value) {
      return
    }
    muted.value = !muted.value
    session.setMicMuted(muted.value)
  }

  /** Mute the microphone and freeze the room until the candidate continues. */
  function togglePause() {
    if (!session || status.value !== 'connected') {
      return
    }
    paused.value = !paused.value
    if (paused.value) {
      resumeUnmuted = !muted.value
      muted.value = true
      session.setMicMuted(true)
      return
    }
    if (resumeUnmuted) {
      muted.value = false
      session.setMicMuted(false)
    }
  }

  onBeforeUnmount(() => {
    void end()
  })

  return { status, mode, muted, paused, level, error, lines, start, end, toggleMute, togglePause }
}

function failureMessage(caught: unknown) {
  if (caught instanceof DOMException && caught.name === 'NotAllowedError') {
    return 'Microphone access was blocked. Allow it in the browser to practise out loud.'
  }
  if (typeof caught === 'object' && caught && 'statusCode' in caught && caught.statusCode === 503) {
    return 'Voice interviews are not configured yet.'
  }
  return 'Could not connect the interviewer. Try again in a moment.'
}
