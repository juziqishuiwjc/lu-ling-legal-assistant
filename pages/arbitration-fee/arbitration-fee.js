// pages/arbitration-fee/arbitration-fee.js
Page({
  data: {
    amount: '',
    caseTypes: ['劳动争议仲裁', '民商事仲裁'],
    caseTypeIndex: 0,
    result: null
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
   * 案件类型改变
   */
  onCaseTypeChange(e) {
    this.setData({
      caseTypeIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 计算仲裁费
   */
  calculate() {
    const amount = parseFloat(this.data.amount)
    const caseTypeIndex = this.data.caseTypeIndex

    // 验证输入
    if (!this.data.amount || this.data.amount.trim() === '') {
      wx.showToast({
        title: '请输入仲裁请求金额',
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

    // 劳动争议仲裁免费
    if (caseTypeIndex === 0) {
      this.setData({
        result: {
          total: '0.00',
          formula: '劳动争议仲裁不收费，由财政保障'
        }
      })

      wx.showToast({
        title: '劳动争议仲裁免费',
        icon: 'success',
        duration: 1500
      })
      return
    }

    // 民商事仲裁收费计算
    let fee = 0
    let formula = ''

    if (amount <= 1000) {
      fee = 50 // 基础费用
      formula = '1000元以下：50-100元，取中间值50元'
    } else if (amount <= 50000) {
      fee = amount * 0.04 // 4%
      formula = `1001-50000元：按4%计算，${amount} × 4% = ${fee.toFixed(2)}元`
    } else if (amount <= 100000) {
      fee = 2000 + (amount - 50000) * 0.03 // 2000 + 超过部分3%
      formula = `50001-100000元：2000元 + 超过部分3%，2000 + (${amount} - 50000) × 3% = ${fee.toFixed(2)}元`
    } else if (amount <= 200000) {
      fee = 3500 + (amount - 100000) * 0.02 // 3500 + 超过部分2%
      formula = `100001-200000元：3500元 + 超过部分2%，3500 + (${amount} - 100000) × 2% = ${fee.toFixed(2)}元`
    } else if (amount <= 500000) {
      fee = 5500 + (amount - 200000) * 0.015 // 5500 + 超过部分1.5%
      formula = `200001-500000元：5500元 + 超过部分1.5%，5500 + (${amount} - 200000) × 1.5% = ${fee.toFixed(2)}元`
    } else if (amount <= 1000000) {
      fee = 10000 + (amount - 500000) * 0.008 // 10000 + 超过部分0.8%
      formula = `500001-1000000元：10000元 + 超过部分0.8%，10000 + (${amount} - 500000) × 0.8% = ${fee.toFixed(2)}元`
    } else {
      fee = 14000 + (amount - 1000000) * 0.005 // 14000 + 超过部分0.5%
      formula = `1000001元以上：14000元 + 超过部分0.5%，14000 + (${amount} - 1000000) × 0.5% = ${fee.toFixed(2)}元`
    }

    this.setData({
      result: {
        acceptanceFee: fee.toFixed(2),
        processingFee: '0.00',
        total: fee.toFixed(2),
        formula: formula
      }
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success',
      duration: 1500
    })
  }
})
