import type { WorkspaceInput } from '#shared/types/workspace'

/** PATCH /api/v1/workspaces/:id */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  }
  const body = await readBody<Partial<WorkspaceInput>>(event)
  return updateWorkspace(serverSupabase(event), user.id, id, body)
})
