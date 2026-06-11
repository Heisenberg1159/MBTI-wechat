import types from '../../data/types'
import type { MBTIResult, DimensionScore } from '../../utils/scorer'
import type { MBTIType } from '../../data/types'

type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP'

interface DimItem {
  key: DimensionKey
  title: string
  leftCode: string
  rightCode: string
  leftName: string
  rightName: string
  leftScore: number
  rightScore: number
  leftPercent: number
  markerPercent: number
  leadCode: string
  leadName: string
  leadPercent: number
  strengthLabel: string
  leftColor: string
  rightColor: string
  resultColor: string
  gradient: string
}

interface CompatibleItem {
  code: string
  name: string
  emoji: string
  color: string
  softColor: string
}

interface StoredResult extends MBTIResult {
  timestamp?: number
}

interface DimensionMeta {
  title: string
  leftCode: string
  rightCode: string
  leftName: string
  rightName: string
  leftColor: string
  rightColor: string
}

const EMPTY_TYPE: MBTIType = {
  code: '',
  name: '',
  emoji: '',
  color: '#007AFF',
  tagline: '',
  traits: [],
  description: '',
  strengths: [],
  weaknesses: [],
  careers: [],
  compatible: [],
}

const DIM_ORDER: DimensionKey[] = ['EI', 'SN', 'TF', 'JP']

const DIM_META: Record<DimensionKey, DimensionMeta> = {
  EI: {
    title: '能量方向',
    leftCode: 'E',
    rightCode: 'I',
    leftName: '外向',
    rightName: '内向',
    leftColor: '#007AFF',
    rightColor: '#AF52DE',
  },
  SN: {
    title: '信息获取',
    leftCode: 'S',
    rightCode: 'N',
    leftName: '感觉',
    rightName: '直觉',
    leftColor: '#34C759',
    rightColor: '#007AFF',
  },
  TF: {
    title: '决策方式',
    leftCode: 'T',
    rightCode: 'F',
    leftName: '思维',
    rightName: '情感',
    leftColor: '#FF9500',
    rightColor: '#34C759',
  },
  JP: {
    title: '生活方式',
    leftCode: 'J',
    rightCode: 'P',
    leftName: '判断',
    rightName: '知觉',
    leftColor: '#AF52DE',
    rightColor: '#FF9500',
  },
}

const EMPTY_RESULT: MBTIResult = {
  typeCode: '',
  scores: {},
}

function clampPercent(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function getStrengthLabel(percent: number) {
  if (percent >= 86) return '强烈倾向'
  if (percent >= 70) return '明显倾向'
  if (percent >= 56) return '轻度倾向'
  return '接近平衡'
}

function getOverallLabel(percent: number) {
  if (percent >= 86) return '轮廓鲜明'
  if (percent >= 70) return '倾向清晰'
  if (percent >= 56) return '温和倾向'
  return '接近平衡'
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  if (value.length !== 6) return `rgba(0, 122, 255, ${alpha})`

  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function normalizeResult(value: unknown): MBTIResult | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Partial<MBTIResult>
  if (!candidate.scores || typeof candidate.scores !== 'object') return null

  const scores: Record<string, DimensionScore> = {}
  let typeCode = ''

  for (const key of DIM_ORDER) {
    const score = (candidate.scores as Record<string, Partial<DimensionScore>>)[key]
    const meta = DIM_META[key]
    if (!score) return null

    const left = Number(score.left) || 0
    const right = Number(score.right) || 0
    const fallbackResult = left >= right ? meta.leftCode : meta.rightCode
    const result = score.result === meta.leftCode || score.result === meta.rightCode
      ? score.result
      : fallbackResult

    scores[key] = { left, right, result }
    typeCode += result
  }

  return {
    typeCode: typeof candidate.typeCode === 'string' && candidate.typeCode.length === 4
      ? candidate.typeCode.toUpperCase()
      : typeCode,
    scores,
  }
}

function parseResult(raw?: string) {
  if (!raw) return null

  try {
    return normalizeResult(JSON.parse(decodeURIComponent(raw)))
  } catch (_e) {
    try {
      return normalizeResult(JSON.parse(raw))
    } catch (_inner) {
      return null
    }
  }
}

Page({
  data: {
    hasResult: false,
    typeData: EMPTY_TYPE,
    dimList: [] as DimItem[],
    result: EMPTY_RESULT,
    compatibleList: [] as CompatibleItem[],
    overallPercent: 0,
    overallLabel: '',
    themeSoftColor: 'rgba(0, 122, 255, 0.08)',
    themeBorderColor: 'rgba(0, 122, 255, 0.18)',
    errorText: '完成测试后会在这里看到完整结果。',
    statusBarHeight: 0,
  },

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })

    const loaded = this.resolveResult(options)

    if (!loaded.result) {
      this.setData({
        hasResult: false,
        typeData: EMPTY_TYPE,
        result: EMPTY_RESULT,
        dimList: [],
        compatibleList: [],
        overallPercent: 0,
        overallLabel: '',
        themeSoftColor: 'rgba(0, 122, 255, 0.08)',
        themeBorderColor: 'rgba(0, 122, 255, 0.18)',
        errorText: '没有找到可展示的测试结果，请先完成一次测试。',
      })
      return
    }

    this.renderResult(loaded.result)

    if (loaded.shouldSave) {
      this.saveToLocal(loaded.result)
    }
  },

  resolveResult(options: WechatMiniprogram.PageLoadOption): { result: MBTIResult | null; shouldSave: boolean } {
    // 优先从 URL data 参数读取（分享/历史入口）
    const fromUrl = parseResult(options.data)
    if (fromUrl) {
      return { result: fromUrl, shouldSave: options.from !== 'share' }
    }

    // 其次从 pending storage 读取（答题完成入口）
    if (options.from === 'quiz') {
      try {
        const pending = normalizeResult(wx.getStorageSync('mbti_pending_result'))
        if (pending) {
          wx.removeStorageSync('mbti_pending_result')
          return { result: pending, shouldSave: true }
        }
      } catch (_e) {
        // ignore
      }
    }

    // 最后从历史记录读取
    return { result: this.loadLatestResult(), shouldSave: false }
  },

  renderResult(result: MBTIResult) {
    const typeData = types.find(t => t.code === result.typeCode) || types[0]
    const dimList = this.buildDimList(result)
    const compatibleList = typeData.compatible
      .map(code => types.find(t => t.code === code))
      .filter((item): item is MBTIType => Boolean(item))
      .map(item => ({
        code: item.code,
        name: item.name,
        emoji: item.emoji,
        color: item.color,
        softColor: hexToRgba(item.color, 0.1),
      }))

    const overallPercent = dimList.length > 0
      ? clampPercent(dimList.reduce((sum: number, item: DimItem) => sum + item.leadPercent, 0) / dimList.length)
      : 0

    this.setData({
      hasResult: true,
      typeData,
      dimList,
      result,
      compatibleList,
      overallPercent,
      overallLabel: getOverallLabel(overallPercent),
      themeSoftColor: hexToRgba(typeData.color, 0.1),
      themeBorderColor: hexToRgba(typeData.color, 0.22),
      errorText: '',
    })
  },

  buildDimList(result: MBTIResult): DimItem[] {
    return DIM_ORDER.map(key => {
      const score = result.scores[key]
      const meta = DIM_META[key]
      const total = score.left + score.right
      const leftPercent = total > 0 ? clampPercent((score.left / total) * 100) : 50
      const leadIsLeft = score.left >= score.right
      const leadScore = leadIsLeft ? score.left : score.right
      const leadPercent = total > 0 ? clampPercent((leadScore / total) * 100) : 50

      return {
        key,
        title: meta.title,
        leftCode: meta.leftCode,
        rightCode: meta.rightCode,
        leftName: meta.leftName,
        rightName: meta.rightName,
        leftScore: score.left,
        rightScore: score.right,
        leftPercent,
        markerPercent: clampPercent(leftPercent, 2, 98),
        leadCode: leadIsLeft ? meta.leftCode : meta.rightCode,
        leadName: leadIsLeft ? meta.leftName : meta.rightName,
        leadPercent,
        strengthLabel: getStrengthLabel(leadPercent),
        leftColor: meta.leftColor,
        rightColor: meta.rightColor,
        resultColor: leadIsLeft ? meta.leftColor : meta.rightColor,
        gradient: `linear-gradient(90deg, ${meta.leftColor}, ${meta.rightColor})`,
      }
    })
  },

  loadLatestResult() {
    try {
      const latest = normalizeResult(wx.getStorageSync('mbti_latest_result'))
      if (latest) return latest

      const history = wx.getStorageSync('mbti_history')
      if (Array.isArray(history) && history.length > 0) {
        return normalizeResult(history[0])
      }
    } catch (_e) {
      // ignore
    }

    return null
  },

  saveToLocal(result: MBTIResult) {
    try {
      const history = wx.getStorageSync('mbti_history')
      const currentHistory = Array.isArray(history) ? history : []
      const record: StoredResult = {
        ...result,
        timestamp: Date.now(),
      }

      wx.setStorageSync('mbti_latest_result', record)
      wx.setStorageSync('mbti_history', [record, ...currentHistory].slice(0, 20))
    } catch (_e) {
      // ignore
    }
  },

  restart() {
    wx.redirectTo({ url: '/pages/quiz/quiz' })
  },

  viewHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  },

  viewTypes() {
    wx.navigateTo({ url: '/pages/types/types' })
  },

  generateCard() {
    if (!this.data.hasResult) return
    const payload = encodeURIComponent(JSON.stringify(this.data.result))
    wx.navigateTo({ url: `/pages/share-card/share-card?data=${payload}` })
  },

  viewMatch() {
    const code = this.data.hasResult ? this.data.result.typeCode : ''
    wx.navigateTo({ url: `/pages/match/match${code ? '?code=' + code : ''}` })
  },

  goHome() {
    wx.redirectTo({ url: '/pages/index/index' })
  },

  buildShareQuery() {
    if (!this.data.hasResult) return ''
    const payload = encodeURIComponent(JSON.stringify(this.data.result))
    return `data=${payload}&from=share`
  },

  buildShareTitle() {
    if (!this.data.hasResult) return '来测测你的 MBTI 性格类型'

    const code = this.data.result.typeCode
    const typeData = this.data.typeData
    return `我的 MBTI 是 ${code} ${typeData.name}，你也来测测`
  },

  onShareAppMessage() {
    return {
      title: this.buildShareTitle(),
      path: this.data.hasResult
        ? `/pages/result/result?${this.buildShareQuery()}`
        : '/pages/index/index',
    }
  },

  onShareTimeline() {
    return {
      title: this.buildShareTitle(),
      query: this.buildShareQuery(),
    }
  },
})
