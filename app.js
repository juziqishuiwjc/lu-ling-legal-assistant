// app.js
App({
  onLaunch() {
    // 初始化设备ID
    this.initDeviceId()
    // 初始化用户数据
    this.initUserData()
  },

  // 初始化设备ID
  initDeviceId() {
    let deviceId = wx.getStorageSync('deviceId')

    if (!deviceId) {
      // 生成新的设备ID
      deviceId = this.generateUUID()
      wx.setStorageSync('deviceId', deviceId)
    }

    this.globalData.deviceId = deviceId
    console.log('当前设备ID:', deviceId)
  },

  // 生成UUID（简单版本）
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },

  // 初始化用户数据
  initUserData() {
    const userInfo = wx.getStorageSync('userInfo')

    if (!userInfo) {
      // 新用户，创建初始数据
      const newUserInfo = {
        phone: '', // 手机号后8位
        avatar: '', // 用户头像
        deviceId: this.globalData.deviceId, // 绑定设备ID
        isRegistered: false, // 是否已注册
        isPaid: false, // 是否已付费
        registerDate: '', // 注册日期
        paidDate: '', // 付费日期
        planType: '', // 会员类型：monthly/yearly/trial
        expireDate: '', // 到期日期
        dailyCount: 0, // 今日已使用次数
        lastDate: '', // 上次使用日期
        totalQuestions: 0 // 总提问次数
      }
      wx.setStorageSync('userInfo', newUserInfo)
      this.globalData.userInfo = newUserInfo
    } else {
      this.globalData.userInfo = userInfo

      // 检查设备绑定（新用户没有deviceId字段）
      if (!userInfo.deviceId) {
        // 老用户，补充设备ID
        userInfo.deviceId = this.globalData.deviceId
        this.saveUserInfo()
      } else if (userInfo.deviceId !== this.globalData.deviceId) {
        // 设备ID不匹配，提示用户
        console.warn('设备ID不匹配！')
        console.warn('存储的设备ID:', userInfo.deviceId)
        console.warn('当前设备ID:', this.globalData.deviceId)

        // 清空用户数据（设备不匹配）
        wx.showModal({
          title: '安全提示',
          content: '检测到您的账号在其他设备上登录，为确保账户安全，当前设备已自动退出登录。如需继续使用，请重新设置手机号。',
          showCancel: false,
          success: () => {
            // 重置用户数据
            const resetUserInfo = {
              phone: '',
              deviceId: this.globalData.deviceId,
              isRegistered: false,
              isPaid: false,
              registerDate: '',
              paidDate: '',
              planType: '',
              expireDate: '',
              dailyCount: 0,
              lastDate: '',
              totalQuestions: 0
            }
            wx.setStorageSync('userInfo', resetUserInfo)
            this.globalData.userInfo = resetUserInfo
          }
        })
        return
      }

      // 检查是否是新的一天
      this.checkAndResetDailyCount()
      // 检查是否已被管理员激活
      this.checkUserActivation()
      // 检查会员是否过期
      this.checkMembershipExpire()
    }
  },

  // 检查并重置每日计数
  checkAndResetDailyCount() {
    const today = this.getCurrentDate()
    const userInfo = this.globalData.userInfo

    if (userInfo.lastDate !== today) {
      // 新的一天，重置计数
      userInfo.dailyCount = 0
      userInfo.lastDate = today
      this.saveUserInfo()
    }
  },

  // 获取当前日期字符串
  getCurrentDate() {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  // 保存用户信息
  saveUserInfo() {
    wx.setStorageSync('userInfo', this.globalData.userInfo)
  },

  // 增加使用次数
  incrementUsage() {
    this.globalData.userInfo.dailyCount++
    this.globalData.userInfo.totalQuestions++
    this.saveUserInfo()
  },

  // 检查是否可以使用
  canUseService() {
    const userInfo = this.globalData.userInfo

    // 已付费用户无限制
    if (userInfo.isPaid) {
      return { canUse: true, reason: '' }
    }

    // 免费用户检查每日次数
    if (userInfo.dailyCount >= 5) {
      return {
        canUse: false,
        reason: 'daily_limit',
        message: '今日免费次数已用完（5次/天）\n\n请注册或付费后继续使用'
      }
    }

    return { canUse: true, reason: '' }
  },

  // 检查用户是否已被管理员激活
  checkUserActivation() {
    const userInfo = this.globalData.userInfo

    // 如果用户没有设置手机号后8位，无法检查激活状态
    if (!userInfo.phone) {
      return
    }

    // 从本地存储中获取激活列表
    const activations = wx.getStorageSync('user_activations') || []

    // 查找匹配的激活记录（根据手机号后8位）
    const activation = activations.find(a => a.phone === userInfo.phone)

    if (activation) {
      // 找到激活记录，更新用户状态
      if (!userInfo.isPaid) {
        // 之前不是会员，现在激活了
        userInfo.isPaid = true
        userInfo.isRegistered = true
        userInfo.paidDate = activation.activateTime
        userInfo.registerDate = userInfo.registerDate || activation.activateTime
        userInfo.planType = activation.planType

        // 计算到期日期（传入试用天数）
        const expireDate = this.calculateExpireDate(activation.activateTime, activation.planType, activation.trialDays)
        userInfo.expireDate = expireDate

        this.saveUserInfo()
        console.log('用户已被管理员激活，手机号后8位:', userInfo.phone)
      }
      // 如果已经是会员，不需要重复更新（保持原有数据）
    } else {
      // 没有找到激活记录
      if (userInfo.isPaid) {
        // 用户之前是会员，但现在手机号在激活列表中找不到
        // 说明用户修改了手机号，需要取消会员资格
        console.warn('用户手机号变更且未激活，取消会员资格')
        console.warn('手机号:', userInfo.phone)

        userInfo.isPaid = false
        userInfo.planType = ''
        userInfo.expireDate = ''
        // 保留 registerDate 和 paidDate 作为记录

        this.saveUserInfo()

        wx.showModal({
          title: '会员状态变更',
          content: '检测到您的手机号已变更，且新手机号未激活会员。您的会员资格已取消，如需继续使用会员服务，请联系王吉成律师激活。',
          showCancel: false
        })
      }
    }
  },

  // 计算到期日期
  calculateExpireDate(paidDate, planType, trialDays = null) {
    const date = new Date(paidDate)
    if (planType === 'monthly') {
      date.setMonth(date.getMonth() + 1)
    } else if (planType === 'yearly') {
      date.setFullYear(date.getFullYear() + 1)
    } else if (planType === 'trial' && trialDays) {
      // 试用会员，按天计算
      date.setDate(date.getDate() + parseInt(trialDays))
    }
    return this.formatDate(date)
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 检查会员是否过期
  checkMembershipExpire() {
    const userInfo = this.globalData.userInfo

    if (!userInfo.isPaid || !userInfo.expireDate) {
      return
    }

    const today = this.getCurrentDate()
    if (today > userInfo.expireDate) {
      // 会员已过期
      userInfo.isPaid = false
      userInfo.planType = ''
      userInfo.expireDate = ''
      this.saveUserInfo()
      console.log('会员已过期')
    }
  },

  globalData: {
    // GLM-4.6V-Flash API配置
    glmConfig: {
      apiKey: '933b46ff0beb4fae86c84f78a3f113da.ha63T3nK4sZUOzSN', // GLM-4.6V-Flash API Key
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    },
    deviceId: '', // 设备ID
    userInfo: null // 用户信息
  }
})
