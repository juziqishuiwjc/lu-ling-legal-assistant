// pages/date-calc/date-calc.js
Page({
  data: {
    currentTab: 0,
    startDate1: '',
    startDate2: '',
    startDate3: '',
    endDate3: '',
    days: '',
    months: '',
    result1: '',
    result2: '',
    result3: null
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

  /**
   * 起始日期改变（Tab1）
   */
  onStartDate1Change(e) {
    this.setData({
      startDate1: e.detail.value,
      result1: ''
    })
  },

  /**
   * 天数输入
   */
  onDaysInput(e) {
    this.setData({
      days: e.detail.value,
      result1: ''
    })
  },

  /**
   * 起始日期改变（Tab2）
   */
  onStartDate2Change(e) {
    this.setData({
      startDate2: e.detail.value,
      result2: ''
    })
  },

  /**
   * 月数输入
   */
  onMonthsInput(e) {
    this.setData({
      months: e.detail.value,
      result2: ''
    })
  },

  /**
   * 起始日期改变（Tab3）
   */
  onStartDate3Change(e) {
    this.setData({
      startDate3: e.detail.value,
      result3: null
    })
  },

  /**
   * 结束日期改变
   */
  onEndDate3Change(e) {
    this.setData({
      endDate3: e.detail.value,
      result3: null
    })
  },

  /**
   * 计算天数加减
   */
  calculateDays() {
    const startDate = this.data.startDate1
    const days = parseInt(this.data.days)

    if (!startDate) {
      wx.showToast({
        title: '请选择起始日期',
        icon: 'none'
      })
      return
    }

    if (isNaN(days)) {
      wx.showToast({
        title: '请输入有效的天数',
        icon: 'none'
      })
      return
    }

    const date = new Date(startDate)
    date.setDate(date.getDate() + days)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const result = `${year}-${month}-${day}`

    this.setData({
      result1: result
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 计算月数加减
   */
  calculateMonths() {
    const startDate = this.data.startDate2
    const months = parseInt(this.data.months)

    if (!startDate) {
      wx.showToast({
        title: '请选择起始日期',
        icon: 'none'
      })
      return
    }

    if (isNaN(months)) {
      wx.showToast({
        title: '请输入有效的月数',
        icon: 'none'
      })
      return
    }

    const date = new Date(startDate)
    date.setMonth(date.getMonth() + months)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const result = `${year}-${month}-${day}`

    this.setData({
      result2: result
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 计算间隔
   */
  calculateInterval() {
    const startDate = this.data.startDate3
    const endDate = this.data.endDate3

    if (!startDate) {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'none'
      })
      return
    }

    if (!endDate) {
      wx.showToast({
        title: '请选择结束日期',
        icon: 'none'
      })
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // 计算天数差
    const timeDiff = end.getTime() - start.getTime()
    const daysDiff = Math.abs(Math.ceil(timeDiff / (1000 * 3600 * 24)))

    // 计算月份差
    let monthsDiff = (end.getFullYear() - start.getFullYear()) * 12
    monthsDiff -= start.getMonth()
    monthsDiff += end.getMonth()

    // 计算年份差
    const yearsDiff = Math.floor(monthsDiff / 12)

    this.setData({
      result3: {
        days: daysDiff,
        months: monthsDiff,
        years: yearsDiff
      }
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  onLoad() {
    // 设置默认日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    this.setData({
      startDate1: todayStr,
      startDate2: todayStr,
      startDate3: todayStr
    })
  }
})
