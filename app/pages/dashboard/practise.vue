<template>
  <section class="mx-auto max-w-6xl">
    <PageHeader
      title="Set up the room"
      :description="active ? `This session is saved in ${active.name}. Its goals and job description shape the questions.` : 'You can start right away. Open a workspace when you are preparing for one role.'"
    />

    <div class="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <form class="card grid content-start gap-x-5 gap-y-5 self-start p-6 sm:grid-cols-2" @submit.prevent="start">
        <Select id="role" v-model="setup.role" label="Role" :options="roles" />
        <Select id="level" v-model="setup.level" label="Experience level" :options="levels" />
        <Select id="category" v-model="setup.category" label="Interview category" :options="categories" />
        <Select id="difficulty" v-model="setup.difficulty" label="Difficulty" :options="difficulties" />
        <Select id="duration" v-model="setup.duration" label="Duration" :options="durations" />
        <Select id="style" v-model="setup.style" label="Interviewer style" :options="styles" />
        <div class="flex flex-wrap items-center gap-3 border-t border-line pt-5 mt-4 sm:col-span-2">
          <Button type="submit">
            <Icon name="Microphone2" :size="18" />
            Start interview
          </Button>
          <p class="text-[13px] text-ink-faint">Microphone required. Camera is optional.</p>
        </div>
      </form>

      <aside class="card bg-dots flex flex-col items-center px-6 py-8">
        <VoiceOrb state="idle" :size="180" />
        <p class="mt-4 text-sm font-medium text-ink">Session preview</p>
        <dl class="mt-5 w-full divide-y divide-line rounded-xl border border-line bg-surface">
          <div v-for="row in summary" :key="row.label" class="flex items-center justify-between gap-4 px-4 py-2.5">
            <dt class="text-[13px] text-ink-faint">{{ row.label }}</dt>
            <dd class="truncate text-right text-[13px] font-medium text-ink">{{ row.value }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  categories,
  defaultSetup,
  difficulties,
  durations,
  labelFor,
  levels,
  roles,
  setupQuery,
  styles,
} from '~/utils/interview'

definePageMeta({ layout: 'app' })
useHead({ title: 'Practise' })

const setup = reactive({ ...defaultSetup })

const summary = computed(() => [
  { label: 'Role', value: labelFor('role', setup.role) },
  { label: 'Level', value: labelFor('level', setup.level) },
  { label: 'Category', value: labelFor('category', setup.category) },
  { label: 'Difficulty', value: labelFor('difficulty', setup.difficulty) },
  { label: 'Duration', value: labelFor('duration', setup.duration) },
  { label: 'Interviewer', value: labelFor('style', setup.style) },
])

const { load: loadProfile } = useProfile()
const { active, load: loadWorkspaces } = useWorkspaces()

function applySetup(role: string, level: string) {
  if (roles.some((option) => option.value === role)) {
    setup.role = role
  }
  if (levels.some((option) => option.value === level)) {
    setup.level = level
  }
}

onMounted(async () => {
  const profile = await loadProfile()
  await loadWorkspaces().catch(() => {})
  applySetup(active.value?.role || profile.specialisation, active.value?.level || profile.level)
})

watch(active, (workspace) => {
  if (workspace) {
    applySetup(workspace.role, workspace.level)
  }
})

function start() {
  navigateTo({ path: '/interview', query: setupQuery(setup) })
}
</script>
