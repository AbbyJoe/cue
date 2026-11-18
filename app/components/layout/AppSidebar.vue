<template>
  <div>
    <div v-if="open" class="fixed inset-0 z-30 bg-ink/20 backdrop-blur-sm lg:hidden" @click="close" />
    <aside
      class="fixed inset-y-0 left-0 z-40 flex h-screen w-[16.5rem] flex-col border-r border-line bg-sunken/80 px-[0.85rem] backdrop-blur-xl pb-[0.85rem] pt-[1.15rem] transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-[1.6rem] items-center justify-between px-[0.6rem]">
        <Wordmark to="/dashboard" />
        <button type="button" class="text-ink-faint hover:text-ink lg:hidden" aria-label="Close navigation" @click="close">
          <Icon name="CloseCircle" :size="18" />
        </button>
      </div>

      <nav class="mt-9 flex flex-1 flex-col gap-6" aria-label="Workspace">
        <div v-for="group in groups" :key="group.label" class="flex flex-col gap-0.5">
          <p class="mb-1 px-3 text-[13px] text-ink-faint">{{ group.label }}</p>
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="group relative flex h-[2.375rem] items-center gap-[0.7rem] rounded-xl px-3 text-sm transition-colors duration-150"
            :class="isActive(item.to) ? 'bg-surface font-medium text-ink shadow-xs ring-1 ring-line' : 'text-ink-soft hover:bg-surface/70 hover:text-ink'"
            @click="close"
          >
            <!-- <span
              v-if="isActive(item.to)"
              class="absolute -left-[0.85rem] inset-y-[0.55rem] w-[3px] rounded-r-[3px] bg-accent"
              aria-hidden="true"
            /> -->
            <Icon :name="item.icon" :size="18" :class="isActive(item.to) ? 'text-accent' : ''" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>

      <NuxtLink to="/dashboard/settings" class="flex items-center gap-[0.7rem] rounded-2xl border border-line bg-surface px-[0.7rem] py-[0.6rem] shadow-xs transition-colors duration-150 hover:border-line-strong" @click="close">
        <span class="grid h-8 w-8 flex-none place-items-center rounded-full bg-gradient-to-br from-aura-peach to-aura-sky text-xs font-semibold text-ink">{{ initials }}</span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px] font-medium text-ink">{{ displayName }}</span>
          <span class="block truncate text-xs text-ink-faint">{{ subtitle }}</span>
        </span>
        <Icon name="Setting2" :size="16" class="text-ink-faint" />
      </NuxtLink>
      <button type="button" class="mt-1.5 w-full flex h-[2.375rem] items-center gap-[0.7rem] rounded-xl px-3 text-sm transition-colors duration-150 text-ink-soft hover:bg-danger-soft hover:text-danger" :disabled="loggingOut" @click="logout">
        <Icon name="Logout" :size="18" />
        Log out
      </button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { labelFor } from '~/utils/interview'
import { emptyProfile, fullName, profileEvent, readProfile } from '~/utils/profile'

const open = defineModel<boolean>('open', { default: false })
const route = useRoute()
const { logout, loggingOut } = useAuth()
const profile = ref({ ...emptyProfile })

const groups = [
  {
    label: 'Prepare',
    items: [
      { label: 'Overview', to: '/dashboard', icon: 'Home2' },
      { label: 'Practise', to: '/dashboard/practise', icon: 'Microphone2' },
      { label: 'Learning', to: '/dashboard/learning', icon: 'Book1' },
    ],
  },
  {
    label: 'Review',
    items: [
      { label: 'History', to: '/dashboard/history', icon: 'Clock' },
      { label: 'Progress', to: '/dashboard/progress', icon: 'Chart2' },
    ],
  },
]

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

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function close() {
  open.value = false
}

function refreshProfile() {
  profile.value = readProfile()
}

onMounted(() => {
  profile.value = readProfile()
  window.addEventListener(profileEvent, refreshProfile)
})

onBeforeUnmount(() => {
  window.removeEventListener(profileEvent, refreshProfile)
})

watch(() => route.path, () => {
  close()
  profile.value = readProfile()
})
</script>
