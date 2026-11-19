/** DELETE /api/v1/profiles/cv: remove the CV file and clear it from the profile. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const supabase = serverSupabase(event)

  const { data: current } = await supabase.from('profiles').select('cv_path').eq('id', user.id).single()
  if (current?.cv_path) {
    await supabase.storage.from(CV_BUCKET).remove([current.cv_path])
  }

  const changes = { cv_path: null, cv_name: null, cv_size: null, cv_uploaded_at: null, cv_text: '' }
  let { error } = await supabase.from('profiles').update(changes).eq('id', user.id)
  if (error?.message.includes('cv_text')) {
    const { cv_text: _cvText, ...withoutText } = changes
    error = (await supabase.from('profiles').update(withoutText).eq('id', user.id)).error
  }
  if (error) {
    console.error('[cv] remove failed:', error.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not remove your CV.' })
  }

  return getProfile(supabase, user.id)
})
