import types from '../../data/types'

Page({
  data: {
    types: types.map(t => ({
      ...t,
      softColor: hexToRgba(t.color, 0.08),
    })),
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
  },

  viewDetail(e: WechatMiniprogram.TouchEvent) {
    const code = e.currentTarget.dataset.code as string
    wx.navigateTo({ url: `/pages/type-detail/type-detail?code=${code}` })
  },

  onShareAppMessage() {
    return { title: 'MBTI 16 型人格百科，看看你是哪一种', path: '/pages/types/types' }
  },

  onShareTimeline() {
    return { title: 'MBTI 16 型人格百科' }
  },
})

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  if (value.length !== 6) return `rgba(0, 122, 255, ${alpha})`
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
