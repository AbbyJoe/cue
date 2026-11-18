<template>
  <ul class="space-y-2.5">
    <li v-for="(score, i) in scores" :key="score.name">
      <div class="flex items-baseline justify-between text-xs">
        <span class="text-ink-soft">{{ score.name }}</span>
        <span class="font-medium tabular-nums text-ink">{{ shown ? score.value : 0 }}/5</span>
      </div>
      <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-subtle">
        <span
          class="block h-full rounded-full bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
          :style="{ width: shown ? `${score.value * 20}%` : '0%', transitionDelay: `${i * 120}ms` }"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { DemoScore } from '~/data/demo'

defineProps<{
  scores: DemoScore[]
  shown: boolean
}>()
</script>
