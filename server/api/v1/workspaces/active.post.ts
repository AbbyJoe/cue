/** POST /api/v1/workspaces/active: open a workspace, or general practice when id is null. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody<{ id?: string | null }>(event)
  const id = typeof body.id === 'string' && body.id ? body.id : null
  return setActiveWorkspace(serverSupabase(event), user.id, id)
})
