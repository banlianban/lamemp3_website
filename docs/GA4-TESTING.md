# Google Analytics 4 (GA4) 测试指南

## 📊 已集成的功能

Google Analytics 4 已成功集成到应用中，包含详细的调试日志。

- **测量 ID**: `G-BMJLXZSDCW`
- **自动页面追踪**: ✅ 已启用
- **调试日志**: ✅ 已启用

---

## 🧪 如何测试

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 打开浏览器控制台

1. 在浏览器中打开 `http://localhost:3000`
2. 按 `F12` 或 `右键 -> 检查` 打开开发者工具
3. 切换到 **Console（控制台）** 标签

### 3. 查看日志输出

如果 GA4 正常工作，你应该看到以下日志：

```
🔍 [GA4] GoogleAnalytics component mounted
🔍 [GA4] Measurement ID: G-BMJLXZSDCW
🔍 [GA4] Current path: /en (或 /zh)
🚀 [GA4] Initializing dataLayer and gtag...
🚀 [GA4] Configuring GA with ID: G-BMJLXZSDCW
✅ [GA4] GA configured successfully for path: /en
✅ [GA4] gtag.js script loaded successfully
✅ [GA4] Analytics configuration script loaded
✅ [GA4] dataLayer: [...]
✅ [GA4] gtag function: function
```

### 4. 验证 dataLayer

在控制台中输入以下命令来检查 dataLayer：

```javascript
window.dataLayer
```

你应该看到一个数组，包含 GA4 的事件数据。

### 5. 验证 gtag 函数

```javascript
typeof window.gtag
```

应该返回 `"function"`。

---

## 🔍 在 Google Analytics 中验证

### 方法 1: 实时报告

1. 登录 [Google Analytics](https://analytics.google.com/)
2. 选择你的属性（Property）
3. 导航到 **报告 -> 实时 (Realtime)**
4. 访问你的网站，你应该能在 1-2 分钟内看到自己的访问

### 方法 2: DebugView

1. 在 Google Analytics 中导航到 **配置 -> DebugView**
2. 在开发环境中访问网站
3. 你应该能看到实时的事件流

---

## 🚀 测试不同页面

测试页面切换时的追踪：

```bash
# 访问英文版
http://localhost:3000/en

# 访问中文版
http://localhost:3000/zh
```

每次切换页面时，控制台都应该显示相应的日志。

---

## 🐛 故障排除

### 看不到日志？

1. **检查浏览器控制台是否打开**
2. **检查是否有广告拦截器** - 某些广告拦截器会阻止 GA 脚本
3. **检查网络请求** - 在 Network 标签中搜索 `gtag` 或 `google-analytics`

### 看到错误日志？

如果看到 `❌ [GA4] Failed to load...` 错误：

1. 检查网络连接
2. 检查是否有防火墙或内容拦截器
3. 尝试禁用浏览器扩展

### GA4 控制台看不到数据？

- **等待时间**: 新数据可能需要 24-48 小时才能在标准报告中显示
- **使用实时报告**: 实时数据通常在 1-2 分钟内可见
- **验证测量 ID**: 确保 GA4 属性中的测量 ID 与代码中的 `G-BMJLXZSDCW` 一致

---

## 📝 移除调试日志

在生产环境中，你可能想要移除或减少日志输出。编辑 `src/components/GoogleAnalytics.tsx`：

```typescript
// 将所有 console.log 移除或改为：
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 [GA4] ...');
}
```

---

## ✅ 检查清单

- [ ] 开发服务器运行正常
- [ ] 浏览器控制台显示 GA4 日志
- [ ] `window.dataLayer` 存在且包含数据
- [ ] `window.gtag` 是一个函数
- [ ] 在 GA4 实时报告中看到访问数据
- [ ] 页面切换时正确追踪
- [ ] 中英文页面都能正常追踪

---

## 🎯 下一步

一旦确认 GA4 正常工作：

1. **移除或条件化调试日志**（用于生产环境）
2. **设置自定义事件追踪**（如按钮点击、表单提交等）
3. **配置转化目标**
4. **设置受众群体**

---

## 📚 更多资源

- [GA4 官方文档](https://support.google.com/analytics/answer/9304153)
- [Next.js Analytics 集成](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [gtag.js 参考文档](https://developers.google.com/tag-platform/gtagjs)

