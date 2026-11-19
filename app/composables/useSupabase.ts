import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

/**
 * The browser Supabase client. Sessions live in cookies so the server can read
 * them too. Returns null on the server or when Supabase isn't configured.
 */
export function useSupabase(): SupabaseClient | null {
  if (import.meta.server) {
    return null
  }
  if (!browserClient) {
    const { supabaseUrl, supabasePublishableKey } = useRuntimeConfig().public
    if (!supabaseUrl || !supabasePublishableKey) {
      return null
    }
    browserClient = createBrowserClient(supabaseUrl as string, supabasePublishableKey as string)
  }
  return browserClient
}
