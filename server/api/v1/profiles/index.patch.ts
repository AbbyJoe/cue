import { nameError } from '#shared/utils/names'
import type { ProfileUpdate } from '#shared/types/profile'

/** PATCH /api/v1/profiles: update name and preparation details. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody<Partial<ProfileUpdate>>(event)
  const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

  const firstName = text(body.firstName, 50)
  const lastName = text(body.lastName, 50)
  const errors = { firstName: nameError(firstName, 'first'), lastName: nameError(lastName, 'last') }
  if (errors.firstName || errors.lastName) {
    throw createError({ statusCode: 422, statusMessage: 'Check the highlighted fields.', data: errors })
  }

  const supabase = serverSupabase(event)
  const changes = {
    first_name: firstName,
    last_name: lastName,
    specialisation: text(body.specialisation, 50) || 'frontend',
    level: text(body.level, 50) || 'senior',
    target_role: text(body.targetRole, 100),
    goals: text(body.goals, 1000),
    job_description: text(body.jobDescription, 4000),
  }
  let { error } = await supabase.from('profiles').update(changes).eq('id', user.id)
  if (error?.message.includes('job_description')) {
    const { job_description: _jobDescription, ...withoutJob } = changes
    error = (await supabase.from('profiles').update(withoutJob).eq('id', user.id)).error
  }

  if (error) {
    console.error('[profiles] update failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not save your profile.' })
  }

  return getProfile(supabase, user.id)
})
