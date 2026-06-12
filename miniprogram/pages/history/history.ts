import types from '../../data/types'

interface HistoryItem {
  typeCode: string
  name: string
  color: string
  emoji: string
  dateStr: string
  timestamp: number
}

interface Summary {
  total: number
  code: string
  name: string
  color: string
  emoji: string
  softColor: string
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
    list: [] as HistoryItem[],
    summary: null as Summary | null,
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
      const list: HistoryItem[] = history.map((item: any) => {
        const t = types.find(tp => tp.code === item.typeCode)
        const d = new Date(item.timestamp)
        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
        return {
          typeCode: item.typeCode,
          name: t ? t.name : '',
          color: t ? t.color : '#007AFF',
          emoji: t ? t.emoji : '🧠',
          dateStr,
          timestamp: item.timestamp,
        }
      })
      this.setData({ list, summary: this.buildSummary(list) })
    } catch (_e) {
      // ignore
    }
  },

  buildSummary(list: HistoryItem[]): Summary | null {
    if (list.length === 0) return null
    const counts: Record<string, number> = {}
    for (const item of list) {
      counts[item.typeCode] = (counts[item.typeCode] || 0) + 1
    }
    let topCode = list[0].typeCode
    let topCount = 0
    for (const code of Object.keys(counts)) {
      if (counts[code] > topCount) {
        topCount = counts[code]
        topCode = code
      }
    }
    const t = types.find(tp => tp.code === topCode)
    return {
      total: list.length,
      code: topCode,
      name: t ? t.name : '',
      color: t ? t.color : '#007AFF',
      emoji: t ? t.emoji : '🧠',
      softColor: hexToRgba(t ? t.color : '#007AFF', 0.1),
    }
  },

  goQuiz() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  clearHistory() {
    if (this.data.list.length === 0) return
    wx.showModal({
      title: '清空测试记录？',
      content: '所有历史记录将被删除，此操作不可恢复',
      confirmText: '清空',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (!res.confirm) return
        try {
          wx.removeStorageSync('mbti_history')
          wx.removeStorageSync('mbti_latest_result')
        } catch (_e) {
          // ignore
        }
        this.setData({ list: [], summary: null })
        wx.showToast({ title: '已清空', icon: 'success' })
      },
    })
  },

  viewDetail(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index as number
    const history = wx.getStorageSync('mbti_history') || []
    const record = history[index]
    if (!record) return
    const payload = encodeURIComponent(JSON.stringify(record))
    wx.navigateTo({ url: `/pages/result/result?data=${payload}&from=history` })
  },
})
