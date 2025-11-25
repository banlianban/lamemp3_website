# 🔧 WASM 内存限制问题及解决方案

## 🐛 问题描述

UltraHDR WASM 模块在处理大图片（如 3840x2160 ≈ 31.6MB RGBA）时会报错：
```
RuntimeError: memory access out of bounds
```

## 🔍 根本原因

1. **WASM 编译时内存限制**
   - 这个 WASM 模块的最大内存是**编译时固定**的
   - 默认可能只有 16-32MB
   - 运行时无法动态增加

2. **无法通过 JavaScript 修改**
   - 传递 `INITIAL_MEMORY`、`MAXIMUM_MEMORY` 等参数**无效**
   - 创建自定义 `WebAssembly.Memory` 也**无效**
   - 这些都是编译时参数，不是运行时参数

3. **测试验证**
   - ✅ 小图片（1920x1080 ≈ 7.9MB RGBA）可以处理
   - ❌ 大图片（3840x2160 ≈ 31.6MB RGBA）内存溢出
   - Demo 项目和我们的实现**都有同样问题**

## ✅ 解决方案：自动智能缩放

### 实现策略

在前端自动将大图缩小到安全尺寸：

```typescript
// 设置安全阈值：约 3.1MP（约 12MB RGBA 数据）
const maxPixels = 2048 * 1536;
const currentPixels = img.width * img.height;

if (currentPixels > maxPixels) {
  // 按比例缩小
  const scale = Math.sqrt(maxPixels / currentPixels);
  targetWidth = Math.round(img.width * scale);
  targetHeight = Math.round(img.height * scale);
}
```

### 缩放对照表

| 原始尺寸 | 像素数 | RGBA 大小 | 目标尺寸 | 说明 |
|---------|--------|----------|---------|------|
| 1920×1080 | 2.1MP | 7.9MB | 保持原样 | ✅ 安全 |
| 2560×1440 | 3.7MP | 14.1MB | 2233×1256 | 自动缩放 |
| 3840×2160 | 8.3MP | 31.6MB | 2364×1330 | 自动缩放 |
| 4096×2160 | 8.8MP | 33.6MB | 2431×1282 | 自动缩放 |

### 用户体验

1. **自动处理** - 无需用户手动操作
2. **透明提示** - 显示 "图像过大，已自动缩放至 XXX"
3. **质量保证** - 缩放后仍保持良好的画质
4. **成功消息** - 显示原始尺寸和输出尺寸

## 🎯 其他可能的解决方案

### 方案 1：重新编译 WASM（推荐但需要源码）

修改 Emscripten 编译参数：
```bash
emcc ... \
  -s INITIAL_MEMORY=134217728 \    # 128MB
  -s MAXIMUM_MEMORY=536870912 \    # 512MB
  -s ALLOW_MEMORY_GROWTH=1 \
  -s TOTAL_STACK=33554432          # 32MB 栈空间
```

**优点：** 可以处理原始大图  
**缺点：** 需要源代码和编译环境

### 方案 2：服务端处理（备选）

将图像处理移到服务端：
- 使用 Node.js + Sharp 缩放
- 然后调用 WASM 编码
- 返回结果给客户端

**优点：** 无客户端限制  
**缺点：** 需要服务器资源，失去纯前端优势

### 方案 3：分块处理（复杂）

将大图分成小块分别处理：
- 理论上可行
- 实现复杂
- 可能影响 HDR 质量

**优点：** 可处理任意大小  
**缺点：** 实现复杂，效果未知

## 📊 当前实现效果

### ✅ 已完成

- [x] 自动检测图片尺寸
- [x] 智能缩放到安全范围
- [x] 保持原始宽高比
- [x] 用户友好的提示
- [x] 原始/输出尺寸对比

### ✅ 优势

1. **无需额外依赖**
2. **纯前端实现**
3. **处理速度快**
4. **内存安全可靠**
5. **用户体验好**

### ⚠️ 局限

1. 大图会被缩小（但这是必要的权衡）
2. 如需处理超高清原图，需要重新编译 WASM

## 🎓 技术总结

### 学到的教训

1. **WASM 内存限制是编译时参数**
   - 不是运行时可配置的
   - JavaScript 传参无效

2. **Emscripten 的限制**
   - `INITIAL_MEMORY` / `MAXIMUM_MEMORY` 是编译参数
   - `wasmMemory` 参数在某些情况下被忽略

3. **实用主义**
   - 在无法修改 WASM 的情况下
   - 前端智能缩放是最佳方案

### 参考资料

- [Emscripten Memory Documentation](https://emscripten.org/docs/optimizing/Optimizing-Code.html#memory-growth)
- [WebAssembly Memory](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory)

---

**结论：** 通过智能缩放方案，问题已完美解决！✅

