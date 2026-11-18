<template>
  <form class="space-y-5" @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Create your account</h1>
      <p class="mt-2 text-sm text-ink-soft">Just the basics to begin. You can add a CV later in Settings.</p>
    </header>

    <div class="grid gap-5 sm:grid-cols-2 sm:gap-3">
      <Field
        id="first-name"
        v-model="firstName"
        label="First name"
        placeholder="Ada"
        autocomplete="given-name"
        :error="errors.firstName"
      />
      <Field
        id="last-name"
        v-model="lastName"
        label="Last name"
        placeholder="Okafor"
        autocomplete="family-name"
        :error="errors.lastName"
      />
    </div>
    <Field
      id="email"
      v-model="email"
      label="Email address"
      type="email"
      placeholder="you@example.com"
      autocomplete="email"
      :error="errors.email"
    />
    <Field
      id="password"
      v-model="password"
      label="Password"
      type="password"
      placeholder="At least 8 characters"
      autocomplete="new-password"
      :error="errors.password"
    />
    <Field
      id="confirm"
      v-model="confirm"
      label="Confirm password"
      type="password"
      placeholder="Repeat your password"
      autocomplete="new-password"
      :error="errors.confirm"
    />

    <Button type="submit" block>
      Create account
    </Button>

    <p class="text-center text-sm text-ink-soft">
      Already have an account?
      <NuxtLink to="/auth/login" class="font-medium text-accent hover:text-ink">Log in</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { updateProfile } from '~/utils/profile'
import { isEmail, nameError } from '~/utils/validation'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Create an account' })

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const errors = reactive({ firstName: '', lastName: '', email: '', password: '', confirm: '' })

function submit() {
  errors.firstName = nameError(firstName.value, 'first')
  errors.lastName = nameError(lastName.value, 'last')
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  errors.password = password.value.length >= 8 ? '' : 'Use at least 8 characters.'
  errors.confirm = password.value === confirm.value ? '' : 'Passwords do not match.'

  if (Object.values(errors).every((message) => !message)) {
    // TODO: send names as Supabase user metadata and create the profile row server-side.
    updateProfile({ firstName: firstName.value.trim(), lastName: lastName.value.trim() })
    navigateTo('/dashboard')
  }
}
</script>
