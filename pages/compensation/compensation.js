// pages/compensation/compensation.js
Page({
  data: {
    types: ['经济补偿金', '赔偿金', '代通知金', '经济补偿金+代通知金', '赔偿金+代通知金'],
    typeIndex: 0,
    salary: '',
    years: '',
    months: '',
    illegalOptions: ['否', '是'],
    illegalIndex: 0,
    avgSalary: '',
    result: null
  },

  /**
   * 补偿类型改变
   */
  onTypeChange(e) {
    this.setData({
      typeIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 月工资输入
   */
  onSalaryInput(e) {
    this.setData({
      salary: e.detail.value,
      result: null
    })
  },

  /**
   * 工作年限输入
   */
  onYearsInput(e) {
    this.setData({
      years: e.detail.value,
      result: null
    })
  },

  /**
   * 剩余月份输入
   */
  onMonthsInput(e) {
    this.setData({
      months: e.detail.value,
      result: null
    })
  },

  /**
   * 是否违法解除改变
   */
  onIllegalChange(e) {
    this.setData({
      illegalIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 当地平均工资输入
   */
  onAvgSalaryInput(e) {
    this.setData({
      avgSalary: e.detail.value,
      result: null
    })
  },

  /**
   * 计算补偿金
   */
  calculate() {
    const salary = parseFloat(this.data.salary)
    const years = parseInt(this.data.years) || 0
    const months = parseInt(this.data.months) || 0
    const avgSalary = parseFloat(this.data.avgSalary) || 0
    const typeIndex = this.data.typeIndex

    // 验证输入
    if (!this.data.salary || this.data.salary.trim() === '') {
      wx.showToast({
        title: '请输入月工资',
        icon: 'none'
      })
      return
    }

    if (isNaN(salary) || salary <= 0) {
      wx.showToast({
        title: '请输入有效的工资',
        icon: 'none'
      })
      return
    }

    if (this.data.years === '' && this.data.months === '') {
      wx.showToast({
        title: '请输入工作年限',
        icon: 'none'
      })
      return
    }

    // 计算工作年限
    let totalYears = years
    if (months > 0) {
      if (months >= 6) {
        totalYears += 1
      } else {
        totalYears += 0.5
      }
    }

    // 判断是否需要封顶（高薪员工）
    let appliedSalary = salary
    let appliedYears = totalYears
    let isCapped = false

    if (avgSalary > 0 && salary >= avgSalary * 3) {
      // 工资高于平均工资3倍，需要封顶
      appliedSalary = avgSalary * 3
      appliedYears = Math.min(totalYears, 12)
      isCapped = true
    }

    // 计算经济补偿金
    const severancePay = appliedSalary * appliedYears

    // 计算赔偿金（2倍）
    const compensation = severancePay * 2

    // 计算代通知金
    const noticePay = salary

    // 根据类型计算最终金额
    let amount = 0
    let typeName = ''
    let formula = ''

    switch (typeIndex) {
      case 0: // 经济补偿金
        amount = severancePay
        typeName = '经济补偿金'
        formula = `${appliedSalary} × ${appliedYears} = ${severancePay.toFixed(2)}`
        break
      case 1: // 赔偿金
        amount = compensation
        typeName = '赔偿金'
        formula = `${appliedSalary} × ${appliedYears} × 2 = ${compensation.toFixed(2)}`
        break
      case 2: // 代通知金
        amount = noticePay
        typeName = '代通知金'
        formula = `${salary} × 1 = ${noticePay.toFixed(2)}`
        break
      case 3: // 经济补偿金+代通知金
        amount = severancePay + noticePay
        typeName = '经济补偿金+代通知金'
        formula = `经济补偿金: ${appliedSalary} × ${appliedYears} = ${severancePay.toFixed(2)}\n代通知金: ${salary} × 1 = ${noticePay.toFixed(2)}\n合计: ${amount.toFixed(2)}`
        break
      case 4: // 赔偿金+代通知金
        amount = compensation + noticePay
        typeName = '赔偿金+代通知金'
        formula = `赔偿金: ${appliedSalary} × ${appliedYears} × 2 = ${compensation.toFixed(2)}\n代通知金: ${salary} × 1 = ${noticePay.toFixed(2)}\n合计: ${amount.toFixed(2)}`
        break
    }

    this.setData({
      result: {
        typeName: typeName,
        appliedSalary: appliedSalary.toFixed(2),
        appliedYears: appliedYears,
        isCapped: isCapped,
        amount: amount.toFixed(2),
        formula: formula
      }
    })

    // 显示结果提示
    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  }
})
