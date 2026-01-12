// pages/home/home.js
Page({
  data: {
    functions: [
      {
        id: 'lawyer-intro',
        name: '律师介绍',
        icon: '⚖️',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        page: '/pages/index/index'
      },
      {
        id: 'litigation-cost',
        name: '诉讼费用',
        icon: '⚖️',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        page: '/pages/litigation-cost/litigation-cost'
      },
      {
        id: 'interest-calc',
        name: '利息/违约金',
        icon: '📊',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        page: '/pages/interest-penalty/interest-penalty'
      },
      {
        id: 'delay-interest',
        name: '迟延履行利息',
        icon: '💰',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        page: '/pages/delay-interest/delay-interest'
      },
      {
        id: 'loan-interest',
        name: '民间借贷利息',
        icon: '📈',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        page: '/pages/loan-interest/loan-interest'
      },
      {
        id: 'lawyer-fee',
        name: '律师费',
        icon: '💼',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        page: '/pages/lawyer-fee/lawyer-fee'
      },
      {
        id: 'bankruptcy-fee',
        name: '破产管理人报酬',
        icon: '🏛️',
        color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        page: '/pages/bankruptcy-fee/bankruptcy-fee'
      },
      {
        id: 'lpr',
        name: 'LPR',
        icon: '📉',
        color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        page: '/pages/lpr-query/lpr-query'
      },
      {
        id: 'date-calc',
        name: '日期推算',
        icon: '📅',
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        page: '/pages/date-calc/date-calc'
      },
      {
        id: 'traffic-accident',
        name: '交通事故',
        icon: '🚗',
        color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        page: '/pages/traffic-accident/traffic-accident'
      },
      {
        id: 'work-injury',
        name: '工伤赔偿',
        icon: '🏥',
        color: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
        page: '/pages/work-injury/work-injury'
      },
      {
        id: 'compensation',
        name: '经济补偿金',
        icon: '💵',
        color: 'linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)',
        page: '/pages/compensation/compensation'
      },
      {
        id: 'annual-leave',
        name: '带薪年休假',
        icon: '🏖️',
        color: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
        page: '/pages/annual-leave/annual-leave'
      },
      {
        id: 'retirement-age',
        name: '退休年龄计算',
        icon: '👴',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        page: '/pages/retirement-age/retirement-age'
      },
      {
        id: 'small-lawsuit',
        name: '小额诉讼限额',
        icon: '📝',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        page: '/pages/small-claim/small-claim'
      },
      {
        id: 'jurisdiction',
        name: '级别管辖',
        icon: '🏢',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        page: '/pages/jurisdiction/jurisdiction'
      },
      {
        id: 'arbitration-fee',
        name: '仲裁费用',
        icon: '⚖️',
        color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        page: '/pages/arbitration-fee/arbitration-fee'
      },
      {
        id: 'benchmark-rate',
        name: '基准利率',
        icon: '📊',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        page: ''
      },
      {
        id: 'civil-cause',
        name: '民事案由',
        icon: '📚',
        color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        page: '/pages/civil-cause/civil-cause'
      },
      {
        id: 'legal-data',
        name: '常用年度数据',
        icon: '📋',
        color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        page: '/pages/legal-data/legal-data'
      }
    ]
  },

  /**
   * 跳转到用户中心
   */
  goToUserCenter() {
    wx.navigateTo({
      url: '/pages/user-center/user-center'
    })
  },

  /**
   * 处理功能模块点击
   */
  handleFunctionTap(e) {
    const id = e.currentTarget.dataset.id
    const functions = this.data.functions
    const target = functions.find(item => item.id === id)

    if (target && target.page) {
      // 如果有配置页面路径,则跳转
      wx.navigateTo({
        url: target.page,
        fail: () => {
          // 如果跳转失败,使用redirectTo
          wx.redirectTo({
            url: target.page,
            fail: () => {
              wx.showToast({
                title: '功能开发中',
                icon: 'none'
              })
            }
          })
        }
      })
    } else {
      // 如果没有配置页面路径,提示开发中
      wx.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  onShow() {
    // 页面显示时的逻辑
  }
})
