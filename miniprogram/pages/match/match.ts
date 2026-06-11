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
    typeB: ALL_TYPES[7], // default: INTJ vs ENFP
    match: null as MatchResult | null,
    statusBarHeight: 0,
  },

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })

    // 支持从外部传入预选类型
    const presetCode = options.code as string
    if (presetCode) {
      const preset = ALL_TYPES.find(t => t.code === presetCode)
      if (preset) {
        this.setData({ typeA: preset })
      }
    }

    this.doMatch()
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

  doMatch() {
    if (!this.data.typeA || !this.data.typeB) return
    const result = calculateMatch(this.data.typeA.code, this.data.typeB.code)
    this.setData({ match: result })
  },

  startQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  goHome() {
    wx.redirectTo({ url: '/pages/index/index' })
  },
})
