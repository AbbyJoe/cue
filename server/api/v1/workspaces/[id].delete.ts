/** DELETE /api/v1/workspaces/:id. Its interviews stay, under General practice. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  }
  return deleteWorkspace(serverSupabase(event), user.id, id)
})
