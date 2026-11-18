<template>
  <div class="block">
    <div class="mb-1.5 flex items-center justify-between gap-3">
      <label :for="id" class="text-[13px] font-medium leading-5 text-ink">
        {{ label }}
      </label>
      <slot name="hint" />
    </div>
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="field"
        :class="[type === 'password' ? 'pr-10' : '', error ? 'invalid' : '']"
        @input="onInput"
      >
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-faint transition-colors hover:text-ink"
        :aria-label="revealed ? 'Hide password' : 'Show password'"
        @click="revealed = !revealed"
      >
        <Icon :name="revealed ? 'EyeSlash' : 'Eye'" :size="16" />
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="mt-1.5 flex items-center gap-1.5 text-[13px] leading-5 text-danger">
      <Icon name="Warning2" :size="14" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: string
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: string
}>(), {
  type: 'text',
  placeholder: '',
  autocomplete: 'on',
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const revealed = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && revealed.value) {
    return 'text'
  }
  return props.type
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
