<template>
  <!-- Bottom centre on phones, bottom right from sm up. Newest toast at the bottom. -->
  <section
    class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    aria-label="Notifications"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      enter-from-class="translate-y-3 scale-95 opacity-0"
      leave-active-class="transition duration-200 ease-in absolute"
      leave-to-class="translate-x-6 opacity-0"
      move-class="transition-transform duration-300 ease-out"
    >
      <article
        v-for="toast in toasts"
        :key="toast.id"
        class="group pointer-events-auto relative w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-float ring-1 ring-line backdrop-blur-xl"
        :role="toast.kind === 'error' ? 'alert' : 'status'"
        :aria-live="toast.kind === 'error' ? 'assertive' : 'polite'"
      >
        <div class="flex items-start gap-3 p-3.5 pr-11">
          <span :class="['grid h-8 w-8 flex-none place-items-center rounded-xl', look[toast.kind].tile]">
            <Icon :name="look[toast.kind].icon" :size="17" />
          </span>
          <div class="min-w-0 flex-1 pt-[0.3rem]">
            <p class="text-sm font-medium leading-5 text-ink">{{ toast.title }}</p>
            <p v-if="toast.description" class="mt-0.5 text-[13px] leading-5 text-ink-soft">{{ toast.description }}</p>
            <button
              v-if="toast.action"
              type="button"
              class="mt-2 text-[13px] font-medium text-accent hover:text-ink"
              @click="runAction(toast)"
            >
              {{ toast.action.label }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full text-ink-faint transition-colors hover:bg-ink/[0.05] hover:text-ink"
          aria-label="Dismiss notification"
          @click="dismiss(toast.id)"
        >
          <Icon name="CloseCircle" :size="16" />
        </button>

        <!-- Countdown. Pauses while hovered or focused; closes the toast when it ends. -->
        <span
          v-if="toast.duration > 0"
          :class="['toast-timer absolute inset-x-0 bottom-0 h-[2px] origin-left animate-[toast-timer_linear_forwards] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]', look[toast.kind].bar]"
          :style="{ animationDuration: `${toast.duration}ms` }"
          aria-hidden="true"
          @animationend="dismiss(toast.id)"
        />
      </article>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import type { Toast, ToastKind } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

const look: Record<ToastKind, { icon: string, tile: string, bar: string }> = {
  success: { icon: 'TickCircle', tile: 'bg-aura-mint text-ink', bar: 'bg-accent' },
  info: { icon: 'InfoCircle', tile: 'bg-aura-sky text-ink', bar: 'bg-accent' },
  error: { icon: 'Warning2', tile: 'bg-danger-soft text-danger', bar: 'bg-danger' },
}

function runAction(toast: Toast) {
  toast.action?.onClick()
  dismiss(toast.id)
}
</script>

<style>
/* Countdown bar: shrinks from full width to nothing. */
@keyframes toast-timer {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>
