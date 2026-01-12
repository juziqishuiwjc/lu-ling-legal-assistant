// pages/ai-chat/ai-chat.js
Page({
  data: {
    messages: [],
    inputValue: '',
    isLoading: false,
    scrollTop: 0
  },

  onLoad() {
    // 添加欢迎消息
    this.addMessage('assistant', '您好！我是王吉成律师AI助手。我可以为您提供法律咨询服务。\n\n专业领域：\n• 职务犯罪辩护\n• 经济犯罪辩护\n• 毒品犯罪辩护\n\n请告诉我您的法律问题。')
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  async sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    if (this.data.isLoading) return

    // 添加用户消息
    this.addMessage('user', content)
    this.setData({ inputValue: '', isLoading: true })

    try {
      const response = await this.callAI(content)
      this.addMessage('assistant', response)
    } catch (error) {
      console.error('AI调用失败:', error)
      let errorMsg = '抱歉，服务暂时不可用，请稍后再试。'

      // 根据错误类型给出提示
      if (error.errMsg && error.errMsg.includes('request:fail')) {
        errorMsg = '网络连接失败，请检查网络设置'
      } else if (error.statusCode === 401) {
        errorMsg = 'API配置错误，请联系管理员'
      } else if (error.statusCode === 429) {
        errorMsg = '请求过于频繁，请稍后再试'
      }

      this.addMessage('assistant', errorMsg)
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 调用AI API
  callAI(content) {
    return new Promise((resolve, reject) => {
      const app = getApp()
      const messages = this.getConversationHistory(content)

      wx.request({
        url: app.globalData.apiBaseUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${app.globalData.apiKey}`
        },
        data: {
          model: 'glm-4.6v-flash',
          messages: messages,
          max_tokens: 2000,
          temperature: 0.3
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
            resolve(res.data.choices[0].message.content)
          } else {
            reject(new Error('API响应格式错误'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  // 获取对话历史
  getConversationHistory(userMessage) {
    const systemPrompt = `你是王吉成律师AI助手。请基于中国法律解答问题，使用"王律师认为"的口吻。

专业领域：刑事辩护（职务犯罪、经济犯罪、毒品犯罪）

每次回答结尾：联系王吉成律师 微信号：lawyer_wang_zz

免责声明：仅供参考，重大问题请线下咨询。`

    // 获取最近6条历史消息（3轮对话）
    const history = this.data.messages.slice(-6).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))

    return [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userMessage }
    ]
  },

  // 添加消息
  addMessage(role, content) {
    const messages = this.data.messages
    messages.push({
      role,
      content,
      time: Date.now()
    })
    this.setData({ messages })
    this.scrollToBottom()
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.messages.length * 1000
      })
    }, 100)
  },

  // 清空对话
  clearChat() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            inputValue: ''
          })
          // 重新添加欢迎消息
          this.addMessage('assistant', '您好！我是王吉成律师AI助手。我可以为您提供法律咨询服务。\n\n专业领域：\n• 职务犯罪辩护\n• 经济犯罪辩护\n• 毒品犯罪辩护\n\n请告诉我您的法律问题。')
        }
      }
    })
  }
})
