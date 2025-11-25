# 🌟 HDR Ultra

一个基于 Next.js 的现代化 Ultra HDR 图像转换工具，支持将普通图像转换为 JPEG/R 格式的 HDR 图像。

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-WASM-654ff0)](https://webassembly.org/)

## ✨ 功能特性

- 🎨 **Ultra HDR 编码** - 将 SDR 图像转换为 HDR 格式 (JPEG/R)
- ⚡ **高性能处理** - 基于 WebAssembly 的原生 C++ 实现
- 🌐 **多语言支持** - 中文和英文界面
- 📱 **响应式设计** - 完美适配各种设备
- 🔒 **隐私优先** - 所有处理均在浏览器本地完成
- 🎯 **SEO 优化** - 完整的 SEO 和结构化数据配置
- 🚀 **PWA 支持** - 可作为 Web 应用安装

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd LameMP3

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:3000
```

### 构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
LameMP3/
├── public/                 # 静态资源
│   ├── wasm/              # WebAssembly 模块
│   │   ├── ultrahdr.js    # WASM 加载器
│   │   └── ultrahdr.wasm  # WASM 二进制文件
│   └── ...
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/      # 多语言路由
│   │   ├── globals.css    # 全局样式
│   │   ├── robots.ts      # 动态 robots
│   │   └── sitemap.ts     # 动态 sitemap
│   ├── components/        # React 组件
│   │   ├── home/          # 首页组件
│   │   ├── layout/        # 布局组件
│   │   └── ...
│   ├── lib/               # 工具库
│   │   └── wasm/          # WASM 集成
│   ├── messages/          # 国际化翻译
│   │   ├── en.json        # 英文
│   │   └── zh.json        # 中文
│   └── ...
├── docs/                  # 项目文档
└── ...
```

## 🎯 支持的图像格式

### 输入格式
- JPEG / JPG
- PNG
- HEIC / HEIF
- AVIF
- WebP
- TIFF
- BMP

### 输出格式
- JPEG/R (Ultra HDR)

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **UI 组件**: Ant Design
- **图像处理**: WebAssembly (ultrahdr-wasm)
- **图标**: Lucide React

## 📖 文档

详细文档请查看 [`/docs`](./docs/) 目录：

- [Docker 部署指南](./docs/development/DOCKER.md) ⭐️
- [快速启动指南](./docs/development/QUICK-START.md)
- [WASM 集成说明](./docs/development/WASM-INTEGRATION.md)
- [WASM 内存解决方案](./docs/development/WASM-MEMORY-SOLUTION.md)
- [SEO 配置](./docs/SEO-CHECKLIST.md)
- [WASM API 文档](./src/lib/wasm/README.md)

## 🌐 部署

### Docker 部署（推荐用于自托管）

项目已完整支持 Docker 部署，提供开发和生产两种环境配置。

#### ⚡ 快速开始

```bash
# 方法1：使用脚本
./scripts/docker-deploy.sh dev        # 开发环境
./scripts/docker-deploy.sh prod       # 生产环境

# 方法2：使用 Makefile
make dev                              # 开发环境
make up                               # 生产环境
```

查看 [5 分钟快速开始](./DOCKER-QUICK-START.md) 📖

#### 详细文档

- 📘 [Docker 部署完整指南](./docs/development/DOCKER.md)
- 📋 [Docker 部署检查清单](./docs/development/DOCKER-CHECKLIST.md)
- ⚡ [Docker 命令速查表](./docs/development/DOCKER-QUICK-REFERENCE.md)
- 📁 [Docker 文件说明](./docs/development/DOCKER-FILES.md)
- 📊 [Docker 接入总结](./DOCKER-SETUP-SUMMARY.md)

### Vercel

```bash
# 确保构建通过
npm run build

# 部署到 Vercel
vercel --prod
```

### 其他平台

项目兼容所有支持 Next.js 的托管平台，如：
- Netlify
- Cloudflare Pages
- AWS Amplify
- 自托管 Node.js 服务器

## 🔐 环境变量

无需配置环境变量即可运行基础功能。

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [UltraHDR](https://developer.android.com/guide/topics/media/platform/hdr-image-format) - Google 的 Ultra HDR 规范
- [Next.js](https://nextjs.org/) - React 框架
- [Vercel](https://vercel.com/) - 部署平台

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 网站: https://lamemp3.com
- Email: support@lamemp3.com

---

Made with ❤️ using Next.js and WebAssembly
