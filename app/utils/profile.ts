/** Details of an uploaded CV. The file itself is not stored until the documents API exists. */
export interface CvFile {
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface CandidateProfile {
  firstName: string
  lastName: string
  specialisation: string
  level: string
  targetRole: string
  goals: string
  cv: CvFile | null
}

export const emptyProfile: CandidateProfile = {
  firstName: '',
  lastName: '',
  specialisation: 'frontend',
  level: 'senior',
  targetRole: '',
  goals: '',
  cv: null,
}

const storageKey = 'cue-profile'

function readCv(value: unknown): CvFile | null {
  if (!value || typeof value !== 'object') {
    return null
  }
  const cv = value as Partial<CvFile>
  if (typeof cv.name !== 'string' || typeof cv.size !== 'number') {
    return null
  }
  return {
    name: cv.name,
    size: cv.size,
    type: typeof cv.type === 'string' ? cv.type : '',
    uploadedAt: typeof cv.uploadedAt === 'string' ? cv.uploadedAt : new Date().toISOString(),
  }
}

export function readProfile(): CandidateProfile {
  if (typeof localStorage === 'undefined') {
    return { ...emptyProfile }
  }

  const saved = localStorage.getItem(storageKey)
  if (!saved) {
    return { ...emptyProfile }
  }

  try {
    const parsed = JSON.parse(saved) as Partial<CandidateProfile>
    return {
      firstName: parsed.firstName || '',
      lastName: parsed.lastName || '',
      specialisation: parsed.specialisation || emptyProfile.specialisation,
      level: parsed.level || emptyProfile.level,
      targetRole: parsed.targetRole || '',
      goals: parsed.goals || '',
      cv: readCv(parsed.cv),
    }
  } catch {
    return { ...emptyProfile }
  }
}

/** Fired on window after the profile is saved, so the shell can refresh names. */
export const profileEvent = 'cue-profile-saved'

export function saveProfile(profile: CandidateProfile) {
  localStorage.setItem(storageKey, JSON.stringify(profile))
  window.dispatchEvent(new Event(profileEvent))
}

/** Merge a partial update into the saved profile. */
export function updateProfile(patch: Partial<CandidateProfile>) {
  saveProfile({ ...readProfile(), ...patch })
}

export function fullName(profile: Pick<CandidateProfile, 'firstName' | 'lastName'>) {
  return [profile.firstName, profile.lastName].map((part) => part.trim()).filter(Boolean).join(' ')
}
