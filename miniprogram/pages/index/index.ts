Page({
  data: {
    statusBarHeight: 0,
    selectedVersion: 'full' as 'quick' | 'full',
    dimensions: [
      { key: 'EI', leftCode: 'E', leftName: '外向', rightCode: 'I', rightName: '内向', leftColor: '#007AFF', rightColor: '#AF52DE', gradient: 'linear-gradient(90deg, #007AFF, #AF52DE)' },
      { key: 'SN', leftCode: 'S', leftName: '感觉', rightCode: 'N', rightName: '直觉', leftColor: '#34C759', rightColor: '#007AFF', gradient: 'linear-gradient(90deg, #34C759, #007AFF)' },
      { key: 'TF', leftCode: 'T', leftName: '思维', rightCode: 'F', rightName: '情感', leftColor: '#FF9500', rightColor: '#34C759', gradient: 'linear-gradient(90deg, #FF9500, #34C759)' },
      { key: 'JP', leftCode: 'J', leftName: '判断', rightCode: 'P', rightName: '知觉', leftColor: '#AF52DE', rightColor: '#FF9500', gradient: 'linear-gradient(90deg, #AF52DE, #FF9500)' },
    ],
  },

  onLoad() {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })
  },

  selectVersion(e: WechatMiniprogram.TouchEvent) {
    const version = e.currentTarget.dataset.version as 'quick' | 'full'
    this.setData({ selectedVersion: version })
  },

  startQuiz() {
    const version = this.data.selectedVersion
    wx.navigateTo({ url: `/pages/quiz/quiz?version=${version}` })
  },

  viewTypes() {
    wx.navigateTo({ url: '/pages/types/types' })
  },
})
