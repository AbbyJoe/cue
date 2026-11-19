import type { Workspace, WorkspaceInput, WorkspaceList } from '#shared/types/workspace'

/** The person's workspaces. Shared across pages so opening one updates the rest. */
export function useWorkspaces() {
  const workspaces = useState<Workspace[]>('workspaces', () => [])
  const activeId = useState<string | null>('active-workspace', () => null)
  const loaded = useState('workspaces-loaded', () => false)
  const active = computed(() => workspaces.value.find((workspace) => workspace.id === activeId.value) ?? null)

  function apply(list: WorkspaceList) {
    workspaces.value = list.workspaces
    activeId.value = list.activeId
    loaded.value = true
  }

  async function load() {
    if (loaded.value) {
      return
    }
    apply(await $fetch<WorkspaceList>('/api/v1/workspaces'))
  }

  async function create(input: WorkspaceInput) {
    const known = new Set(workspaces.value.map((workspace) => workspace.id))
    apply(await $fetch<WorkspaceList>('/api/v1/workspaces', { method: 'POST', body: input }))
    return workspaces.value.find((workspace) => !known.has(workspace.id))?.id ?? null
  }

  async function uploadCv(id: string, file: File) {
    const body = new FormData()
    body.append('file', file)
    apply(await $fetch<WorkspaceList>(`/api/v1/workspaces/${id}/cv`, { method: 'POST', body }))
  }

  async function clearCv(id: string) {
    apply(await $fetch<WorkspaceList>(`/api/v1/workspaces/${id}/cv`, { method: 'DELETE' }))
  }

  async function save(id: string, input: WorkspaceInput) {
    apply(await $fetch<WorkspaceList>(`/api/v1/workspaces/${id}`, { method: 'PATCH', body: input }))
  }

  async function remove(id: string) {
    apply(await $fetch<WorkspaceList>(`/api/v1/workspaces/${id}`, { method: 'DELETE' }))
  }

  async function open(id: string | null) {
    apply(await $fetch<WorkspaceList>('/api/v1/workspaces/active', { method: 'POST', body: { id } }))
  }

  function clear() {
    workspaces.value = []
    activeId.value = null
    loaded.value = false
  }

  return { workspaces, activeId, active, load, create, save, remove, open, uploadCv, clearCv, clear }
}
