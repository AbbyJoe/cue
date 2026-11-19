import type { InterviewRecord } from '#shared/types/interview'
import { lessons } from '~/data/lessons'

/** The same dimensions the assessment asks for, in display order. */
export const rubric = [
  { name: 'Relevance', question: 'Did you answer the question that was asked?' },
  { name: 'Structure', question: 'Was the response organised logically?' },
  { name: 'Depth', question: 'Did you show enough understanding for your level?' },
  { name: 'Clarity', question: 'Was the explanation easy to follow?' },
  { name: 'Evidence', question: 'Did you support it with real examples?' },
]

const lessonForScore: Record<string, string> = {
  Relevance: 'tell-me-about-yourself',
  Structure: 'a-difficult-situation',
  Evidence: 'a-difficult-situation',
  Depth: 'explaining-a-technical-concept',
  Clarity: 'explaining-a-technical-concept',
}

export function averageScore(interviews: InterviewRecord[], name: string) {
  const values = interviews.flatMap((interview) => {
    const value = interview.feedback?.scores.find((score) => score.name === name)?.value
    return value == null ? [] : [value]
  })
  if (values.length === 0) {
    return null
  }
  return values.reduce((total, value) => total + value, 0) / values.length
}

export function weakestScore(interviews: InterviewRecord[]) {
  let lowest: { name: string, question: string, value: number } | null = null
  for (const item of rubric) {
    const value = averageScore(interviews, item.name)
    if (value == null) {
      continue
    }
    if (!lowest || value < lowest.value) {
      lowest = { ...item, value }
    }
  }
  return lowest
}

export function lessonFor(scoreName: string) {
  const slug = lessonForScore[scoreName]
  return lessons.find((lesson) => lesson.slug === slug) ?? null
}
