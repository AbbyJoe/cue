import type { Profile, ProfileUpdate } from '#shared/types/profile'

// Only used in the browser (load runs from onMounted), so a module variable is safe.
let request: Promise<Profile> | null = null

/**
 * The signed-in person's profile from the database.
 * Shared across the app, loaded once and refreshed after each change.
 */
export function useProfile() {
  const profile = useState<Profile | null>('profile', () => null)

  const fullName = computed(() => {
    const p = profile.value
    return p ? `${p.firstName} ${p.lastName}`.trim() : ''
  })

  async function load() {
    if (profile.value) {
      return profile.value
    }
    // Several components load at once; share one request between them.
    request ??= $fetch<Profile>('/api/v1/profiles').finally(() => {
      request = null
    })
    profile.value = await request
    return profile.value
  }

  async function save(update: ProfileUpdate) {
    profile.value = await $fetch<Profile>('/api/v1/profiles', { method: 'PATCH', body: update })
  }

  async function uploadCv(file: File) {
    const body = new FormData()
    body.append('file', file)
    profile.value = await $fetch<Profile>('/api/v1/profiles/cv', { method: 'POST', body })
    return profile.value
  }

  async function removeCv() {
    profile.value = await $fetch<Profile>('/api/v1/profiles/cv', { method: 'DELETE' })
  }

  function clear() {
    profile.value = null
  }

  return { profile, fullName, load, save, uploadCv, removeCv, clear }
}
