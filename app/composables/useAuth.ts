export type OAuthProvider = 'google' | 'linkedin'

/** Supabase provider ids. LinkedIn uses the OpenID Connect provider. */
const supabaseProviders = {
  google: 'google',
  linkedin: 'linkedin_oidc',
} as const

export type EmailAuthResult =
  | { status: 'signed-in' }
  | { status: 'confirm-email' }
  | { status: 'error', code: string, message: string }

/** Plain-language messages for the Supabase errors people actually hit. */
function describe(error: { code?: string, message: string, status?: number }): EmailAuthResult {
  const code = error.code ?? ''
  const messages: Record<string, string> = {
    invalid_credentials: 'That email and password don’t match. Check them and try again.',
    email_not_confirmed: 'Confirm your email first. We sent you a link when you signed up.',
    user_already_exists: 'An account with this email already exists. Log in instead.',
    email_exists: 'An account with this email already exists. Log in instead.',
    weak_password: 'Choose a stronger password: at least 8 characters, ideally a mix of words, numbers and symbols.',
    email_address_invalid: 'Enter a valid email address.',
    signup_disabled: 'New sign-ups are paused right now.',
    over_email_send_rate_limit: 'Too many emails sent. Wait a minute and try again.',
    over_request_rate_limit: 'Too many attempts. Wait a minute and try again.',
  }
  return {
    status: 'error',
    code,
    message: messages[code] ?? (error.status === 429 ? messages.over_request_rate_limit! : 'Something went wrong. Please try again.'),
  }
}

function callbackUrl(next: string, flow?: 'email') {
  const url = new URL('/auth/callback', window.location.origin)
  url.searchParams.set('next', next)
  if (flow) {
    url.searchParams.set('flow', flow)
  }
  return url.toString()
}

export function useAuth() {
  const loggingOut = useState('auth-logging-out', () => false)
  const { clear: clearProfile } = useProfile()
  const { clear: clearWorkspaces } = useWorkspaces()
  const toast = useToast()

  async function logout() {
    if (loggingOut.value) {
      return
    }
    loggingOut.value = true
    try {
      // scope 'local' ends this browser's session without signing out other devices.
      await useSupabase()?.auth.signOut({ scope: 'local' })
      clearProfile()
      clearWorkspaces()
      await navigateTo('/auth/login', { replace: true })
      toast.info('You’ve been logged out')
    } finally {
      loggingOut.value = false
    }
  }

  /**
   * Start social sign-in. The same call covers log in and sign up: the provider
   * creates the account on first use. The browser leaves the site and comes back
   * through /auth/callback.
   */
  async function signInWithProvider(provider: OAuthProvider, next = '/dashboard') {
    const supabase = useSupabase()
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: supabaseProviders[provider],
      options: {
        redirectTo: callbackUrl(next),
        // Ask Google which account to use instead of silently picking the last one.
        queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
      },
    })
    if (error) {
      throw error
    }
  }

  async function signInWithPassword(email: string, password: string): Promise<EmailAuthResult> {
    const supabase = useSupabase()
    if (!supabase) {
      return { status: 'error', code: 'unavailable', message: 'Sign-in isn’t available right now.' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error ? describe(error) : { status: 'signed-in' }
  }

  /**
   * Create an account. Names go into user metadata, where the database trigger
   * copies them into public.profiles. With email confirmation on, there is no
   * session until the person clicks the link in their inbox.
   */
  async function signUpWithPassword(input: {
    firstName: string
    lastName: string
    email: string
    password: string
    next?: string
  }): Promise<EmailAuthResult> {
    const supabase = useSupabase()
    if (!supabase) {
      return { status: 'error', code: 'unavailable', message: 'Sign-up isn’t available right now.' }
    }
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: { first_name: input.firstName.trim(), last_name: input.lastName.trim() },
        emailRedirectTo: callbackUrl(input.next ?? '/dashboard', 'email'),
      },
    })
    if (error) {
      return describe(error)
    }
    if (data.session) {
      return { status: 'signed-in' }
    }
    // With confirmation on, Supabase hides whether the email is already registered
    // (no error, but an empty identities list). Say so without exposing more.
    if (data.user && data.user.identities?.length === 0) {
      return describe({ code: 'user_already_exists', message: '' })
    }
    return { status: 'confirm-email' }
  }

  /** Send the confirmation email again. */
  async function resendConfirmation(email: string, next = '/dashboard'): Promise<EmailAuthResult> {
    const supabase = useSupabase()
    if (!supabase) {
      return { status: 'error', code: 'unavailable', message: 'Email isn’t available right now.' }
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: { emailRedirectTo: callbackUrl(next, 'email') },
    })
    return error ? describe(error) : { status: 'confirm-email' }
  }

  /** Email a link that signs the person in and opens the new-password page. */
  async function sendPasswordReset(email: string): Promise<EmailAuthResult> {
    const supabase = useSupabase()
    if (!supabase) {
      return { status: 'error', code: 'unavailable', message: 'Password reset isn’t available right now.' }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: callbackUrl('/auth/update-password'),
    })
    return error ? describe(error) : { status: 'confirm-email' }
  }

  async function updatePassword(password: string): Promise<EmailAuthResult> {
    const supabase = useSupabase()
    if (!supabase) {
      return { status: 'error', code: 'unavailable', message: 'Password reset isn’t available right now.' }
    }
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      return { status: 'error', code: 'session', message: 'Open the reset link from your email, then choose a new password.' }
    }
    const { error } = await supabase.auth.updateUser({ password })
    return error ? describe(error) : { status: 'signed-in' }
  }

  return { logout, loggingOut, signInWithProvider, signInWithPassword, signUpWithPassword, resendConfirmation, sendPasswordReset, updatePassword }
}
