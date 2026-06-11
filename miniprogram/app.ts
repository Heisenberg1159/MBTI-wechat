App({
  onLaunch() {
    try {
      const windowInfo = wx.getWindowInfo()
      this.globalData.statusBarHeight = windowInfo.statusBarHeight
      this.globalData.windowWidth = windowInfo.windowWidth
      this.globalData.windowHeight = windowInfo.windowHeight
    } catch (_e) {
      const res = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = res.statusBarHeight
      this.globalData.windowWidth = res.windowWidth
      this.globalData.windowHeight = res.windowHeight
    }
  },

  globalData: {
    statusBarHeight: 0,
    windowWidth: 0,
    windowHeight: 0,
  },
})
