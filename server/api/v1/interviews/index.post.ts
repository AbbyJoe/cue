import type { TranscriptLine } from '#shared/types/interview'
import { callTooShort, skipInterview, storeInterview } from '../../../utils/interviews'

const conversationIdPattern = /^[A-Za-z0-9_-]{8,80}$/

/**
 * POST /api/v1/interviews
 * Score the transcript from the call the candidate just ended.
 * The webhook can still arrive later; a saved feedback row is left as it is.
 */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const conversationId = text(body?.conversationId)
  if (!conversationIdPattern.test(conversationId)) {
    throw createError({ statusCode: 422, statusMessage: 'That interview could not be saved.' })
  }
  const elapsed = Number(body?.elapsed)
  if (callTooShort(elapsed)) {
    skipInterview(conversationId)
    return { saved: false }
  }

  try {
    await storeInterview({
      userId: user.id,
      conversationId,
      transcript: lines(body?.transcript),
      variables: {
        role: text(body?.role, 80),
        level: text(body?.level, 80),
        category: text(body?.category, 80),
        difficulty: text(body?.difficulty, 80),
        duration: text(body?.duration, 80),
        style: text(body?.style, 80),
        target_role: text(body?.targetRole, 200),
        goals: text(body?.goals, 1000),
        job_description: text(body?.jobDescription, 2000),
        cv: text(body?.cv, 4000),
        workspace_id: text(body?.workspaceId, 80),
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('[interviews] could not score the transcript')
    throw createError({ statusCode: 502, statusMessage: 'Could not score the interview.' })
  }

  return { saved: true }
})

function text(value: unknown, max = 80) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function lines(value: unknown): TranscriptLine[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.flatMap((line) => {
    if (!line || typeof line !== 'object') {
      return []
    }
    const from = 'from' in line ? line.from : ''
    const message = 'text' in line && typeof line.text === 'string' ? line.text.trim().slice(0, 2000) : ''
    if (!message || (from !== 'you' && from !== 'interviewer')) {
      return []
    }
    return [{ from, text: message }]
  }).slice(0, 40)
}
