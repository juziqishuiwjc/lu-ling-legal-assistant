// pages/jurisdiction/jurisdiction.js
Page({
  data: {
    currentTab: 0
  },

  /**
   * 切换Tab
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      currentTab: index
    })
  },

  onLoad() {
    // 页面加载
  }
})
