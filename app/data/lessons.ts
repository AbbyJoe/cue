export interface Lesson {
  slug: string
  title: string
  category: string
  summary: string
  purpose: string
  evaluates: string
  mistakes: string[]
  structure: string[]
  example: string
  exercise: string
}

export const lessons: Lesson[] = [
  {
    slug: 'tell-me-about-yourself',
    title: 'Tell me about yourself',
    category: 'Behavioural',
    summary: 'A short professional story that leads to the role you want.',
    purpose: 'Give the interviewer a clear picture of who you are now, and why this conversation makes sense.',
    evaluates: 'Whether you can choose relevant experience, stay concise, and connect your past to the role.',
    mistakes: [
      'Reciting a full career history.',
      'Listing tools without saying what you did with them.',
      'Ending without a reason for wanting this kind of role.',
    ],
    structure: [
      'Where you are now, in one sentence.',
      'Two or three experiences that show how you work.',
      'Why those experiences lead to the role you are preparing for.',
    ],
    example: 'I am a frontend engineer who has spent the last four years building Vue applications for banking teams. I usually own a feature from the first design conversation through release, and I have spent a lot of that time making slow pages faster. I am looking for a senior role where I can keep doing that work and help other engineers make those decisions.',
    exercise: 'Say your answer out loud in under 90 seconds. Then remove any sentence that does not help the interviewer understand the role you want.',
  },
  {
    slug: 'a-difficult-situation',
    title: 'Describe a difficult situation',
    category: 'Behavioural',
    summary: 'Show how you handled a real problem, including your own part in it.',
    purpose: 'Let the interviewer see your judgement when something was unclear, blocked, or going wrong.',
    evaluates: 'Context, your responsibility, the action you took, and what changed because of it.',
    mistakes: [
      'Spending the whole answer on the problem and never reaching what you did.',
      'Using “we” so often that your own contribution disappears.',
      'Choosing a story where you had no real decision to make.',
    ],
    structure: [
      'What the situation was, and why it mattered.',
      'What you were responsible for.',
      'What you did, including one trade-off.',
      'What happened, and what you would repeat or change.',
    ],
    example: 'A release was a week away and the main page still took eight seconds to load. I owned the frontend, so I measured the route before changing it. The largest cost was a chart that rendered data the user could not see yet. I deferred that chart and kept the first view small. The page opened in under two seconds, and we shipped the rest of the chart the following week.',
    exercise: 'Tell one story with a visible “I”. If you cannot point to your decision, pick a different story.',
  },
  {
    slug: 'explaining-a-technical-concept',
    title: 'Explain a concept from your work',
    category: 'Role-specific',
    summary: 'Make a concept clear without hiding the trade-off.',
    purpose: 'Show that you understand an idea from your field well enough to explain it to a colleague.',
    evaluates: 'Accuracy, depth for your level, and whether you can connect the concept to a real situation.',
    mistakes: [
      'Defining the term and stopping there.',
      'Naming tools or frameworks instead of explaining the decision.',
      'Speaking as if one approach is always the right one.',
    ],
    structure: [
      'Say what the concept is for.',
      'Explain how it works in plain language.',
      'Give one situation where you would use it.',
      'Name one cost or limit.',
    ],
    example: 'A customer segment is only useful if it changes what you do. I would name the group, say why their need is different, and say what we would stop offering to everyone else. A segment that does not change the offer is just a label.',
    exercise: 'Pick one concept from your own work. Explain it in four sentences, and make the last sentence a trade-off.',
  },
  {
    slug: 'strengths-and-weaknesses',
    title: 'Strengths and weaknesses',
    category: 'Recruitment and HR',
    summary: 'Be specific, and show that you understand the shape of your own work.',
    purpose: 'Help a recruiter see how you work with other people, and how you handle a real limit.',
    evaluates: 'Self-awareness, evidence, and whether the weakness is honest without turning into a confession.',
    mistakes: [
      'Offering a strength with no example.',
      'Disguising a strength as a weakness.',
      'Naming a weakness and stopping before what you do about it.',
    ],
    structure: [
      'Name one strength and the situation that showed it.',
      'Name one real limit.',
      'Say what you now do differently because of that limit.',
    ],
    example: 'I am good at making a vague feature specific enough to build. On a payments page I turned a broad request into three user paths and we shipped the first one in a week. I am less strong at estimating unfamiliar work. I now break the unknown into a short spike before I give a date.',
    exercise: 'Write one strength and one weakness. Each one needs a real situation from your work.',
  },
  {
    slug: 'mentoring',
    title: 'Mentoring and direction',
    category: 'Leadership',
    summary: 'Show how you help other people make better decisions.',
    purpose: 'A senior interview is often about influence, not only your own output.',
    evaluates: 'Whether you can raise the quality of other people’s work without taking the work away from them.',
    mistakes: [
      'Describing management as assigning tasks.',
      'Taking credit for a solution you handed someone.',
      'Skipping the disagreement or the constraint.',
    ],
    structure: [
      'Who needed help, and what the decision was.',
      'How you helped them think, rather than only what you told them to do.',
      'What they shipped, and what you learned about leading that work.',
    ],
    example: 'A junior engineer wanted to cache an entire dashboard response. I asked what would be wrong if one widget changed and the rest stayed old. They split the cache by widget and added a short expiry. The page got faster, and they could explain the choice in review without me speaking for them.',
    exercise: 'Describe one time you changed someone else’s approach. Include the question you asked, not only the answer you preferred.',
  },
]

export function lessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug)
}

export function lessonsByCategory() {
  const groups = new Map<string, Lesson[]>()

  for (const lesson of lessons) {
    const group = groups.get(lesson.category) ?? []
    group.push(lesson)
    groups.set(lesson.category, group)
  }

  return Array.from(groups, ([category, items]) => ({ category, items }))
}
