// pages/traffic-accident/traffic-accident.js
Page({
  data: {
    caseType: 'injury', // injury(人身损害), death(死亡), disability(伤残)
    disabilityIndex: 0,
    disabilityLevels: ['一级（100%）', '二级（90%）', '三级（80%）', '四级（70%）', '五级（60%）', '六级（50%）', '七级（40%）', '八级（30%）', '九级（20%）', '十级（10%）'],
    disabilityRates: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
    formData: {
      // 基础费用
      medicalExpense: '',
      lostWages: '',
      nursingFee: '',
      transportationFee: '',
      hospitalFoodFee: '',
      nutritionFee: '',
      // 伤残/死亡赔偿
      urbanIncome: '45554', // 2023年江西省城镇居民人均可支配收入
      disabilityYears: '20',
      deathYears: '20',
      monthlySalary: '7895', // 2023年江西省在岗职工月平均工资(94742÷12)
      dependentExpense: '',
      mentalDistress: ''
    },
    result: null
  },

  /**
   * 选择案件类型
   */
  selectCaseType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      caseType: type,
      result: null
    })
  },

  /**
   * 伤残等级变化
   */
  onDisabilityChange(e) {
    this.setData({
      disabilityIndex: parseInt(e.detail.value)
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
   * 计算赔偿金额
   */
  calculate() {
    const { caseType, disabilityIndex, disabilityRates, formData } = this.data

    let details = []
    let total = 0
    let formula = ''

    // 基础费用
    const medicalExpense = parseFloat(formData.medicalExpense) || 0
    const lostWages = parseFloat(formData.lostWages) || 0
    const nursingFee = parseFloat(formData.nursingFee) || 0
    const transportationFee = parseFloat(formData.transportationFee) || 0
    const hospitalFoodFee = parseFloat(formData.hospitalFoodFee) || 0
    const nutritionFee = parseFloat(formData.nutritionFee) || 0

    // 添加基础费用
    if (medicalExpense > 0) {
      details.push({ name: '医疗费', value: medicalExpense.toFixed(2) })
      total += medicalExpense
    }
    if (lostWages > 0) {
      details.push({ name: '误工费', value: lostWages.toFixed(2) })
      total += lostWages
    }
    if (nursingFee > 0) {
      details.push({ name: '护理费', value: nursingFee.toFixed(2) })
      total += nursingFee
    }
    if (transportationFee > 0) {
      details.push({ name: '交通费', value: transportationFee.toFixed(2) })
      total += transportationFee
    }
    if (hospitalFoodFee > 0) {
      details.push({ name: '住院伙食补助费', value: hospitalFoodFee.toFixed(2) })
      total += hospitalFoodFee
    }
    if (nutritionFee > 0) {
      details.push({ name: '营养费', value: nutritionFee.toFixed(2) })
      total += nutritionFee
    }

    // 根据案件类型计算
    if (caseType === 'disability') {
      // 伤残赔偿
      const urbanIncome = parseFloat(formData.urbanIncome) || 0
      const disabilityYears = parseFloat(formData.disabilityYears) || 20
      const disabilityRate = disabilityRates[disabilityIndex]

      const disabilityCompensation = urbanIncome * disabilityYears * disabilityRate
      details.push({
        name: '伤残赔偿金',
        value: disabilityCompensation.toFixed(2)
      })
      total += disabilityCompensation

      formula = `伤残赔偿金 = 城镇居民人均可支配收入(${urbanIncome}元) × 赔偿年限(${disabilityYears}年) × 伤残系数(${disabilityRate})`

      // 被扶养人生活费
      const dependentExpense = parseFloat(formData.dependentExpense) || 0
      if (dependentExpense > 0) {
        details.push({ name: '被扶养人生活费', value: dependentExpense.toFixed(2) })
        total += dependentExpense
      }

      // 精神损害抚慰金
      const mentalDistress = parseFloat(formData.mentalDistress) || 0
      if (mentalDistress > 0) {
        details.push({ name: '精神损害抚慰金', value: mentalDistress.toFixed(2) })
        total += mentalDistress
      }

    } else if (caseType === 'death') {
      // 死亡赔偿金
      const urbanIncome = parseFloat(formData.urbanIncome) || 0
      const deathYears = parseFloat(formData.deathYears) || 20

      const deathCompensation = urbanIncome * deathYears
      details.push({
        name: '死亡赔偿金',
        value: deathCompensation.toFixed(2)
      })
      total += deathCompensation

      // 丧葬费
      const monthlySalary = parseFloat(formData.monthlySalary) || 0
      const funeralFee = monthlySalary * 6
      details.push({
        name: '丧葬费',
        value: funeralFee.toFixed(2)
      })
      total += funeralFee

      formula = `死亡赔偿金 = 城镇居民人均可支配收入(${urbanIncome}元) × 赔偿年限(${deathYears}年) + 丧葬费(月平均工资${monthlySalary}元 × 6个月)`

      // 被扶养人生活费
      const dependentExpense = parseFloat(formData.dependentExpense) || 0
      if (dependentExpense > 0) {
        details.push({ name: '被扶养人生活费', value: dependentExpense.toFixed(2) })
        total += dependentExpense
      }

      // 精神损害抚慰金
      const mentalDistress = parseFloat(formData.mentalDistress) || 0
      if (mentalDistress > 0) {
        details.push({ name: '精神损害抚慰金', value: mentalDistress.toFixed(2) })
        total += mentalDistress
      }
    }

    this.setData({
      result: {
        total: total.toFixed(2),
        details: details,
        formula: formula || '基础费用合计'
      }
    })

    wx.showToast({
      title: '计算完成',
      icon: 'success'
    })
  },

  /**
   * 重置表单
   */
  reset() {
    this.setData({
      caseType: 'injury',
      disabilityIndex: 0,
      formData: {
        medicalExpense: '',
        lostWages: '',
        nursingFee: '',
        transportationFee: '',
        hospitalFoodFee: '',
        nutritionFee: '',
        urbanIncome: '49283',
        disabilityYears: '20',
        deathYears: '20',
        monthlySalary: '7000',
        dependentExpense: '',
        mentalDistress: ''
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
