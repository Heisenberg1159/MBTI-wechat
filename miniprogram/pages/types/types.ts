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
    wx.redirectTo({
      url: `/pages/type-detail/type-detail?code=${code}`,
    })
  },

  goMatch() {
    wx.navigateTo({ url: '/pages/match/match' })
  },

  goHome() {
    wx.redirectTo({ url: '/pages/index/index' })
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
