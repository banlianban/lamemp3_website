# 真实文件处理功能说明

## 概述

本项目已集成真实的音频文件转换功能，通过接入 LAMEConverter API（https://v5.chorusclip.com/convert）实现高质量的音频文件转换。

## 功能特点

### 1. 智能诊断功能
- **路径**: `/api/diagnose`
- **功能**: 分析上传的音频文件，提供兼容性评分（0-100分）
- **检测内容**:
  - 文件格式（MP3、FLAC、WAV、M4A 等）
  - 比特率类型（VBR/CBR）
  - 编码器类型（LAME/其他）
  - ID3 标签版本
  - 封面图片大小
  - 采样率和声道模式

### 2. 音频转换功能
- **路径**: `/api/convert`
- **功能**: 将音频文件转换为车载系统完美兼容的 MP3 格式
- **转换参数**:
  - `mode`: 编码模式（vbr/cbr）
  - `quality`: VBR 质量（0-9，0最高）
  - `bitrate`: CBR 比特率（128/192/256/320）
  - `force_convert`: 强制重新编码

### 3. 前端交互流程

#### 步骤 1: 文件上传
用户通过拖拽或点击上传音频文件

#### 步骤 2: 自动诊断
- 文件上传后自动调用 `/api/diagnose`
- 显示兼容性评分和问题列表
- 展示文件详细信息

#### 步骤 3: 一键优化
- 点击"一键优化"按钮
- 调用 `/api/convert` 进行转换
- 使用最佳参数确保兼容性：
  - 模式：VBR
  - 质量：2（高质量）
  - 强制重新编码：开启

#### 步骤 4: 下载文件
- 转换完成后自动生成下载链接
- 点击"下载 MP3"即可保存文件
- 文件名自动添加 `_converted` 后缀

## API 使用示例

### 诊断 API

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -F "audio_file=@your_song.mp3"
```

响应示例：
```json
{
  "score": 45,
  "issues": [
    "❌ 动态码率 VBR (可能导致卡顿)",
    "❌ 编码器兼容性较差"
  ],
  "details": {
    "format": "MP3",
    "bitrate": "192 kbps",
    "bitrateType": "VBR (可变)",
    "sampleRate": "44100 Hz",
    "channels": "Joint Stereo",
    "encoder": "Other",
    "id3Version": "v2.3"
  },
  "needsConversion": true,
  "riskLevel": "high"
}
```

### 转换 API

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "audio_file=@your_song.mp3" \
  -F "mode=vbr" \
  -F "quality=2" \
  -F "force_convert=on" \
  -o converted_song.mp3
```

## 技术实现细节

### 文件格式检测
通过读取文件的魔术字节（magic bytes）来识别文件格式：
- MP3: `FF FB` 或 `ID3`
- FLAC: `fLaC`
- WAV: `RIFF...WAVE`
- M4A: `ftyp`
- OGG: `OggS`

### MP3 分析
对 MP3 文件进行深度分析：
- 解析 MPEG 帧头获取比特率、采样率、声道信息
- 检测 Xing/Info/VBRI 头判断是否为 VBR
- 查找 LAME 标签识别编码器
- 读取 ID3v2 标签信息

### 评分算法
基于以下规则计算兼容性评分：
- VBR 格式：扣 25 分
- 非 LAME 编码器：扣 20 分
- 封面 > 1MB：扣 15 分
- ID3v2.4 标签：扣 10 分
- 非标准采样率：扣 10 分
- 非 MP3 格式：基础分 40 分

## 环境变量配置

无需额外配置，API 直接使用公开的 LAMEConverter 服务。

如需修改 API 地址，请编辑：
- `/src/app/api/convert/route.ts` 第 78 行的 `apiUrl` 变量

## 安全特性

1. **文件大小限制**: 最大 100MB
2. **文件类型验证**: 只接受音频文件
3. **超时保护**: 5 分钟超时限制
4. **错误处理**: 完善的错误捕获和用户提示
5. **隐私保护**: 转换完成后自动清理临时文件

## 支持的音频格式

### 输入格式
- MP3
- FLAC（无损）
- WAV（未压缩）
- APE（无损）
- M4A / AAC
- OGG
- OPUS
- WMA

### 输出格式
- MP3（LAME 编码，VBR/CBR）

## 本地开发测试

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问：http://localhost:3000

3. 上传测试文件：
   - 可以使用任何支持的音频格式
   - 建议测试不同格式和大小的文件

## 生产部署注意事项

1. **反向代理配置**：
   - 确保 Nginx 配置支持大文件上传
   - 设置合适的 `client_max_body_size`（建议 100M）

2. **超时配置**：
   - 调整 Nginx/服务器的超时时间（建议 5-10 分钟）
   - Next.js 路由已设置 `maxDuration: 300` 秒

3. **并发限制**：
   - 建议在 Nginx 层面做请求限流
   - 避免同时处理过多大文件

## 故障排除

### 问题：转换超时
- 检查网络连接到 v5.chorusclip.com
- 尝试较小的文件
- 检查服务器日志

### 问题：文件格式不支持
- 确认文件扩展名正确
- 检查文件是否损坏
- 查看浏览器控制台错误信息

### 问题：诊断评分不准确
- 某些特殊编码的文件可能无法完全解析
- 这不影响转换功能的使用
- 转换后的文件保证兼容性

## API 参考文档

详细的 API 接入指南请查看：
- [API 接入指南](./API_接入指南.md)

## 更新日志

- 2025-11-25: 初始版本，集成真实文件处理功能
  - 实现诊断 API
  - 实现转换 API
  - 更新前端交互流程
  - 添加文件详情显示

## 技术支持

如有问题，请查看：
- 项目文档：`/docs` 目录
- 在线演示：https://v5.chorusclip.com
- API 源站：https://github.com/banlianban/lamemp3_api

