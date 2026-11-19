/** DELETE /api/v1/workspaces/:id/cv: drop the workspace CV and use the profile CV. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  }
  return saveWorkspaceCv(serverSupabase(event), user.id, id, '', '')
})