import type { H3Event } from 'h3'

/** The signed-in user for this request, or a 401. Queries made with
 * serverSupabase(event) afterwards run as this user, so RLS applies. */
export async function requireUser(event: H3Event) {
  if (!supabaseConfigured(event)) {
    throw createError({ statusCode: 503, statusMessage: 'Authentication is not configured.' })
  }
  const { data, error } = await serverSupabase(event).auth.getUser()
  if (error || !data.user) {
    throw createError({ statusCode: 401, statusMessage: 'Sign in to continue.' })
  }
  return data.user
}
