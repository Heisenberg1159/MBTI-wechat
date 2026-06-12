import types from '../../data/types'
import { calculateMatch } from '../../utils/matcher'
import type { MatchResult } from '../../utils/matcher'

interface TypeItem {
  code: string
  name: string
  emoji: string
  color: string
  softColor: string
}

function hexToRgba(hex: string, alpha: number) {
  const v = hex.replace('#', '')
  if (v.length !== 6) return `rgba(0,122,255,${alpha})`
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const ALL_TYPES: TypeItem[] = types.map(t => ({
  code: t.code,
  name: t.name,
  emoji: t.emoji,
  color: t.color,
  softColor: hexToRgba(t.color, 0.08),
}))

Page({
  data: {
    allTypes: ALL_TYPES,
    typeA: ALL_TYPES[0],
    typeB: ALL_TYPES[7], // 默认 INTJ vs ENFP
    match: null as MatchResult | null,
    ringStyle: '',
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
    this.doMatch()
  },

  onShow() {
    // 从结果页 / 详情页跳转过来时携带的预选类型
    const app = getApp<IAppOption>()
    const code = app.globalData.pendingMatchCode
    if (code) {
      app.globalData.pendingMatchCode = ''
      const preset = ALL_TYPES.find(t => t.code === code)
      if (preset && preset.code !== this.data.typeA.code) {
        this.setData({ typeA: preset }, () => this.doMatch())
      }
    }
  },

  selectTypeA(e: WechatMiniprogram.TouchEvent) {
    const code = e.currentTarget.dataset.code as string
    const type = ALL_TYPES.find(t => t.code === code)
    if (!type) return
    this.setData({ typeA: type }, () => this.doMatch())
  },

  selectTypeB(e: WechatMiniprogram.TouchEvent) {
    const code = e.currentTarget.dataset.code as string
    const type = ALL_TYPES.find(t => t.code === code)
    if (!type) return
    this.setData({ typeB: type }, () => this.doMatch())
  },

  swapTypes() {
    this.setData({ typeA: this.data.typeB, typeB: this.data.typeA }, () => this.doMatch())
  },

  doMatch() {
    if (!this.data.typeA || !this.data.typeB) return
    const result = calculateMatch(this.data.typeA.code, this.data.typeB.code)
    // 分数环：用 conic-gradient 画进度
    const deg = Math.round((result.score / 100) * 360)
    const ringStyle = `background: conic-gradient(${result.levelColor} ${deg}deg, rgba(0,0,0,0.06) ${deg}deg);`
    this.setData({ match: result, ringStyle })
  },

  startQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz?version=full' })
  },

  onShareAppMessage() {
    const a = this.data.typeA
    const b = this.data.typeB
    return {
      title: `${a.code} × ${b.code} 的匹配度有多高？快来看看`,
      path: '/pages/index/index',
    }
  },

  onShareTimeline() {
    return { title: 'MBTI 类型匹配度测试' }
  },
})
