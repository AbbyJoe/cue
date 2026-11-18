<template>
  <section class="mx-auto max-w-5xl">
    <PageHeader
      title="Settings"
      description="Your details and the context used to shape practice sessions. Everything stays on this device for now."
    />

    <form class="mt-10 divide-y divide-line" novalidate @submit.prevent="save">
      <!-- Personal details -->
      <div :class="row">
        <div>
          <h2 class="text-base font-semibold">Personal details</h2>
          <p class="mt-1 text-sm text-ink-soft">How the interviewer and your reports address you.</p>
        </div>
        <div class="card grid gap-5 p-6 sm:grid-cols-2">
          <Field
            id="first-name"
            v-model="profile.firstName"
            label="First name"
            placeholder="Ada"
            autocomplete="given-name"
            :error="errors.firstName"
          />
          <Field
            id="last-name"
            v-model="profile.lastName"
            label="Last name"
            placeholder="Okafor"
            autocomplete="family-name"
            :error="errors.lastName"
          />
        </div>
      </div>

      <!-- Preparation profile -->
      <div :class="row">
        <div>
          <h2 class="text-base font-semibold">Preparation profile</h2>
          <p class="mt-1 text-sm text-ink-soft">Used to suggest the role, depth and focus of each session.</p>
        </div>
        <div>
          <div class="card grid gap-5 p-6 sm:grid-cols-2">
            <Select id="specialisation" v-model="profile.specialisation" label="Specialisation" :options="roles" />
            <Select id="level" v-model="profile.level" label="Experience level" :options="levels" />
            <div class="sm:col-span-2">
              <Field
                id="target-role"
                v-model="profile.targetRole"
                label="Target role"
                placeholder="Senior Frontend Engineer"
                autocomplete="organization-title"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="goals" class="mb-1.5 block text-[13px] font-medium text-ink">Preparation goals</label>
              <textarea
                id="goals"
                v-model="profile.goals"
                rows="4"
                placeholder="Explain technical trade-offs more clearly."
                class="field"
              />
            </div>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-4">
            <Button type="submit">Save changes</Button>
            <p v-if="status === 'saved'" class="flex items-center gap-1.5 text-sm text-ink-soft" role="status">
              <Icon name="TickCircle" :size="16" class="text-accent" />
              Saved on this device
            </p>
            <p v-else-if="status === 'invalid'" class="text-sm text-danger" role="status">Check the highlighted fields.</p>
          </div>
        </div>
      </div>

      <!-- CV -->
      <div :class="row">
        <div>
          <h2 class="text-base font-semibold">CV</h2>
          <p class="mt-1 text-sm text-ink-soft">Optional. Lets the interviewer ask about your real projects and experience.</p>
        </div>
        <div class="card p-6">
          <FileUpload id="cv" v-model="profile.cv" label="Your CV" @update:model-value="saveCv" />
          <ul class="mt-5 grid gap-2.5 text-[13px] text-ink-soft">
            <li v-for="note in cvNotes" :key="note.text" class="flex gap-2.5">
              <Icon :name="note.icon" :size="16" class="mt-px flex-none text-ink-faint" />
              {{ note.text }}
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { levels, roles } from '~/utils/interview'
import type { CvFile } from '~/utils/profile'
import { emptyProfile, readProfile, saveProfile, updateProfile } from '~/utils/profile'
import { nameError } from '~/utils/validation'

definePageMeta({ layout: 'app' })
useHead({ title: 'Settings' })

const row = 'grid gap-5 py-8 first:pt-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10'

const profile = reactive({ ...emptyProfile })
const errors = reactive({ firstName: '', lastName: '' })
const status = ref<'idle' | 'saved' | 'invalid'>('idle')

const cvNotes = [
  { icon: 'Lock', text: 'Only you can see your CV. It is never shared with employers.' },
  { icon: 'MagicStar', text: 'Analysis starts once accounts are connected. For now only the file details are kept.' },
  { icon: 'Trash', text: 'Remove it at any time. Practice works without one.' },
]

onMounted(() => {
  Object.assign(profile, readProfile())
})

// Any edit clears the last save message.
watch(
  () => [profile.firstName, profile.lastName, profile.specialisation, profile.level, profile.targetRole, profile.goals],
  () => {
    if (status.value === 'saved') {
      status.value = 'idle'
    }
  },
)

function save() {
  errors.firstName = nameError(profile.firstName, 'first')
  errors.lastName = nameError(profile.lastName, 'last')
  if (errors.firstName || errors.lastName) {
    status.value = 'invalid'
    return
  }
  // The CV is saved on its own as soon as it changes.
  saveProfile({
    ...profile,
    firstName: profile.firstName.trim(),
    lastName: profile.lastName.trim(),
    cv: readProfile().cv,
  })
  status.value = 'saved'
}

function saveCv(cv: CvFile | null) {
  // TODO: upload the file to /api/v1/documents once the server exists.
  updateProfile({ cv })
}
</script>
