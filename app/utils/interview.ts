export interface SelectOption {
  label: string
  value: string
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
  { label: 'Frontend engineering', value: 'frontend' },
  { label: 'Backend engineering', value: 'backend' },
  { label: 'Full-stack engineering', value: 'fullstack' },
  { label: 'Product management', value: 'product-management' },
  { label: 'Product design', value: 'product-design' },
  { label: 'Data analytics', value: 'data-analytics' },
  { label: 'Data science', value: 'data-science' },
  { label: 'Quality assurance', value: 'quality-assurance' },
  { label: 'DevOps and cloud', value: 'devops' },
  { label: 'Cybersecurity', value: 'cybersecurity' },
  { label: 'Technical project management', value: 'technical-project-management' },
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
  { label: 'Technical', value: 'technical' },
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
]

export const styles: SelectOption[] = [
  { label: 'Friendly recruiter', value: 'friendly' },
  { label: 'Professional technical interviewer', value: 'technical-interviewer' },
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
