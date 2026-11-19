/** GET /api/v1/workspaces: the signed-in person's workspaces and the open one. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return listWorkspaces(serverSupabase(event), user.id)
})
