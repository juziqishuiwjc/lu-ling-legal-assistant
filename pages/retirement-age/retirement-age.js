// pages/retire-age/retire-age.js
// 渐进式延迟退休年龄计算器
// 根据《国务院关于渐进式延迟法定退休年龄的办法》（2025年1月1日起实施）
Page({
  data: {
    // 性别
    genderOptions: ['男', '女'],
    genderIndex: 0,

    // 女职工类型
    femaleTypeOptions: ['管理技术岗位（原55岁退休）', '工人岗位（原50岁退休）'],
    femaleTypeIndex: 0,

    // 出生日期
    birthYear: '',
    birthMonth: '',

    // 计算结果
    result: null, // { originalAge, newAge, retireDate, yearsToRetire, delayMonths }
  },

  /**
   * 性别改变
   */
  onGenderChange(e) {
    this.setData({
      genderIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 女职工类型改变
   */
  onFemaleTypeChange(e) {
    this.setData({
      femaleTypeIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 出生年份输入
   */
  onBirthYearInput(e) {
    this.setData({
      birthYear: e.detail.value,
      result: null
    })
  },

  /**
   * 出生月份输入
   */
  onBirthMonthInput(e) {
    this.setData({
      birthMonth: e.detail.value,
      result: null
    })
  },

  /**
   * 计算退休年龄（根据国务院渐进式延迟退休办法）
   */
  calculateRetireAge() {
    const gender = this.data.genderIndex // 0=男, 1=女
    const femaleType = this.data.femaleTypeIndex // 0=管理技术55岁, 1=工人50岁
    const birthYear = parseInt(this.data.birthYear)
    const birthMonth = parseInt(this.data.birthMonth)

    // 验证输入
    if (!birthYear || !birthMonth) {
      wx.showToast({
        title: '请输入完整的出生年月',
        icon: 'none'
      })
      return null
    }

    if (isNaN(birthYear) || birthYear < 1940 || birthYear > 2015) {
      wx.showToast({
        title: '请输入有效的出生年份（1940-2015）',
        icon: 'none'
      })
      return null
    }

    if (isNaN(birthMonth) || birthMonth < 1 || birthMonth > 12) {
      wx.showToast({
        title: '请输入有效的出生月份（1-12）',
        icon: 'none'
      })
      return null
    }

    // 原法定退休年龄
    let originalRetireAge = 60 // 男
    let maxDelayMonths = 36 // 男职工最多延迟36个月（3年）

    if (gender === 1) {
      // 女
      if (femaleType === 0) {
        // 管理技术岗位（原55岁）
        originalRetireAge = 55
        maxDelayMonths = 36 // 延迟至58岁（3年）
      } else {
        // 工人岗位（原50岁）
        originalRetireAge = 50
        maxDelayMonths = 60 // 延迟至55岁（5年）
      }
    }

    // 渐进式延迟退休起始时间：2025年1月1日
    const reformStartDate = new Date(2025, 0, 1) // 月份从0开始

    // 原退休日期
    const originalRetireDate = new Date(birthYear + originalRetireAge, birthMonth - 1, 1)

    // 新退休年龄和退休日期
    let newRetireAge = originalRetireAge
    let retireDate = new Date(originalRetireDate)
    let delayMonths = 0

    // 判断是否在改革实施后达到原退休年龄
    if (originalRetireDate >= reformStartDate) {
      // 计算从2025年1月1日到原退休日期的月数
      const monthsFromReform = (originalRetireDate.getFullYear() - reformStartDate.getFullYear()) * 12 +
                               (originalRetireDate.getMonth() - reformStartDate.getMonth())

      if (gender === 0 || (gender === 1 && femaleType === 0)) {
        // 男职工 或 女职工（原55岁）：每4个月延迟1个月
        delayMonths = Math.min(Math.floor(monthsFromReform / 4), maxDelayMonths)
      } else {
        // 女职工（原50岁）：每2个月延迟1个月
        delayMonths = Math.min(Math.floor(monthsFromReform / 2), maxDelayMonths)
      }

      // 计算新退休年龄和日期
      newRetireAge = originalRetireAge + Math.floor(delayMonths / 12)
      retireDate = new Date(birthYear + newRetireAge, birthMonth - 1 + delayMonths % 12, 1)

      // 处理月份溢出
      if (retireDate.getMonth() !== (birthMonth - 1 + delayMonths % 12) % 12) {
        retireDate = new Date(birthYear + newRetireAge + Math.floor((birthMonth - 1 + delayMonths % 12) / 12),
                            (birthMonth - 1 + delayMonths % 12) % 12, 1)
      }
    }

    // 计算距退休年限
    const today = new Date()
    const yearsToRetire = retireDate > today ?
      Math.floor((retireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) :
      0

    // 计算距退休月数
    const monthsToRetire = retireDate > today ?
      Math.floor((retireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44)) :
      0

    return {
      originalAge: originalRetireAge,
      newAge: newRetireAge,
      retireDate: `${retireDate.getFullYear()}年${retireDate.getMonth() + 1}月`,
      yearsToRetire: yearsToRetire,
      monthsToRetire: monthsToRetire,
      delayMonths: delayMonths,
      delayYears: Math.floor(delayMonths / 12),
      delayRemainingMonths: delayMonths % 12
    }
  },

  /**
   * 计算按钮点击
   */
  onCalculate() {
    const result = this.calculateRetireAge()

    if (result) {
      this.setData({
        result: result
      })

      // 弹窗显示结果
      let content = `您的退休年龄信息：\n\n`
      content += `━━━━━━━━━━━━━━━\n`
      content += `📅 原法定退休年龄：${result.originalAge}周岁\n`
      content += `📅 新法定退休年龄：${result.newAge}周岁\n`

      if (result.delayMonths > 0) {
        content += `⏰ 延迟时长：${result.delayYears}年${result.delayRemainingMonths > 0 ? result.delayRemainingMonths + '个月' : ''}\n`
      } else {
        content += `⏰ 延迟时长：无延迟\n`
      }

      content += `📆 预计退休时间：${result.retireDate}\n`

      if (result.yearsToRetire > 0) {
        content += `⏳ 距退休年限：约${result.yearsToRetire}年（${result.monthsToRetire}个月）\n`
      } else {
        content += `⏳ 距退休年限：已达到或超过退休年龄\n`
      }

      content += `\n━━━━━━━━━━━━━━━\n`
      content += `根据《国务院关于渐进式延迟\n法定退休年龄的办法》计算`

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
  }
})
