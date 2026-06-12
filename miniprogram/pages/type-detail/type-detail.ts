import types from '../../data/types'
import type { MBTIType } from '../../data/types'

interface CompatibleItem {
  code: string
  name: string
  emoji: string
  color: string
  softColor: string
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

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  if (value.length !== 6) return `rgba(0, 122, 255, ${alpha})`
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

Page({
  data: {
    typeData: EMPTY_TYPE,
    compatibleList: [] as CompatibleItem[],
    themeSoftColor: 'rgba(0, 122, 255, 0.08)',
    themeBorderColor: 'rgba(0, 122, 255, 0.18)',
    navTitle: '',
    statusBarHeight: 0,
  },

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })

    const code = options.code as string
    const typeData = types.find(t => t.code === code)

    if (!typeData) {
      wx.showToast({ title: '类型未找到', icon: 'none' })
      wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/types/types' }) })
      return
    }

    this.setData({
      typeData,
      themeSoftColor: hexToRgba(typeData.color, 0.08),
      themeBorderColor: hexToRgba(typeData.color, 0.18),
      navTitle: `${typeData.code} ${typeData.name}`,
    })

    // 构造兼容类型列表
    const compatibleList = typeData.compatible
      .map(c => types.find(t => t.code === c))
      .filter((item): item is MBTIType => Boolean(item))
      .map(item => ({
        code: item.code,
        name: item.name,
        emoji: item.emoji,
        color: item.color,
        softColor: hexToRgba(item.color, 0.08),
      }))
    this.setData({ compatibleList })
  },

  viewCompatible(e: WechatMiniprogram.TouchEvent) {
    const code = e.currentTarget.dataset.code as string
    // 用 redirectTo 替换当前详情页，避免反复点击堆叠页面栈
    wx.redirectTo({ url: `/pages/type-detail/type-detail?code=${code}` })
  },

  startQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz?version=full' })
  },

  goMatch() {
    const app = getApp<IAppOption>()
    app.globalData.pendingMatchCode = this.data.typeData.code
    wx.switchTab({ url: '/pages/match/match' })
  },

  onShareAppMessage() {
    const t = this.data.typeData
    return {
      title: t.code ? `${t.code} ${t.name} · ${t.tagline}` : 'MBTI 16 型人格百科',
      path: '/pages/types/types',
    }
  },
})
