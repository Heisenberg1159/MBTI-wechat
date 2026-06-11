import types from '../../data/types'
import type { MBTIType } from '../../data/types'
import type { MBTIResult, DimensionScore } from '../../utils/scorer'

type DimensionKey = 'EI' | 'SN' | 'TF' | 'JP'

interface DimensionMeta {
  title: string
  leftCode: string
  rightCode: string
  leftName: string
  rightName: string
  leftColor: string
  rightColor: string
}

const DIM_ORDER: DimensionKey[] = ['EI', 'SN', 'TF', 'JP']

const DIM_META: Record<DimensionKey, DimensionMeta> = {
  EI: { title: '能量方向', leftCode: 'E', rightCode: 'I', leftName: '外向', rightName: '内向', leftColor: '#007AFF', rightColor: '#AF52DE' },
  SN: { title: '信息获取', leftCode: 'S', rightCode: 'N', leftName: '感觉', rightName: '直觉', leftColor: '#34C759', rightColor: '#007AFF' },
  TF: { title: '决策方式', leftCode: 'T', rightCode: 'F', leftName: '思维', rightName: '情感', leftColor: '#FF9500', rightColor: '#34C759' },
  JP: { title: '生活方式', leftCode: 'J', rightCode: 'P', leftName: '判断', rightName: '知觉', leftColor: '#AF52DE', rightColor: '#FF9500' },
}

const CARD_W = 630
const CARD_H = 900
const PADDING = 40

Page({
  data: {
    cardReady: false,
    statusBarHeight: 0,
  },

  typeData: null as MBTIType | null,
  result: null as MBTIResult | null,
  canvas: null as WechatMiniprogram.CanvasContext | null,

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })

    // 解析 result data
    const raw = options.data
    if (!raw) {
      this.showError()
      return
    }
    try {
      const result = JSON.parse(decodeURIComponent(raw)) as MBTIResult
      const typeData = types.find(t => t.code === result.typeCode)
      if (!typeData) { this.showError(); return }
      this.result = result
      this.typeData = typeData
      this.initCanvas()
    } catch (_e) {
      this.showError()
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#shareCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          // 降级到旧 API
          const ctx = wx.createCanvasContext('shareCanvas')
          this.canvas = ctx as unknown as WechatMiniprogram.CanvasContext
          this.drawCard(ctx as unknown as WechatMiniprogram.CanvasContext)
          return
        }
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = CARD_W * dpr
        canvas.height = CARD_H * dpr
        ctx.scale(dpr, dpr)
        this.canvas = ctx
        this.drawCard(ctx)
      })
  },

  drawCard(ctx: WechatMiniprogram.CanvasContext) {
    const type = this.typeData!
    const result = this.result!

    // 背景
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    this.roundRect(ctx, 0, 0, CARD_W, CARD_H, 24)
    ctx.fill()

    // 顶部色块
    const gradient = ctx.createLinearGradient(0, 0, CARD_W, 0)
    gradient.addColorStop(0, type.color)
    gradient.addColorStop(1, this.lightenColor(type.color, 0.6))
    ctx.fillStyle = gradient
    ctx.beginPath()
    this.roundRectTop(ctx, 0, 0, CARD_W, 220, 24)
    ctx.fill()

    // Emoji 圆底
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.beginPath()
    ctx.arc(CARD_W / 2, 110, 52, 0, Math.PI * 2)
    ctx.fill()

    // Emoji
    ctx.font = '48px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(type.emoji, CARD_W / 2, 110)

    // Type code
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 52px -apple-system, sans-serif'
    ctx.fillText(type.code, CARD_W / 2, 180)

    // Type name + tagline (below gradient area)
    ctx.fillStyle = '#1D1D1F'
    ctx.font = 'bold 30px -apple-system, sans-serif'
    ctx.fillText(type.name, CARD_W / 2, 264)

    ctx.fillStyle = '#86868B'
    ctx.font = '22px -apple-system, sans-serif'
    ctx.fillText(type.tagline, CARD_W / 2, 296)

    // 维度条
    let y = 340
    const dims = DIM_ORDER.map(key => {
      const score = result.scores[key]
      const meta = DIM_META[key]
      const total = score.left + score.right
      const leftPct = total > 0 ? Math.round((score.left / total) * 100) : 50
      return { ...meta, leftPct, leftScore: score.left, rightScore: score.right }
    })

    // Section title
    ctx.fillStyle = '#86868B'
    ctx.font = '20px -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('四维倾向', PADDING, y)
    y += 36

    for (const dim of dims) {
      // Labels
      ctx.fillStyle = dim.leftColor
      ctx.font = 'bold 20px -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(dim.leftCode + ' ' + dim.leftName, PADDING, y)

      ctx.fillStyle = dim.rightColor
      ctx.textAlign = 'right'
      ctx.fillText(dim.rightCode + ' ' + dim.rightName, CARD_W - PADDING, y)

      y += 28

      // Track
      const trackY = y
      const trackW = CARD_W - PADDING * 2
      ctx.fillStyle = '#EBEBF0'
      ctx.beginPath()
      this.roundRect(ctx, PADDING, trackY, trackW, 10, 5)
      ctx.fill()

      // Fill
      const fillW = (dim.leftPct / 100) * trackW
      const fillGrad = ctx.createLinearGradient(PADDING, 0, PADDING + trackW, 0)
      fillGrad.addColorStop(0, dim.leftColor)
      fillGrad.addColorStop(1, dim.rightColor)
      ctx.fillStyle = fillGrad
      ctx.beginPath()
      this.roundRect(ctx, PADDING, trackY, fillW, 10, 5)
      ctx.fill()

      // Dot
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(PADDING + fillW, trackY + 5, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = dim.leftPct >= 50 ? dim.leftColor : dim.rightColor
      ctx.lineWidth = 2.5
      ctx.stroke()

      y += 40
    }

    // 分割线
    y += 10
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(PADDING, y)
    ctx.lineTo(CARD_W - PADDING, y)
    ctx.stroke()

    // Footer
    y += 40
    ctx.fillStyle = '#1D1D1F'
    ctx.font = 'bold 24px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('扫码测测你的人格', CARD_W / 2, y)

    y += 34
    ctx.fillStyle = '#86868B'
    ctx.font = '20px -apple-system, sans-serif'
    ctx.fillText('微信搜索「MBTI 测试」小程序', CARD_W / 2, y)

    // 绘制完成
    this.setData({ cardReady: true })

    // 延迟 draw 确保渲染
    if (typeof (ctx as any).draw === 'function') {
      (ctx as any).draw()
    }
  },

  saveToAlbum() {
    wx.canvasToTempFilePath({
      canvas: (this.canvas as any),
      x: 0,
      y: 0,
      width: CARD_W,
      height: CARD_H,
      destWidth: CARD_W * 2,
      destHeight: CARD_H * 2,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({ title: '已保存到相册', icon: 'success' })
          },
          fail: () => {
            wx.showToast({ title: '保存失败，请重试', icon: 'none' })
          },
        })
      },
      fail: () => {
        wx.showToast({ title: '生成图片失败', icon: 'none' })
      },
    })
  },

  roundRect(ctx: WechatMiniprogram.CanvasContext, x: number, y: number, w: number, h: number, r: number) {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  },

  roundRectTop(ctx: WechatMiniprogram.CanvasContext, x: number, y: number, w: number, h: number, r: number) {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  },

  lightenColor(hex: string, factor: number): string {
    const v = hex.replace('#', '')
    const r = Math.min(255, Math.round(parseInt(v.slice(0, 2), 16) + (255 - parseInt(v.slice(0, 2), 16)) * factor))
    const g = Math.min(255, Math.round(parseInt(v.slice(2, 4), 16) + (255 - parseInt(v.slice(2, 4), 16)) * factor))
    const b = Math.min(255, Math.round(parseInt(v.slice(4, 6), 16) + (255 - parseInt(v.slice(4, 6), 16)) * factor))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  },

  showError() {
    wx.showToast({ title: '加载失败', icon: 'none' })
    setTimeout(() => wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) }), 1500)
  },

  goHome() {
    wx.redirectTo({ url: '/pages/index/index' })
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/index/index' }) })
  },
})
