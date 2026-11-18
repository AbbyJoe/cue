<template>
  <div>
    <div class="mb-1.5 flex items-center justify-between gap-3">
      <p :id="`${id}-label`" class="text-[13px] font-medium leading-5 text-ink">{{ label }}</p>
      <slot name="hint" />
    </div>

    <input
      :id="id"
      ref="input"
      type="file"
      class="sr-only"
      :accept="accept.join(',')"
      :aria-labelledby="`${id}-label`"
      :aria-describedby="`${id}-help`"
      tabindex="-1"
      @change="onPick"
    >

    <!-- Empty: drop zone -->
    <button
      v-if="!modelValue"
      type="button"
      class="group relative isolate flex w-full flex-col items-center overflow-hidden rounded-2xl border border-dashed px-6 py-9 text-center transition-colors duration-150"
      :class="dragging
        ? 'border-accent bg-accent-soft/60'
        : error
          ? 'border-danger/60 bg-surface hover:bg-surface-hover'
          : 'border-line-hover bg-surface hover:border-ink-faint hover:bg-surface-hover'"
      :aria-labelledby="`${id}-label`"
      :aria-describedby="`${id}-help`"
      v-on="dropHandlers"
      @click="browse"
    >
      <div
        class="aurora -z-10 bg-aurora-soft opacity-0 transition-opacity duration-300"
        :class="dragging ? 'opacity-100' : 'group-hover:opacity-60'"
        aria-hidden="true"
      />
      <span
        class="grid h-12 w-12 place-items-center rounded-2xl bg-aura-sky text-ink transition-transform duration-200"
        :class="dragging ? '-translate-y-1 scale-105' : 'group-hover:-translate-y-0.5'"
      >
        <Icon name="DocumentUpload" :size="22" />
      </span>
      <span class="mt-4 text-sm font-medium text-ink">
        <template v-if="dragging">Drop it here</template>
        <template v-else>Drag your file here, or <span class="text-accent underline decoration-accent/30 underline-offset-4 group-hover:decoration-accent">browse</span></template>
      </span>
      <span :id="`${id}-help`" class="mt-1 text-[13px] text-ink-faint">{{ help }}</span>
    </button>

    <!-- Filled: file row (drop a new file on it to replace) -->
    <div
      v-else
      class="flex items-center gap-3.5 rounded-2xl border bg-surface p-3.5 transition-colors duration-150"
      :class="dragging ? 'border-accent bg-accent-soft/60' : 'border-line'"
      v-on="dropHandlers"
    >
      <span :class="['relative grid h-12 w-10 flex-none place-items-center rounded-lg text-[11px] font-semibold text-ink', fileTint]">
        <Icon name="DocumentText" :size="18" class="opacity-70" />
        <span class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-md bg-surface px-1 text-[10px] font-semibold leading-4 text-ink shadow-xs ring-1 ring-line">{{ extension }}</span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-ink" :title="modelValue.name">{{ modelValue.name }}</p>
        <p :id="`${id}-help`" class="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-faint">
          <Icon name="TickCircle" :size="14" class="text-accent" />
          {{ formatSize(modelValue.size) }} · Added {{ formatDate(modelValue.uploadedAt) }}
        </p>
      </div>
      <Button variant="secondary" size="sm" @click="browse">
        <Icon name="Refresh2" :size="14" />
        <span class="hidden sm:inline">Replace</span>
      </Button>
      <button
        type="button"
        class="grid h-8 w-8 flex-none place-items-center rounded-full text-ink-faint transition-colors duration-150 hover:bg-danger-soft hover:text-danger"
        :aria-label="`Remove ${modelValue.name}`"
        @click="remove"
      >
        <Icon name="Trash" :size="16" />
      </button>
    </div>

    <p v-if="error" class="mt-1.5 flex items-center gap-1.5 text-[13px] leading-5 text-danger" role="alert">
      <Icon name="Warning2" :size="14" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CvFile } from '~/utils/profile'

const props = withDefaults(defineProps<{
  id: string
  label: string
  modelValue: CvFile | null
  /** File extensions, with the dot. */
  accept?: string[]
  /** Maximum size in megabytes. */
  maxSizeMb?: number
}>(), {
  accept: () => ['.pdf', '.doc', '.docx'],
  maxSizeMb: 5,
})

const emit = defineEmits<{
  'update:modelValue': [value: CvFile | null]
  /** The raw file, for when there is somewhere to send it. */
  file: [file: File | null]
}>()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const error = ref('')
let depth = 0 // dragenter/leave fire for children too; count to avoid flicker

const help = computed(() => {
  const kinds = props.accept.includes('.pdf') && props.accept.some((ext) => ext.startsWith('.doc'))
    ? 'PDF or Word document'
    : props.accept.map((ext) => ext.slice(1).toUpperCase()).join(', ')
  return `${kinds}, up to ${props.maxSizeMb} MB`
})

const extension = computed(() => {
  const name = props.modelValue?.name ?? ''
  const dot = name.lastIndexOf('.')
  return dot > -1 ? name.slice(dot + 1).toUpperCase().slice(0, 4) : 'FILE'
})

const fileTint = computed(() => (extension.value === 'PDF' ? 'bg-aura-peach' : 'bg-aura-sky'))

const dropHandlers = {
  dragenter: (event: DragEvent) => {
    event.preventDefault()
    depth += 1
    dragging.value = true
  },
  dragover: (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  },
  dragleave: () => {
    depth = Math.max(0, depth - 1)
    if (depth === 0) {
      dragging.value = false
    }
  },
  drop: (event: DragEvent) => {
    event.preventDefault()
    depth = 0
    dragging.value = false
    const files = event.dataTransfer?.files
    if (files && files.length > 1) {
      error.value = 'Drop one file at a time.'
      return
    }
    take(files?.[0])
  },
}

function browse() {
  input.value?.click()
}

function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  take(target.files?.[0])
  target.value = '' // allow picking the same file again after removing it
}

function validate(file: File) {
  const name = file.name.toLowerCase()
  if (!props.accept.some((ext) => name.endsWith(ext))) {
    return `That file type isn’t supported. Use a ${help.value.split(',')[0]}.`
  }
  if (file.size === 0) {
    return 'That file is empty.'
  }
  if (file.size > props.maxSizeMb * 1024 * 1024) {
    return `That file is ${formatSize(file.size)}. The limit is ${props.maxSizeMb} MB.`
  }
  return ''
}

function take(file: File | undefined) {
  if (!file) {
    return
  }
  error.value = validate(file)
  if (error.value) {
    return
  }
  emit('update:modelValue', {
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  })
  emit('file', file)
}

function remove() {
  error.value = ''
  emit('update:modelValue', null)
  emit('file', null)
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? 'recently'
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
