// pages/legal-data/legal-data.js
Page({
  data: {
    years: ['2023年', '2022年', '2021年'],
    selectedYear: 0,
    data: {
      urbanIncome: '45,554元',
      ruralIncome: '21,358元',
      avgWage: '94,742元',
      consumption: '27,733元'
    },
    province: '江西省'
  },

  /**
   * 年份选择改变
   */
  onYearChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({
      selectedYear: index
    })

    this.updateData(index)
  },

  /**
   * 更新数据（江西省数据）
   */
  updateData(index) {
    const dataList = [
      {
        // 2023年江西省数据
        urbanIncome: '45,554元',
        ruralIncome: '21,358元',
        avgWage: '94,742元',
        consumption: '27,733元'
      },
      {
        // 2022年江西省数据
        urbanIncome: '43,697元',
        ruralIncome: '19,936元',
        avgWage: '87,972元',
        consumption: '26,512元'
      },
      {
        // 2021年江西省数据
        urbanIncome: '41,684元',
        ruralIncome: '18,684元',
        avgWage: '83,766元',
        consumption: '25,376元'
      }
    ]

    this.setData({
      data: dataList[index]
    })
  },

  onLoad() {
    // 页面加载
  }
})
