# Docker 快速开始 🚀

5 分钟内用 Docker 启动 HDR Ultra Web！

## 前置要求

- ✅ Docker 已安装
- ✅ Docker 正在运行

## 快速开始

### 方法一：使用脚本（最简单）

```bash
# 1. 检查环境（可选）
./scripts/docker-check.sh

# 2. 启动开发环境
./scripts/docker-deploy.sh dev

# 3. 访问应用
open http://localhost:3000
```

### 方法二：使用 Makefile（推荐）

```bash
# 查看所有可用命令
make help

# 启动开发环境
make dev

# 或启动生产环境
make up
```

### 方法三：直接使用 Docker Compose

```bash
# 开发环境（带热重载）
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d

# 生产环境（带 Nginx）
docker-compose -f docker-compose.prod.yml up -d
```

## 常用命令

```bash
# 查看日志
make logs

# 停止服务
make down

# 查看运行状态
docker ps

# 进入容器
docker exec -it hdr-ultra-web sh

# 清理资源
make clean
```

## 访问地址

| 环境 | 地址 |
|-----|------|
| 开发环境 | http://localhost:3000 |
| 生产环境（简单） | http://localhost:3000 |
| 生产环境（Nginx） | http://localhost |

## 环境变量（可选）

如需配置环境变量：

```bash
# 创建 .env.local 文件
cat > .env.local << EOF
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
EOF

# 然后在 docker-compose.yml 中启用 env_file
```

## 故障排查

### 端口被占用

```bash
# 查看端口占用
lsof -i :3000

# 修改端口（编辑 docker-compose.yml）
ports:
  - "3001:3000"  # 改用 3001 端口
```

### 容器启动失败

```bash
# 查看日志
docker logs hdr-ultra-web

# 重新构建
make build
```

## 📚 详细文档

需要更多信息？查看：

- [完整部署指南](./docs/development/DOCKER.md)
- [命令速查表](./docs/development/DOCKER-QUICK-REFERENCE.md)
- [部署检查清单](./docs/development/DOCKER-CHECKLIST.md)
- [文件说明](./docs/development/DOCKER-FILES.md)
- [完整总结](./DOCKER-SETUP-SUMMARY.md)

## 🎉 就这么简单！

现在你的 HDR Ultra Web 应用已经在 Docker 中运行了！

---

**提示:** 首次启动可能需要几分钟来下载和构建镜像，请耐心等待。

