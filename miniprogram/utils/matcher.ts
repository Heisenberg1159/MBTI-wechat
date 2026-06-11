import types from '../data/types'
import type { MBTIType } from '../data/types'

export interface MatchResult {
  score: number
  level: string
  levelColor: string
  levelEmoji: string
  letterMatch: number
  isCompatible: boolean
  summary: string
  communication: string
  work: string
  romance: string
}

// 计算两个类型的匹配度
export function calculateMatch(codeA: string, codeB: string): MatchResult {
  const typeA = types.find(t => t.code === codeA)
  const typeB = types.find(t => t.code === codeB)
  if (!typeA || !typeB) throw new Error('类型未找到')

  // 相同类型
  if (codeA === codeB) {
    return sameTypeResult(typeA)
  }

  // 是否在兼容列表中
  const aLikesB = typeA.compatible.includes(codeB)
  const bLikesA = typeB.compatible.includes(codeA)
  const isCompatible = aLikesB || bLikesA

  // 字母匹配数
  let letterMatch = 0
  for (let i = 0; i < 4; i++) {
    if (codeA[i] === codeB[i]) letterMatch++
  }

  // 计分：基础 40 + 字母匹配（每字母最多 10，特定维度加权）+ 兼容加成
  let score = 40
  const weights = [8, 12, 12, 8] // E/I=8, S/N=12, T/F=12, J/P=8
  for (let i = 0; i < 4; i++) {
    if (codeA[i] === codeB[i]) score += weights[i]
  }
  // 兼容加成
  if (aLikesB && bLikesA) score += 15
  else if (isCompatible) score += 10

  // 共性是 N（直觉）时加分
  if (codeA[1] === 'N' && codeB[1] === 'N') score += 5

  score = Math.min(98, Math.max(15, score))

  const { level, levelColor, levelEmoji } = getLevel(score)

  return {
    score,
    level,
    levelColor,
    levelEmoji,
    letterMatch,
    isCompatible,
    summary: buildSummary(score, typeA, typeB),
    communication: buildComm(score, codeA, codeB),
    work: buildWork(score, codeA, codeB),
    romance: buildRomance(score, codeA, codeB, aLikesB && bLikesA),
  }
}

function sameTypeResult(type: MBTIType): MatchResult {
  return {
    score: 90,
    level: '灵魂共鸣',
    levelColor: '#AF52DE',
    levelEmoji: '💫',
    letterMatch: 4,
    isCompatible: true,
    summary: `两个 ${type.code} ${type.name} 在一起，就像照镜子。你们会惊人地理解彼此的想法和感受，沟通几乎不需要解释。但也可能因为过于相似而缺少新鲜感。`,
    communication: '沟通几乎是心领神会的——你们用同样的方式思考，同样的方式表达。唯一需要注意的是，不要因为太懂对方而忽略了真正"说出口"的重要性。',
    work: '作为工作搭档，你们的效率极高，因为思维模式完全同步。但要警惕"集体盲区"——两个人可能同时忽略同样的风险。',
    romance: '这是一段深度连接的关系，你们能在精神层面达到极致的亲密。保持一些各自的独立空间，反而能让关系更长久。',
  }
}

function getLevel(score: number): { level: string; levelColor: string; levelEmoji: string } {
  if (score >= 85) return { level: '天作之合', levelColor: '#AF52DE', levelEmoji: '💫' }
  if (score >= 70) return { level: '高度契合', levelColor: '#34C759', levelEmoji: '🌟' }
  if (score >= 55) return { level: '互相吸引', levelColor: '#007AFF', levelEmoji: '🤝' }
  if (score >= 40) return { level: '需要磨合', levelColor: '#FF9500', levelEmoji: '🔧' }
  return { level: '差异较大', levelColor: '#FF3B30', levelEmoji: '🌊' }
}

function buildSummary(score: number, a: MBTIType, b: MBTIType): string {
  if (score >= 85) return `${a.name} 与 ${b.name} 的匹配度非常高。你们在核心维度上高度一致，能够深刻理解彼此的思维和感受，是理想的精神搭档。`
  if (score >= 70) return `${a.name} 与 ${b.name} 是相当不错的组合。你们在关键方面有共同语言，差异恰好互补，能够从对方身上学到很多。`
  if (score >= 55) return `${a.name} 与 ${b.name} 之间存在有趣的吸引力。虽然有差异需要磨合，但正是这些不同让关系充满张力和成长空间。`
  if (score >= 40) return `${a.name} 与 ${b.name} 的差异比较明显。你们看世界的方式很不同，需要更多的耐心和理解才能找到共鸣，但并非不可能。`
  return `${a.name} 与 ${b.name} 几乎站在人格光谱的两端。沟通可能需要大量努力，但如果双方都愿意学习，也能收获独特视角。`
}

function buildComm(score: number, codeA: string, codeB: string): string {
  const sameEI = codeA[0] === codeB[0]
  const sameSN = codeA[1] === codeB[1]
  const sameTF = codeA[2] === codeB[2]

  if (sameSN && sameTF) return '你们在信息接收和决策方式上高度一致，沟通顺畅高效。可以放心地深入讨论任何话题，彼此都能跟上对方的思路。'
  if (sameSN && !sameTF) return '你们看到的事实相似，但得出的结论可能不同。一个重逻辑、一个重感受，这正是互补之处——试着欣赏对方的角度。'
  if (!sameSN && sameTF) return '你们用相似的价值观做判断，但获取信息的渠道不同。多分享各自关注的细节和全局，能让沟通更全面。'
  if (sameEI) return '你们拥有相似的社交节奏，这让日常相处很舒适。但在深层话题上可能需要更多主动表达。'
  return '你们的沟通风格差异较大。一方喜欢边说边想，一方需要时间沉淀——给彼此空间，找到共同的沟通节奏很重要。'
}

function buildWork(score: number, codeA: string, codeB: string): string {
  const sameJP = codeA[3] === codeB[3]

  if (score >= 70) {
    return sameJP
      ? '你们的工作节奏高度同步，无论是规划还是执行都很流畅。适合做长期项目搭档，可以放心地把后背交给对方。'
      : '一个喜欢规划、一个擅长应变，这种组合在项目中往往出奇制胜。明确分工、尊重彼此节奏即可高效协作。'
  }
  if (score >= 50) {
    return '工作中的差异可能带来摩擦，但也意味着互补。明确各自的角色和期望，定期同步进展，可以有效减少误解。'
  }
  return '你们的工作方式差异较大，不太适合紧密协作。但如果能各司其职、保持独立空间，反而可以做到1+1>2。'
}

function buildRomance(score: number, codeA: string, codeB: string, mutualCompat: boolean): string {
  if (mutualCompat) return '你们是彼此理想的情感归属。这种关系中，双方都能做真实的自己，同时被对方深深理解和欣赏。珍惜这份难得的契合。'
  if (score >= 70) return '这是一段充满成长的关系。你们足够相似以建立连接，又足够不同以保持新鲜。关键在于欣赏差异而非试图改变对方。'
  if (score >= 50) return '这段关系需要投入更多心思。差异既是吸引力也是挑战——多一些好奇心，少一些评判，你们会发现彼此的世界都很精彩。'
  return '这段关系充满挑战，但如果双方都愿意付出努力，也能发展出深厚的情感连接。尊重差异、保持沟通是关键。'
}
