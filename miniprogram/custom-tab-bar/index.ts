const TABS = [
  { pagePath: '/pages/index/index', text: '测试', icon: '📝' },
  { pagePath: '/pages/types/types', text: '百科', icon: '🧩' },
  { pagePath: '/pages/match/match', text: '匹配', icon: '💞' },
  { pagePath: '/pages/history/history', text: '我的', icon: '👤' },
]

Component({
  data: {
    selected: 0,
    safeAreaBottom: 0,
    list: TABS,
  },

  lifetimes: {
    attached() {
      const app = getApp<IAppOption>()
      this.setData({ safeAreaBottom: app.globalData.safeAreaBottom })
      this.syncSelected()
    },
  },

  pageLifetimes: {
    show() {
      this.syncSelected()
    },
  },

  methods: {
    syncSelected() {
      const pages = getCurrentPages()
      if (!pages.length) return
      const route = '/' + pages[pages.length - 1].route
      const idx = TABS.findIndex(t => t.pagePath === route)
      if (idx >= 0 && idx !== this.data.selected) {
        this.setData({ selected: idx })
      }
    },

    onTap(e: WechatMiniprogram.TouchEvent) {
      const index = Number(e.currentTarget.dataset.index)
      const target = TABS[index]
      if (!target || index === this.data.selected) return
      wx.switchTab({ url: target.pagePath })
    },
  },
})
