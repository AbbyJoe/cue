<template>
  <form class="space-y-5" @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Welcome back</h1>
      <p class="mt-2 text-sm text-ink-soft">Continue your interview preparation.</p>
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

    <Button type="submit" block>
      Log in
    </Button>

    <p class="text-center text-sm text-ink-soft">
      New to Cue?
      <NuxtLink to="/auth/signup" class="font-medium text-accent hover:text-ink">Create an account</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { isEmail } from '~/utils/validation'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Log in' })

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })

function submit() {
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  errors.password = password.value ? '' : 'Enter your password.'

  if (!errors.email && !errors.password) {
    navigateTo('/dashboard')
  }
}
</script>
