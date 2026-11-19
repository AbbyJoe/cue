/** One preparation goal, such as a role or a company. */
export interface Workspace {
  id: string
  name: string
  role: string
  level: string
  goals: string
  jobDescription: string
  /** File name of a CV uploaded for this workspace. Empty means use the profile CV. */
  cvName: string
  cvText: string
  createdAt: string
}

export interface WorkspaceList {
  activeId: string | null
  workspaces: Workspace[]
}

export type WorkspaceInput = Pick<Workspace, 'name' | 'role' | 'level' | 'goals' | 'jobDescription'>
