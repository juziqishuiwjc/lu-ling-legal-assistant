// pages/loan-interest/loan-interest.js
Page({
  data: {
    amount: '', // 借款金额
    interestRate: '', // 约定年利率
    lprRate: '13.8', // LPR的4倍 (3.45% * 4)
    startDate: '', // 借款日期
    endDate: '', // 还款日期
    methods: ['单利计算', '复利计算'],
    methodIndex: 0, // 计息方式
    result: null, // 利息结果
    totalAmount: null, // 本息合计
    loanDays: 0, // 借款天数
    loanYears: 0, // 借款年数
    appliedRate: 0, // 适用利率
    isOverRate: null, // 是否超过法定利率
    overRateMsg: '', // 超过利率提示
    legalMsg: '', // 合法利率提示
    legalInterest: 0, // 法律保护利息
    excessInterest: 0 // 超出部分利息
  },

  /**
   * 借款金额输入
   */
  onAmountInput(e) {
    this.setData({
      amount: e.detail.value,
      result: null
    })
  },

  /**
   * 年利率输入
   */
  onInterestRateInput(e) {
    this.setData({
      interestRate: e.detail.value,
      result: null
    })
  },

  /**
   * 借款日期改变
   */
  onStartDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      result: null
    })
  },

  /**
   * 还款日期改变
   */
  onEndDateChange(e) {
    this.setData({
      endDate: e.detail.value,
      result: null
    })
  },

  /**
   * 计息方式改变
   */
  onMethodChange(e) {
    this.setData({
      methodIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 计算利息
   */
  calculate() {
    const amount = parseFloat(this.data.amount)
    const interestRate = parseFloat(this.data.interestRate)
    const startDate = this.data.startDate
    const endDate = this.data.endDate

    // 验证输入
    if (!this.data.amount || this.data.amount.trim() === '') {
      wx.showToast({
        title: '请输入借款金额',
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

    if (!this.data.interestRate || this.data.interestRate.trim() === '') {
      wx.showToast({
        title: '请输入年利率',
        icon: 'none'
      })
      return
    }

    if (isNaN(interestRate) || interestRate < 0) {
      wx.showToast({
        title: '请输入有效的利率',
        icon: 'none'
      })
      return
    }

    if (!startDate) {
      wx.showToast({
        title: '请选择借款日期',
        icon: 'none'
      })
      return
    }

    if (!endDate) {
      wx.showToast({
        title: '请选择还款日期',
        icon: 'none'
      })
      return
    }

    // 计算借款天数
    const loanDays = this.calculateDays(startDate, endDate)

    if (loanDays <= 0) {
      wx.showToast({
        title: '还款日期应晚于借款日期',
        icon: 'none'
      })
      return
    }

    // 计算借款年数
    const loanYears = (loanDays / 365).toFixed(2)

    // 法定最高利率：LPR的4倍
    const maxRate = 13.8 // 3.45% * 4

    // 判断是否超过法定利率
    let appliedRate = interestRate
    let finalInterest = 0
    let isOverRate = false
    let legalInterest = 0
    let excessInterest = 0

    // 计算利息
    if (interestRate > maxRate) {
      // 超过法定利率
      isOverRate = true

      if (this.data.methodIndex === 0) {
        // 单利计算
        finalInterest = amount * (interestRate / 100) * (loanDays / 365)
        legalInterest = amount * (maxRate / 100) * (loanDays / 365)
      } else {
        // 复利计算 (本息合计 - 本金)
        const rate = interestRate / 100
        const years = loanDays / 365
        const total = amount * Math.pow(1 + rate, years)
        finalInterest = total - amount

        const legalRate = maxRate / 100
        const legalTotal = amount * Math.pow(1 + legalRate, years)
        legalInterest = legalTotal - amount
      }

      excessInterest = finalInterest - legalInterest
      appliedRate = interestRate

      this.setData({
        overRateMsg: `约定利率${interestRate}%超过法律保护上限${maxRate}%，超出部分不受法律保护`,
        legalMsg: '',
        isOverRate: true,
        legalInterest: legalInterest.toFixed(2),
        excessInterest: excessInterest.toFixed(2)
      })
    } else {
      // 未超过法定利率
      isOverRate = false

      if (this.data.methodIndex === 0) {
        // 单利计算
        finalInterest = amount * (interestRate / 100) * (loanDays / 365)
      } else {
        // 复利计算
        const rate = interestRate / 100
        const years = loanDays / 365
        const total = amount * Math.pow(1 + rate, years)
        finalInterest = total - amount
      }

      this.setData({
        overRateMsg: '',
        legalMsg: `约定利率${interestRate}%未超过法律保护上限${maxRate}%，完全受法律保护`,
        isOverRate: false
      })
    }

    // 格式化结果
    const result = finalInterest.toFixed(2)
    const totalAmount = (amount + finalInterest).toFixed(2)

    this.setData({
      result: result,
      totalAmount: totalAmount,
      loanDays: loanDays,
      loanYears: loanYears,
      appliedRate: appliedRate
    })

    // 显示结果提示
    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 计算天数差
   */
  calculateDays(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 计算天数差
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return daysDiff
  },

  onLoad() {
    // 设置默认日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    this.setData({
      endDate: todayStr
    })
  }
})
