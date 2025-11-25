# Docker 文件清单

本文档列出了所有 Docker 相关的文件和它们的用途。

## 📁 文件结构

```
LameMP3/
├── Dockerfile                        # 生产环境 Docker 镜像配置
├── Dockerfile.dev                    # 开发环境 Docker 镜像配置
├── .dockerignore                     # Docker 构建忽略文件
├── docker-compose.yml                # 生产环境编排（简单模式）
├── docker-compose.dev.yml            # 开发环境编排
├── docker-compose.prod.yml           # 生产环境编排（带 Nginx）
├── Makefile                          # 快捷命令配置
├── DOCKER-SETUP-SUMMARY.md           # Docker 接入总结
│
├── .github/
│   └── workflows/
│       └── docker-build.yml          # GitHub Actions 自动构建
│
├── nginx/                            # Nginx 配置目录
│   ├── nginx.conf                    # Nginx 主配置
│   ├── conf.d/
│   │   └── default.conf              # 站点配置
│   └── logs/                         # 日志目录（运行时生成）
│       └── .gitkeep
│
├── scripts/                          # 辅助脚本
│   ├── docker-check.sh               # 环境检查脚本
│   └── docker-deploy.sh              # 快速部署脚本
│
└── docs/development/                 # 文档
    ├── DOCKER.md                     # 完整部署指南
    ├── DOCKER-CHECKLIST.md           # 部署检查清单
    ├── DOCKER-QUICK-REFERENCE.md     # 快速命令参考
    └── DOCKER-FILES.md               # 本文件
```

## 📄 文件说明

### 核心配置文件

#### `Dockerfile`
**用途:** 生产环境的 Docker 镜像构建配置

**特点:**
- 多阶段构建（deps → builder → runner）
- 基于 Alpine Linux（轻量级）
- 使用 Next.js standalone 模式
- 非 root 用户运行
- 优化的层缓存

**何时使用:** 生产环境部署

#### `Dockerfile.dev`
**用途:** 开发环境的 Docker 镜像配置

**特点:**
- 支持热重载
- 挂载源代码
- 完整的开发工具

**何时使用:** 本地开发调试

#### `.dockerignore`
**用途:** 指定 Docker 构建时忽略的文件

**包含内容:**
- node_modules
- .next
- .git
- 文档和日志
- IDE 配置

**作用:** 减小构建上下文，加快构建速度

### Docker Compose 配置

#### `docker-compose.yml`
**用途:** 生产环境简单部署

**服务:**
- hdr-ultra-web (Next.js 应用)

**端口:** 3000

**特点:**
- 健康检查
- 自动重启
- 基础配置

#### `docker-compose.dev.yml`
**用途:** 开发环境部署

**服务:**
- hdr-ultra-web-dev

**端口:** 3000

**特点:**
- 源代码挂载
- 热重载支持
- 环境变量配置

#### `docker-compose.prod.yml`
**用途:** 生产环境完整部署（推荐）

**服务:**
- hdr-ultra-web (Next.js)
- nginx (反向代理)

**端口:** 80, 443

**特点:**
- Nginx 反向代理
- 静态文件缓存
- Gzip 压缩
- 资源限制
- HTTPS 支持

### Nginx 配置

#### `nginx/nginx.conf`
**用途:** Nginx 主配置文件

**配置项:**
- Worker 进程设置
- Gzip 压缩
- 日志格式
- 性能优化

#### `nginx/conf.d/default.conf`
**用途:** 站点具体配置

**配置项:**
- 反向代理规则
- 静态文件缓存
- 安全头部
- HTTPS 配置模板

### 辅助脚本

#### `scripts/docker-check.sh`
**用途:** 检查 Docker 环境是否就绪

**功能:**
- 检查 Docker 安装
- 检查 Docker 运行状态
- 验证必要文件
- 显示磁盘使用情况

**使用:**
```bash
./scripts/docker-check.sh
```

#### `scripts/docker-deploy.sh`
**用途:** 一键部署脚本

**功能:**
- 支持三种部署模式（dev/prod/prod-nginx）
- 彩色输出
- 错误处理
- 状态检查

**使用:**
```bash
./scripts/docker-deploy.sh [dev|prod|prod-nginx]
```

### Makefile

#### `Makefile`
**用途:** 提供简化的命令接口

**主要命令:**
- `make help` - 显示帮助
- `make dev` - 启动开发环境
- `make up` - 启动生产环境
- `make prod-up` - 启动生产环境（带 Nginx）
- `make logs` - 查看日志
- `make down` - 停止服务
- `make clean` - 清理资源

### CI/CD 配置

#### `.github/workflows/docker-build.yml`
**用途:** GitHub Actions 自动构建配置

**触发条件:**
- 推送到 main/develop 分支
- 创建 tag
- Pull Request

**功能:**
- 自动构建 Docker 镜像
- 推送到 GitHub Container Registry
- 多架构支持（amd64/arm64）
- 使用 BuildKit 缓存

### 文档

#### `docs/development/DOCKER.md`
**用途:** 完整的 Docker 部署指南

**内容:**
- 详细的部署步骤
- 环境变量配置
- 故障排查
- 性能优化
- 安全建议

**适合:** 首次部署或深入了解

#### `docs/development/DOCKER-CHECKLIST.md`
**用途:** 部署前后的检查清单

**内容:**
- 部署前准备
- 部署步骤
- 验证清单
- 常见问题
- 安全检查

**适合:** 按步骤执行部署

#### `docs/development/DOCKER-QUICK-REFERENCE.md`
**用途:** 常用命令速查表

**内容:**
- 快速命令参考
- 常用组合命令
- 故障排查命令
- 维护命令

**适合:** 日常使用查询

#### `DOCKER-SETUP-SUMMARY.md`
**用途:** Docker 接入总结

**内容:**
- 完成工作清单
- 快速开始指南
- 架构说明
- 最佳实践

**适合:** 快速了解 Docker 配置

## 🔧 配置优先级

### 环境变量

1. **容器运行时环境变量**（最高优先级）
   ```bash
   docker run -e NODE_ENV=production ...
   ```

2. **docker-compose.yml 中的 environment**
   ```yaml
   environment:
     - NODE_ENV=production
   ```

3. **env_file 指定的文件**
   ```yaml
   env_file:
     - .env.production
   ```

4. **.env 文件**（默认）

### 端口映射

格式: `主机端口:容器端口`

```yaml
ports:
  - "3000:3000"  # 主机 3000 → 容器 3000
  - "80:80"      # 主机 80 → 容器 80
```

## 📝 环境变量模板

由于 `.env.example` 被 `.gitignore` 阻止，这里提供环境变量模板：

### 开发环境 (`.env.local`)

```env
# Next.js 环境变量 - 开发环境
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development

# API 配置（如需要）
# NEXT_PUBLIC_API_URL=http://localhost:8080

# Google Analytics（如需要）
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 生产环境 (`.env.production`)

```env
# Next.js 环境变量 - 生产环境
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production

# 站点配置
NEXT_PUBLIC_SITE_URL=https://lamemp3.com

# API 配置
# NEXT_PUBLIC_API_URL=https://api.lamemp3.com

# Google Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 其他配置
# NEXT_PUBLIC_CDN_URL=https://cdn.lamemp3.com
```

**创建方法:**
```bash
# 复制模板
cat > .env.local << EOF
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
EOF

# 或手动创建
nano .env.local
```

## 🚀 使用流程

### 1. 首次设置

```bash
# 1. 检查环境
./scripts/docker-check.sh

# 2. 选择配置文件
# 开发环境使用: docker-compose.dev.yml
# 生产环境使用: docker-compose.prod.yml
```

### 2. 日常开发

```bash
# 启动
make dev

# 查看日志
make dev-logs

# 停止
make dev-down
```

### 3. 生产部署

```bash
# 构建
make prod-build

# 启动
make prod-up

# 验证
curl http://localhost

# 查看日志
make prod-logs
```

## 🔄 更新维护

### 更新流程

```bash
# 1. 拉取代码
git pull

# 2. 停止服务
make down

# 3. 重新构建
make build

# 4. 启动服务
make up
```

### 清理资源

```bash
# 清理未使用资源
make clean

# 完全清理（包括镜像）
make clean-all
```

## 📊 文件大小参考

| 文件 | 大小 | 说明 |
|-----|------|------|
| Dockerfile | ~2KB | 配置文件 |
| Dockerfile.dev | ~0.5KB | 配置文件 |
| docker-compose.yml | ~1KB | 编排文件 |
| docker-compose.prod.yml | ~2KB | 编排文件 |
| nginx.conf | ~1KB | Nginx 配置 |
| default.conf | ~3KB | 站点配置 |
| **构建镜像** | ~400MB | 完整应用镜像 |

## ⚠️ 注意事项

1. **`.env*` 文件被 gitignore 忽略**
   - 环境变量文件不会被提交到 Git
   - 需要手动创建或使用模板

2. **nginx/logs/ 目录**
   - 运行时自动生成日志文件
   - 日志文件不会被提交到 Git

3. **脚本执行权限**
   - `scripts/*.sh` 已添加执行权限
   - 如果没有权限: `chmod +x scripts/*.sh`

4. **端口冲突**
   - 确保所需端口未被占用
   - 可以修改 docker-compose.yml 中的端口映射

5. **WASM 文件**
   - 确保 `public/wasm/` 目录包含必要的文件
   - 检查 `.dockerignore` 没有排除 WASM 文件

## 🔗 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js Docker 部署](https://nextjs.org/docs/deployment#docker-image)
- [Nginx 文档](https://nginx.org/en/docs/)

---

**提示:** 建议将此文件作为 Docker 配置的总览文档。

