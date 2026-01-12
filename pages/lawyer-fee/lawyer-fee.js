// pages/lawyer-fee/lawyer-fee.js
// 江西吉泰律师事务所收费标准（2020年版）
Page({
  data: {
    // 主要案件类型（合并后）
    caseTypes: [
      '刑事案件',
      '民事诉讼（不涉及财产）',
      '民事诉讼（涉及财产）',
      '行政案件',
      '申诉案件',
      '法律咨询',
      '法律文书制作',
      '法律顾问'
    ],
    caseTypeIndex: 0,

    // 刑事案件阶段
    criminalStages: ['侦查阶段', '审查起诉阶段', '一审阶段', '二审阶段'],
    criminalStageIndex: 0,

    // 行政案件阶段
    adminStages: ['行政处理', '复议阶段', '一审阶段', '二审阶段'],
    adminStageIndex: 0,

    // 需要输入标的额
    needAmount: false,
    amount: '',

    // 需要输入小时数（法律咨询）
    needHours: false,
    hours: '',
    hourlyRate: '1000', // 默认1000元/小时

    result: null
  },

  /**
   * 案件类型改变
   */
  onCaseTypeChange(e) {
    const index = parseInt(e.detail.value)

    // 判断需要什么输入
    // 2=民事诉讼(涉及财产) 需要标的额
    // 5=法律咨询 需要小时数
    const needAmount = index === 2
    const needHours = index === 5

    this.setData({
      caseTypeIndex: index,
      needAmount: needAmount,
      needHours: needHours,
      result: null
    })
  },

  /**
   * 刑事案件阶段改变
   */
  onCriminalStageChange(e) {
    this.setData({
      criminalStageIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 行政案件阶段改变
   */
  onAdminStageChange(e) {
    this.setData({
      adminStageIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 标的额输入
   */
  onAmountInput(e) {
    this.setData({
      amount: e.detail.value,
      result: null
    })
  },

  /**
   * 工作小时数输入
   */
  onHoursInput(e) {
    this.setData({
      hours: e.detail.value,
      result: null
    })
  },

  /**
   * 小时费率输入
   */
  onHourlyRateInput(e) {
    this.setData({
      hourlyRate: e.detail.value,
      result: null
    })
  },

  /**
   * 计算律师费
   */
  calculate() {
    const caseTypeIndex = this.data.caseTypeIndex
    let result = null

    // 根据案件类型计算
    if (caseTypeIndex === 0) {
      // 刑事案件
      result = this.calculateCriminalFee()
    } else if (caseTypeIndex === 1) {
      // 民事诉讼(不涉及财产)
      result = this.calculateCivilFixedFee()
    } else if (caseTypeIndex === 2) {
      // 民事诉讼(涉及财产)
      result = this.calculateCivilRatioFee()
    } else if (caseTypeIndex === 3) {
      // 行政案件
      result = this.calculateAdminFee()
    } else if (caseTypeIndex === 4) {
      // 申诉案件
      result = this.calculateAppealFee()
    } else if (caseTypeIndex === 5) {
      // 法律咨询
      result = this.calculateConsultationFee()
    } else if (caseTypeIndex === 6) {
      // 法律文书制作
      result = this.calculateDocumentFee()
    } else if (caseTypeIndex === 7) {
      // 法律顾问
      result = this.calculateLegalAdvisorFee()
    }

    if (result) {
      this.setData({
        result: result
      })

      // 弹窗显示律师费金额
      let content = `律师费参考：¥${result.fee}`

      if (result.range) {
        content += `\n收费范围：${result.range}`
      }

      wx.showModal({
        title: '计算完成',
        content: content,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击知道了')
          }
        }
      })
    }
  },

  /**
   * 刑事案件收费
   */
  calculateCriminalFee() {
    const stageIndex = this.data.criminalStageIndex
    const stages = [
      { name: '侦查阶段', min: 15000, max: 60000 },
      { name: '审查起诉阶段', min: 15000, max: 60000 },
      { name: '一审阶段', min: 20000, max: 100000 },
      { name: '二审阶段', min: 20000, max: 100000 }
    ]

    const stage = stages[stageIndex]
    const mid = Math.round((stage.min + stage.max) / 2)

    return {
      fee: mid.toLocaleString(),
      range: `${stage.min.toLocaleString()} - ${stage.max.toLocaleString()}元`,
      formula: `${stage.name}收费：${stage.min.toLocaleString()}—${stage.max.toLocaleString()}元/件\n（合伙人办理可上调5000元）`
    }
  },

  /**
   * 民事诉讼(不涉及财产)收费
   */
  calculateCivilFixedFee() {
    return {
      fee: '5,000',
      formula: '民事诉讼(不涉及财产)：5000元/件\n（案情复杂可协商，最高不超过3倍）'
    }
  },

  /**
   * 民事诉讼(涉及财产)分段累计收费
   */
  calculateCivilRatioFee() {
    const amount = parseFloat(this.data.amount)

    if (!this.data.amount || this.data.amount.trim() === '') {
      wx.showToast({
        title: '请输入标的额',
        icon: 'none'
      })
      return null
    }

    if (isNaN(amount) || amount <= 0) {
      wx.showToast({
        title: '请输入有效的标的额',
        icon: 'none'
      })
      return null
    }

    // 吉泰所标准分段累计
    let fee = 0
    let remaining = amount
    let details = []

    // 0-50,000元：5000元
    if (remaining > 0) {
      fee += 5000
      details.push(`0-5万元：5000元`)
      remaining -= Math.min(remaining, 50000)
    }

    // 50,001-100,000元：5%
    if (remaining > 0) {
      const segment = Math.min(remaining, 50000)
      const segmentFee = segment * 0.05
      fee += segmentFee
      details.push(`5-10万元：${segment.toLocaleString()} × 5% = ${segmentFee.toLocaleString()}元`)
      remaining -= segment
    }

    // 100,001-1,000,000元：4%
    if (remaining > 0) {
      const segment = Math.min(remaining, 900000)
      const segmentFee = segment * 0.04
      fee += segmentFee
      details.push(`10-100万元：${segment.toLocaleString()} × 4% = ${segmentFee.toLocaleString()}元`)
      remaining -= segment
    }

    // 1,000,001-5,000,000元：3%
    if (remaining > 0) {
      const segment = Math.min(remaining, 4000000)
      const segmentFee = segment * 0.03
      fee += segmentFee
      details.push(`100-500万元：${segment.toLocaleString()} × 3% = ${segmentFee.toLocaleString()}元`)
      remaining -= segment
    }

    // 5,000,001-10,000,000元：2%
    if (remaining > 0) {
      const segment = Math.min(remaining, 5000000)
      const segmentFee = segment * 0.02
      fee += segmentFee
      details.push(`500-1000万元：${segment.toLocaleString()} × 2% = ${segmentFee.toLocaleString()}元`)
      remaining -= segment
    }

    // 10,000,001元以上部分：1%
    if (remaining > 0) {
      const segmentFee = remaining * 0.01
      fee += segmentFee
      details.push(`1000万元以上：${remaining.toLocaleString()} × 1% = ${segmentFee.toLocaleString()}元`)
    }

    return {
      baseAmount: amount.toLocaleString(),
      fee: Math.round(fee).toLocaleString(),
      formula: details.join('\n')
    }
  },

  /**
   * 行政案件收费
   */
  calculateAdminFee() {
    const stageIndex = this.data.adminStageIndex
    const stages = [
      { name: '行政处理', fee: '5000元/件起', min: 5000, max: null },
      { name: '复议阶段', fee: null, min: 10000, max: 60000 },
      { name: '一审阶段', fee: null, min: 20000, max: 100000 },
      { name: '二审阶段', fee: null, min: 20000, max: 100000 }
    ]

    const stage = stages[stageIndex]

    if (stageIndex === 0) {
      // 行政处理
      return {
        fee: '5,000起',
        formula: `${stage.name}：${stage.fee}\n（涉及财产争议的，参照民事案件分段累计收费）`
      }
    } else {
      // 复议、一审、二审
      const mid = Math.round((stage.min + stage.max) / 2)
      return {
        fee: mid.toLocaleString(),
        range: `${stage.min.toLocaleString()} - ${stage.max.toLocaleString()}元`,
        formula: `${stage.name}：${stage.min.toLocaleString()}—${stage.max.toLocaleString()}元/件\n（合伙人办理可上调5000元）`
      }
    }
  },

  /**
   * 申诉案件收费
   */
  calculateAppealFee() {
    return {
      fee: '37,500',
      range: '15,000 - 60,000元',
      formula: '申诉立案审查阶段：15000—60000元/件\n再审审理阶段根据再审对应的审级收费'
    }
  },

  /**
   * 法律咨询收费
   */
  calculateConsultationFee() {
    const hours = parseFloat(this.data.hours) || 0
    const hourlyRate = parseFloat(this.data.hourlyRate) || 0

    if (hours <= 0) {
      wx.showToast({
        title: '请输入工作小时数',
        icon: 'none'
      })
      return null
    }

    if (hourlyRate <= 0) {
      wx.showToast({
        title: '请输入小时费率',
        icon: 'none'
      })
      return null
    }

    const fee = hours * hourlyRate

    return {
      fee: fee.toLocaleString(),
      range: '500 - 5000元/小时',
      formula: `解答法律咨询：${hours}小时 × ${hourlyRate.toLocaleString()}元/小时 = ${fee.toLocaleString()}元\n（标准：500-5000元/小时，具体由律师确定）`
    }
  },

  /**
   * 法律文书制作收费
   */
  calculateDocumentFee() {
    return {
      fee: '3,000',
      range: '1,000 - 5,000元/件',
      formula: '制作法律事务文书：1000—5000元/件\n（根据文书复杂程度确定）'
    }
  },

  /**
   * 法律顾问收费
   */
  calculateLegalAdvisorFee() {
    return {
      fee: '100,000',
      range: '20,000 - 500,000元/年',
      formula: '担任法律顾问：20000—500000元/年\n（具体根据顾问单位体量、法律事务数量等因素确定）'
    }
  }
})
