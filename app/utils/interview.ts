export interface SelectOption {
  label: string
  value: string
  group?: string
}

export interface InterviewSetup {
  role: string
  level: string
  category: string
  difficulty: string
  duration: string
  style: string
}

export const roles: SelectOption[] = [
  { label: 'Frontend engineering', value: 'frontend', group: 'Technology' },
  { label: 'Backend engineering', value: 'backend', group: 'Technology' },
  { label: 'Full-stack engineering', value: 'fullstack', group: 'Technology' },
  { label: 'Product management', value: 'product-management', group: 'Technology' },
  { label: 'Product design', value: 'product-design', group: 'Technology' },
  { label: 'Data analytics', value: 'data-analytics', group: 'Technology' },
  { label: 'Data science', value: 'data-science', group: 'Technology' },
  { label: 'Quality assurance', value: 'quality-assurance', group: 'Technology' },
  { label: 'DevOps and cloud', value: 'devops', group: 'Technology' },
  { label: 'Cybersecurity', value: 'cybersecurity', group: 'Technology' },
  { label: 'Technical project management', value: 'technical-project-management', group: 'Technology' },
  { label: 'Consulting', value: 'consulting', group: 'Business' },
  { label: 'Marketing', value: 'marketing', group: 'Business' },
  { label: 'Sales', value: 'sales', group: 'Business' },
  { label: 'Operations', value: 'operations', group: 'Business' },
  { label: 'Finance', value: 'finance', group: 'Business' },
  { label: 'Human resources', value: 'human-resources', group: 'Business' },
  { label: 'Customer success', value: 'customer-success', group: 'Business' },
  { label: 'General management', value: 'general-management', group: 'Business' },
]

export const levels: SelectOption[] = [
  { label: 'Entry-level', value: 'entry' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid-level', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead / Principal', value: 'lead' },
]

export const categories: SelectOption[] = [
  { label: 'General and HR', value: 'general' },
  { label: 'Behavioural', value: 'behavioural' },
  { label: 'Role-specific', value: 'technical' },
  { label: 'Leadership', value: 'leadership' },
  { label: 'Mixed', value: 'mixed' },
]

export const difficulties: SelectOption[] = [
  { label: 'Guided', value: 'guided' },
  { label: 'Standard', value: 'standard' },
  { label: 'Challenging', value: 'challenging' },
]

export const durations: SelectOption[] = [
  { label: '10 minutes', value: '10' },
  { label: '15 minutes', value: '15' },
  { label: '20 minutes', value: '20' },
  { label: '30 minutes', value: '30' },
]

export const styles: SelectOption[] = [
  { label: 'Friendly recruiter', value: 'friendly' },
  { label: 'Specialist interviewer', value: 'technical-interviewer' },
  { label: 'Hiring manager', value: 'hiring-manager' },
  { label: 'Challenging interviewer', value: 'challenging' },
]

export const defaultSetup: InterviewSetup = {
  role: 'frontend',
  level: 'senior',
  category: 'technical',
  difficulty: 'standard',
  duration: '15',
  style: 'technical-interviewer',
}

const groups = {
  role: roles,
  level: levels,
  category: categories,
  difficulty: difficulties,
  duration: durations,
  style: styles,
}

export function labelFor(group: keyof typeof groups, value: string) {
  return groups[group].find((option) => option.value === value)?.label ?? value
}

const previousLabels: Record<string, string> = {
  Technical: 'technical',
  'Professional technical interviewer': 'technical-interviewer',
}

export function valueFor(group: keyof typeof groups, label: string) {
  return groups[group].find((option) => option.label === label)?.value ?? previousLabels[label]
}

export function readSetup(query: Record<string, unknown>): InterviewSetup {
  const setup = { ...defaultSetup }

  for (const key of Object.keys(groups) as Array<keyof typeof groups>) {
    const raw = query[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    if (typeof value === 'string' && groups[key].some((option) => option.value === value)) {
      setup[key] = value
    }
  }

  return setup
}

export function setupQuery(setup: InterviewSetup) {
  return { ...setup }
}
