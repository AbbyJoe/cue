<template>
  <div ref="root">
    <label :id="`${id}-label`" :for="id" class="mb-1.5 block text-[13px] font-medium leading-5 text-ink">
      {{ label }}
    </label>

    <div class="relative">
      <button
      :id="id"
      ref="trigger"
      type="button"
      class="field flex items-center justify-between gap-2 text-left"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="`${id}-listbox`"
      :aria-labelledby="`${id}-label ${id}`"
      @click="toggle"
      @keydown="onTriggerKey"
    >
      <span class="truncate">{{ selected?.label ?? 'Select…' }}</span>
      <Icon
        name="ArrowDown2"
        :size="16"
        class="shrink-0 text-ink-faint transition-transform duration-150"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      leave-active-class="transition duration-100 ease-in"
      enter-from-class="opacity-0 scale-[0.98]"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <ul
        v-show="open"
        :id="`${id}-listbox`"
        ref="list"
        role="listbox"
        tabindex="-1"
        class="absolute inset-x-0 z-50 max-h-80 overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-menu outline-none"
        :class="openAbove ? 'bottom-[calc(100%+4px)] origin-bottom' : 'top-[calc(100%+4px)] origin-top'"
        :aria-labelledby="`${id}-label`"
        :aria-activedescendant="open ? optionId(active) : undefined"
        @keydown="onListKey"
      >
        <template v-for="(option, index) in options" :key="option.value">
        <li
          v-if="option.group && option.group !== options[index - 1]?.group"
          class="px-2.5 pb-1 pt-2 text-[11px] font-medium text-ink-faint"
          role="presentation"
        >
          {{ option.group }}
        </li>
        <li
          :id="optionId(index)"
          role="option"
          :aria-selected="option.value === modelValue"
          class="flex min-h-9 cursor-pointer items-center justify-between gap-3 rounded-[0.35rem] px-2.5 text-sm"
          :class="[
            index === active ? 'bg-panel' : '',
            index === active || option.value === modelValue ? 'text-ink' : 'text-ink-soft',
            option.value === modelValue ? 'font-medium' : '',
          ]"
          @mousemove="active = index"
          @click="choose(index)"
        >
          <span class="truncate">{{ option.label }}</span>
          <Icon v-if="option.value === modelValue" name="TickCircle" :size="16" class="shrink-0 text-accent" />
        </li>
        </template>
      </ul>
    </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from '~/utils/interview'

const props = defineProps<{
  id: string
  label: string
  modelValue: string
  options: SelectOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLUListElement | null>(null)
const open = ref(false)
const openAbove = ref(false)
const active = ref(0)

let typed = ''
let typedTimer: ReturnType<typeof setTimeout> | undefined

const selectedIndex = computed(() => props.options.findIndex((option) => option.value === props.modelValue))
const selected = computed(() => props.options[selectedIndex.value])

function optionId(index: number) {
  return `${props.id}-option-${index}`
}

async function show() {
  if (open.value) {
    return
  }
  active.value = Math.max(selectedIndex.value, 0)
  // Flip upward when there is not enough room below.
  const rect = trigger.value?.getBoundingClientRect()
  openAbove.value = rect ? window.innerHeight - rect.bottom < 280 && rect.top > 280 : false
  open.value = true
  await nextTick()
  list.value?.focus({ preventScroll: true })
  scrollActive()
}

function hide(refocus = true) {
  if (!open.value) {
    return
  }
  open.value = false
  if (refocus) {
    trigger.value?.focus({ preventScroll: true })
  }
}

function toggle() {
  if (open.value) {
    hide()
  } else {
    void show()
  }
}

function choose(index: number) {
  const option = props.options[index]
  if (option) {
    emit('update:modelValue', option.value)
  }
  hide()
}

function move(to: number) {
  const last = props.options.length - 1
  active.value = Math.min(Math.max(to, 0), last)
  scrollActive()
}

function scrollActive() {
  nextTick(() => {
    document.getElementById(optionId(active.value))?.scrollIntoView({ block: 'nearest' })
  })
}

function typeahead(key: string) {
  typed += key.toLowerCase()
  clearTimeout(typedTimer)
  typedTimer = setTimeout(() => {
    typed = ''
  }, 500)
  const start = open.value ? active.value + (typed.length === 1 ? 1 : 0) : 0
  const ordered = [...props.options.slice(start), ...props.options.slice(0, start)]
  const match = ordered.find((option) => option.label.toLowerCase().startsWith(typed))
  if (!match) {
    return
  }
  const index = props.options.indexOf(match)
  if (open.value) {
    move(index)
  } else {
    emit('update:modelValue', match.value)
  }
}

function onTriggerKey(event: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    void show()
  } else if (event.key.length === 1 && /\S/.test(event.key)) {
    typeahead(event.key)
  }
}

function onListKey(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(active.value + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      move(active.value - 1)
      break
    case 'Home':
      event.preventDefault()
      move(0)
      break
    case 'End':
      event.preventDefault()
      move(props.options.length - 1)
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      choose(active.value)
      break
    case 'Escape':
      event.preventDefault()
      hide()
      break
    case 'Tab':
      hide(false)
      break
    default:
      if (event.key.length === 1 && /\S/.test(event.key)) {
        typeahead(event.key)
      }
  }
}

function onOutside(event: PointerEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) {
    hide(false)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onOutside)
  clearTimeout(typedTimer)
})
</script>
