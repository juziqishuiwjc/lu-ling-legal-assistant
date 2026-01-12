// pages/work-injury/work-injury.js
// 根据《江西省工伤保险实施办法》（2023年修订版）和《工伤保险条例》
Page({
  data: {
    // 伤残等级（从轻到重）
    levels: ['十级', '九级', '八级', '七级', '六级', '五级', '四级', '三级', '二级', '一级'],
    levelIndex: 0,

    // 本人工资（用于计算一次性伤残补助金和就业补助金）
    salary: '',

    // 统筹地区职工平均工资（用于计算一次性工伤医疗补助金）
    avgSalary: '',

    // 是否解除劳动关系
    resignOptions: ['否', '是'],
    resignIndex: 0,
    isResigned: false,

    // 是否患职业病
    occupationalDiseaseOptions: ['否', '是'],
    occupationalDiseaseIndex: 0,
    isOccupationalDisease: false,

    // 用户基本信息（用于计算退休年龄）
    genderOptions: ['男', '女'],
    genderIndex: 0,

    // 女职工类型
    femaleTypeOptions: ['管理技术岗位（55岁）', '工人岗位（50岁）'],
    femaleTypeIndex: 0,

    // 出生日期
    birthYear: '',
    birthMonth: '',

    // 计算出的退休信息
    calculatedRetireInfo: null, // { originalAge, newAge, retireDate, yearsToRetire }

    result: null
  },

  /**
   * 伤残等级改变
   */
  onLevelChange(e) {
    this.setData({
      levelIndex: parseInt(e.detail.value),
      result: null
    })
  },

  /**
   * 本人工资输入
   */
  onSalaryInput(e) {
    this.setData({
      salary: e.detail.value,
      result: null
    })
  },

  /**
   * 统筹地区工资输入
   */
  onAvgSalaryInput(e) {
    this.setData({
      avgSalary: e.detail.value,
      result: null
    })
  },

  /**
   * 是否解除劳动关系改变
   */
  onResignChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({
      resignIndex: index,
      isResigned: index === 1,
      result: null
    })
  },

  /**
   * 是否患职业病改变
   */
  onOccupationalDiseaseChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({
      occupationalDiseaseIndex: index,
      isOccupationalDisease: index === 1,
      result: null
    })
  },

  /**
   * 性别改变
   */
  onGenderChange(e) {
    this.setData({
      genderIndex: parseInt(e.detail.value),
      calculatedRetireInfo: null,
      result: null
    })
  },

  /**
   * 女职工类型改变
   */
  onFemaleTypeChange(e) {
    this.setData({
      femaleTypeIndex: parseInt(e.detail.value),
      calculatedRetireInfo: null,
      result: null
    })
  },

  /**
   * 出生年份输入
   */
  onBirthYearInput(e) {
    this.setData({
      birthYear: e.detail.value,
      calculatedRetireInfo: null,
      result: null
    })
  },

  /**
   * 出生月份输入
   */
  onBirthMonthInput(e) {
    this.setData({
      birthMonth: e.detail.value,
      calculatedRetireInfo: null,
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
      return null
    }

    if (birthYear < 1940 || birthYear > 2010) {
      return null
    }

    if (birthMonth < 1 || birthMonth > 12) {
      return null
    }

    // 原法定退休年龄
    let originalRetireAge = 60 // 男
    if (gender === 1) {
      // 女
      originalRetireAge = femaleType === 0 ? 55 : 50
    }

    // 渐进式延迟退休起始时间：2025年1月1日
    const reformStartDate = new Date(2025, 0, 1) // 月份从0开始

    // 原退休日期
    let originalRetireDate = new Date(birthYear + originalRetireAge, birthMonth - 1, 1)

    // 新退休年龄
    let newRetireAge = originalRetireAge
    let retireDate = new Date(originalRetireDate)

    // 判断是否在改革实施后达到原退休年龄
    if (originalRetireDate >= reformStartDate) {
      // 计算从2025年1月1日到原退休日期的月数
      const monthsFromReform = (originalRetireDate.getFullYear() - reformStartDate.getFullYear()) * 12 +
                               (originalRetireDate.getMonth() - reformStartDate.getMonth())

      let monthsDelay = 0

      if (gender === 0) {
        // 男职工：每4个月延迟1个月，延迟至63岁（共36个月）
        const maxDelay = 36 // 63-60=3年=36个月
        monthsDelay = Math.min(Math.floor(monthsFromReform / 4), maxDelay)
        newRetireAge = originalRetireAge + Math.floor(monthsDelay / 12)
        retireDate = new Date(birthYear + newRetireAge, birthMonth - 1 + monthsDelay % 12, 1)
      } else if (gender === 1) {
        if (femaleType === 0) {
          // 女职工（原55岁）：每4个月延迟1个月，延迟至58岁（共36个月）
          const maxDelay = 36 // 58-55=3年=36个月
          monthsDelay = Math.min(Math.floor(monthsFromReform / 4), maxDelay)
          newRetireAge = originalRetireAge + Math.floor(monthsDelay / 12)
          retireDate = new Date(birthYear + newRetireAge, birthMonth - 1 + monthsDelay % 12, 1)
        } else {
          // 女职工（原50岁）：每2个月延迟1个月，延迟至55岁（共60个月）
          const maxDelay = 60 // 55-50=5年=60个月
          monthsDelay = Math.min(Math.floor(monthsFromReform / 2), maxDelay)
          newRetireAge = originalRetireAge + Math.floor(monthsDelay / 12)
          retireDate = new Date(birthYear + newRetireAge, birthMonth - 1 + monthsDelay % 12, 1)
        }
      }
    }

    // 计算距退休年限
    const today = new Date()
    const yearsToRetire = retireDate > today ?
      Math.floor((retireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) :
      0

    return {
      originalAge: originalRetireAge,
      newAge: newRetireAge,
      retireDate: `${retireDate.getFullYear()}年${retireDate.getMonth() + 1}月`,
      yearsToRetire: yearsToRetire
    }
  },

  /**
   * 计算工伤赔偿
   */
  calculate() {
    const salary = parseFloat(this.data.salary)
    const avgSalary = parseFloat(this.data.avgSalary)
    const levelIndex = this.data.levelIndex
    const isResigned = this.data.isResigned
    const isOccupationalDisease = this.data.isOccupationalDisease

    // 验证输入
    if (!this.data.salary || this.data.salary.trim() === '') {
      wx.showToast({
        title: '请输入本人工资',
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

    if (isResigned) {
      if (!this.data.avgSalary || this.data.avgSalary.trim() === '') {
        wx.showToast({
          title: '请输入统筹地区职工平均工资',
          icon: 'none'
        })
        return
      }

      if (isNaN(avgSalary) || avgSalary <= 0) {
        wx.showToast({
          title: '请输入有效的平均工资',
          icon: 'none'
        })
        return
      }

      // 如果解除劳动关系且五至十级，需要计算退休年龄
      if (levelIndex <= 5) {
        // 尝试计算退休年龄
        const retireInfo = this.calculateRetireAge()

        if (retireInfo) {
          // 成功计算退休年龄
          this.setData({
            calculatedRetireInfo: retireInfo
          })
        } else {
          // 没有输入出生年月或输入无效，清空退休年龄信息
          this.setData({
            calculatedRetireInfo: null
          })
        }
      }
    }

    // 根据《工伤保险条例》第三十五、三十六、三十七条
    // 一次性伤残补助金月数（十级到一级）
    const disabilityMonths = [7, 9, 11, 13, 16, 18, 21, 23, 25, 27]

    // 计算一次性伤残补助金
    const disabilityGrant = salary * disabilityMonths[levelIndex]
    const disabilityGrantDesc = `${salary} × ${disabilityMonths[levelIndex]}个月 = ${disabilityGrant.toFixed(2)}元`

    let medicalGrant = 0
    let medicalGrantDesc = ''
    let employmentGrant = 0
    let employmentGrantDesc = ''

    // 如果解除劳动关系，计算一次性工伤医疗补助金和就业补助金
    if (isResigned) {
      // 根据《江西省工伤保险实施办法》第二十二条
      // 一次性工伤医疗补助金月数（十级到五级）
      const medicalMonths = [5, 8, 11, 14, 18, 21, 0, 0, 0, 0]
      const medicalMonth = medicalMonths[levelIndex] || 0

      // 一次性伤残就业补助金月数（十级到五级）
      const employmentMonths = [6, 9, 13, 18, 28, 32, 0, 0, 0, 0]
      const employmentMonth = employmentMonths[levelIndex] || 0

      if (levelIndex <= 5) { // 五级到十级
        // 计算一次性工伤医疗补助金
        medicalGrant = avgSalary * medicalMonth

        // 患职业病的，一次性工伤医疗补助金增发30%
        if (isOccupationalDisease) {
          medicalGrant = medicalGrant * 1.3
          medicalGrantDesc = `${avgSalary} × ${medicalMonth}个月 × 1.3（职业病增发30%）= ${medicalGrant.toFixed(2)}元`
        } else {
          medicalGrantDesc = `${avgSalary} × ${medicalMonth}个月 = ${medicalGrant.toFixed(2)}元`
        }

        // 计算一次性伤残就业补助金（考虑距退休年龄）
        employmentGrant = salary * employmentMonth
        const retireInfo = this.data.calculatedRetireInfo
        const yearsToRetire = retireInfo ? retireInfo.yearsToRetire : 999

        // 五级至十级工伤职工距法定退休年龄不足5年的，一次性伤残就业补助金按比例支付
        if (yearsToRetire < 5) {
          let ratio = 1

          if (yearsToRetire <= 0) {
            // 超过法定退休年龄的不支付
            employmentGrant = 0
            employmentGrantDesc = `超过法定退休年龄，不支付一次性伤残就业补助金`
          } else if (yearsToRetire < 1) {
            // 不足1年：10%
            ratio = 0.1
            employmentGrant = employmentGrant * ratio
            employmentGrantDesc = `${salary} × ${employmentMonth}个月 × 10%（距退休不足1年）= ${employmentGrant.toFixed(2)}元`
          } else if (yearsToRetire < 2) {
            // 满1年不足2年：20%
            ratio = 0.2
            employmentGrant = employmentGrant * ratio
            employmentGrantDesc = `${salary} × ${employmentMonth}个月 × 20%（距退休满1年不足2年）= ${employmentGrant.toFixed(2)}元`
          } else if (yearsToRetire < 3) {
            // 满2年不足3年：40%
            ratio = 0.4
            employmentGrant = employmentGrant * ratio
            employmentGrantDesc = `${salary} × ${employmentMonth}个月 × 40%（距退休满2年不足3年）= ${employmentGrant.toFixed(2)}元`
          } else if (yearsToRetire < 4) {
            // 满3年不足4年：60%
            ratio = 0.6
            employmentGrant = employmentGrant * ratio
            employmentGrantDesc = `${salary} × ${employmentMonth}个月 × 60%（距退休满3年不足4年）= ${employmentGrant.toFixed(2)}元`
          } else {
            // 满4年不足5年：80%
            ratio = 0.8
            employmentGrant = employmentGrant * ratio
            employmentGrantDesc = `${salary} × ${employmentMonth}个月 × 80%（距退休满4年不足5年）= ${employmentGrant.toFixed(2)}元`
          }
        } else {
          employmentGrantDesc = `${salary} × ${employmentMonth}个月 = ${employmentGrant.toFixed(2)}元`
        }
      }
    }

    // 计算总额
    let total = disabilityGrant + medicalGrant + employmentGrant

    // 构建弹窗内容
    let modalContent = `工伤赔偿总额：¥${total.toFixed(2)}\n\n一次性伤残补助金：¥${disabilityGrant.toFixed(2)}`

    if (isResigned) {
      modalContent += `\n一次性工伤医疗补助金：¥${medicalGrant.toFixed(2)}`

      if (levelIndex <= 5 && this.data.calculatedRetireInfo) {
        const retireInfo = this.data.calculatedRetireInfo
        modalContent += `\n一次性伤残就业补助金：¥${employmentGrant.toFixed(2)}`

        // 添加退休年龄信息
        modalContent += `\n\n━━━━━━━━━━━━━━━`
        modalContent += `\n【退休年龄信息】`
        modalContent += `\n原法定退休年龄：${retireInfo.originalAge}周岁`
        modalContent += `\n新法定退休年龄：${retireInfo.newAge}周岁`
        modalContent += `\n预计退休时间：${retireInfo.retireDate}`

        if (retireInfo.yearsToRetire > 0) {
          modalContent += `\n距退休年限：约${retireInfo.yearsToRetire}年`
        } else {
          modalContent += `\n距退休年限：已超过退休年龄`
        }
      }
    }

    this.setData({
      result: {
        disabilityGrant: disabilityGrant.toFixed(2),
        disabilityGrantDesc: disabilityGrantDesc,
        medicalGrant: medicalGrant.toFixed(2),
        medicalGrantDesc: medicalGrantDesc,
        employmentGrant: employmentGrant.toFixed(2),
        employmentGrantDesc: employmentGrantDesc,
        total: total.toFixed(2)
      }
    })

    // 弹窗显示总额
    wx.showModal({
      title: '计算完成',
      content: modalContent,
      showCancel: false,
      confirmText: '知道了',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击知道了')
        }
      }
    })
  }
})
