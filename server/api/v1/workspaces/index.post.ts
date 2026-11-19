import type { WorkspaceInput } from '#shared/types/workspace'

/** POST /api/v1/workspaces: create a workspace and open it. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody<Partial<WorkspaceInput>>(event)
  return createWorkspace(serverSupabase(event), user.id, body)
})
