// utils/api.js
const app = getApp()

/**
 * 调用GLM-4.6V-Flash API进行法律问答
 * @param {Array} messages - 消息历史数组
 * @param {String} systemPrompt - 系统提示词
 * @returns {Promise<String>} - 返回助手的回复
 */
function callGLM4API(messages, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    const config = app.globalData.glmConfig

    if (!config.apiKey) {
      wx.showToast({
        title: '请先配置API Key',
        icon: 'none'
      })
      reject(new Error('API Key未配置'))
      return
    }

    // 检查用户付费状态，设置不同的max_tokens
    const userInfo = app.globalData.userInfo
    const isPaid = userInfo && userInfo.isPaid

    // 非会员：2000 tokens，会员：6000 tokens（3倍）
    const maxTokens = isPaid ? 6000 : 2000

    console.log('用户付费状态:', isPaid ? '会员' : '非会员')
    console.log('max_tokens设置:', maxTokens)

    // 构建请求消息
    const requestMessages = []

    // 添加系统提示词
    if (systemPrompt) {
      requestMessages.push({
        role: 'system',
        content: systemPrompt
      })
    }

    // 添加历史消息
    messages.forEach(msg => {
      requestMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })
    })

    // 调用GLM-4.6V-Flash API
    console.log('========== 开始调用 GLM-4.6V-Flash API ==========')
    console.log('API URL:', config.baseUrl)
    console.log('API Key 前10位:', config.apiKey.substring(0, 10))
    console.log('请求参数:', {
      model: 'glm-4.6v-flash',
      messages: requestMessages,
      temperature: 0.3,  // 降低随机性，提高速度
      top_p: 0.7,        // 降低采样范围，提高速度
      max_tokens: maxTokens
    })

    wx.request({
      url: config.baseUrl,
      method: 'POST',
      timeout: 120000, // 设置超时时间为120秒（2分钟），适应长回复
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      data: {
        model: 'glm-4.6v-flash',
        messages: requestMessages,
        temperature: 0.3,  // 降低随机性，提高速度
        top_p: 0.7,        // 降低采样范围，提高速度
        max_tokens: maxTokens
      },
      success: (res) => {
        console.log('========== API 响应 ==========')
        console.log('状态码:', res.statusCode)
        console.log('响应数据:', res.data)

        if (res.statusCode === 200) {
          if (res.data.choices && res.data.choices.length > 0) {
            console.log('提取回复内容成功')
            resolve(res.data.choices[0].message.content)
          } else {
            console.error('API返回格式异常，缺少choices字段')
            reject(new Error('API返回格式异常'))
          }
        } else if (res.statusCode === 401) {
          console.error('API Key 无效或已过期')
          wx.showToast({
            title: 'API Key无效，请检查配置',
            icon: 'none',
            duration: 3000
          })
          reject(new Error('API Key无效'))
        } else if (res.statusCode === 429) {
          console.error('请求频率超限或余额不足')
          console.error('详细错误:', res.data)
          wx.showModal({
            title: 'API调用失败',
            content: '可能是以下原因：\n1. API Key余额不足\n2. 请求频率过高\n3. 免费额度已用完\n\n请访问智谱AI控制台查看详情',
            showCancel: false,
            confirmText: '知道了'
          })
          reject(new Error('请求频率超限或余额不足'))
        } else {
          console.error('API响应异常:', res)
          wx.showToast({
            title: `API错误(${res.statusCode})`,
            icon: 'none'
          })
          reject(new Error(`API错误: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        console.error('========== API 调用失败 ==========')
        console.error('错误对象:', err)
        console.error('错误信息:', JSON.stringify(err))

        // 详细的错误提示
        let errorMsg = '网络错误'
        let suggestions = []

        if (err.errMsg && err.errMsg.includes('timeout')) {
          errorMsg = '请求超时'
          suggestions = [
            isPaid ? '会员回复内容较长，请耐心等待' : '网络连接较慢',
            '请检查网络连接是否稳定',
            '稍后重试（已将超时时间延长至2分钟）',
            '如频繁超时，请检查智谱AI控制台的API余额'
          ]
        } else if (err.errMsg && err.errMsg.includes('fail')) {
          errorMsg = '网络连接失败'
          suggestions = [
            '请检查网络连接',
            '确认网络可以访问外网',
            '尝试切换WiFi/4G/5G网络'
          ]
        }

        wx.showModal({
          title: 'API调用失败',
          content: `${errorMsg}\n\n可能的原因：\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n技术信息：\n${JSON.stringify(err)}`,
          showCancel: false,
          confirmText: '知道了'
        })

        reject(err)
      }
    })
  })
}

/**
 * 获取法律专用的系统提示词
 * @returns {String} - 系统提示词
 */
function getLegalSystemPrompt() {
  return `你是王吉成律师AI助手。基于中国法律解答，用"王律师认为"。
结尾：联系王吉成律师 微信号:lawyer_wang_zz
免责：仅供参考，重大问题请线下咨询。`
}

module.exports = {
  callGLM4API,
  getLegalSystemPrompt
}
