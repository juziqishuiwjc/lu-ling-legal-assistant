// pages/interest-penalty/interest-penalty.js
Page({
  data: {
    currentTab: 0,
    // 违约金
    contractAmount: '',
    penaltyRate: '',
    penaltyResult: '',
    // 资金占用费
    occupyAmount: '',
    occupyRate: '',
    occupyDays: '',
    occupyResult: '',
    // 逾期利息
    overdueAmount: '',
    overdueRate: '',
    overdueDays: '',
    overdueResult: '',
    overdueTotal: ''
  },

  /**
   * 切换Tab
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      currentTab: index
    })
  },

  // 违约金输入
  onContractAmountInput(e) {
    this.setData({ contractAmount: e.detail.value, penaltyResult: '' })
  },

  onPenaltyRateInput(e) {
    this.setData({ penaltyRate: e.detail.value, penaltyResult: '' })
  },

  /**
   * 计算违约金
   */
  calculatePenalty() {
    const amount = parseFloat(this.data.contractAmount)
    const rate = parseFloat(this.data.penaltyRate)

    if (!this.data.contractAmount || !this.data.penaltyRate) {
      wx.showToast({ title: '请输入完整信息', icon: 'none' })
      return
    }

    if (isNaN(amount) || isNaN(rate)) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' })
      return
    }

    const penalty = amount * (rate / 100)
    this.setData({
      penaltyResult: penalty.toFixed(2)
    })

    wx.showToast({ title: '计算完成', icon: 'success' })
  },

  // 资金占用费输入
  onOccupyAmountInput(e) {
    this.setData({ occupyAmount: e.detail.value, occupyResult: '' })
  },

  onOccupyRateInput(e) {
    this.setData({ occupyRate: e.detail.value, occupyResult: '' })
  },

  onOccupyDaysInput(e) {
    this.setData({ occupyDays: e.detail.value, occupyResult: '' })
  },

  /**
   * 计算资金占用费
   */
  calculateOccupy() {
    const amount = parseFloat(this.data.occupyAmount)
    const rate = parseFloat(this.data.occupyRate)
    const days = parseFloat(this.data.occupyDays)

    if (!this.data.occupyAmount || !this.data.occupyRate || !this.data.occupyDays) {
      wx.showToast({ title: '请输入完整信息', icon: 'none' })
      return
    }

    if (isNaN(amount) || isNaN(rate) || isNaN(days)) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' })
      return
    }

    const fee = amount * (rate / 100) / 365 * days
    this.setData({
      occupyResult: fee.toFixed(2)
    })

    wx.showToast({ title: '计算完成', icon: 'success' })
  },

  // 逾期利息输入
  onOverdueAmountInput(e) {
    this.setData({ overdueAmount: e.detail.value, overdueResult: '' })
  },

  onOverdueRateInput(e) {
    this.setData({ overdueRate: e.detail.value, overdueResult: '' })
  },

  onOverdueDaysInput(e) {
    this.setData({ overdueDays: e.detail.value, overdueResult: '' })
  },

  /**
   * 计算逾期利息
   */
  calculateOverdue() {
    const amount = parseFloat(this.data.overdueAmount)
    const rate = parseFloat(this.data.overdueRate)
    const days = parseFloat(this.data.overdueDays)

    if (!this.data.overdueAmount || !this.data.overdueRate || !this.data.overdueDays) {
      wx.showToast({ title: '请输入完整信息', icon: 'none' })
      return
    }

    if (isNaN(amount) || isNaN(rate) || isNaN(days)) {
      wx.showToast({ title: '请输入有效的数值', icon: 'none' })
      return
    }

    const interest = amount * (rate / 100) / 365 * days
    const total = amount + interest

    this.setData({
      overdueResult: interest.toFixed(2),
      overdueTotal: total.toFixed(2)
    })

    wx.showToast({ title: '计算完成', icon: 'success' })
  }
})
