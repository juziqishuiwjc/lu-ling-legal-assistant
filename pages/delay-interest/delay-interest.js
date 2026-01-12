// pages/delay-interest/delay-interest.js
Page({
  data: {
    amount: '', // 判决金额
    judgmentDate: '', // 判决确定日期
    paymentDate: '', // 实际履行日期
    result: null, // 利息结果
    totalAmount: null, // 合计金额
    delayDays: 0 // 迟延天数
  },

  /**
   * 判决金额输入
   */
  onAmountInput(e) {
    this.setData({
      amount: e.detail.value,
      result: null
    })
  },

  /**
   * 判决确定日期改变
   */
  onJudgmentDateChange(e) {
    this.setData({
      judgmentDate: e.detail.value,
      result: null
    })
  },

  /**
   * 实际履行日期改变
   */
  onPaymentDateChange(e) {
    this.setData({
      paymentDate: e.detail.value,
      result: null
    })
  },

  /**
   * 计算迟延履行利息
   */
  calculate() {
    const amount = parseFloat(this.data.amount)
    const judgmentDate = this.data.judgmentDate
    const paymentDate = this.data.paymentDate

    // 验证输入
    if (!this.data.amount || this.data.amount.trim() === '') {
      wx.showToast({
        title: '请输入判决金额',
        icon: 'none'
      })
      return
    }

    if (isNaN(amount) || amount <= 0) {
      wx.showToast({
        title: '请输入有效的金额',
        icon: 'none'
      })
      return
    }

    if (!judgmentDate) {
      wx.showToast({
        title: '请选择判决确定日期',
        icon: 'none'
      })
      return
    }

    if (!paymentDate) {
      wx.showToast({
        title: '请选择实际履行日期',
        icon: 'none'
      })
      return
    }

    // 计算迟延天数
    const delayDays = this.calculateDelayDays(judgmentDate, paymentDate)

    if (delayDays <= 0) {
      wx.showToast({
        title: '履行日期应晚于判决日期',
        icon: 'none'
      })
      return
    }

    // 计算利息：日万分之1.75
    // 年化利率 = 0.0175 * 365 = 6.375%
    const dailyRate = 0.000175 // 日利率
    const interest = amount * dailyRate * delayDays

    // 格式化结果
    const result = interest.toFixed(2)
    const totalAmount = (amount + interest).toFixed(2)

    this.setData({
      result: result,
      totalAmount: totalAmount,
      delayDays: delayDays
    })

    // 显示结果提示
    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 计算迟延天数
   */
  calculateDelayDays(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 计算天数差
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return daysDiff
  },

  onLoad() {
    // 设置默认日期（今天）
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    this.setData({
      paymentDate: todayStr
    })
  }
})
