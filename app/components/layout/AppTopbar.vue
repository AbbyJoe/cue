<template>
  <header class="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-line bg-canvas/75 px-5 backdrop-blur-xl lg:px-10">
    <div class="flex min-w-0 items-center gap-3">
      <button
        type="button"
        class="grid h-8 w-8 place-items-center rounded-full border border-line-strong bg-surface text-ink shadow-xs lg:hidden"
        aria-label="Open navigation"
        @click="emit('menu')"
      >
        <Icon name="HambergerMenu" :size="18" />
      </button>
      <div class="lg:hidden mt-3">
        <Wordmark to="/dashboard" :size="24" />
      </div>
      <nav class="hidden items-center gap-2 text-[13px] lg:flex" aria-label="Breadcrumb">
        <span class="text-ink-faint">Workspace</span>
        <Icon name="ArrowRight2" :size="12" class="text-ink-faint" />
        <span class="font-medium text-ink">{{ section }}</span>
      </nav>
    </div>

    <div class="flex items-center gap-2">
      <Button to="/dashboard/practise" size="sm">
        <Icon name="Microphone2" :size="15" />
        <span class="hidden sm:inline">New interview</span>
      </Button>

      <div ref="menuRoot" class="relative">
        <button
          type="button"
          class="group flex items-center gap-1.5 rounded-full p-0.5"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          aria-label="Account menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="grid h-8 w-8 place-items-center rounded-full border border-white bg-gradient-to-br from-aura-peach to-aura-sky text-xs font-semibold text-ink shadow-xs ring-1 ring-line transition-shadow duration-150 group-hover:ring-line-hover">{{ initials }}</span>
          <Icon name="ArrowDown2" :size="14" class="hidden text-ink-faint sm:block" />
        </button>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          leave-active-class="transition duration-100 ease-in"
          enter-from-class="opacity-0 -translate-y-1"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="menuOpen" class="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border border-line bg-surface p-1.5 shadow-menu" role="menu" @keydown.esc="menuOpen = false">
            <div class="mb-1 border-b border-line px-[0.6rem] pb-[0.65rem] pt-2">
              <p class="truncate text-[13px] font-medium text-ink">{{ displayName }}</p>
              <p class="truncate text-xs text-ink-faint">{{ subtitle }}</p>
            </div>
            <NuxtLink to="/dashboard/settings" class="flex h-9 w-full items-center gap-[0.6rem] rounded-lg px-[0.6rem] text-sm text-ink-soft hover:bg-panel hover:text-ink" role="menuitem" @click="menuOpen = false">
              <Icon name="Setting2" :size="16" />
              Settings
            </NuxtLink>
            <button type="button" class="flex h-9 w-full items-center gap-[0.6rem] rounded-lg px-[0.6rem] text-sm text-ink-soft hover:bg-danger-soft hover:text-danger" role="menuitem" :disabled="loggingOut" @click="logout">
              <Icon name="Logout" :size="16" />
              Log out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { labelFor } from '~/utils/interview'
import { emptyProfile, fullName, profileEvent, readProfile } from '~/utils/profile'

const emit = defineEmits<{ menu: [] }>()
const route = useRoute()
const { logout, loggingOut } = useAuth()

const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)
const profile = ref({ ...emptyProfile })

const names: Record<string, string> = {
  '/dashboard/practise': 'Practise',
  '/dashboard/learning': 'Learning',
  '/dashboard/history': 'History',
  '/dashboard/progress': 'Progress',
  '/dashboard/settings': 'Settings',
}

const section = computed(() => {
  const match = Object.keys(names).find((path) => route.path === path || route.path.startsWith(`${path}/`))
  return match ? names[match] : 'Overview'
})

const roleLabel = computed(() => profile.value.targetRole || labelFor('role', profile.value.specialisation))
const levelLabel = computed(() => labelFor('level', profile.value.level))
const name = computed(() => fullName(profile.value))
const displayName = computed(() => name.value || roleLabel.value)
const subtitle = computed(() => (name.value ? `${roleLabel.value} · ${levelLabel.value}` : levelLabel.value))
const initials = computed(() => displayName.value
  .split(/\s+/)
  .slice(0, 2)
  .map((word: string) => word[0]?.toUpperCase() ?? '')
  .join(''))

function onOutside(event: PointerEvent) {
  if (menuOpen.value && menuRoot.value && !menuRoot.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

function refreshProfile() {
  profile.value = readProfile()
}

onMounted(() => {
  profile.value = readProfile()
  window.addEventListener(profileEvent, refreshProfile)
  document.addEventListener('pointerdown', onOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener(profileEvent, refreshProfile)
  document.removeEventListener('pointerdown', onOutside)
})

watch(() => route.path, () => {
  menuOpen.value = false
  profile.value = readProfile()
})
</script>
