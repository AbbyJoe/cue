<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
// Imported directly so the toaster never depends on component auto-registration.
import Toaster from '~/components/ui/Toaster.vue'
</script>
