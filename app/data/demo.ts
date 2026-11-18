export interface DemoScore {
  name: string
  value: number
}

export interface DemoScenario {
  id: string
  track: string
  role: string
  question: string
  answer: string
  scores: DemoScore[]
  tip: string
}

// Illustrative sessions used by the landing page and auth panel.
export const demoScenarios: DemoScenario[] = [
  {
    id: 'engineering',
    track: 'Engineering',
    role: 'Senior Frontend Engineer',
    question: 'Walk me through a performance problem you solved recently.',
    answer: 'Our dashboard took eight seconds to load. I profiled it first, found a chart rendering data nobody could see yet, and deferred it.',
    scores: [
      { name: 'Structure', value: 4 },
      { name: 'Evidence', value: 5 },
      { name: 'Depth', value: 3 },
    ],
    tip: 'Strong evidence. Name the trade-off you accepted to show more depth.',
  },
  {
    id: 'product',
    track: 'Product',
    role: 'Product Manager',
    question: 'Tell me about a time you said no to a stakeholder.',
    answer: 'Sales wanted a custom export for one client. I showed them the usage data, offered a smaller version, and we shipped it in a week.',
    scores: [
      { name: 'Relevance', value: 5 },
      { name: 'Structure', value: 3 },
      { name: 'Evidence', value: 4 },
    ],
    tip: 'Lead with the outcome, then walk back through your reasoning.',
  },
  {
    id: 'design',
    track: 'Design',
    role: 'Product Designer',
    question: 'How do you decide when a design is ready to ship?',
    answer: 'I check it against the problem we agreed on, put it in front of three real users, and fix anything that blocks the main path.',
    scores: [
      { name: 'Clarity', value: 4 },
      { name: 'Depth', value: 3 },
      { name: 'Evidence', value: 3 },
    ],
    tip: 'Add one moment where testing changed your decision.',
  },
  {
    id: 'data',
    track: 'Data',
    role: 'Data Analyst',
    question: 'Explain a statistical result to someone non-technical.',
    answer: 'I said the new checkout probably helped, but the effect was small enough that one unusual week could hide it.',
    scores: [
      { name: 'Clarity', value: 5 },
      { name: 'Accuracy', value: 4 },
      { name: 'Application', value: 4 },
    ],
    tip: 'Great framing. Close with the decision the result supported.',
  },
]
