import type { InterviewFeedback, TranscriptLine } from '#shared/types/interview'
import { scoreTranscript } from './xai'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const minimumCallSeconds = 180
const skippedCalls = new Set<string>()

interface TranscriptionData {
  conversation_id?: string
  user_id?: string
  transcript?: unknown[]
  metadata?: { call_duration_secs?: unknown }
  conversation_initiation_client_data?: {
    dynamic_variables?: Record<string, unknown>
  }
}

/** A call that ends within 3 minutes is not scored or stored. */
export function callTooShort(seconds: number) {
  return Number.isFinite(seconds) && seconds <= minimumCallSeconds
}

/** Remember a short call so a later webhook does not score it. */
export function skipInterview(conversationId: string) {
  skippedCalls.add(conversationId)
}

/** Score one finished conversation and store it. Throws when a retry could still succeed. */
export async function recordTranscription(data: TranscriptionData | undefined) {
  const conversationId = text(data?.conversation_id)
  const variables = data?.conversation_initiation_client_data?.dynamic_variables ?? {}
  const userId = text(data?.user_id) || text(variables.user_id)
  if (!conversationId || !uuid.test(userId)) {
    console.error('[elevenlabs] transcription has no account to attach it to')
    return
  }
  const duration = Number(data?.metadata?.call_duration_secs)
  if (skippedCalls.has(conversationId) || callTooShort(duration)) {
    console.info(`[elevenlabs] ${conversationId} ended within 3 minutes, not saved`)
    return
  }

  await storeInterview({
    userId,
    conversationId,
    transcript: lines(data?.transcript),
    variables,
  })
}

/** Score a transcript the candidate already has and store it under their account. */
export async function storeInterview(input: {
  userId: string
  conversationId: string
  transcript: TranscriptLine[]
  variables: Record<string, unknown>
}) {
  if (skippedCalls.has(input.conversationId)) {
    return
  }

  const admin = serviceSupabase()
  if (!admin) {
    throw createError({ statusCode: 503, statusMessage: 'Interview storage is not configured.' })
  }

  const existing = await admin
    .from('interviews')
    .select('feedback')
    .eq('conversation_id', input.conversationId)
    .maybeSingle()
  if (existing.error) {
    console.error('[interviews] lookup failed:', existing.error.code)
    throw createError({ statusCode: 502, statusMessage: 'Could not store the interview.' })
  }
  if (existing.data?.feedback) {
    return
  }

  const transcript = input.transcript
  const feedback = transcript.length === 0
    ? { summary: 'The call ended before any answers were recorded.', scores: [], strengths: [], improvements: [] }
    : await scoreTranscript(asText(transcript), setupContext(input.variables))

  const workspaceId = await ownedWorkspace(admin, input.userId, text(input.variables.workspace_id))
  const row = {
    user_id: input.userId,
    conversation_id: input.conversationId,
    role: text(input.variables.role),
    level: text(input.variables.level),
    category: text(input.variables.category),
    difficulty: text(input.variables.difficulty),
    duration: text(input.variables.duration),
    style: text(input.variables.style),
    transcript,
    feedback,
    workspace_id: workspaceId,
  }
  let saved = await admin.from('interviews').upsert(row, { onConflict: 'conversation_id' })
  if (saved.error?.message.includes('workspace_id')) {
    const { workspace_id: _workspaceId, ...withoutWorkspace } = row
    saved = await admin.from('interviews').upsert(withoutWorkspace, { onConflict: 'conversation_id' })
  }

  if (saved.error) {
    console.error('[interviews] save failed:', saved.error.code)
    throw createError({ statusCode: 502, statusMessage: 'Could not store the interview.' })
  }
}

async function ownedWorkspace(admin: NonNullable<ReturnType<typeof serviceSupabase>>, userId: string, workspaceId: string) {
  if (!uuid.test(workspaceId)) {
    return null
  }
  const owned = await admin.from('workspaces').select('id').eq('id', workspaceId).eq('user_id', userId).maybeSingle()
  return owned.data?.id ?? null
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function lines(transcript: unknown): TranscriptLine[] {
  if (!Array.isArray(transcript)) {
    return []
  }
  return transcript.flatMap((turn) => {
    if (!turn || typeof turn !== 'object') {
      return []
    }
    const role = 'role' in turn ? turn.role : ''
    const message = 'message' in turn ? text(turn.message) : ''
    if (!message || (role !== 'user' && role !== 'agent')) {
      return []
    }
    return [{ from: role === 'user' ? 'you' as const : 'interviewer' as const, text: message }]
  })
}

function asText(transcript: TranscriptLine[]) {
  return transcript
    .map((line) => `${line.from === 'you' ? 'Candidate' : 'Interviewer'}: ${line.text}`)
    .join('\n')
    .slice(0, 24000)
}

function setupContext(variables: Record<string, unknown>) {
  const setup = ['role', 'level', 'category', 'difficulty', 'duration', 'style']
    .map((key) => text(variables[key]))
    .filter(Boolean)
  const extra = [
    text(variables.target_role) ? `Target role: ${text(variables.target_role)}` : '',
    text(variables.goals) ? `Preparation goals: ${text(variables.goals)}` : '',
    text(variables.job_description) ? `Job description:\n${text(variables.job_description).slice(0, 2000)}` : '',
    text(variables.cv) ? `CV:\n${text(variables.cv).slice(0, 4000)}` : '',
  ].filter(Boolean)
  const lines = [
    setup.length ? `Interview setup: ${setup.join(', ')}.` : 'Interview setup was not recorded.',
    ...extra,
  ]
  return lines.join('\n')
}

export function isFeedback(value: unknown): value is InterviewFeedback {
  if (!value || typeof value !== 'object') {
    return false
  }
  const feedback = value as InterviewFeedback
  return typeof feedback.summary === 'string' && Array.isArray(feedback.scores)
}
