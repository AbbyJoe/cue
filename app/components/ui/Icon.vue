<template>
  <VsxIcon :icon-name="name" type="linear" :size="size" color="currentColor" />
</template>

<script setup lang="ts">
import { VsxIcon } from 'vue-iconsax'

withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 20,
})
</script>
