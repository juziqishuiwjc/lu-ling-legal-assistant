// pages/user-center/user-center.js
Page({
  data: {
    phone: '', // 手机号后8位
    avatar: '', // 用户头像
    isPaid: false, // 是否已付费
    isRegistered: false, // 是否已注册
    dailyCount: 0, // 今日使用次数
    registerDate: '', // 注册时间
    paidDate: '', // 付费时间
    planType: '', // 会员类型：monthly/yearly
    expireDate: '', // 到期日期
    remainingDays: '' // 剩余时间
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    // 每次显示页面时重新加载用户信息
    this.loadUserInfo()
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (userInfo) {
      this.setData({
        phone: userInfo.phone || '',
        avatar: userInfo.avatar || '',
        isPaid: userInfo.isPaid || false,
        isRegistered: userInfo.isRegistered || false,
        dailyCount: userInfo.dailyCount || 0,
        registerDate: userInfo.registerDate || '',
        paidDate: userInfo.paidDate || '',
        planType: userInfo.planType || '',
        expireDate: userInfo.expireDate || ''
      })

      // 计算剩余时间
      this.calculateRemainingDays()
    }
  },

  /**
   * 修改头像
   */
  changeAvatar() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        // 显示确认弹窗
        wx.showModal({
          title: '确认更换头像',
          content: '确定要使用这张图片作为头像吗？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 保存头像路径
              const app = getApp()
              app.globalData.userInfo.avatar = tempFilePath
              app.saveUserInfo()

              self.setData({
                avatar: tempFilePath
              })

              wx.showToast({
                title: '头像更新成功',
                icon: 'success'
              })
            }
          }
        })
      }
    })
  },

  /**
   * 计算剩余时间
   */
  calculateRemainingDays() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (!userInfo.isPaid || !userInfo.expireDate) {
      this.setData({
        remainingDays: ''
      })
      return
    }

    const today = new Date()
    const expireDate = new Date(userInfo.expireDate)
    const diffTime = expireDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      this.setData({
        remainingDays: `剩余${diffDays}天`
      })
    } else if (diffDays === 0) {
      this.setData({
        remainingDays: '今天到期'
      })
    } else {
      this.setData({
        remainingDays: '已到期'
      })
    }
  },

  /**
   * 跳转到升级页面
   */
  goToUpgrade() {
    wx.navigateTo({
      url: '/pages/upgrade/upgrade'
    })
  },

  /**
   * 设置手机号
   */
  setPhone() {
    wx.showModal({
      title: '设置手机号',
      content: '请输入您的手机号后8位（用于律师确认后开通会员）',
      editable: true,
      placeholderText: '例如：12345678',
      success: (res) => {
        if (res.confirm) {
          const phone = res.content.trim()

          // 验证输入：必须恰好是8位数字
          if (!phone) {
            wx.showToast({
              title: '请输入手机号',
              icon: 'none'
            })
            return
          }

          if (!/^\d{8}$/.test(phone)) {
            // 检查是否包含非数字字符
            if (/\D/.test(phone)) {
              wx.showToast({
                title: '只能输入数字',
                icon: 'none'
              })
              return
            }

            // 检查长度
            if (phone.length < 8) {
              wx.showToast({
                title: '手机号不足8位',
                icon: 'none'
              })
              return
            }

            if (phone.length > 8) {
              wx.showToast({
                title: '手机号超过8位',
                icon: 'none'
              })
              return
            }

            // 其他情况
            wx.showToast({
              title: '请输入8位数字',
              icon: 'none'
            })
            return
          }

          // 保存手机号
          const app = getApp()
          const wasPaid = app.globalData.userInfo.isPaid // 记录修改前的会员状态
          app.globalData.userInfo.phone = phone
          app.saveUserInfo()

          // 重新检查激活状态（如果手机号变更，可能会影响会员状态）
          app.checkUserActivation()

          // 重新加载页面数据
          this.loadUserInfo()

          this.setData({
            phone: phone
          })

          // 如果修改手机号导致会员状态变化，提示用户
          const isPaid = app.globalData.userInfo.isPaid
          if (wasPaid && !isPaid) {
            wx.showModal({
              title: '会员状态变更',
              content: '手机号修改成功。由于新手机号未激活会员，您的会员资格已取消。',
              showCancel: false
            })
          } else {
            wx.showToast({
              title: '设置成功',
              icon: 'success'
            })
          }
        }
      }
    })
  },

  /**
   * 复制微信号
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
  },

  /**
   * 跳转到管理后台（长按管理卡片）
   */
  goToAdmin() {
    // 要求输入管理员密码
    wx.showModal({
      title: '管理员验证',
      content: '请输入管理员密码',
      editable: true,
      placeholderText: '请输入密码',
      success: (res) => {
        if (res.confirm) {
          const password = res.content.trim()
          // 验证密码（王吉成律师设置的密码）
          if (password === 'wangjicheng2024') {
            wx.showToast({
              title: '验证成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/admin/admin'
              })
            }, 500)
          } else {
            wx.showToast({
              title: '密码错误',
              icon: 'none'
            })
          }
        }
      }
    })
  }
})
