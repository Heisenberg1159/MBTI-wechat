import types from '../../data/types'
import type { MBTIType } from '../../data/types'
import type { MBTIResult } from '../../utils/scorer'

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
const CARD_H = 920
const PADDING = 44

Page({
  data: {
    cardReady: false,
    statusBarHeight: 0,
  },

  typeData: null as MBTIType | null,
  result: null as MBTIResult | null,
  canvas: null as any,

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    this.setData({ statusBarHeight: app.globalData.statusBarHeight })

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
    } catch (_e) {
      this.showError()
    }
  },

  onReady() {
    // 此时 canvas 已渲染（不再被 wx:if 隐藏），可安全初始化
    if (this.typeData && this.result) {
      this.initCanvas()
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#shareCanvas')
      .fields({ node: true, size: true })
      .exec((res: any[]) => {
        if (!res[0] || !res[0].node) {
          wx.showToast({ title: '生成失败，请重试', icon: 'none' })
          return
        }
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const app = getApp<IAppOption>()
        const dpr = app.globalData.pixelRatio || 2
        canvas.width = CARD_W * dpr
        canvas.height = CARD_H * dpr
        ctx.scale(dpr, dpr)
        this.canvas = canvas
        this.drawCard(ctx)
      })
  },

  drawCard(ctx: any) {
    const type = this.typeData!
    const result = this.result!

    // 卡片底
    ctx.fillStyle = '#FFFFFF'
    this.roundRect(ctx, 0, 0, CARD_W, CARD_H, 28)
    ctx.fill()

    // 顶部渐变头
    const headerH = 280
    const gradient = ctx.createLinearGradient(0, 0, CARD_W, headerH)
    gradient.addColorStop(0, type.color)
    gradient.addColorStop(1, this.lightenColor(type.color, 0.45))
    ctx.fillStyle = gradient
    this.roundRectTop(ctx, 0, 0, CARD_W, headerH, 28)
    ctx.fill()

    // Emoji 圆底
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    ctx.beginPath()
    ctx.arc(CARD_W / 2, 104, 56, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '52px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(type.emoji, CARD_W / 2, 104)

    // Type code
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 58px -apple-system, sans-serif'
    ctx.fillText(type.code, CARD_W / 2, 200)

    // 名称 + 标语
    ctx.fillStyle = '#1D1D1F'
    ctx.font = 'bold 34px -apple-system, sans-serif'
    ctx.fillText(type.name, CARD_W / 2, headerH + 44)

    ctx.fillStyle = '#86868B'
    ctx.font = '23px -apple-system, sans-serif'
    ctx.fillText(type.tagline, CARD_W / 2, headerH + 84)

    // 特质标签（药丸）
    let y = headerH + 130
    this.drawTraitPills(ctx, type, y)

    // 四维倾向
    y = headerH + 200
    ctx.fillStyle = '#86868B'
    ctx.font = '21px -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('四维倾向', PADDING, y)
    y += 38

    const dims = DIM_ORDER.map(key => {
      const score = result.scores[key]
      const meta = DIM_META[key]
      const total = score.left + score.right
      const leftPct = total > 0 ? Math.round((score.left / total) * 100) : 50
      return { ...meta, leftPct }
    })

    for (const dim of dims) {
      ctx.fillStyle = dim.leftColor
      ctx.font = 'bold 21px -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(dim.leftCode + ' ' + dim.leftName, PADDING, y)

      ctx.fillStyle = dim.rightColor
      ctx.textAlign = 'right'
      ctx.fillText(dim.rightCode + ' ' + dim.rightName, CARD_W - PADDING, y)

      y += 26
      const trackY = y
      const trackW = CARD_W - PADDING * 2
      ctx.fillStyle = '#EBEBF0'
      this.roundRect(ctx, PADDING, trackY, trackW, 10, 5)
      ctx.fill()

      const fillW = (dim.leftPct / 100) * trackW
      const fillGrad = ctx.createLinearGradient(PADDING, 0, PADDING + trackW, 0)
      fillGrad.addColorStop(0, dim.leftColor)
      fillGrad.addColorStop(1, dim.rightColor)
      ctx.fillStyle = fillGrad
      this.roundRect(ctx, PADDING, trackY, Math.max(fillW, 10), 10, 5)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(PADDING + Math.max(Math.min(fillW, trackW), 0), trackY + 5, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = dim.leftPct >= 50 ? dim.leftColor : dim.rightColor
      ctx.lineWidth = 3
      ctx.stroke()

      y += 42
    }

    // 分割线
    y += 8
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PADDING, y)
    ctx.lineTo(CARD_W - PADDING, y)
    ctx.stroke()

    // Footer
    y += 46
    ctx.fillStyle = '#1D1D1F'
    ctx.font = 'bold 25px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('测测你的 MBTI 性格类型', CARD_W / 2, y)

    y += 34
    ctx.fillStyle = '#AEAEB2'
    ctx.font = '20px -apple-system, sans-serif'
    ctx.fillText('微信搜索「MBTI 测试」小程序', CARD_W / 2, y)

    this.setData({ cardReady: true })
  },

  drawTraitPills(ctx: any, type: MBTIType, y: number) {
    ctx.font = '20px -apple-system, sans-serif'
    const padX = 18
    const gap = 12
    const h = 38
    let pills = type.traits.slice(0, 4)

    const measure = (arr: string[]) => {
      const widths = arr.map(t => ctx.measureText(t).width + padX * 2)
      const total = widths.reduce((a, b) => a + b, 0) + gap * (arr.length - 1)
      return { widths, total }
    }

    let { widths, total } = measure(pills)
    while (total > CARD_W - PADDING * 2 && pills.length > 1) {
      pills = pills.slice(0, pills.length - 1)
      const m = measure(pills)
      widths = m.widths
      total = m.total
    }

    let x = (CARD_W - total) / 2
    const soft = this.hexToRgba(type.color, 0.1)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < pills.length; i++) {
      const w = widths[i]
      ctx.fillStyle = soft
      this.roundRect(ctx, x, y - h / 2, w, h, h / 2)
      ctx.fill()
      ctx.fillStyle = type.color
      ctx.fillText(pills[i], x + padX, y + 1)
      x += w + gap
    }
    ctx.textBaseline = 'alphabetic'
  },

  saveToAlbum() {
    if (!this.canvas) {
      wx.showToast({ title: '卡片尚未生成', icon: 'none' })
      return
    }
    wx.canvasToTempFilePath({
      canvas: this.canvas,
      x: 0,
      y: 0,
      width: CARD_W,
      height: CARD_H,
      destWidth: CARD_W * 2,
      destHeight: CARD_H * 2,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
          fail: () => wx.showToast({ title: '保存失败，请重试', icon: 'none' }),
        })
      },
      fail: () => wx.showToast({ title: '生成图片失败', icon: 'none' }),
    })
  },

  roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
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

  roundRectTop(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  },

  hexToRgba(hex: string, alpha: number): string {
    const v = hex.replace('#', '')
    if (v.length !== 6) return `rgba(0,122,255,${alpha})`
    const r = parseInt(v.slice(0, 2), 16)
    const g = parseInt(v.slice(2, 4), 16)
    const b = parseInt(v.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${alpha})`
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
    setTimeout(() => wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/index/index' }) }), 1500)
  },

  onShareAppMessage() {
    const code = this.typeData ? `我是 ${this.typeData.code} ${this.typeData.name}` : '我的 MBTI 性格类型'
    const payload = this.result ? encodeURIComponent(JSON.stringify(this.result)) : ''
    return {
      title: `${code}，你也来测测`,
      path: payload ? `/pages/result/result?data=${payload}&from=share` : '/pages/index/index',
    }
  },
})
