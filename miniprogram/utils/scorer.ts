import type { Question } from '../data/questions'

export interface DimensionScore {
  left: number
  right: number
  result: string
}

export interface MBTIResult {
  typeCode: string
  scores: Record<string, DimensionScore>
}

export function calculateResult(questions: Question[], answers: Record<number, string>): MBTIResult {
  const dimensions: Record<string, { left: string; right: string; leftCount: number; rightCount: number }> = {
    EI: { left: 'E', right: 'I', leftCount: 0, rightCount: 0 },
    SN: { left: 'S', right: 'N', leftCount: 0, rightCount: 0 },
    TF: { left: 'T', right: 'F', leftCount: 0, rightCount: 0 },
    JP: { left: 'J', right: 'P', leftCount: 0, rightCount: 0 },
  }

  for (const q of questions) {
    const answer = answers[q.id]
    if (!answer) continue
    const dim = dimensions[q.dimension]
    if (answer === dim.left) {
      dim.leftCount++
    } else {
      dim.rightCount++
    }
  }

  const scores: Record<string, DimensionScore> = {}
  let typeCode = ''

  for (const [key, dim] of Object.entries(dimensions)) {
    const result = dim.leftCount >= dim.rightCount ? dim.left : dim.right
    typeCode += result
    scores[key] = {
      left: dim.leftCount,
      right: dim.rightCount,
      result,
    }
  }

  return { typeCode, scores }
}
