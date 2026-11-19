/**
 * Page-level access on full page loads. Client-side navigation is handled by
 * app/middleware/auth.global.ts. Data access is enforced separately by RLS.
 */
const protectedPrefixes = ['/dashboard', '/interview']
const guestOnly = ['/auth/login', '/auth/signup']

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`)
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  const isProtected = protectedPrefixes.some((prefix) => matches(path, prefix))
  const isGuestOnly = guestOnly.includes(path)

  if ((!isProtected && !isGuestOnly) || !supabaseConfigured(event)) {
    return
  }

  // getUser() validates the token with Supabase and refreshes cookies if needed.
  const { data } = await serverSupabase(event).auth.getUser()

  if (isProtected && !data.user) {
    const next = encodeURIComponent(getRequestURL(event).pathname + getRequestURL(event).search)
    return sendRedirect(event, `/auth/login?next=${next}`)
  }

  if (isGuestOnly && data.user) {
    return sendRedirect(event, '/dashboard')
  }
})
