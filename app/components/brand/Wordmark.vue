<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center gap-[0.55rem] text-ink"
    aria-label="Cue home"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <CueLogo :size="size" :animated="animated || hovered" />
    <span class="text-xl font-semibold leading-none tracking-[-0.04em]">cue</span>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  size?: number
  animated?: boolean
}>(), {
  to: '/',
  size: 28,
  animated: false,
})

const hovered = ref(false)
</script>
