# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

庐陵吉成法答 - 基于GLM-4 API的法律问答微信小程序，为江西吉泰律师事务所王吉成律师的AI法律助手。

**核心功能**：
- 智能法律问答（GLM-4.6V-Flash模型）
- 用户次数限制与付费会员系统
- 设备绑定安全机制
- 管理后台（密码保护）
- 用户中心与会员管理

**技术栈**：微信小程序原生框架 + JavaScript ES6+ + WXSS

---

## 开发工作流

### 调试小程序

**在微信开发者工具中调试**：
```bash
# 打开微信开发者工具，选择项目目录：
C:\Users\橘子汽水\ClaudeCode\xiaochengxu

# AppID已配置在 project.config.json 中
# 当前AppID: wx8f9cd9609456ba94
```

**调试技巧**：
- 使用Console标签查看日志输出
- 使用Sources标签断点调试JavaScript代码
- 使用Storage标签查看本地缓存数据
- 使用AppData标签实时查看页面数据
- 勾选"不校验合法域名"进行本地开发

### 进入管理后台

**方法1：隐藏入口（生产环境）**
1. 进入用户中心页面
2. 滚动到页面底部
3. 长按"庐陵吉成法答 v1.0.0"文字（约1-2秒）
4. 输入密码：`wangjicheng2024`
5. 验证成功后进入管理后台

**方法2：调试模式（开发调试）**
```json
// 修改 app.json，将 pages/admin/admin 移到第一位
"pages": [
  "pages/admin/admin",
  "pages/index/index",
  ...
]
```

### 配置API Key

**GLM-4 API配置位置**：`app.js:258`

```javascript
glmConfig: {
  apiKey: 'YOUR_API_KEY_HERE', // 智谱AI API Key
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
}
```

**重要**：
- 不要将真实API Key提交到公开代码仓库
- API Key需要在微信小程序后台配置服务器域名白名单
- 确保账户余额充足，避免429错误

### 查看诊断信息

```bash
# 查看项目结构
ls -la

# 查看页面路由
cat app.json

# 查看全局配置
cat app.js
```

---

## 核心架构

### 用户管理系统（app.js）

**设备ID绑定机制**：
- 每个设备生成唯一UUID（`generateUUID()`）
- 用户数据绑定到设备ID，防止账号共享
- 设备ID不匹配时自动清空用户数据（`app.js:63-94`）
- 老用户迁移：自动补充设备ID字段

**用户数据结构**：
```javascript
{
  phone: '',           // 手机号后8位（用户唯一标识）
  deviceId: '',        // 设备ID（安全绑定）
  avatar: '',          // 用户头像
  isRegistered: false, // 是否已注册
  isPaid: false,       // 是否已付费
  registerDate: '',    // 注册日期
  paidDate: '',        // 付费日期
  planType: '',        // 会员类型：monthly/yearly/trial
  expireDate: '',      // 到期日期
  dailyCount: 0,       // 今日已使用次数
  lastDate: '',        // 上次使用日期
  totalQuestions: 0    // 总提问次数
}
```

**核心检查逻辑**（app.js启动时自动执行）：
1. `checkAndResetDailyCount()` - 检查是否新的一天，重置计数
2. `checkUserActivation()` - 检查用户是否已被管理员激活
3. `checkMembershipExpire()` - 检查会员是否过期

### API调用系统（utils/api.js）

**GLM-4.6V-Flash模型配置**：
- 模型：`glm-4.6v-flash`
- 超时时间：120秒（适应长回复）
- 温度：0.3（降低随机性）
- Top-P：0.7（降低采样范围）

**会员差异化配置**（`utils/api.js:28`）：
```javascript
// 非会员：2000 tokens，会员：6000 tokens（3倍长度）
const maxTokens = isPaid ? 6000 : 2000
```

**错误处理**：
- 401：API Key无效
- 429：余额不足或请求频率超限
- timeout：网络超时（2分钟）

**系统提示词**（`utils/api.js:162`）：
```
你是王吉成律师AI助手。基于中国法律解答，用"王律师认为"。
结尾：联系王吉成律师 微信号:lawyer_wang_zz
免责：仅供参考，重大问题请线下咨询。
```

### 次数限制系统

**免费用户限制**（`app.js:136-155`）：
- 每天5次问答
- 次数用完引导到升级页面
- 每日零点自动重置

**付费用户权益**：
- 无限次问答
- 回复长度3倍（6000 tokens）
- 优先响应

**检查调用位置**（`pages/index/index.js:93-100`）：
```javascript
sendMessage() {
  // 1. 检查是否可以使用服务
  const canUseResult = app.canUseService()
  if (!canUseResult.canUse) {
    // 2. 引导到升级页面
    return
  }
  // 3. 发送消息
  // 4. 增加使用次数
  app.incrementUsage()
}
```

### 管理后台系统

**数据存储**（本地存储）：
```javascript
wx.setStorageSync('user_activations', [
  {
    phone: '12345678',        // 手机号后8位
    planType: 'monthly',      // 会员类型
    trialDays: 7,            // 试用天数（仅试用类型）
    activateTime: '2026-01-03' // 激活时间
  }
])
```

**核心功能**（`pages/admin/admin.js`）：
1. 激活用户会员（输入手机号后8位）
2. 设置会员类型（月付/年付/试用）
3. 设置试用天数
4. 查看已激活用户列表
5. 搜索和过滤用户
6. 删除激活记录

**安全机制**：
- 隐藏入口：长按用户中心底部版本号
- 密码保护：`wangjicheng2024`（`pages/user-center/user-center.js:118`）
- 密码位置可修改

**用户激活流程**（`app.js:157-212`）：
1. 用户打开小程序，系统自动检查激活列表
2. 根据手机号后8位查找激活记录
3. 找到记录 → 激活会员，设置到期日期
4. 未找到记录 → 如果是会员则取消资格
5. 每次启动自动检查，确保状态同步

### 会员到期管理

**到期日期计算**（`app.js:214-226`）：
```javascript
calculateExpireDate(paidDate, planType, trialDays) {
  // monthly: +1个月
  // yearly: +1年
  // trial: +trialDays天
}
```

**自动检查**（`app.js:236-253`）：
- 每次启动小程序自动检查
- 今天的日期 > expireDate → 取消会员资格
- 清空 planType 和 expireDate

---

## 页面路由结构

```json
pages/
├── index/           # 主页面（聊天界面）
├── upgrade/         # 会员付费页
├── user-center/     # 用户中心页
└── admin/           # 管理后台（隐藏入口）
```

**app.json路由配置**：
```json
{
  "pages": [
    "pages/index/index",        // 首页（默认启动）
    "pages/upgrade/upgrade",    // 会员升级
    "pages/user-center/user-center", // 用户中心
    "pages/admin/admin"         // 管理后台
  ]
}
```

---

## 关键业务逻辑

### 用户激活流程

**场景1：管理员激活用户**
1. 进入管理后台
2. 输入用户手机号后8位
3. 选择会员类型（月付/年付/试用）
4. 点击"激活用户"
5. 存储到本地 `user_activations`

**场景2：用户端自动同步**
1. 用户打开小程序
2. `app.js:checkUserActivation()` 自动执行
3. 根据手机号查找激活记录
4. 更新用户会员状态
5. 计算到期日期

**场景3：会员到期**
1. 用户打开小程序
2. `app.js:checkMembershipExpire()` 自动执行
3. 检查 expireDate < 今天
4. 取消会员资格
5. 提示用户续费

### 次数限制流程

**发送消息前检查**：
```javascript
// app.js
canUseService() {
  if (userInfo.isPaid) {
    return { canUse: true }  // 会员无限制
  }
  if (userInfo.dailyCount >= 5) {
    return { canUse: false, reason: 'daily_limit' }
  }
  return { canUse: true }
}
```

**使用后更新**：
```javascript
// app.js
incrementUsage() {
  userInfo.dailyCount++
  userInfo.totalQuestions++
  saveUserInfo()
}
```

---

## 常见问题排查

### 429错误（请求频率超限）

**原因**：
- API Key余额不足
- 请求频率过高
- 免费额度已用完

**解决方案**：
1. 访问智谱AI控制台查看余额
2. 充值账户
3. 调整请求频率

详见：`429错误解决方案.md`

### API调用超时

**检查项**：
1. 网络连接是否稳定
2. API Key余额是否充足
3. 超时时间已设置为120秒（`utils/api.js:67`）

**调试方法**：
- 查看Console日志输出
- 检查错误信息中的 `err.errMsg`

详见：`调试指南-发送消息问题.md`

### 用户数据丢失

**原因**：
- 用户清除缓存
- 设备ID不匹配（自动清空）

**解决方案**：
- 设备ID不匹配会提示"账号在其他设备登录"
- 重新设置手机号后8位
- 联系管理员重新激活

详见：`安全功能说明.md`

---

## 部署配置

### 服务器域名白名单

**必须配置的域名**：
```
https://open.bigmodel.cn
```

**配置位置**：微信小程序后台 → 开发 → 开发设置 → 服务器域名

### 图片资源

**当前使用**：图床链接（`i.ibb.co`）

**建议**：
- 下载图片到本地
- 上传到自己的服务器或CDN
- 确保图片URL稳定可访问

### 上线流程

1. 代码上传（微信开发者工具）
2. 提交审核（填写审核信息）
3. 等待审核（1-7个工作日）
4. 审核通过后发布

详见：`调试和上线指南.md`

---

## 重要配置位置

| 功能 | 文件路径 | 关键行号 |
|------|---------|---------|
| API Key配置 | app.js | 258 |
| 设备ID生成 | app.js | 25-31 |
| 用户激活检查 | app.js | 157-212 |
| 会员到期检查 | app.js | 236-253 |
| 次数限制检查 | app.js | 136-155 |
| 会员差异化tokens | utils/api.js | 28 |
| 系统提示词 | utils/api.js | 162-166 |
| 管理后台密码 | pages/user-center/user-center.js | 约118行 |
| 隐藏入口 | pages/user-center/user-center.wxml | 约94行 |

---

## 商业化功能说明

**免费版**：¥0/月，每天5次咨询
**专业版（月付）**：¥99/月，无限次咨询
**专业版（年付）**：¥996/年，无限次咨询

**支付流程**：
- 当前为模拟支付（生产环境需对接微信支付）
- 点击"立即开通" → 确认弹窗 → 模拟支付成功 → 更新用户状态

详见：`商业化功能说明.md`

---

## 安全建议

**当前安全级别**：适合个人使用的小程序

**已实现的安全措施**：
1. 设备ID绑定（防止账号共享）
2. 管理后台密码保护
3. 隐藏入口（长按版本号触发）
4. 设备不匹配自动清空数据

**生产环境建议**：
1. 使用后端服务器验证用户权限
2. 对接微信支付
3. 使用数据库存储用户数据
4. 添加限流机制防止恶意刷量

详见：`安全功能说明.md`

---

## 律师信息

- **姓名**：王吉成
- **职业**：中国执业律师
- **执业机构**：江西吉泰律师事务所
- **执业地点**：江西省吉安市
- **电话**：183-0796-5661
- **微信号**：lawyer_wang_zz
- **专业领域**：刑事辩护、民商事争议

**重要**：所有内容必须保持法律专业性，使用中文回答，引用准确的法律条款。
