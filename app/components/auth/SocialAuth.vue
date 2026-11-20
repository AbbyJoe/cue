<template>
  <div>
    <div class="grid gap-3 grid-cols-2">
      <div v-for="provider in providers" :key="provider.id" class="relative">
        <button
          type="button"
          class="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-surface px-3 text-sm font-medium text-ink shadow-xs transition-[background-color,border-color,transform] duration-150 hover:border-line-hover hover:bg-surface-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-line-strong disabled:hover:bg-surface disabled:active:scale-100"
          :disabled="!provider.enabled || Boolean(pending)"
          :aria-label="provider.enabled ? `Continue with ${provider.name}` : `${provider.name} sign-in is coming soon`"
          :aria-busy="pending === provider.id"
          :title="provider.enabled ? undefined : 'Coming soon'"
          @click="start(provider.id)"
        >
          <CueLogo v-if="pending === provider.id" :size="18" animated aria-hidden="true" />
          <!-- Google "G" -->
          <svg v-else-if="provider.id === 'google'" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          <!-- LinkedIn "in" -->
          <svg v-else width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" rx="4" fill="#0A66C2" />
            <path fill="#FFFFFF" d="M7.1 9.6h-2.6v8.9h2.6V9.6zM5.8 8.4c.85 0 1.5-.68 1.5-1.5S6.65 5.4 5.8 5.4s-1.5.68-1.5 1.5.65 1.5 1.5 1.5zM19.5 13.6c0-2.4-.52-4.2-3.3-4.2-1.35 0-2.25.74-2.62 1.44h-.04V9.6H11v8.9h2.6v-4.4c0-1.16.22-2.28 1.66-2.28 1.42 0 1.44 1.33 1.44 2.36v4.32h2.6l.2-4.9z" />
          </svg>
          {{ provider.name }}
        </button>
        <!-- Label sits on the button's top-right edge, outside the faded button -->
        <span
          v-if="!provider.enabled"
          class="pointer-events-none absolute -top-2 right-4 rounded-full bg-surface px-2 py-px text-[11px] font-medium leading-4 text-ink-soft shadow-xs ring-1 ring-line"
          aria-hidden="true"
        >Coming soon</span>
      </div>
    </div>

    <div class="my-6 flex items-center gap-3 text-[13px] text-ink-faint" role="separator">
      <span class="h-px flex-1 bg-line" />
      or {{ intent === 'signup' ? 'sign up' : 'log in' }} with email
      <span class="h-px flex-1 bg-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OAuthProvider } from '~/composables/useAuth'

defineProps<{
  intent: 'login' | 'signup'
}>()

const { signInWithProvider } = useAuth()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const providers: Array<{ id: OAuthProvider, name: string, enabled: boolean }> = [
  { id: 'google', name: 'Google', enabled: true },
  { id: 'linkedin', name: 'LinkedIn', enabled: false },
]

// Messages for errors reported back by /auth/callback (?error=...).
const callbackErrors: Record<string, { title: string, description: string }> = {
  cancelled: { title: 'Sign-in cancelled', description: 'Choose an option to try again.' },
  link: { title: 'That link didn’t work', description: 'It has expired or was opened in a different browser. If you already confirmed your email, log in below.' },
  failed: { title: 'Couldn’t sign you in', description: 'Please try again.' },
  unavailable: { title: 'Sign-in isn’t available', description: 'Please try again later.' },
}

const pending = ref<OAuthProvider | null>(null)

async function start(provider: OAuthProvider) {
  pending.value = provider
  try {
    const next = typeof route.query.next === 'string' ? route.query.next : '/dashboard'
    await signInWithProvider(provider, next)
    // On success the browser is already leaving for the provider; keep the spinner.
  } catch {
    const name = providers.find((item) => item.id === provider)?.name
    toast.error(`Couldn’t connect to ${name}`, { description: 'Try again, or use your email.' })
    pending.value = null
  }
}

// Coming back with the browser's back button restores the page from cache; reset the spinner.
onMounted(() => {
  window.addEventListener('pageshow', resetPending)

  // Show a callback error once, then drop it from the URL so a reload doesn't repeat it.
  const message = callbackErrors[String(route.query.error ?? '')]
  if (message) {
    toast.error(message.title, { description: message.description })
    const { error: _error, ...query } = route.query
    router.replace({ query })
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('pageshow', resetPending)
})
function resetPending() {
  pending.value = null
}
</script>
