<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'sm' | 'lg'
  type?: 'button' | 'submit'
  to?: string | Record<string, unknown>
  disabled?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  block: false,
})

// Pill controls: charcoal primary with a soft top highlight, white secondary.
const classes = computed(() => {
  const variants = {
    primary: 'border border-accent-solid bg-accent-solid text-white shadow-button hover:border-accent-hover hover:bg-accent-hover',
    secondary: 'border border-line-strong bg-surface text-ink shadow-xs hover:border-line-hover hover:bg-surface-hover',
    ghost: 'border border-transparent text-ink-soft hover:bg-ink/[0.04] hover:text-ink',
    danger: 'border border-danger/40 bg-surface text-danger hover:bg-danger-soft',
  }
  const sizes = {
    sm: 'h-8 px-3.5 text-[13px] gap-1.5',
    md: 'h-10 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-[15px] gap-2',
  }

  return [
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium transition-[color,background-color,border-color,box-shadow,transform] active:scale-[0.98] duration-150 disabled:cursor-not-allowed disabled:opacity-50',
    variants[props.variant],
    sizes[props.size],
    props.block ? 'w-full' : '',
  ]
})
</script>
