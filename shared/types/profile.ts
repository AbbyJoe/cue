export interface ProfileCv {
  name: string
  size: number
  uploadedAt: string
  /** Signed link to the file. Expires after an hour. */
  url: string
}

/** The signed-in person's profile, as the API returns it. */
export interface Profile {
  firstName: string
  lastName: string
  specialisation: string
  level: string
  targetRole: string
  goals: string
  jobDescription: string
  /** Words read from the CV. Empty when the file could not be read. */
  cvText: string
  cv: ProfileCv | null
}

/** Fields that can be changed with PATCH /api/v1/profiles. */
export type ProfileUpdate = Omit<Profile, 'cv' | 'cvText'>
