<template>
  <div class="min-h-screen bg-canvas text-ink">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Signed-in pages are private: keep them out of search results.
useSeoMeta({ robots: 'noindex, nofollow' })
</script>
