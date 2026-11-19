<template>
  <section class="mx-auto max-w-5xl">
    <PageHeader
      title="Settings"
      description="Your details and the context used to shape practice sessions."
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
            v-model="form.firstName"
            label="First name"
            placeholder="Ada"
            autocomplete="given-name"
            :error="errors.firstName"
          />
          <Field
            id="last-name"
            v-model="form.lastName"
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
            <Select id="specialisation" v-model="form.specialisation" label="Specialisation" :options="roles" />
            <Select id="level" v-model="form.level" label="Experience level" :options="levels" />
            <div class="sm:col-span-2">
              <Field
                id="target-role"
                v-model="form.targetRole"
                label="Target role"
                placeholder="Marketing manager"
                autocomplete="organization-title"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="goals" class="mb-1.5 block text-[13px] font-medium text-ink">Preparation goals</label>
              <textarea
                id="goals"
                v-model="form.goals"
                rows="4"
                placeholder="Explain a trade-off more clearly."
                class="field"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="job-description" class="mb-1.5 block text-[13px] font-medium text-ink">Job description</label>
              <textarea
                id="job-description"
                v-model="form.jobDescription"
                rows="5"
                maxlength="4000"
                placeholder="Paste the role you are preparing for. The interviewer will use it to choose questions."
                class="field"
              />
            </div>
          </div>
          <div class="mt-5 flex flex-wrap items-center gap-4">
            <Button type="submit" :loading="saving">{{ saving ? 'Saving…' : 'Save changes' }}</Button>
          </div>
        </div>
      </div>

      <!-- CV -->
      <div :class="row">
        <div>
          <h2 class="text-base font-semibold">CV</h2>
          <p class="mt-1 text-sm text-ink-soft">Optional, and only visible to you. Practice works without one.</p>
        </div>
        <div class="card p-6">
          <FileUpload
            id="cv"
            label="Your CV"
            :file="profile?.cv ?? null"
            :busy="cvBusy"
            @select="onCvSelect"
            @remove="onCvRemove"
          />
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
import { nameError } from '~/utils/validation'

definePageMeta({ layout: 'app' })
useHead({ title: 'Settings' })

const row = 'grid gap-5 py-8 first:pt-0 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10'

const { profile, load, save: saveProfile, uploadCv, removeCv } = useProfile()
const toast = useToast()

// Editable copy of the profile. Filled once it has loaded.
const form = reactive({ firstName: '', lastName: '', specialisation: 'frontend', level: 'senior', targetRole: '', goals: '', jobDescription: '' })
const errors = reactive({ firstName: '', lastName: '' })
const saving = ref(false)
const cvBusy = ref(false)

const cvNotes = [
  { icon: 'Lock', text: 'Only you can see your CV. It is stored privately and never shared with employers.' },
  { icon: 'Refresh2', text: 'Uploading a new file replaces the current one.' },
  { icon: 'Trash', text: 'Remove it at any time. Practice works without one.' },
]

onMounted(async () => {
  const p = await load()
  Object.assign(form, {
    firstName: p.firstName,
    lastName: p.lastName,
    specialisation: p.specialisation,
    level: p.level,
    targetRole: p.targetRole,
    goals: p.goals,
    jobDescription: p.jobDescription,
  })
})

async function save() {
  errors.firstName = nameError(form.firstName, 'first')
  errors.lastName = nameError(form.lastName, 'last')
  if (errors.firstName || errors.lastName) {
    toast.error('Check the highlighted fields')
    return
  }

  saving.value = true
  try {
    await saveProfile({ ...form })
    toast.success('Changes saved')
  } catch {
    toast.error('Couldn’t save your changes', { description: 'Please try again.' })
  } finally {
    saving.value = false
  }
}

async function onCvSelect(file: File) {
  const replacing = Boolean(profile.value?.cv)
  cvBusy.value = true
  try {
    const saved = await uploadCv(file)
    toast.success(replacing ? 'CV replaced' : 'CV uploaded', {
      description: saved.cvText ? file.name : 'Saved, but the words could not be read. Use a PDF or DOCX.',
    })
  } catch (error) {
    const message = (error as { statusMessage?: string }).statusMessage
    toast.error('Couldn’t upload your CV', { description: message || 'Please try again.' })
  } finally {
    cvBusy.value = false
  }
}

async function onCvRemove() {
  cvBusy.value = true
  try {
    await removeCv()
    toast.success('CV removed')
  } catch {
    toast.error('Couldn’t remove your CV', { description: 'Please try again.' })
  } finally {
    cvBusy.value = false
  }
}
</script>
