export interface InterviewScore {
  name: string
  value: number
  note: string
}

export interface InterviewFeedback {
  summary: string
  scores: InterviewScore[]
  strengths: string[]
  improvements: string[]
}

export interface TranscriptLine {
  from: 'you' | 'interviewer'
  text: string
}

/** One completed interview, as the history API returns it. */
export interface InterviewRecord {
  id: string
  createdAt: string
  role: string
  level: string
  category: string
  feedback: InterviewFeedback | null
  transcript: TranscriptLine[]
}
