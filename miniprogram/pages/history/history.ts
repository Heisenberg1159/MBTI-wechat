import types from '../../data/types'

Page({
  data: {
    list: [] as Array<{
      typeCode: string
      name: string
      color: string
      dateStr: string
      timestamp: number
    }>,
    statusBarHeight: 0,
  },

  onLoad() {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
  },

  onShow() {
    this.loadHistory()
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('mbti_history') || []
      const list = history.map((item: any) => {
        const t = types.find(tp => tp.code === item.typeCode)
        const d = new Date(item.timestamp)
        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
        return {
          typeCode: item.typeCode,
          name: t ? t.name : '',
          color: t ? t.color : '#007AFF',
          dateStr,
          timestamp: item.timestamp,
        }
      })
      this.setData({ list })
    } catch (_e) {
      // ignore
    }
  },

  goQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  goHome() {
    wx.redirectTo({ url: '/pages/index/index' })
  },

  viewDetail(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index as number
    const item = this.data.list[index]
    if (!item) return

    const history = wx.getStorageSync('mbti_history') || []
    const record = history[index]
    if (!record) return

    const payload = encodeURIComponent(JSON.stringify(record))
    wx.redirectTo({ url: `/pages/result/result?data=${payload}&from=history` })
  },
})
