<template>
  <!-- Desktop: fixed viewport, each half scrolls independently with hidden scrollbars. -->
  <div class="min-h-screen bg-canvas lg:grid lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
    <AuthShowcase :class="['hidden lg:flex', pane]" />
    <main :class="['flex min-h-screen px-6 py-12', pane]">
      <!-- margin:auto centres without clipping the top when content is taller than the pane -->
      <div class="m-auto w-full max-w-sm">
        <div class="mb-10 flex justify-center">
          <Wordmark />
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const pane = 'lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
</script>
