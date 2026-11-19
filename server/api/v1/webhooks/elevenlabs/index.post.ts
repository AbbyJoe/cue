import { createHmac, timingSafeEqual } from 'node:crypto'
import { recordTranscription } from '../../../../utils/interviews'

/**
 * POST /api/v1/webhooks/elevenlabs
 * ElevenLabs calls this after a conversation. The signature is checked against
 * NUXT_ELEVENLABS_WEBHOOK_SECRET. Point the webhook at this path.
 */
export default defineEventHandler(async (event) => {
  const secret = useRuntimeConfig(event).elevenlabsWebhookSecret
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Webhook secret is not configured.' })
  }

  const rawBody = await readRawBody(event)
  const signature = getHeader(event, 'elevenlabs-signature')
  if (!rawBody || !signature || !validSignature(rawBody, signature, secret)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid webhook signature.' })
  }

  let payload: { type?: string, data?: Parameters<typeof recordTranscription>[0] }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid webhook payload.' })
  }
  const conversationId = payload.data?.conversation_id ?? 'unknown'
  const turns = Array.isArray(payload.data?.transcript) ? payload.data.transcript.length : 0
  console.info(`[elevenlabs] ${payload.type ?? 'event'} ${conversationId}${turns ? ` (${turns} turns)` : ''}`)

  if (payload.type === 'post_call_transcription') {
    try {
      await recordTranscription(payload.data)
    } catch (error) {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        throw error
      }
      console.error('[elevenlabs] could not score the transcript')
      throw createError({ statusCode: 502, statusMessage: 'Could not score the interview.' })
    }
  }

  return { received: true }
})

/** Header format: t=<unix seconds>,v0=<hex hmac of `${timestamp}.${rawBody}`>. */
function validSignature(rawBody: string, header: string, secret: string) {
  const parts = header.split(',')
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2)
  const signatures = parts.filter((part) => part.startsWith('v0=')).map((part) => part.slice(3))
  if (!timestamp || signatures.length === 0) {
    return false
  }

  const sentAt = Number(timestamp) * 1000
  if (!Number.isFinite(sentAt) || sentAt < Date.now() - 30 * 60 * 1000) {
    return false
  }

  const digest = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest()
  return signatures.some((signature) => {
    const actual = Buffer.from(signature, 'hex')
    return actual.length === digest.length && timingSafeEqual(actual, digest)
  })
}
