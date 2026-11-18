<template>
  <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div class="animate-rise">
      <h1 class="mt-3 text-[1.75rem] font-semibold leading-9 tracking-[-0.025em]">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-xl text-[15px] leading-6 text-ink-soft">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
