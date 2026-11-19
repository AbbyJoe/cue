<template>
  <div class="min-w-0">
    <p :id="`${id}-label`" class="mb-1.5 text-[13px] font-medium leading-5 text-ink">{{ label }}</p>

    <input
      :id="id"
      ref="input"
      type="file"
      class="sr-only"
      :accept="accept.join(',')"
      :aria-labelledby="`${id}-label`"
      tabindex="-1"
      @change="onPick"
    >

    <!-- No file yet: drop zone -->
    <button
      v-if="!file"
      type="button"
      class="group relative isolate flex w-full flex-col items-center overflow-hidden rounded-2xl border border-dashed px-6 py-9 text-center transition-colors duration-150 disabled:cursor-wait"
      :class="dragging ? 'border-accent bg-accent-soft/60' : 'border-line-hover bg-surface hover:border-ink-faint hover:bg-surface-hover'"
      :disabled="busy"
      :aria-labelledby="`${id}-label`"
      @click="browse"
      @dragenter.prevent="dragging = true"
      @dragover.prevent
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div
        class="aurora -z-10 bg-aurora-soft transition-opacity duration-300"
        :class="dragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'"
        aria-hidden="true"
      />
      <span
        class="grid h-12 w-12 place-items-center rounded-2xl bg-aura-sky text-ink transition-transform duration-200"
        :class="dragging ? '-translate-y-1 scale-105' : 'group-hover:-translate-y-0.5'"
      >
        <CueLogo v-if="busy" :size="24" animated aria-hidden="true" />
        <Icon v-else name="DocumentUpload" :size="22" />
      </span>
      <span class="mt-4 text-sm font-medium text-ink">
        <template v-if="busy">Uploading…</template>
        <template v-else-if="dragging">Drop it here</template>
        <template v-else>Drag your file here, or <span class="text-accent underline decoration-accent/30 underline-offset-4 group-hover:decoration-accent">browse</span></template>
      </span>
      <span class="mt-1 text-[13px] text-ink-faint">PDF or Word document, up to {{ maxSizeMb }} MB</span>
    </button>

    <!-- File uploaded: file row -->
    <div v-else class="cv-file flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
      <span :class="['relative grid h-12 w-10 flex-none place-items-center rounded-lg text-ink', extension === 'PDF' ? 'bg-aura-peach' : 'bg-aura-sky']">
        <Icon name="DocumentText" :size="18" class="opacity-70" />
        <span class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-md bg-surface px-1 text-[10px] font-semibold leading-4 shadow-xs ring-1 ring-line">{{ extension }}</span>
      </span>
      <div class="min-w-0 flex-1">
        <a v-if="file.url" :href="file.url" target="_blank" rel="noopener" class="block truncate text-sm font-medium text-ink hover:text-accent" :title="file.name">{{ file.name }}</a>
        <p v-else class="truncate text-sm font-medium text-ink" :title="file.name">{{ file.name }}</p>
        <p v-if="file.size || file.uploadedAt" class="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] text-ink-faint">
          <Icon name="TickCircle" :size="14" class="flex-none text-accent" />
          <span class="truncate">{{ formatSize(file.size) }}<template v-if="file.uploadedAt"> · Added {{ formatDate(file.uploadedAt) }}</template></span>
        </p>
      </div>
      <div class="flex flex-none items-center gap-1.5">
        <a v-if="file.url" :href="file.url" target="_blank" rel="noopener" class="cv-extra text-[13px] font-medium text-ink-soft hover:text-ink">View</a>
        <Button variant="secondary" size="sm" :loading="busy" aria-label="Replace file" @click="browse">
          <Icon v-if="!busy" name="Refresh2" :size="14" />
          <span v-if="!busy" class="cv-extra">Replace</span>
        </Button>
        <button
          type="button"
          class="grid h-8 w-8 flex-none place-items-center rounded-full text-ink-faint transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
          :disabled="busy"
          :aria-label="`Remove ${file.name}`"
          @click="emit('remove')"
        >
          <Icon name="Trash" :size="16" />
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { ProfileCv } from '#shared/types/profile'

const props = withDefaults(defineProps<{
  id: string
  label: string
  file: ProfileCv | null
  busy?: boolean
  maxSizeMb?: number
}>(), {
  busy: false,
  maxSizeMb: 5,
})

const emit = defineEmits<{
  select: [file: File]
  remove: []
}>()

const accept = ['.pdf', '.doc', '.docx']
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const toast = useToast()

const extension = computed(() => props.file?.name.split('.').pop()?.toUpperCase().slice(0, 4) ?? 'FILE')

function browse() {
  input.value?.click()
}

function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  check(target.files?.[0])
  target.value = '' // allow choosing the same file again
}

function onDrop(event: DragEvent) {
  dragging.value = false
  check(event.dataTransfer?.files[0])
}

// dragleave also fires when moving over child elements; only reset when leaving the zone.
function onDragLeave(event: DragEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
    dragging.value = false
  }
}

function check(file: File | undefined) {
  if (!file) {
    return
  }
  if (!accept.some((ext) => file.name.toLowerCase().endsWith(ext))) {
    toast.error('That file type isn’t supported', { description: 'Use a PDF or Word document.' })
  } else if (file.size > props.maxSizeMb * 1024 * 1024) {
    toast.error('That file is too big', { description: `It’s ${formatSize(file.size)}. The limit is ${props.maxSizeMb} MB.` })
  } else {
    emit('select', file)
  }
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.cv-file {
  container-type: inline-size;
}

/* The row sits in a narrow form. Hide the extra labels so the filename can truncate. */
@container (max-width: 26rem) {
  .cv-extra {
    display: none;
  }
}
</style>
