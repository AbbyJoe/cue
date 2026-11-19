import { readCvText } from '../../../../utils/cvText'

const MAX_SIZE = 5 * 1024 * 1024

/** POST /api/v1/workspaces/:id/cv: read an optional CV for this workspace. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  }

  const form = await readMultipartFormData(event)
  const file = form?.find((part) => part.name === 'file' && part.filename)
  if (!file?.filename || !file.data.length) {
    throw createError({ statusCode: 400, statusMessage: 'Choose a PDF or DOCX file.' })
  }
  const ext = file.filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext !== 'pdf' && ext !== 'docx') {
    throw createError({ statusCode: 400, statusMessage: 'Use a PDF or DOCX so the interviewer can read it.' })
  }
  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: 'The file must be under 5 MB.' })
  }

  const text = await readCvText(file.filename, file.data)
  if (!text) {
    throw createError({ statusCode: 422, statusMessage: 'Could not read that CV. Use a PDF or DOCX with selectable text.' })
  }

  return saveWorkspaceCv(serverSupabase(event), user.id, id, file.filename, text)
})
