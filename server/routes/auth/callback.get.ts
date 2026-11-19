/**
 * Google and email-confirmation links send the browser back here.
 * Exchange the one-time code for a session (stored in cookies), then continue.
 *
 * `flow=email` marks confirmation links. Their failures get a gentler message,
 * because by then the email is usually confirmed already and logging in works.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const next = safeNext(query.next)
  const fromEmail = query.flow === 'email'

  if (!supabaseConfigured(event)) {
    return sendRedirect(event, '/auth/login?error=unavailable')
  }

  // Failures are reported as query parameters.
  if (query.error) {
    let reason = 'failed'
    if (query.error_code === 'otp_expired' || fromEmail) {
      reason = 'link'
    } else if (query.error === 'access_denied') {
      reason = 'cancelled'
    }
    return sendRedirect(event, `/auth/login?error=${reason}`)
  }

  if (typeof query.code !== 'string' || !query.code) {
    return sendRedirect(event, `/auth/login?error=${fromEmail ? 'link' : 'failed'}`)
  }

  const { error } = await serverSupabase(event).auth.exchangeCodeForSession(query.code)
  if (error) {
    console.error('[auth] code exchange failed:', error.message)
    return sendRedirect(event, `/auth/login?error=${fromEmail ? 'link' : 'failed'}`)
  }

  return sendRedirect(event, next)
})
