// pages/lpr-query/lpr-query.js
Page({
  data: {
    currentLpr: {
      oneYear: '3.10',
      fiveYear: '3.60'
    },
    currentDate: '2024-10-21',
    legalLimit: '12.4', // 3.10 * 4
    years: ['2024', '2023', '2022', '2021'],
    selectedYear: '2024',
    lprHistory: [
      // 2024年数据（更新至10月）
      { date: '2024-10-21', oneYear: '3.10', fiveYear: '3.60', oneYearChanged: true, fiveYearChanged: true },
      { date: '2024-09-20', oneYear: '3.35', fiveYear: '3.85', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-08-20', oneYear: '3.35', fiveYear: '3.85', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-07-22', oneYear: '3.35', fiveYear: '3.85', oneYearChanged: true, fiveYearChanged: true },
      { date: '2024-06-20', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-05-20', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-04-22', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-03-20', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-02-20', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },
      { date: '2024-01-22', oneYear: '3.45', fiveYear: '3.95', oneYearChanged: false, fiveYearChanged: false },

      // 2023年数据
      { date: '2023-12-20', oneYear: '3.45', fiveYear: '4.20', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-11-20', oneYear: '3.45', fiveYear: '4.20', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-10-20', oneYear: '3.45', fiveYear: '4.20', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-09-20', oneYear: '3.45', fiveYear: '4.20', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-08-21', oneYear: '3.45', fiveYear: '4.20', oneYearChanged: true, fiveYearChanged: false },
      { date: '2023-07-20', oneYear: '3.55', fiveYear: '4.20', oneYearChanged: true, fiveYearChanged: false },
      { date: '2023-06-20', oneYear: '3.55', fiveYear: '4.20', oneYearChanged: false, fiveYearChanged: true },
      { date: '2023-05-22', oneYear: '3.55', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-04-20', oneYear: '3.55', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2023-03-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: true },
      { date: '2023-02-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: true },
      { date: '2023-01-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },

      // 2022年数据
      { date: '2022-12-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-11-21', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-10-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-09-20', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-08-22', oneYear: '3.65', fiveYear: '4.30', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-07-20', oneYear: '3.70', fiveYear: '4.30', oneYearChanged: true, fiveYearChanged: true },
      { date: '2022-06-20', oneYear: '3.70', fiveYear: '4.45', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-05-20', oneYear: '3.70', fiveYear: '4.45', oneYearChanged: false, fiveYearChanged: true },
      { date: '2022-04-20', oneYear: '3.70', fiveYear: '4.60', oneYearChanged: false, fiveYearChanged: true },
      { date: '2022-03-21', oneYear: '3.70', fiveYear: '4.60', oneYearChanged: true, fiveYearChanged: false },
      { date: '2022-02-21', oneYear: '3.70', fiveYear: '4.60', oneYearChanged: false, fiveYearChanged: false },
      { date: '2022-01-20', oneYear: '3.70', fiveYear: '4.60', oneYearChanged: false, fiveYearChanged: false },

      // 2021年数据
      { date: '2021-12-20', oneYear: '3.80', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-11-22', oneYear: '3.80', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-10-20', oneYear: '3.80', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-09-20', oneYear: '3.80', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-08-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: true, fiveYearChanged: false },
      { date: '2021-07-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: true },
      { date: '2021-06-21', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-05-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-04-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-03-22', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-02-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2021-01-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },

      // 2020年数据
      { date: '2020-12-21', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-11-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-10-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-09-21', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-08-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-07-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-06-22', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-05-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-04-20', oneYear: '3.85', fiveYear: '4.65', oneYearChanged: true, fiveYearChanged: true },
      { date: '2020-03-20', oneYear: '4.05', fiveYear: '4.75', oneYearChanged: false, fiveYearChanged: false },
      { date: '2020-02-20', oneYear: '4.05', fiveYear: '4.75', oneYearChanged: true, fiveYearChanged: false },
      { date: '2020-01-20', oneYear: '4.15', fiveYear: '4.80', oneYearChanged: false, fiveYearChanged: false },

      // 2019年数据
      { date: '2019-12-20', oneYear: '4.15', fiveYear: '4.80', oneYearChanged: false, fiveYearChanged: false },
      { date: '2019-11-20', oneYear: '4.15', fiveYear: '4.80', oneYearChanged: false, fiveYearChanged: false },
      { date: '2019-10-21', oneYear: '4.20', fiveYear: '4.85', oneYearChanged: true, fiveYearChanged: true },
      { date: '2019-09-20', oneYear: '4.20', fiveYear: '4.85', oneYearChanged: false, fiveYearChanged: false },
      { date: '2019-08-20', oneYear: '4.25', fiveYear: '4.85', oneYearChanged: true, fiveYearChanged: true }
    ],
    filteredHistory: []
  },

  /**
   * 年份选择改变
   */
  onYearChange(e) {
    const index = parseInt(e.detail.value)
    const year = this.data.years[index]

    this.setData({
      selectedYear: year
    })

    this.filterHistory()
  },

  /**
   * 筛选历史数据
   */
  filterHistory() {
    const selectedYear = this.data.selectedYear
    const filtered = this.data.lprHistory.filter(item => {
      return item.date.indexOf(selectedYear) === 0
    })

    this.setData({
      filteredHistory: filtered
    })
  },

  onLoad() {
    // 初始化显示2024年数据
    this.filterHistory()
  }
})
