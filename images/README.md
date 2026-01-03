# 头像图片说明

请在此目录下放置以下两个头像图片：

## 1. user-avatar.png
- **用途**: 用户头像
- **建议尺寸**: 80x80 像素
- **格式**: PNG（支持透明背景）
- **样式建议**: 可以使用个人照片、卡通头像等

## 2. assistant-avatar.png
- **用途**: AI法律助手头像
- **建议尺寸**: 80x80 像素
- **格式**: PNG（支持透明背景）
- **样式建议**: 可以使用律师、法槌、天平等法律相关图标

## 临时方案

如果暂时没有准备头像图片，可以：

### 方案1：使用纯色背景（推荐）
暂时删除或注释掉 index.wxml 中的头像部分，系统会使用渐变色背景。

### 方案2：使用网络图片
修改 pages/index/index.wxml 中的头像src为网络图片URL：

```xml
<!-- 用户头像 -->
<image class="avatar user-avatar" src="https://example.com/user-avatar.png" mode="aspectFit"></image>

<!-- 助手头像 -->
<image class="avatar assistant-avatar" src="https://example.com/assistant-avatar.png" mode="aspectFit"></image>
```

### 方案3：生成临时头像
可以使用在线工具生成简单的头像：
- https://www.favicon-generator.org/ （生成图标）
- https://www.designevo.com/ （设计Logo）
- 或使用Canva、美图秀秀等工具设计
