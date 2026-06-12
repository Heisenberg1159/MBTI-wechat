App<IAppOption>({
  onLaunch() {
    this.readWindowMetrics()
  },

  readWindowMetrics() {
    try {
      const windowInfo = wx.getWindowInfo()
      this.globalData.statusBarHeight = windowInfo.statusBarHeight
      this.globalData.windowWidth = windowInfo.windowWidth
      this.globalData.windowHeight = windowInfo.windowHeight
      this.globalData.pixelRatio = windowInfo.pixelRatio || 2
      // 底部安全区（全面屏手机的小黑条）
      const bottom = windowInfo.screenHeight - windowInfo.safeArea.bottom
      this.globalData.safeAreaBottom = bottom > 0 ? bottom : 0
    } catch (_e) {
      const res = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = res.statusBarHeight
      this.globalData.windowWidth = res.windowWidth
      this.globalData.windowHeight = res.windowHeight
      this.globalData.pixelRatio = res.pixelRatio || 2
      this.globalData.safeAreaBottom = 0
    }
  },

  globalData: {
    statusBarHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
    pixelRatio: 2,
    safeAreaBottom: 0,
    // 从结果页/详情页跳转匹配 tab 时暂存预选类型（switchTab 无法带参）
    pendingMatchCode: '',
  },
})
