<template>
  <form class="space-y-5" novalidate @submit.prevent="submit">
    <header class="mb-8 text-center">
      <h1 class="text-[1.75rem] font-semibold leading-9 tracking-tight">Choose a new password</h1>
      <p class="mt-2 text-sm text-ink-soft">Use at least 8 characters.</p>
    </header>

    <Field
      id="password"
      v-model="password"
      label="New password"
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
      {{ submitting ? 'Saving…' : 'Update password' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'New password' })

const { updatePassword } = useAuth()
const toast = useToast()
const password = ref('')
const confirm = ref('')
const submitting = ref(false)
const errors = reactive({ password: '', confirm: '' })

async function submit() {
  errors.password = password.value.length >= 8 ? '' : 'Use at least 8 characters.'
  errors.confirm = password.value === confirm.value ? '' : 'Those passwords don’t match.'
  if (errors.password || errors.confirm) {
    return
  }
  submitting.value = true
  const result = await updatePassword(password.value)
  submitting.value = false
  if (result.status === 'error') {
    toast.error(result.message)
    return
  }
  toast.success('Password updated')
  await navigateTo('/dashboard')
}
</script>
