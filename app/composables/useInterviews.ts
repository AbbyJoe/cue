import type { InterviewRecord } from '#shared/types/interview'

/** Completed interviews for the open workspace, newest first. */
export function useInterviews() {
  const { activeId, load: loadWorkspaces } = useWorkspaces()
  const interviews = ref<InterviewRecord[]>([])
  const pending = ref(true)
  const error = ref('')
  let following = false

  async function load(quiet = false) {
    if (!quiet) {
      pending.value = true
    }
    error.value = ''
    try {
      await loadWorkspaces().catch(() => {})
      interviews.value = await $fetch<InterviewRecord[]>('/api/v1/interviews', {
        query: { workspace: activeId.value ?? 'general' },
      })
    } catch {
      error.value = 'Could not load past interviews.'
    } finally {
      pending.value = false
      following = true
    }
  }

  watch(activeId, () => {
    if (following) {
      load(true)
    }
  })

  return { interviews, pending, error, load }
}
