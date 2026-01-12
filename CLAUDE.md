# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

庐陵吉成法答 - 法律工具微信小程序，为江西吉泰律师事务所王吉成律师的法律助手工具。

**核心功能**：
- 19个法律计算器工具（诉讼费用、利息计算、律师费等）
- 律师介绍页面（含咨询收费标准）
- 用户次数限制与付费会员系统
- 设备绑定安全机制
- 管理后台（密码保护）

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
1. 进入用户中心页面（页面路径：`pages/user-center/user-center`）
2. 滚动到页面底部
3. 长按"庐陵吉成法答 v1.0.0"文字
4. 输入密码：`wangjicheng2024`
5. 验证成功后进入管理后台

**方法2：调试模式（开发调试）**
```json
// 修改 app.json，将 pages/admin/admin 移到第一位
"pages": [
  "pages/admin/admin",
  "pages/home/home",
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

---

## 页面路由结构

### 主页面（功能入口）

**pages/home/home** - 主页面，展示19个功能模块入口：
1. 律师介绍（跳转到 pages/index/index）
2. 诉讼费用
3. 利息/违约金
4. 迟延履行利息
5. 民间借贷利息
6. 律师费
7. 破产管理人报酬
8. LPR查询
9. 日期推算
10. 交通事故
11. 工伤赔偿
12. 经济补偿金
13. 带薪年休假
14. 退休年龄计算
15. 小额诉讼限额
16. 级别管辖
17. 仲裁费用
18. 基准利率（开发中）
19. 民事案由
20. 常用年度数据

功能模块配置在 `pages/home/home.js:4-145`

### 律师介绍页

**pages/index/index** - 律师个人介绍页面：
- 律师头像和基本信息
- 专业领域介绍
- 办案理念
- 办公地址和联系方式
- **咨询收费标准：600元/小时**
- AI助手入口（点击跳转到律师网站 `https://abc.juziqishui.top/`）

### 其他页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 用户中心 | pages/user-center/user-center | 用户信息管理、会员状态查看 |
| 管理后台 | pages/admin/admin | 激活用户会员（隐藏入口） |
| 会员升级 | pages/upgrade/upgrade | 会员付费页面 |
| 外链跳转 | pages/webview/webview | 加载外部H5页面 |

---

## 核心架构

### 用户管理系统（app.js）

**设备ID绑定机制**：
- 每个设备生成唯一UUID（`generateUUID()`）
- 用户数据绑定到设备ID，防止账号共享
- 设备ID不匹配时自动清空用户数据（`app.js:63-94`）

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
- 密码保护：`wangjicheng2024`（`pages/user-center/user-center.js:252`）

**用户激活流程**（`app.js:157-212`）：
1. 用户打开小程序，系统自动检查激活列表
2. 根据手机号后8位查找激活记录
3. 找到记录 → 激活会员，设置到期日期
4. 未找到记录 → 如果是会员则取消资格
5. 每次启动自动检查，确保状态同步

### 外链跳转（webview）

**pages/webview/webview** - 用于加载外部网站：
- 使用 `<web-view>` 组件加载H5页面
- 通过URL参数传递目标地址
- 需要在微信小程序后台配置业务域名白名单

**业务域名配置**：
- 路径：微信小程序后台 → 开发 → 开发设置 → 业务域名
- 需添加：`abc.juziqishui.top`

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

**系统提示词**（`utils/api.js:162`）：
```
你是王吉成律师AI助手。基于中国法律解答，用"王律师认为"。
结尾：联系王吉成律师 微信号:lawyer_wang_zz
免责：仅供参考，重大问题请线下咨询。
```

---

## 重要配置位置

| 功能 | 文件路径 | 关键行号 |
|------|---------|---------|
| API Key配置 | app.js | 258 |
| 设备ID生成 | app.js | 25-31 |
| 用户激活检查 | app.js | 157-212 |
| 会员到期检查 | app.js | 236-253 |
| 次数限制检查 | app.js | 136-155 |
| 系统提示词 | utils/api.js | 162-166 |
| 管理后台密码 | pages/user-center/user-center.js | 252 |
| 隐藏入口 | pages/user-center/user-center.wxml | 100 |
| 主页功能列表 | pages/home/home.js | 4-145 |
| 律师网站跳转 | pages/index/index.js | 24-45 |

---

## 部署配置

### 服务器域名白名单

**必须配置的域名**：
```
https://open.bigmodel.cn    // GLM-4 API
```

**业务域名**（用于webview跳转）：
```
https://abc.juziqishui.top  // 律师网站
```

**配置位置**：微信小程序后台 → 开发 → 开发设置

### 图片资源

**律师头像**：`https://pic1.imgdb.cn/item/6963714075db907620f2acb0.jpg`

### 上线流程

1. 代码上传（微信开发者工具）
2. 提交审核（填写审核信息）
3. 等待审核（1-7个工作日）
4. 审核通过后发布

---

## 律师信息

- **姓名**：王吉成
- **职业**：中国执业律师
- **执业机构**：江西吉泰律师事务所
- **执业地点**：江西省吉安市吉州区平园路9号金光道大厦19楼
- **电话**：183-0796-5661
- **微信号**：lawyer_wang_zz
- **专业领域**：刑事辩护、民商事争议
- **咨询收费**：600元/小时

**重要**：所有内容必须保持法律专业性，使用中文回答，引用准确的法律条款。
