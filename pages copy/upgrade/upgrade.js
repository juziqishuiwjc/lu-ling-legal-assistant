// pages/upgrade/upgrade.js
Page({
  data: {
    userInfo: null
  },

  onLoad() {
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 联系律师（月付）
   */
  contactLawyer() {
    console.log('========== 点击了月付按钮 ==========')
    wx.showModal({
      title: '开通专业版 - 月付',
      content: '请添加王吉成律师微信：lawyer_wang_zz\n\n转账金额：¥99\n转账时请备注您的手机号后8位\n\n5分钟内为您开通月卡会员',
      confirmText: '复制微信',
      cancelText: '知道了',
      success: (res) => {
        console.log('用户选择:', res.confirm)
        if (res.confirm) {
          console.log('开始复制微信号')
          this.copyWechatId()
        }
      },
      fail: (err) => {
        console.error('弹窗失败:', err)
      }
    })
  },

  /**
   * 联系律师（年付）
   */
  contactLawyerYearly() {
    console.log('========== 点击了年付按钮 ==========')
    wx.showModal({
      title: '开通专业版 - 年付',
      content: '请添加王吉成律师微信：lawyer_wang_zz\n\n转账金额：¥996（年付优惠）\n转账时请备注您的手机号后8位\n\n5分钟内为您开通年费会员',
      confirmText: '复制微信',
      cancelText: '知道了',
      success: (res) => {
        console.log('用户选择:', res.confirm)
        if (res.confirm) {
          console.log('开始复制微信号')
          this.copyWechatId()
        }
      },
      fail: (err) => {
        console.error('弹窗失败:', err)
      }
    })
  },

  /**
   * 复制微信号
   */
  copyWechatId() {
    console.log('执行复制微信号')
    wx.setClipboardData({
      data: 'lawyer_wang_zz',
      success: () => {
        console.log('复制成功')
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('复制失败:', err)
        wx.showToast({
          title: '复制失败，请手动复制',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 复制微信号（底部卡片用）
   */
  copyWechat() {
    wx.setClipboardData({
      data: 'lawyer_wang_zz',
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        })
      }
    })
  }
})
