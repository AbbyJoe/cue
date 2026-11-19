<template>
  <section v-if="sent" class="text-center" aria-live="polite">
    <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-aura-sky text-ink">
      <Icon name="SmsTracking" :size="26" />
    </span>
    <h1 class="mt-6 text-[1.75rem] font-semibold leading-9 tracking-tight">Check your inbox</h1>
    <p class="mt-2 text-sm leading-6 text-ink-soft">
      If an account exists for <span class="font-medium text-ink">{{ email }}</span>, we sent a link to choose a new password.
    </p>
    <Button to="/auth/login" variant="secondary" block class="mt-8">
      Back to log in
    </Button>
  </section>

  <form v-else class="space-y-5" novalidate @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Reset your password</h1>
      <p class="mt-2 text-sm text-ink-soft">Enter the email on your account.</p>
    </header>

    <Field
      id="email"
      v-model="email"
      label="Email address"
      type="email"
      placeholder="you@example.com"
      autocomplete="email"
      :error="errors.email"
    />

    <Button type="submit" block :loading="submitting">
      {{ submitting ? 'Sending…' : 'Send reset link' }}
    </Button>

    <p class="text-center text-sm">
      <NuxtLink to="/auth/login" class="font-medium text-accent hover:text-ink">Back to log in</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { isEmail } from '~/utils/validation'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Reset password' })

const { sendPasswordReset } = useAuth()
const toast = useToast()
const email = ref('')
const sent = ref(false)
const submitting = ref(false)
const errors = reactive({ email: '' })

async function submit() {
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  if (errors.email) {
    return
  }
  submitting.value = true
  const result = await sendPasswordReset(email.value)
  submitting.value = false
  if (result.status === 'error' && result.code !== 'user_not_found') {
    toast.error(result.message)
    return
  }
  sent.value = true
}
</script>
