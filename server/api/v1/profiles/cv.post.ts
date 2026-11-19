import { readCvText } from '../../../utils/cvText'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['pdf', 'doc', 'docx']

/**
 * POST /api/v1/profiles/cv: upload a CV (multipart field "file").
 * Stores it at cvs/<user id>/cv.<ext>, replacing any previous CV,
 * and returns the updated profile with a signed link to the file.
 */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const form = await readMultipartFormData(event)
  const file = form?.find((part) => part.name === 'file' && part.filename)

  if (!file?.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Choose a file to upload.' })
  }
  const ext = file.filename.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Use a PDF or Word document.' })
  }
  if (file.data.length === 0 || file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'The file must be under 5 MB.' })
  }

  const supabase = serverSupabase(event)
  const path = `${user.id}/cv.${ext}`

  // Remove the old file first if it had a different extension.
  const { data: current } = await supabase.from('profiles').select('cv_path').eq('id', user.id).single()
  if (current?.cv_path && current.cv_path !== path) {
    await supabase.storage.from(CV_BUCKET).remove([current.cv_path])
  }

  const { error: uploadError } = await supabase.storage
    .from(CV_BUCKET)
    .upload(path, file.data, { contentType: file.type, upsert: true })
  if (uploadError) {
    console.error('[cv] upload failed:', uploadError.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not upload your CV.' })
  }

  const cvText = await readCvText(file.filename, file.data)
  const changes = {
    cv_path: path,
    cv_name: file.filename,
    cv_size: file.data.length,
    cv_uploaded_at: new Date().toISOString(),
    cv_text: cvText,
  }
  let { error: updateError } = await supabase.from('profiles').update(changes).eq('id', user.id)
  if (updateError?.message.includes('cv_text')) {
    const { cv_text: _cvText, ...withoutText } = changes
    updateError = (await supabase.from('profiles').update(withoutText).eq('id', user.id)).error
  }
  if (updateError) {
    console.error('[cv] profile update failed:', updateError.message)
    throw createError({ statusCode: 500, statusMessage: 'Could not save your CV.' })
  }

  return getProfile(supabase, user.id)
})
