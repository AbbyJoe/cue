import type { InterviewRecord, TranscriptLine } from '#shared/types/interview'
import { isFeedback } from '../../../utils/interviews'

/** GET /api/v1/interviews: completed interviews for the open workspace, newest first. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const workspace = getQuery(event).workspace
  const columns = 'id, created_at, role, level, category, feedback, transcript'
  let query = serverSupabase(event).from('interviews').select(columns).eq('user_id', user.id)
  if (workspace === 'general') {
    query = query.is('workspace_id', null)
  } else if (typeof workspace === 'string' && /^[0-9a-f-]{36}$/i.test(workspace)) {
    query = query.eq('workspace_id', workspace)
  }

  let { data, error } = await query.order('created_at', { ascending: false })
  if (error?.message.includes('workspace_id')) {
    const fallback = await serverSupabase(event).from('interviews').select(columns).eq('user_id', user.id).order('created_at', { ascending: false })
    data = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('[interviews] list failed:', error.code)
    throw createError({ statusCode: 500, statusMessage: 'Could not load interviews.' })
  }

  return (data ?? []).map((row): InterviewRecord => ({
    id: row.id,
    createdAt: row.created_at,
    role: row.role,
    level: row.level,
    category: row.category,
    feedback: isFeedback(row.feedback) ? row.feedback : null,
    transcript: lines(row.transcript),
  }))
})

function lines(value: unknown): TranscriptLine[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.flatMap((line) => {
    if (!line || typeof line !== 'object') {
      return []
    }
    const from = 'from' in line ? line.from : ''
    const text = 'text' in line && typeof line.text === 'string' ? line.text : ''
    if (!text || (from !== 'you' && from !== 'interviewer')) {
      return []
    }
    return [{ from, text }]
  })
}
