<template>
  <form class="space-y-5" novalidate @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Welcome back</h1>
      <p class="mt-2 text-sm text-ink-soft">Continue your interview preparation.</p>
    </header>

    <SocialAuth intent="login" />

    <Field
      id="email"
      v-model="email"
      label="Email address"
      type="email"
      placeholder="you@example.com"
      autocomplete="email"
      :error="errors.email"
    />
    <div>
      <Field
        id="password"
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autocomplete="current-password"
        :error="errors.password"
      />
      <div class="mt-3 text-right">
        <NuxtLink to="/auth/forgot-password" class="text-sm text-accent hover:text-ink">
          Forgot your password?
        </NuxtLink>
      </div>
    </div>

    <Button type="submit" block :loading="submitting">
      {{ submitting ? 'Logging in…' : 'Log in' }}
    </Button>

    <p class="text-center text-sm text-ink-soft">
      New to Cue?
      <NuxtLink :to="{ path: '/auth/signup', query: route.query.next ? { next: route.query.next } : {} }" class="font-medium text-accent hover:text-ink">Create an account</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { isEmail } from '~/utils/validation'

definePageMeta({ layout: 'auth' })
usePageSeo({ title: 'Log in', description: 'Log in to Cue to keep practising interviews and review your feedback.' })

const route = useRoute()
const { signInWithPassword, resendConfirmation } = useAuth()
const toast = useToast()

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })
const submitting = ref(false)

const next = computed(() => {
  const value = route.query.next
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'
})

async function submit() {
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  errors.password = password.value ? '' : 'Enter your password.'
  if (errors.email || errors.password) {
    return
  }

  submitting.value = true
  const result = await signInWithPassword(email.value, password.value)
  submitting.value = false

  if (result.status === 'signed-in') {
    // toast.success('Welcome back')
    await navigateTo(next.value, { replace: true })
    return
  }
  if (result.status === 'error') {
    // An unconfirmed account can ask for a new link straight from the toast.
    const action = result.code === 'email_not_confirmed'
      ? { label: 'Send the link again', onClick: resendLink }
      : undefined
    toast.error('Couldn’t log you in', { description: result.message, action })
  }
}

async function resendLink() {
  const result = await resendConfirmation(email.value, next.value)
  if (result.status === 'error') {
    toast.error('Couldn’t send the link', { description: result.message })
    return
  }
  toast.success('Confirmation link sent', { description: `Check ${email.value.trim()} and open the link on this device.` })
}
</script>
