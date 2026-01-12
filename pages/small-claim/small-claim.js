// pages/small-claim/small-claim.js
Page({
  data: {
    provinces: [
      '全国平均', '北京市', '上海市', '广东省', '江苏省', '浙江省',
      '山东省', '河南省', '四川省', '湖北省', '湖南省', '河北省',
      '福建省', '安徽省', '陕西省', '江西省', '重庆市', '天津市',
      '辽宁省', '云南省', '广西', '山西省', '吉林省', '黑龙江省',
      '内蒙古', '甘肃', '海南', '宁夏', '青海', '新疆', '贵州', '西藏'
    ],
    selectedProvince: 0,
    limitData: {
      limit: '43,565元',
      effectiveDate: '2024年'
    },
    limitList: [
      { id: 1, province: '全国平均', limit: '43,565元', effectiveDate: '2024年' },
      { id: 2, province: '北京市', limit: '55,755元', effectiveDate: '2024年' },
      { id: 3, province: '上海市', limit: '54,858元', effectiveDate: '2024年' },
      { id: 4, province: '广东省', limit: '49,962元', effectiveDate: '2024年' },
      { id: 5, province: '江苏省', limit: '48,789元', effectiveDate: '2024年' },
      { id: 6, province: '浙江省', limit: '47,852元', effectiveDate: '2024年' },
      { id: 7, province: '山东省', limit: '46,523元', effectiveDate: '2024年' },
      { id: 8, province: '河南省', limit: '43,120元', effectiveDate: '2024年' },
      { id: 9, province: '四川省', limit: '43,089元', effectiveDate: '2024年' },
      { id: 10, province: '湖北省', limit: '44,586元', effectiveDate: '2024年' },
      { id: 11, province: '湖南省', limit: '43,345元', effectiveDate: '2024年' },
      { id: 12, province: '河北省', limit: '42,567元', effectiveDate: '2024年' },
      { id: 13, province: '福建省', limit: '45,678元', effectiveDate: '2024年' },
      { id: 14, province: '安徽省', limit: '42,890元', effectiveDate: '2024年' },
      { id: 15, province: '陕西省', limit: '41,234元', effectiveDate: '2024年' },
      { id: 16, province: '江西省', limit: '38,382元', effectiveDate: '2024年' },
      { id: 17, province: '重庆市', limit: '43,456元', effectiveDate: '2024年' },
      { id: 18, province: '天津市', limit: '52,345元', effectiveDate: '2024年' },
      { id: 19, province: '辽宁省', limit: '43,012元', effectiveDate: '2024年' },
      { id: 20, province: '云南省', limit: '40,234元', effectiveDate: '2024年' },
      { id: 21, province: '广西', limit: '39,567元', effectiveDate: '2024年' },
      { id: 22, province: '山西省', limit: '41,890元', effectiveDate: '2024年' },
      { id: 23, province: '吉林省', limit: '40,123元', effectiveDate: '2024年' },
      { id: 24, province: '黑龙江省', limit: '38,456元', effectiveDate: '2024年' },
      { id: 25, province: '内蒙古', limit: '40,567元', effectiveDate: '2024年' },
      { id: 26, province: '甘肃省', limit: '38,234元', effectiveDate: '2024年' },
      { id: 27, province: '海南省', limit: '40,890元', effectiveDate: '2024年' },
      { id: 28, province: '宁夏', limit: '39,456元', effectiveDate: '2024年' },
      { id: 29, province: '青海省', limit: '38,123元', effectiveDate: '2024年' },
      { id: 30, province: '新疆', limit: '39,789元', effectiveDate: '2024年' },
      { id: 31, province: '贵州省', limit: '39,234元', effectiveDate: '2024年' },
      { id: 32, province: '西藏', limit: '38,567元', effectiveDate: '2024年' }
    ]
  },

  /**
   * 省份选择改变
   */
  onProvinceChange(e) {
    const index = parseInt(e.detail.value)
    const limitData = this.data.limitList[index]

    this.setData({
      selectedProvince: index,
      limitData: limitData
    })
  },

  onLoad() {
    // 页面加载
  }
})
