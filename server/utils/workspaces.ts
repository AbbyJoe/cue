import type { SupabaseClient } from '@supabase/supabase-js'
import type { Workspace, WorkspaceInput, WorkspaceList } from '#shared/types/workspace'
import { levels, roles } from '../../app/utils/interview'

const columns = 'id, name, role, level, goals, job_description, cv_name, cv_text, created_at'

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function choice(value: unknown, options: { value: string }[], fallback: string) {
  const raw = text(value, 80)
  return options.some((option) => option.value === raw) ? raw : fallback
}

export function workspaceInput(body: Partial<WorkspaceInput>) {
  const name = text(body.name, 80)
  if (!name) {
    throw createError({ statusCode: 422, statusMessage: 'Give the workspace a name.' })
  }
  return {
    name,
    role: choice(body.role, roles, 'frontend'),
    level: choice(body.level, levels, 'senior'),
    goals: text(body.goals, 1000),
    job_description: text(body.jobDescription, 4000),
  }
}

function toWorkspace(row: {
  id: string
  name: string
  role: string
  level: string
  goals: string
  job_description: string | null
  cv_name?: string | null
  cv_text?: string | null
  created_at: string
}): Workspace {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    level: row.level,
    goals: row.goals,
    jobDescription: row.job_description ?? '',
    cvName: row.cv_name ?? '',
    cvText: row.cv_text ?? '',
    createdAt: row.created_at,
  }
}

function unavailable(error: { message?: string } | null) {
  return Boolean(error?.message && (error.message.includes('workspaces') || error.message.includes('active_workspace_id')))
}

/** The signed-in person's workspaces, and which one is open. */
export async function listWorkspaces(supabase: SupabaseClient, userId: string): Promise<WorkspaceList> {
  let { data, error } = await supabase
    .from('workspaces')
    .select(columns)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error?.message.includes('cv_text')) {
    const fallback = await supabase
      .from('workspaces')
      .select('id, name, role, level, goals, job_description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    data = (fallback.data ?? []).map((row) => ({ ...row, cv_name: '', cv_text: '' }))
    error = fallback.error
  }

  if (error) {
    console.error('[workspaces] list failed:', error.code)
    throw createError({
      statusCode: unavailable(error) ? 503 : 500,
      statusMessage: unavailable(error) ? 'Workspaces are not set up yet.' : 'Could not load workspaces.',
    })
  }

  const active = await supabase.from('profiles').select('active_workspace_id').eq('id', userId).maybeSingle()
  const rows = data ?? []
  const activeId = !active.error && rows.some((row) => row.id === active.data?.active_workspace_id)
    ? active.data?.active_workspace_id ?? null
    : null

  return { activeId, workspaces: rows.map(toWorkspace) }
}

export async function createWorkspace(supabase: SupabaseClient, userId: string, body: Partial<WorkspaceInput>) {
  const { data, error } = await supabase
    .from('workspaces')
    .insert({ user_id: userId, ...workspaceInput(body) })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[workspaces] create failed:', error?.code)
    throw createError({
      statusCode: unavailable(error) ? 503 : 500,
      statusMessage: unavailable(error) ? 'Workspaces are not set up yet.' : 'Could not create the workspace.',
    })
  }

  await supabase.from('profiles').update({ active_workspace_id: data.id }).eq('id', userId)
  return listWorkspaces(supabase, userId)
}

export async function updateWorkspace(supabase: SupabaseClient, userId: string, id: string, body: Partial<WorkspaceInput>) {
  const { error } = await supabase.from('workspaces').update(workspaceInput(body)).eq('id', id).eq('user_id', userId)
  if (error) {
    console.error('[workspaces] update failed:', error.code)
    throw createError({ statusCode: 500, statusMessage: 'Could not save the workspace.' })
  }
  return listWorkspaces(supabase, userId)
}

export async function deleteWorkspace(supabase: SupabaseClient, userId: string, id: string) {
  const { error } = await supabase.from('workspaces').delete().eq('id', id).eq('user_id', userId)
  if (error) {
    console.error('[workspaces] delete failed:', error.code)
    throw createError({ statusCode: 500, statusMessage: 'Could not delete the workspace.' })
  }
  return listWorkspaces(supabase, userId)
}

export async function setActiveWorkspace(supabase: SupabaseClient, userId: string, id: string | null) {
  if (id) {
    const owned = await supabase.from('workspaces').select('id').eq('id', id).eq('user_id', userId).maybeSingle()
    if (!owned.data) {
      throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
    }
  }

  const { error } = await supabase.from('profiles').update({ active_workspace_id: id }).eq('id', userId)
  if (error) {
    console.error('[workspaces] activate failed:', error.code)
    throw createError({
      statusCode: unavailable(error) ? 503 : 500,
      statusMessage: unavailable(error) ? 'Workspaces are not set up yet.' : 'Could not switch workspace.',
    })
  }
  return listWorkspaces(supabase, userId)
}

/** Store the words from a CV uploaded for this workspace. An empty name clears it. */
export async function saveWorkspaceCv(supabase: SupabaseClient, userId: string, id: string, name: string, text: string) {
  const { error } = await supabase
    .from('workspaces')
    .update({ cv_name: name, cv_text: text })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[workspaces] cv save failed:', error.code)
    throw createError({
      statusCode: error.message.includes('cv_text') ? 503 : 500,
      statusMessage: error.message.includes('cv_text') ? 'CV text is not set up yet.' : 'Could not save the CV.',
    })
  }
  return listWorkspaces(supabase, userId)
}
