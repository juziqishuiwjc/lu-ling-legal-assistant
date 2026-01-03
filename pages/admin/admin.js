// pages/admin/admin.js
Page({
  data: {
    phoneInput: '', // 输入的手机号
    selectedPlan: 'monthly', // 选中的套餐
    trialDays: '', // 试用天数
    searchKeyword: '', // 搜索关键词
    activatedUsers: [], // 已激活用户列表
    filteredUsers: [], // 过滤后的用户列表
    totalUsers: 0, // 总用户数
    paidUsers: 0, // 付费用户数
    yearlyUsers: 0 // 年付用户数
  },

  onLoad() {
    this.loadActivatedUsers()
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e) {
    this.setData({
      phoneInput: e.detail.value
    })
  },

  /**
   * 选择套餐
   */
  selectPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({
      selectedPlan: plan,
      trialDays: '' // 切换套餐时清空试用天数
    })
  },

  /**
   * 试用天数输入
   */
  onTrialDaysInput(e) {
    this.setData({
      trialDays: e.detail.value
    })
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    })
    this.filterUsers(keyword)
  },

  /**
   * 激活用户
   */
  activateUser() {
    const phone = this.data.phoneInput.trim()

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

    // 如果选择试用套餐，验证试用天数
    if (this.data.selectedPlan === 'trial') {
      const trialDays = this.data.trialDays
      if (!trialDays || trialDays <= 0) {
        wx.showToast({
          title: '请输入有效的试用天数',
          icon: 'none'
        })
        return
      }
      if (trialDays > 365) {
        wx.showToast({
          title: '试用天数不能超过365天',
          icon: 'none'
        })
        return
      }
    }

    // 检查是否已经激活
    const existingUser = this.data.activatedUsers.find(u => u.phone === phone)
    if (existingUser) {
      wx.showModal({
        title: '提示',
        content: '该用户已经激活过了，是否要更新套餐？',
        success: (res) => {
          if (res.confirm) {
            this.updateUserPlan(phone)
          }
        }
      })
      return
    }

    // 构建套餐描述
    let planDesc = ''
    if (this.data.selectedPlan === 'trial') {
      planDesc = `试用会员（${this.data.trialDays}天）`
    } else if (this.data.selectedPlan === 'yearly') {
      planDesc = '年付会员'
    } else {
      planDesc = '月付会员'
    }

    // 激活用户
    wx.showModal({
      title: '确认激活',
      content: `确认为手机号后8位 ****${phone} 的用户开通${planDesc}吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doActivateUser(phone)
        }
      }
    })
  },

  /**
   * 执行激活
   */
  doActivateUser(phone) {
    wx.showLoading({
      title: '激活中...',
      mask: true
    })

    const app = getApp()
    const today = app.getCurrentDate()
    const planType = this.data.selectedPlan
    const trialDays = this.data.selectedPlan === 'trial' ? parseInt(this.data.trialDays) : null

    // 创建激活记录
    const activation = {
      phone: phone,
      planType: planType,
      trialDays: trialDays, // 试用天数（仅试用套餐有值）
      activateTime: today,
      timestamp: Date.now()
    }

    // 保存到本地存储
    let activations = wx.getStorageSync('user_activations') || []
    activations.push(activation)
    wx.setStorageSync('user_activations', activations)

    // 更新全局数据（如果当前登录用户匹配）
    if (app.globalData.userInfo && app.globalData.userInfo.phone === phone) {
      app.globalData.userInfo.isPaid = true
      app.globalData.userInfo.isRegistered = true
      app.globalData.userInfo.paidDate = today
      app.globalData.userInfo.registerDate = app.globalData.userInfo.registerDate || today
      app.globalData.userInfo.planType = planType

      // 计算并保存到期日期
      const expireDate = app.calculateExpireDate(today, planType, trialDays)
      app.globalData.userInfo.expireDate = expireDate

      app.saveUserInfo()
    }

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '激活成功',
        icon: 'success'
      })

      // 清空输入
      this.setData({
        phoneInput: ''
      })

      // 重新加载用户列表
      this.loadActivatedUsers()
    }, 500)
  },

  /**
   * 更新用户套餐
   */
  updateUserPlan(phone) {
    // 如果选择试用套餐，验证试用天数
    if (this.data.selectedPlan === 'trial') {
      const trialDays = this.data.trialDays
      if (!trialDays || trialDays <= 0) {
        wx.showToast({
          title: '请输入有效的试用天数',
          icon: 'none'
        })
        return
      }
      if (trialDays > 365) {
        wx.showToast({
          title: '试用天数不能超过365天',
          icon: 'none'
        })
        return
      }
    }

    wx.showLoading({
      title: '更新中...',
      mask: true
    })

    const app = getApp()
    let activations = wx.getStorageSync('user_activations') || []
    const index = activations.findIndex(u => u.phone === phone)

    if (index !== -1) {
      const today = app.getCurrentDate()
      const trialDays = this.data.selectedPlan === 'trial' ? parseInt(this.data.trialDays) : null

      activations[index].planType = this.data.selectedPlan
      activations[index].trialDays = trialDays
      activations[index].activateTime = today
      activations[index].timestamp = Date.now()

      wx.setStorageSync('user_activations', activations)

      // 更新全局数据
      if (app.globalData.userInfo && app.globalData.userInfo.phone === phone) {
        app.globalData.userInfo.paidDate = today
        app.globalData.userInfo.planType = this.data.selectedPlan

        // 重新计算到期日期
        const expireDate = app.calculateExpireDate(today, this.data.selectedPlan, trialDays)
        app.globalData.userInfo.expireDate = expireDate

        app.saveUserInfo()
      }
    }

    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })

      this.loadActivatedUsers()
    }, 500)
  },

  /**
   * 加载已激活用户列表
   */
  loadActivatedUsers() {
    const activations = wx.getStorageSync('user_activations') || []
    const app = getApp()
    const today = app.getCurrentDate()

    // 为每个用户计算到期日期和剩余天数
    const usersWithInfo = activations.map(user => {
      // 计算到期日期
      const expireDate = app.calculateExpireDate(user.activateTime, user.planType, user.trialDays)

      // 计算剩余天数
      const todayDate = new Date(today)
      const expireDateTime = new Date(expireDate)
      const diffTime = expireDateTime - todayDate
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let remainingText = ''
      let isExpired = false

      if (diffDays < 0) {
        remainingText = '已到期'
        isExpired = true
      } else if (diffDays === 0) {
        remainingText = '今天到期'
      } else {
        remainingText = `剩余${diffDays}天`
      }

      return {
        ...user,
        expireDate: expireDate,
        remainingDays: remainingText,
        isExpired: isExpired
      }
    })

    // 按时间倒序排列
    usersWithInfo.sort((a, b) => b.timestamp - a.timestamp)

    // 计算统计数据
    const paidUsers = usersWithInfo.length
    const yearlyUsers = usersWithInfo.filter(u => u.planType === 'yearly').length
    const totalUsers = paidUsers + 10 // 假设有10个免费用户（示例数据）

    this.setData({
      activatedUsers: usersWithInfo,
      filteredUsers: usersWithInfo,
      totalUsers: totalUsers,
      paidUsers: paidUsers,
      yearlyUsers: yearlyUsers
    })
  },

  /**
   * 过滤用户列表
   */
  filterUsers(keyword) {
    if (!keyword) {
      this.setData({
        filteredUsers: this.data.activatedUsers
      })
      return
    }

    const filtered = this.data.activatedUsers.filter(user =>
      user.phone.includes(keyword)
    )

    this.setData({
      filteredUsers: filtered
    })
  },

  /**
   * 显示用户详细信息
   */
  showUserInfo(e) {
    const user = e.currentTarget.dataset.user

    // 检查用户是否已注册（通过查看本地用户信息）
    const app = getApp()
    const userInfo = app.globalData.userInfo
    const isRegistered = userInfo && userInfo.phone === user.phone && userInfo.isRegistered

    // 构建套餐名称
    let planName = ''
    if (user.planType === 'trial') {
      planName = `试用会员（${user.trialDays}天）`
    } else if (user.planType === 'yearly') {
      planName = '年付会员'
    } else {
      planName = '月付会员'
    }

    // 显示详细信息弹窗
    wx.showModal({
      title: '用户详细信息',
      content: `手机号后8位：${user.phone}

注册状态：${isRegistered ? '已注册用户' : '未注册用户'}

会员类型：${planName}

激活时间：${user.activateTime}

到期时间：${user.expireDate}

剩余时间：${user.remainingDays}`,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  /**
   * 返回首页
   */
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
