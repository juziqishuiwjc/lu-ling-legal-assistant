// pages/bankruptcy-fee/bankruptcy-fee.js
Page({
  data: {
    calcType: 'general', // general(普通破产财产), secured(担保权人受偿)
    hasManagement: false,
    formData: {
      propertyValue: '',
      securedAmount: ''
    },
    result: null
  },

  /**
   * 选择计算类型
   */
  selectCalcType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      calcType: type,
      result: null
    })
  },

  /**
   * 选择是否涉及管理人管理担保财产
   */
  selectManagement(e) {
    const value = e.currentTarget.dataset.value === 'true'
    this.setData({
      hasManagement: value
    })
  },

  /**
   * 输入框变化
   */
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  /**
   * 计算管理人报酬
   */
  calculate() {
    const { calcType, hasManagement, formData } = this.data

    let total = 0
    let segments = []
    let notice = ''
    let formula = ''

    if (calcType === 'general') {
      // 普通破产财产计算
      const propertyValue = parseFloat(formData.propertyValue) || 0

      if (propertyValue <= 0) {
        wx.showToast({
          title: '请输入有效的财产价值',
          icon: 'none'
        })
        return
      }

      // 小额案件上限检查
      if (propertyValue < 100) {
        // 不超过100万元，最高12万元
        const calculated = propertyValue * 0.12
        const maxFee = 12
        total = Math.min(calculated, maxFee)
        notice = `清算价值${propertyValue}万元 < 100万元，按12%计算但最高不超过12万元`

        segments.push({
          range: '0-100万元',
          amount: propertyValue.toFixed(2),
          rate: '12%',
          fee: calculated.toFixed(2)
        })

        if (calculated > maxFee) {
          segments.push({
            range: '上限调整',
            amount: '-',
            rate: '-',
            fee: '12.00（封顶）'
          })
        }
      } else if (propertyValue < 200) {
        // 100-200万元，最高24万元
        const calculated = this.calculateBySegments(propertyValue)
        const maxFee = 24
        total = Math.min(calculated, maxFee)
        notice = `清算价值${propertyValue}万元 < 200万元，分段计算但最高不超过24万元`
        segments = this.getSegments(propertyValue)
      } else if (propertyValue < 500) {
        // 200-500万元，最高40万元
        const calculated = this.calculateBySegments(propertyValue)
        const maxFee = 40
        total = Math.min(calculated, maxFee)
        notice = `清算价值${propertyValue}万元 < 500万元，分段计算但最高不超过40万元`
        segments = this.getSegments(propertyValue)
      } else {
        // 正常分段计算
        total = this.calculateBySegments(propertyValue)
        segments = this.getSegments(propertyValue)
      }

      formula = '按照《最高人民法院关于审理企业破产案件确定管理人报酬的规定》第二条分段计算'

    } else {
      // 担保权人受偿计算
      const securedAmount = parseFloat(formData.securedAmount) || 0

      if (securedAmount <= 0) {
        wx.showToast({
          title: '请输入有效的受偿金额',
          icon: 'none'
        })
        return
      }

      if (!hasManagement) {
        // 不涉及管理人管理担保财产，报酬为0
        total = 0
        notice = '担保权人受偿部分，管理人未付出管理劳动的，不计收报酬'
        formula = '根据规定第十三条规定，管理人未付出管理劳动的，不计收报酬'
      } else {
        // 涉及管理人管理担保财产，按照分段比例计算
        total = this.calculateBySegments(securedAmount)
        segments = this.getSegments(securedAmount)
        formula = '管理人管理担保财产的，按照分段比例计算报酬'
      }
    }

    this.setData({
      result: {
        total: total.toFixed(2),
        segments: segments,
        notice: notice,
        formula: formula
      }
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success'
    })
  },

  /**
   * 分段累计计算
   */
  calculateBySegments(amount) {
    let fee = 0
    const remaining = amount

    // 不超过100万元的部分：12%
    if (remaining > 0) {
      const segment1 = Math.min(remaining, 100)
      fee += segment1 * 0.12
    }

    // 超过100万元至500万元的部分：10%
    if (remaining > 100) {
      const segment2 = Math.min(remaining - 100, 400)
      fee += segment2 * 0.10
    }

    // 超过500万元至1000万元的部分：8%
    if (remaining > 500) {
      const segment3 = Math.min(remaining - 500, 500)
      fee += segment3 * 0.08
    }

    // 超过1000万元至5000万元的部分：6%
    if (remaining > 1000) {
      const segment4 = Math.min(remaining - 1000, 4000)
      fee += segment4 * 0.06
    }

    // 超过5000万元至1亿元的部分：3%
    if (remaining > 5000) {
      const segment5 = Math.min(remaining - 5000, 5000)
      fee += segment5 * 0.03
    }

    // 超过1亿元的部分：1%
    if (remaining > 10000) {
      const segment6 = remaining - 10000
      fee += segment6 * 0.01
    }

    return fee
  },

  /**
   * 获取分段详情
   */
  getSegments(amount) {
    const segments = []

    // 不超过100万元的部分：12%
    if (amount > 0) {
      const segment1 = Math.min(amount, 100)
      const fee1 = segment1 * 0.12
      segments.push({
        range: '不超过100万元',
        amount: segment1.toFixed(2),
        rate: '12%',
        fee: fee1.toFixed(2)
      })
    }

    // 超过100万元至500万元的部分：10%
    if (amount > 100) {
      const segment2 = Math.min(amount - 100, 400)
      const fee2 = segment2 * 0.10
      segments.push({
        range: '100万-500万元',
        amount: segment2.toFixed(2),
        rate: '10%',
        fee: fee2.toFixed(2)
      })
    }

    // 超过500万元至1000万元的部分：8%
    if (amount > 500) {
      const segment3 = Math.min(amount - 500, 500)
      const fee3 = segment3 * 0.08
      segments.push({
        range: '500万-1000万元',
        amount: segment3.toFixed(2),
        rate: '8%',
        fee: fee3.toFixed(2)
      })
    }

    // 超过1000万元至5000万元的部分：6%
    if (amount > 1000) {
      const segment4 = Math.min(amount - 1000, 4000)
      const fee4 = segment4 * 0.06
      segments.push({
        range: '1000万-5000万元',
        amount: segment4.toFixed(2),
        rate: '6%',
        fee: fee4.toFixed(2)
      })
    }

    // 超过5000万元至1亿元的部分：3%
    if (amount > 5000) {
      const segment5 = Math.min(amount - 5000, 5000)
      const fee5 = segment5 * 0.03
      segments.push({
        range: '5000万-1亿元',
        amount: segment5.toFixed(2),
        rate: '3%',
        fee: fee5.toFixed(2)
      })
    }

    // 超过1亿元的部分：1%
    if (amount > 10000) {
      const segment6 = amount - 10000
      const fee6 = segment6 * 0.01
      segments.push({
        range: '超过1亿元',
        amount: segment6.toFixed(2),
        rate: '1%',
        fee: fee6.toFixed(2)
      })
    }

    return segments
  },

  /**
   * 重置表单
   */
  reset() {
    this.setData({
      calcType: 'general',
      hasManagement: false,
      formData: {
        propertyValue: '',
        securedAmount: ''
      },
      result: null
    })

    wx.showToast({
      title: '已重置',
      icon: 'success'
    })
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.switchTab({
          url: '/pages/home/home'
        })
      }
    })
  }
})
