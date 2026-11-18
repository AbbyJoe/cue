const sessionKeys = ['cue-session']

export function useAuth() {
  const loggingOut = useState('auth-logging-out', () => false)

  async function logout() {
    if (loggingOut.value) {
      return
    }
    loggingOut.value = true
    try {
      // TODO: call supabase.auth.signOut() once Supabase auth is wired up.
      if (typeof localStorage !== 'undefined') {
        for (const key of sessionKeys) {
          localStorage.removeItem(key)
        }
      }
      await navigateTo('/auth/login', { replace: true })
    } finally {
      loggingOut.value = false
    }
  }

  return { logout, loggingOut }
}
