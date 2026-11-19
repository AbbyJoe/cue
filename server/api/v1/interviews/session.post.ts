/**
 * POST /api/v1/interviews/session
 * A short-lived WebRTC token for the signed-in user. The API key stays here.
 */
export default defineEventHandler(async (event) => {
  await requireUser(event)

  const { elevenlabsApiKey, elevenlabsAgentId } = useRuntimeConfig(event)
  if (!elevenlabsApiKey || !elevenlabsAgentId) {
    throw createError({ statusCode: 503, statusMessage: 'Voice interviews are not configured.' })
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(elevenlabsAgentId)}`,
    { headers: { 'xi-api-key': elevenlabsApiKey } },
  )
  if (!response.ok) {
    console.error('[elevenlabs] token request failed:', response.status)
    throw createError({ statusCode: 502, statusMessage: 'Could not start the voice session.' })
  }

  const body = await response.json() as { token?: string }
  if (!body.token) {
    throw createError({ statusCode: 502, statusMessage: 'Could not start the voice session.' })
  }

  return { token: body.token }
})
