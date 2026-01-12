// pages/annual-leave/annual-leave.js
Page({
  data: {
    workYears: '',
    workDays: '365',
    unspentDays: '',
    dailyWage: '',
    resignOptions: ['否', '是'],
    isResigned: 0,
    result: null
  },

  /**
   * 工作年限输入
   */
  onWorkYearsInput(e) {
    this.setData({
      workYears: e.detail.value,
      result: null
    })
  },

  /**
   * 在职天数输入
   */
  onWorkDaysInput(e) {
    this.setData({
      workDays: e.detail.value,
      result: null
    })
  },

  /**
   * 未休年假天数输入
   */
  onUnspentDaysInput(e) {
    this.setData({
      unspentDays: e.detail.value,
      result: null
    })
  },

  /**
   * 日工资输入
   */
  onDailyWageInput(e) {
    this.setData({
      dailyWage: e.detail.value,
      result: null
    })
  },

  /**
   * 是否离职改变
   */
  onResignChange(e) {
    this.setData({
      isResigned: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 计算年假
   */
  calculate() {
    const workYears = parseFloat(this.data.workYears)
    const workDays = parseFloat(this.data.workDays) || 365
    const unspentDays = this.data.unspentDays === '' ? null : parseFloat(this.data.unspentDays)
    const dailyWage = parseFloat(this.data.dailyWage)

    // 验证输入
    if (!this.data.workYears || this.data.workYears.trim() === '') {
      wx.showToast({
        title: '请输入累计工作年限',
        icon: 'none'
      })
      return
    }

    if (isNaN(workYears) || workYears < 0) {
      wx.showToast({
        title: '请输入有效的工作年限',
        icon: 'none'
      })
      return
    }

    if (!this.data.dailyWage || this.data.dailyWage.trim() === '') {
      wx.showToast({
        title: '请输入日工资',
        icon: 'none'
      })
      return
    }

    if (isNaN(dailyWage) || dailyWage <= 0) {
      wx.showToast({
        title: '请输入有效的日工资',
        icon: 'none'
      })
      return
    }

    // 计算法定年假天数
    let legalDays = 0
    if (workYears < 1) {
      legalDays = 0
    } else if (workYears < 10) {
      legalDays = 5
    } else if (workYears < 20) {
      legalDays = 10
    } else {
      legalDays = 15
    }

    // 计算本年度享有年假（新入职折算）
    let entitledDays = legalDays
    if (workDays < 365) {
      entitledDays = Math.floor((workDays / 365) * legalDays)
    }

    // 确定未休年假天数
    let finalUnspentDays = unspentDays !== null ? unspentDays : entitledDays

    // 计算应支付的未休年假工资（300%日工资，其中100%是正常工资，额外支付200%）
    const compensation = dailyWage * finalUnspentDays * 2 // 额外200%

    this.setData({
      result: {
        legalDays: legalDays,
        entitledDays: entitledDays,
        compensation: compensation.toFixed(2),
        formula: `日工资${dailyWage}元 × 未休年假${finalUnspentDays}天 × 200% = ${compensation.toFixed(2)}元（额外支付的200%，不含正常工资）`
      }
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  }
})
