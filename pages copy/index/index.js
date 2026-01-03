// pages/index/index.js
const { callGLM4API, getLegalSystemPrompt } = require('../../utils/api.js')

Page({
  data: {
    messages: [], // 消息列表
    inputText: '', // 输入框内容
    hasInput: false, // 是否有输入内容（用于按钮状态）
    loading: false, // 是否正在加载
    scrollToView: '', // 滚动到的位置
    messageId: 0, // 消息ID计数器
    typingTimer: null, // 打字机定时器
    remainingCount: 5, // 剩余次数
    userAvatar: '' // 用户头像
  },

  onLoad() {
    console.log('页面加载完成')

    // 检查API Key是否配置
    const app = getApp()
    console.log('API Key 配置状态:', app.globalData.glmConfig.apiKey ? '已配置' : '未配置')

    // 加载用户头像
    if (app.globalData.userInfo && app.globalData.userInfo.avatar) {
      this.setData({
        userAvatar: app.globalData.userInfo.avatar
      })
    }

    // 计算剩余次数
    this.updateRemainingCount()

    if (!app.globalData.glmConfig.apiKey) {
      wx.showModal({
        title: '提示',
        content: '请先在app.js中配置您的GLM-4.6 API Key',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            console.log('用户确认配置API Key')
          }
        }
      })
    }
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.typingTimer) {
      clearInterval(this.data.typingTimer)
      this.data.typingTimer = null
    }
  },

  /**
   * 输入框内容变化
   */
  onInputChange(e) {
    console.log('输入框内容变化:', e.detail.value)
    console.log('输入框长度:', e.detail.value.length)
    console.log('trim后长度:', e.detail.value.trim().length)

    const trimmedValue = e.detail.value.trim()
    const hasInput = trimmedValue.length > 0

    this.setData({
      inputText: e.detail.value,
      hasInput: hasInput
    })

    console.log('设置后的 inputText:', this.data.inputText)
    console.log('hasInput:', hasInput)
    console.log('按钮应该启用:', hasInput)
  },

  /**
   * 发送消息
   */
  sendMessage() {
    console.log('========== sendMessage 被调用 ==========')
    console.log('inputText:', this.data.inputText)
    console.log('hasInput:', this.data.hasInput)
    console.log('loading:', this.data.loading)
    console.log('attachment:', this.data.attachment)

    const app = getApp()
    console.log('app.globalData.userInfo:', app.globalData.userInfo)

    // 检查是否可以使用服务
    const checkResult = app.canUseService()
    console.log('checkResult:', checkResult)

    if (!checkResult.canUse) {
      console.log('不能使用服务，原因:', checkResult.reason)
      // 超出限制，自动跳转到升级页面
      if (checkResult.reason === 'daily_limit') {
        wx.showToast({
          title: '今日免费次数已用完',
          icon: 'none',
          duration: 2000
        })
        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/upgrade/upgrade'
          })
        }, 500)
      }
      return
    }

    const content = this.data.inputText.trim()
    console.log('trimmed content:', content)

    // 检查是否有输入内容
    if (!content) {
      console.log('没有内容')
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    // 检查是否是"继续"命令
    if (content === '继续' || content === '继续 ') {
      console.log('检测到"继续"命令')

      // 检查是否有上一条助手回复
      const lastMessage = this.data.messages[this.data.messages.length - 1]
      if (!lastMessage || lastMessage.role !== 'assistant') {
        wx.showToast({
          title: '没有可继续的内容',
          icon: 'none'
        })
        return
      }

      // 添加"继续"指令作为用户消息，让AI基于上一条回答继续
      const continueMessage = {
        id: this.data.messageId,
        role: 'user',
        content: '请继续深入分析上述问题，提供更详细的说明和建议。'
      }

      this.setData({
        messages: [...this.data.messages, continueMessage],
        inputText: '',
        hasInput: false,
        loading: true,
        messageId: this.data.messageId + 1,
        scrollToView: `msg-${this.data.messageId}`
      })

      this.scrollToBottom()
      this.getAssistantResponse(continueMessage.content)
      return
    }

    if (this.data.loading) {
      console.log('正在加载中，忽略此次点击')
      return
    }

    console.log('开始发送消息')

    // 增加使用次数
    app.incrementUsage()

    // 更新页面显示剩余次数
    this.updateRemainingCount()

    // 添加用户消息
    const userMessage = {
      id: this.data.messageId,
      role: 'user',
      content: content
    }

    console.log('用户消息:', userMessage)

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      hasInput: false,
      loading: true,
      messageId: this.data.messageId + 1,
      scrollToView: `msg-${this.data.messageId}`
    })

    console.log('用户消息已添加到列表')

    // 滚动到底部
    this.scrollToBottom()

    // 调用API获取回复
    console.log('准备调用 API')
    this.getAssistantResponse(userMessage.content)
  },

  /**
   * 更新剩余次数显示
   */
  updateRemainingCount() {
    const app = getApp()
    const userInfo = app.globalData.userInfo

    if (userInfo.isPaid) {
      // 已付费用户，显示无限制
      this.setData({
        remainingCount: '无限'
      })
    } else {
      // 免费用户，显示剩余次数
      const remaining = 5 - userInfo.dailyCount
      this.setData({
        remainingCount: Math.max(0, remaining)
      })
    }
  },

  /**
   * 获取助手回复
   */
  async getAssistantResponse(userMessage) {
    console.log('开始获取助手回复，用户消息:', userMessage)

    try {
      // 只获取最近1条对话作为上下文
      let recentMessages = this.data.messages.slice(-1)

      // 严格限制单条消息长度（提高速度）
      recentMessages = recentMessages.map(msg => {
        const maxLength = 300 // 每条消息最多300字符（降低以提高速度）
        if (msg.content.length > maxLength) {
          return {
            ...msg,
            content: msg.content.substring(0, maxLength) + '...'
          }
        }
        return msg
      })

      const totalLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0)
      console.log('历史消息数量:', recentMessages.length)
      console.log('历史消息总长度:', totalLength, '字符')

      // 调用GLM-4.6V-Flash API
      console.log('调用 GLM-4.6V-Flash API...')

      // 调用API获取完整回复
      const fullResponse = await callGLM4API(
        recentMessages,
        getLegalSystemPrompt()
      )

      console.log('API 返回成功，开始打字机效果')

      // 先添加一个空的助手消息，并关闭loading
      const assistantMessage = {
        id: this.data.messageId,
        role: 'assistant',
        content: '',
        isTyping: true // 标记为正在打字
      }

      this.setData({
        messages: [...this.data.messages, assistantMessage],
        messageId: this.data.messageId + 1,
        loading: false, // 关闭加载动画
        scrollToView: `msg-${this.data.messageId}`
      })

      // 滚动到底部
      this.scrollToBottom()

      // 开始打字机效果
      this.typeWriterEffect(this.data.messageId - 1, fullResponse)

    } catch (error) {
      console.error('获取助手回复失败:', error)
      this.setData({
        loading: false
      })

      // 添加错误提示消息
      const errorMessage = {
        id: this.data.messageId,
        role: 'assistant',
        content: '抱歉，我暂时无法回答您的问题。请检查网络连接或稍后重试。'
      }

      this.setData({
        messages: [...this.data.messages, errorMessage],
        messageId: this.data.messageId + 1,
        scrollToView: `msg-${this.data.messageId}`
      })

      this.scrollToBottom()
    }
  },

  /**
   * 打字机效果 - 快速流式输出
   */
  typeWriterEffect(messageId, fullText) {
    // 清除之前的定时器
    if (this.data.typingTimer) {
      clearInterval(this.data.typingTimer)
    }

    let currentIndex = 0
    const messages = [...this.data.messages]
    const messageIndex = messages.findIndex(m => m.id === messageId)

    if (messageIndex === -1) {
      console.error('找不到消息')
      return
    }

    // 超快速打字（每5ms显示15个字符，极速显示）
    const speed = 5
    const charsPerTick = 15

    this.data.typingTimer = setInterval(() => {
      if (currentIndex >= fullText.length) {
        // 打字完成
        clearInterval(this.data.typingTimer)
        this.data.typingTimer = null

        // 更新消息状态
        messages[messageIndex].isTyping = false
        this.setData({
          messages: messages,
          loading: false
        })

        console.log('流式输出完成')
        return
      }

      // 添加下一批字符（每次显示更多，更快）
      currentIndex = Math.min(currentIndex + charsPerTick, fullText.length)
      const displayedText = fullText.substring(0, currentIndex)

      messages[messageIndex].content = displayedText
      this.setData({
        messages: messages
      })

      // 滚动到底部（保持最新内容可见）
      this.scrollToBottom()

    }, speed)
  },

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.select('.chat-area').scrollOffset()
      query.exec((res) => {
        if (res[0]) {
          const scrollTop = res[0].scrollHeight
          wx.pageScrollTo({
            scrollTop: scrollTop,
            duration: 300
          })
        }
      })
    }, 100)
  },

  /**
   * 清空聊天记录
   */
  clearChat() {
    wx.showModal({
      title: '提示',
      content: '确定要清空聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            messageId: 0
          })
        }
      }
    })
  },

  /**
   * 跳转到用户中心
   */
  goToUserCenter() {
    wx.navigateTo({
      url: '/pages/user-center/user-center'
    })
  }
})
