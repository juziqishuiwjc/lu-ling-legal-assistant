// pages/webview/webview.js
Page({
  data: {
    url: ''
  },

  onLoad(options) {
    // 获取传递过来的URL参数
    const url = decodeURIComponent(options.url || '')
    this.setData({
      url: url
    })
    console.log('WebView加载URL:', url)
  },

  handleMessage(e) {
    console.log('WebView消息:', e.detail.data)
  }
})
