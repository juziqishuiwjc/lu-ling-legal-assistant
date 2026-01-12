// pages/litigation-cost/litigation-cost.js
Page({
  data: {
    caseTypes: ['财产案件', '离婚案件', '人格权案件', '知识产权案件'],
    caseTypeIndex: 0,
    amount: '',
    result: null
  },

  /**
   * 案件类型改变
   */
  onCaseTypeChange(e) {
    this.setData({
      caseTypeIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 金额输入
   */
  onAmountInput(e) {
    this.setData({
      amount: e.detail.value,
      result: null
    })
  },

  /**
   * 计算诉讼费用
   */
  calculate() {
    const amount = parseFloat(this.data.amount)

    // 验证输入
    if (!this.data.amount || this.data.amount.trim() === '') {
      wx.showToast({
        title: '请输入诉讼标的额',
        icon: 'none'
      })
      return
    }

    if (isNaN(amount) || amount < 0) {
      wx.showToast({
        title: '请输入有效的金额',
        icon: 'none'
      })
      return
    }

    // 计算费用
    const caseTypeIndex = this.data.caseTypeIndex
    let fee = 0

    if (caseTypeIndex === 0) {
      // 财产案件:根据标的额分段累计计算
      fee = this.calculatePropertyCaseFee(amount)
    } else if (caseTypeIndex === 1) {
      // 离婚案件:每件50-300元,涉及财产分割的,财产总额不超过20万元的,不另行交纳;超过20万元的部分,按照0.5%交纳
      fee = 50 // 基础费用
      if (amount > 200000) {
        fee += (amount - 200000) * 0.005
      }
    } else if (caseTypeIndex === 2) {
      // 人格权案件:每件100-500元
      fee = 100 // 基础费用
      if (amount > 50000) {
        // 涉及赔偿的,超过5万至10万:1%;超过10万:0.5%
        if (amount <= 100000) {
          fee += (amount - 50000) * 0.01
        } else {
          fee += 50000 * 0.01 + (amount - 100000) * 0.005
        }
      }
    } else if (caseTypeIndex === 3) {
      // 知识产权案件:没有争议金额的:每件500-1000元;有争议金额的:按财产案件标准交纳
      if (amount === 0) {
        fee = 500
      } else {
        fee = this.calculatePropertyCaseFee(amount)
      }
    }

    // 格式化结果(保留两位小数)
    const result = fee.toFixed(2)

    this.setData({
      result: result
    })

    // 显示结果提示
    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 计算财产案件费用
   * 根据诉讼请求的金额或者价额,按照下列比例分段累计交纳
   */
  calculatePropertyCaseFee(amount) {
    let fee = 0

    // 不超过1万元的:交纳50元
    if (amount <= 10000) {
      fee = 50
    } else {
      fee = 50

      // 超过1万元至10万元的部分:交纳2.5%
      if (amount > 10000) {
        if (amount <= 100000) {
          fee += (amount - 10000) * 0.025
        } else {
          fee += 90000 * 0.025
        }
      }

      // 超过10万元至20万元的部分:交纳2.2%
      if (amount > 100000) {
        if (amount <= 200000) {
          fee += (amount - 100000) * 0.022
        } else {
          fee += 100000 * 0.022
        }
      }

      // 超过20万元至50万元的部分:交纳2%
      if (amount > 200000) {
        if (amount <= 500000) {
          fee += (amount - 200000) * 0.02
        } else {
          fee += 300000 * 0.02
        }
      }

      // 超过50万元至100万元的部分:交纳1.5%
      if (amount > 500000) {
        if (amount <= 1000000) {
          fee += (amount - 500000) * 0.015
        } else {
          fee += 500000 * 0.015
        }
      }

      // 超过100万元至200万元的部分:交纳1%
      if (amount > 1000000) {
        if (amount <= 2000000) {
          fee += (amount - 1000000) * 0.01
        } else {
          fee += 1000000 * 0.01
        }
      }

      // 超过200万元至500万元的部分:交纳0.8%
      if (amount > 2000000) {
        if (amount <= 5000000) {
          fee += (amount - 2000000) * 0.008
        } else {
          fee += 3000000 * 0.008
        }
      }

      // 超过500万元至1000万元的部分:交纳0.6%
      if (amount > 5000000) {
        if (amount <= 10000000) {
          fee += (amount - 5000000) * 0.006
        } else {
          fee += 5000000 * 0.006
        }
      }

      // 超过1000万元的部分:交纳0.5%
      if (amount > 10000000) {
        fee += (amount - 10000000) * 0.005
      }
    }

    return fee
  },

  onLoad() {
    // 页面加载
  }
})
