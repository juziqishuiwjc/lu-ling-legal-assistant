// pages/index/index.js
Page({
  data: {
    phoneNumber: '18307965661',
    wechatId: 'lawyer_wang_zz'
  },

  onLoad() {
    console.log('律师介绍页面加载完成')
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 跳转到王吉成律师主页
   */
  goToLawyerWebsite() {
    const url = 'https://abc.juziqishui.top/'

    // 使用 web-view 跳转（需要配置业务域名）
    wx.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
      fail: (err) => {
        console.error('跳转失败:', err)
        // 降级：复制链接到剪贴板
        wx.setClipboardData({
          data: url,
          success: () => {
            wx.showModal({
              title: '链接已复制',
              content: '请在浏览器中打开：https://abc.juziqishui.top/',
              showCancel: false
            })
          }
        })
      }
    })
  },

  /**
   * 拨打电话
   */
  makePhoneCall() {
    const phoneNumber = this.data.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: (err) => {
        console.error('拨打电话失败:', err)
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 复制微信号
   */
  copyWeChat() {
    const wechatId = this.data.wechatId
    wx.setClipboardData({
      data: wechatId,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success',
          duration: 2000
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  }
})
