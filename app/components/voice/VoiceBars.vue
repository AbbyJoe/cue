<template>
  <span class="inline-flex items-center gap-0.5" :style="{ height: `${height}px` }" aria-hidden="true">
    <span
      v-for="i in count"
      :key="i"
      class="h-full w-0.5 animate-eq rounded-sm bg-current transition-transform duration-100 motion-reduce:animate-none"
      :style="{
        transform: `scaleY(${scale})`,
        animationDelay: `${-(i * 137) % 900}ms`,
        animationDuration: `${620 + (i * 89) % 480}ms`,
      }"
    />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  level?: number
  count?: number
  height?: number
  active?: boolean
}>(), {
  level: 0,
  count: 14,
  height: 18,
  active: true,
})

const scale = computed(() => {
  const amp = props.active ? Math.min(0.25 + props.level * 4, 1) : 0.12
  return 0.15 + amp * 0.85
})
</script>
