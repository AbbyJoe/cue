// Client-side navigation guard. Full page loads are checked by server/middleware/auth.ts.
const protectedPrefixes = ['/dashboard', '/interview']
const guestOnly = ['/auth/login', '/auth/signup']

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`)
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }
  const supabase = useSupabase()
  if (!supabase) {
    return
  }

  const isProtected = protectedPrefixes.some((prefix) => matches(to.path, prefix))
  const isGuestOnly = guestOnly.includes(to.path)
  if (!isProtected && !isGuestOnly) {
    return
  }

  // In the browser the local session is enough to decide which page to show.
  const { data } = await supabase.auth.getSession()

  if (isProtected && !data.session) {
    return navigateTo({ path: '/auth/login', query: { next: to.fullPath } })
  }
  if (isGuestOnly && data.session) {
    return navigateTo('/dashboard')
  }
})
