/**
 * 顶部导航条 — 用于非 tabBar 页面（结果 / 详情 / 分享卡片）。
 * 自带状态栏高度占位，左侧返回，右侧可选「首页」按钮。
 */
Component({
  properties: {
    // 是否显示返回按钮（默认显示）
    showBack: { type: Boolean, value: true },
    // 是否显示首页按钮（默认显示）
    showHome: { type: Boolean, value: true },
    // 居中标题（可选）
    title: { type: String, value: '' },
  },

  data: {
    statusBarHeight: 0,
  },

  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      this.setData({ statusBarHeight: app.globalData.statusBarHeight })
    },
  },

  methods: {
    onBack() {
      wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) })
    },
    onHome() {
      wx.switchTab({ url: '/pages/index/index' })
    },
  },
})
