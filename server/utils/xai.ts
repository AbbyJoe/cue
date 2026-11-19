import type { InterviewFeedback } from '#shared/types/interview'

const instructions = `You assess a practice interview transcript for the candidate.
Judge what they said, not their accent, personality, or employability.
Return only JSON with this shape:
{"summary":"","scores":[{"name":"","value":1,"note":""}],"strengths":[""],"improvements":[""]}
Use exactly these score names: Relevance, Structure, Depth, Clarity, Evidence.
Each value is an integer from 1 to 5. Keep every string to one or two sentences.`

/** Ask xAI for structured feedback on one transcript. */
export async function scoreTranscript(transcript: string, context: string): Promise<InterviewFeedback> {
  const config = useRuntimeConfig()
  if (!config.xaiApiKey) {
    throw new Error('xAI is not configured')
  }

  const base = (config.xaiBaseUrl || 'https://api.x.ai/v1').replace(/\/$/, '')
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.xaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.xaiModel || 'grok-4.7',
      temperature: 0.2,
      max_tokens: Number(config.xaiMaxTokens) || 2000,
      messages: [
        { role: 'system', content: instructions },
        { role: 'user', content: `${context}\n\nTranscript:\n${transcript}` },
      ],
    }),
  })

  if (!response.ok) {
    console.error('[xai] scoring failed:', response.status)
    throw new Error('xAI scoring failed')
  }

  const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  const content = body.choices?.[0]?.message?.content ?? ''
  return parseFeedback(content)
}

function parseFeedback(content: string): InterviewFeedback {
  const start = content.indexOf('{')
  const end = content.lastIndexOf('}')
  if (start === -1 || end <= start) {
    throw new Error('xAI returned an unexpected assessment')
  }
  const parsed = JSON.parse(content.slice(start, end + 1)) as Partial<InterviewFeedback>
  const scores = Array.isArray(parsed.scores)
    ? parsed.scores.flatMap((score) => {
        if (!score || typeof score.name !== 'string' || typeof score.note !== 'string') {
          return []
        }
        const value = Number(score.value)
        if (!Number.isInteger(value) || value < 1 || value > 5) {
          return []
        }
        return [{ name: score.name, value, note: score.note }]
      })
    : []
  const lines = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim() !== '') : []

  if (typeof parsed.summary !== 'string' || scores.length === 0) {
    throw new Error('xAI returned an unexpected assessment')
  }

  return {
    summary: parsed.summary,
    scores,
    strengths: lines(parsed.strengths),
    improvements: lines(parsed.improvements),
  }
}
