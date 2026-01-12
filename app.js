// app.js
App({
  onLaunch() {
    console.log('庐陵吉成法答小程序启动')
  },

  globalData: {
    // 应用全局数据
    userInfo: null,
    // 智谱AI配置
    apiKey: '933b46ff0beb4fae86c84f78a3f113da.ha63T3nK4sZUOzSN', // 智谱AI API Key
    apiBaseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  }
})
