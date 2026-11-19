<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="flex-none overflow-visible"
    role="img"
    aria-label="Cue"
  >
    <!-- The "C": an open voice ring, open toward where the voice travels -->
    <path
      d="M31.82 10.77A15 15 0 1 0 31.82 29.23"
      :class="onDark ? 'stroke-[#6E9BFF]' : 'stroke-accent'"
      stroke-width="3.2"
      stroke-linecap="round"
    />
    <!-- Voice: three bars, the conversation inside the ring -->
    <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <path :class="[bar, animated && 'animate-talk']" d="M13.5 16.5v7" />
      <path :class="[bar, animated && 'animate-talk [animation-delay:-0.35s]']" d="M20 12v16" />
      <path :class="[bar, animated && 'animate-talk [animation-delay:-0.7s]']" d="M26.5 15v10" />
    </g>
    <!-- AI spark at the mouth of the ring -->
    <path
      :class="[bar, onDark ? 'fill-accent-line' : 'fill-accent-strong', animated && 'animate-spark']"
      d="M35 15.5c.45 2.75 1.25 3.55 4 4-2.75.45-3.55 1.25-4 4-.45-2.75-1.25-3.55-4-4 2.75-.45 3.55-1.25 4-4Z"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  animated?: boolean
  /** Lighter blues for use on charcoal (e.g. inside primary buttons). */
  onDark?: boolean
}>(), {
  size: 28,
  animated: false,
  onDark: false,
})

// SVG children need fill-box so they scale around their own centre.
const bar = 'origin-center [transform-box:fill-box]'
</script>
