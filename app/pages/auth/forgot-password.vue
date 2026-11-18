<template>
  <form class="space-y-5" @submit.prevent="submit">
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

    <p v-if="sent" class="rounded-md border border-accent-line bg-accent-soft px-3 py-3 text-sm leading-6 text-accent">
      Password reset is not connected yet. This is where the confirmation will appear.
    </p>

    <Button type="submit" block>
      Send reset link
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

const email = ref('')
const sent = ref(false)
const errors = reactive({ email: '' })

function submit() {
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  sent.value = !errors.email
}
</script>
