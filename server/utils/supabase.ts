import { createClient } from '@supabase/supabase-js'
import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'

let serviceClient: SupabaseClient | null = null

/** True when the public Supabase URL and publishable key are set. */
export function supabaseConfigured(event: H3Event) {
  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig(event).public
  return Boolean(supabaseUrl && supabasePublishableKey)
}

/**
 * A Supabase client bound to this request. It reads the session from cookies
 * and writes refreshed tokens back onto the response. One client per request.
 */
export function serverSupabase(event: H3Event): SupabaseClient {
  if (event.context.supabase) {
    return event.context.supabase as SupabaseClient
  }

  const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig(event).public
  const client = createServerClient(supabaseUrl as string, supabasePublishableKey as string, {
    cookies: {
      getAll() {
        return parseCookieHeader(getHeader(event, 'cookie') ?? '').map(({ name, value }) => ({ name, value: value ?? '' }))
      },
      setAll(cookies) {
        for (const { name, value, options } of cookies) {
          setCookie(event, name, value, options)
        }
      },
    },
  })

  event.context.supabase = client
  return client
}

/** Bypasses row level security. Used when a webhook, not a signed-in user, writes a row. */
export function serviceSupabase(): SupabaseClient | null {
  const { supabaseSecretKey, public: { supabaseUrl } } = useRuntimeConfig()
  if (!supabaseUrl || !supabaseSecretKey) {
    return null
  }
  serviceClient ??= createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return serviceClient
}

/** Only allow same-site relative paths, so `next` can't send people elsewhere. */
export function safeNext(value: unknown, fallback = '/dashboard') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
    ? value
    : fallback
}
