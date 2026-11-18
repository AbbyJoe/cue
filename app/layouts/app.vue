<template>
  <div class="min-h-screen bg-canvas lg:grid lg:grid-cols-[16.5rem_1fr]">
    <AppSidebar v-model:open="navOpen" />
    <div class="min-w-0">
      <AppTopbar @menu="navOpen = true" />
      <main class="px-5 pb-16 pt-7 lg:px-10 lg:pt-9">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const navOpen = ref(false)
</script>
