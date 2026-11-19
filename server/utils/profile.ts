import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '#shared/types/profile'
import { readCvText } from './cvText'

export const CV_BUCKET = 'cvs'

const cvReadAttempted = new Set<string>()

/**
 * Read the profile row for a user and shape it for the browser.
 * The CV comes back with a signed link that works for one hour.
 */
export async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile> {
  const columns = 'first_name, last_name, specialisation, level, target_role, goals, job_description, cv_path, cv_name, cv_size, cv_uploaded_at, cv_text'
  let canStoreText = true
  let { data: row, error } = await supabase.from('profiles').select(columns).eq('id', userId).single()
  if (error?.message.includes('cv_text')) {
    canStoreText = false
    const fallback = await supabase
      .from('profiles')
      .select('first_name, last_name, specialisation, level, target_role, goals, job_description, cv_path, cv_name, cv_size, cv_uploaded_at')
      .eq('id', userId)
      .single()
    row = fallback.data ? { ...fallback.data, cv_text: '' } : null
    error = fallback.error
  }

  // The job description column arrives in a later migration. Keep profiles readable until it is applied.
  if (error?.message.includes('job_description')) {
    canStoreText = false
    const fallback = await supabase
      .from('profiles')
      .select('first_name, last_name, specialisation, level, target_role, goals, cv_path, cv_name, cv_size, cv_uploaded_at')
      .eq('id', userId)
      .single()
    row = fallback.data ? { ...fallback.data, job_description: '', cv_text: '' } : null
    error = fallback.error
  }

  if (error || !row) {
    console.error('[profiles] read failed:', error?.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not load your profile.' })
  }

  let cvText = row.cv_text ?? ''
  if (canStoreText && !cvText && row.cv_path && !cvReadAttempted.has(userId)) {
    cvReadAttempted.add(userId)
    cvText = await rememberCvText(supabase, userId, row.cv_path)
  }

  let cv: Profile['cv'] = null
  if (row.cv_path) {
    const { data } = await supabase.storage.from(CV_BUCKET).createSignedUrl(row.cv_path, 60 * 60)
    cv = {
      name: row.cv_name ?? 'CV',
      size: row.cv_size ?? 0,
      uploadedAt: row.cv_uploaded_at ?? '',
      url: data?.signedUrl ?? '',
    }
  }

  return {
    firstName: row.first_name,
    lastName: row.last_name,
    specialisation: row.specialisation,
    level: row.level,
    targetRole: row.target_role,
    goals: row.goals,
    jobDescription: row.job_description ?? '',
    cvText,
    cv,
  }
}

/** Read a CV that was uploaded before its text was stored, and keep the words for next time. */
async function rememberCvText(supabase: SupabaseClient, userId: string, path: string) {
  const downloaded = await supabase.storage.from(CV_BUCKET).download(path)
  if (downloaded.error || !downloaded.data) {
    return ''
  }
  const text = await readCvText(path, Buffer.from(await downloaded.data.arrayBuffer()))
  if (text) {
    await supabase.from('profiles').update({ cv_text: text }).eq('id', userId)
  }
  return text
}
