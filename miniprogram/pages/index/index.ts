import types from '../../data/types'

interface ResumeInfo {
  version: 'quick' | 'full'
  current: number
  total: number
}

interface LatestInfo {
  code: string
  name: string
  emoji: string
  color: string
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
    statusBarHeight: 0,
    selectedVersion: 'full' as 'quick' | 'full',
    resume: null as ResumeInfo | null,
    latest: null as LatestInfo | null,
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

  onShow() {
    this.refreshState()
  },

  refreshState() {
    let resume: ResumeInfo | null = null
    let latest: LatestInfo | null = null
    try {
      const progress = wx.getStorageSync('mbti_quiz_progress')
      if (progress && progress.version && progress.answers && typeof progress.currentIndex === 'number') {
        const total = progress.version === 'full' ? 60 : 28
        resume = { version: progress.version, current: progress.currentIndex + 1, total }
      }
      const record = wx.getStorageSync('mbti_latest_result')
      if (record && record.typeCode) {
        const t = types.find(tp => tp.code === record.typeCode)
        if (t) {
          latest = { code: t.code, name: t.name, emoji: t.emoji, color: t.color, softColor: hexToRgba(t.color, 0.1) }
        }
      }
    } catch (_e) {
      // ignore
    }
    this.setData({ resume, latest })
  },

  selectVersion(e: WechatMiniprogram.TouchEvent) {
    const version = e.currentTarget.dataset.version as 'quick' | 'full'
    this.setData({ selectedVersion: version })
  },

  startQuiz() {
    // 开始新测试，清除旧进度
    try { wx.removeStorageSync('mbti_quiz_progress') } catch (_e) { /* ignore */ }
    wx.navigateTo({ url: `/pages/quiz/quiz?version=${this.data.selectedVersion}` })
  },

  continueQuiz() {
    wx.navigateTo({ url: '/pages/quiz/quiz?resume=1' })
  },

  viewLatest() {
    wx.navigateTo({ url: '/pages/result/result' })
  },

  onShareAppMessage() {
    return {
      title: '测测你的 MBTI 性格类型，发现你的性格密码',
      path: '/pages/index/index',
    }
  },

  onShareTimeline() {
    return { title: '测测你的 MBTI 性格类型，发现你的性格密码' }
  },
})
