<template>
  <!-- After sign-up: check your inbox -->
  <section v-if="sentTo" class="text-center" aria-live="polite">
    <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-aura-sky text-ink">
      <Icon name="SmsTracking" :size="26" />
    </span>
    <h1 class="mt-6 text-[1.75rem] font-semibold leading-9 tracking-tight">Check your inbox</h1>
    <p class="mt-2 text-sm leading-6 text-ink-soft">
      We sent a confirmation link to <span class="font-medium text-ink">{{ sentTo }}</span>.
      Open it on this device to finish creating your account.
    </p>

    <div class="mt-8 grid gap-3">
      <Button variant="secondary" block :loading="resend === 'sending'" :disabled="cooldown > 0" @click="resendLink">
        <template v-if="resend === 'sending'">Sending…</template>
        <template v-else-if="cooldown > 0">Send again in {{ cooldown }}s</template>
        <template v-else>Send the link again</template>
      </Button>
      <Button variant="ghost" block @click="startOver">Use a different email</Button>
    </div>

    <p class="mt-8 text-[13px] leading-5 text-ink-faint">
      Can’t find it? Check your spam folder. The link expires after 24 hours.
    </p>
  </section>

  <form v-else class="space-y-5" novalidate @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Create your account</h1>
      <p class="mt-2 text-sm text-ink-soft">Enter your details to get started.</p>
    </header>

    <SocialAuth intent="signup" />

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

    <Button type="submit" block :loading="submitting">
      {{ submitting ? 'Creating your account…' : 'Create account' }}
    </Button>

    <p class="text-center text-[13px] leading-5 text-ink-faint">
      By creating an account you agree that feedback from Cue is coaching, not a hiring decision.
    </p>

    <p class="text-center text-sm text-ink-soft">
      Already have an account?
      <NuxtLink :to="{ path: '/auth/login', query: loginQuery }" class="font-medium text-accent hover:text-ink">Log in</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { isEmail, nameError } from '~/utils/validation'

definePageMeta({ layout: 'auth' })
usePageSeo({ title: 'Create an account', description: 'Create a free Cue account and start rehearsing interviews with an AI coach.' })

const route = useRoute()
const { signUpWithPassword, resendConfirmation } = useAuth()
const toast = useToast()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const errors = reactive({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
const submitting = ref(false)

const sentTo = ref('')
const resend = ref<'idle' | 'sending'>('idle')
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const next = computed(() => {
  const value = route.query.next
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'
})
const loginQuery = computed(() => (route.query.next ? { next: route.query.next } : {}))

async function submit() {
  errors.firstName = nameError(firstName.value, 'first')
  errors.lastName = nameError(lastName.value, 'last')
  errors.email = isEmail(email.value) ? '' : 'Enter a valid email address.'
  errors.password = password.value.length >= 8 ? '' : 'Use at least 8 characters.'
  errors.confirm = password.value === confirm.value ? '' : 'Passwords do not match.'
  if (Object.values(errors).some(Boolean)) {
    return
  }

  submitting.value = true
  const result = await signUpWithPassword({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    next: next.value,
  })
  submitting.value = false

  if (result.status === 'signed-in') {
    // Email confirmation is off in Supabase, so there is a session already.
    await navigateTo(next.value, { replace: true })
    return
  }
  if (result.status === 'confirm-email') {
    sentTo.value = email.value.trim()
    toast.success('Account created', { description: 'Confirm your email to finish.' })
    password.value = ''
    confirm.value = ''
    startCooldown()
    return
  }
  const accountExists = result.code === 'user_already_exists' || result.code === 'email_exists'
  toast.error('Couldn’t create your account', {
    description: result.message,
    action: accountExists ? { label: 'Go to log in', onClick: () => navigateTo({ path: '/auth/login', query: loginQuery.value }) } : undefined,
  })
  if (result.code === 'weak_password') {
    errors.password = 'Choose a stronger password.'
  }
}

async function resendLink() {
  resend.value = 'sending'
  const result = await resendConfirmation(sentTo.value, next.value)
  resend.value = 'idle'
  if (result.status === 'error') {
    toast.error('Couldn’t send the link', { description: result.message })
    return
  }
  toast.success('A new link is on its way', { description: `Sent to ${sentTo.value}.` })
  startCooldown()
}

// Supabase limits confirmation emails; wait a minute between sends.
function startCooldown() {
  cooldown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

function startOver() {
  sentTo.value = ''
  resend.value = 'idle'
  clearInterval(timer)
  cooldown.value = 0
}

onBeforeUnmount(() => clearInterval(timer))
</script>
