import { quickQuestions, fullQuestions } from '../../data/questions'
import { calculateResult } from '../../utils/scorer'
import type { Question } from '../../data/questions'

const DIMENSION_LABELS: Record<string, string> = {
  EI: '能量方向',
  SN: '信息获取',
  TF: '决策方式',
  JP: '生活方式',
}

Page({
  data: {
    questions: [] as Question[],
    currentIndex: 0,
    total: 0,
    progress: 0,
    currentQuestion: {} as Question,
    dimensionLabel: '',
    selectedOption: '',
    answers: {} as Record<number, string>,
    animating: false,
    selecting: false,
    direction: 'forward' as 'forward' | 'backward',
    statusBarHeight: 0,
    showConfirm: false,
  },

  onLoad(options: WechatMiniprogram.PageLoadOption) {
    const app = getApp<IAppOption>()
    const version = options.version === 'full' ? 'full' : 'quick'
    const questions = version === 'full' ? fullQuestions : quickQuestions

    this.setData({
      questions,
      total: questions.length,
      currentQuestion: questions[0],
      dimensionLabel: DIMENSION_LABELS[questions[0].dimension],
      progress: (1 / questions.length) * 100,
      statusBarHeight: app.globalData.statusBarHeight,
    })
  },

  selectOption(e: WechatMiniprogram.TouchEvent) {
    // 防止动画期间重复点击
    if (this.data.selecting || this.data.animating) return

    const option = e.currentTarget.dataset.option as string
    const q = this.data.currentQuestion as Question
    const value = option === 'A' ? q.optionA.value : q.optionB.value
    const answers = { ...this.data.answers, [q.id]: value }

    // 阶段 1：显示选中动画（毛玻璃弹跳 + 指示器脉冲）
    this.setData({ selectedOption: option, answers, selecting: true })

    // 阶段 2：动画播完后触发切题
    setTimeout(() => {
      this.setData({ animating: true, direction: 'forward' })

      setTimeout(() => {
        if (this.data.currentIndex < this.data.total - 1) {
          this.nextQuestion(answers)
        } else {
          this.finishQuiz(answers)
        }
      }, 250)
    }, 600)
  },

  nextQuestion(answers: Record<number, string>) {
    const nextIndex = this.data.currentIndex + 1
    const nextQ = this.data.questions[nextIndex]

    setTimeout(() => {
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: nextQ,
        dimensionLabel: DIMENSION_LABELS[nextQ.dimension],
        progress: ((nextIndex + 1) / this.data.total) * 100,
        selectedOption: answers[nextQ.id] ? (nextQ.optionA.value === answers[nextQ.id] ? 'A' : 'B') : '',
        animating: false,
        selecting: false,
      })
    }, 200)
  },

  goBack() {
    if (this.data.currentIndex === 0 || this.data.animating) return
    const prevIndex = this.data.currentIndex - 1
    const prevQ = this.data.questions[prevIndex]
    const prevAnswer = this.data.answers[prevQ.id]
    const prevOption = prevAnswer ? (prevQ.optionA.value === prevAnswer ? 'A' : 'B') : ''

    this.setData({ animating: true, direction: 'backward' })

    setTimeout(() => {
      this.setData({
        currentIndex: prevIndex,
        currentQuestion: prevQ,
        dimensionLabel: DIMENSION_LABELS[prevQ.dimension],
        progress: ((prevIndex + 1) / this.data.total) * 100,
        selectedOption: prevOption,
        animating: false,
        selecting: false,
      })
    }, 200)
  },

  goHome() {
    this.setData({ showConfirm: true })
  },

  cancelExit() {
    this.setData({ showConfirm: false })
  },

  confirmExit() {
    this.setData({ showConfirm: false })
    wx.redirectTo({ url: '/pages/index/index' })
  },

  finishQuiz(answers: Record<number, string>) {
    const result = calculateResult(this.data.questions, answers)
    wx.setStorageSync('mbti_pending_result', result)
    wx.redirectTo({ url: '/pages/result/result?from=quiz' })
  },
})
