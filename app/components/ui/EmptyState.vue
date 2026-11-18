<template>
  <div class="card bg-dots flex flex-col items-center px-6 py-14 text-center">
    <span class="grid h-12 w-12 place-items-center rounded-2xl border border-accent/30 bg-accent-soft text-accent">
      <Icon :name="icon" :size="22" />
    </span>
    <h2 class="mt-5 text-lg font-semibold">{{ title }}</h2>
    <p class="mt-2 max-w-md text-sm leading-6 text-ink-soft">{{ description }}</p>
    <div v-if="$slots.default" class="mt-7">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>
