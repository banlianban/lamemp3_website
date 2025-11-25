# Docker 部署指南

本项目支持使用 Docker 进行开发和生产部署。

> 💡 **快速参考:** 如需查阅常用命令，请查看 [Docker 快速参考](./DOCKER-QUICK-REFERENCE.md)  
> 📋 **部署检查清单:** 部署前请参考 [Docker 部署检查清单](./DOCKER-CHECKLIST.md)

## 目录

- [快速开始](#快速开始)
- [开发环境](#开发环境)
- [生产环境](#生产环境)
- [常用命令](#常用命令)
- [故障排查](#故障排查)
- [相关文档](#相关文档)

## 快速开始

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

### 检查 Docker 安装

```bash
docker --version
docker-compose --version
```

## 开发环境

开发环境使用 Docker 时支持热重载，代码更改会自动反映。

### 启动开发环境

```bash
# 使用 docker-compose 启动
docker-compose -f docker-compose.dev.yml up

# 或者后台运行
docker-compose -f docker-compose.dev.yml up -d
```

### 查看日志

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### 停止开发环境

```bash
docker-compose -f docker-compose.dev.yml down
```

## 生产环境

生产环境使用优化的多阶段构建，镜像更小、启动更快。

### 方法一：使用 Docker Compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止并删除容器
docker-compose down
```

### 方法二：使用 Docker 命令

```bash
# 构建镜像
docker build -t hdr-ultra-web:latest .

# 运行容器
docker run -d \
  --name hdr-ultra-web \
  -p 3000:3000 \
  --restart unless-stopped \
  hdr-ultra-web:latest

# 查看日志
docker logs -f hdr-ultra-web

# 停止容器
docker stop hdr-ultra-web

# 删除容器
docker rm hdr-ultra-web
```

## 常用命令

### 查看运行中的容器

```bash
docker ps
```

### 进入容器内部

```bash
# 生产环境
docker exec -it hdr-ultra-web sh

# 开发环境
docker exec -it hdr-ultra-web-dev sh
```

### 重新构建镜像

```bash
# 生产环境
docker-compose build --no-cache

# 开发环境
docker-compose -f docker-compose.dev.yml build --no-cache
```

### 清理未使用的镜像和容器

```bash
# 清理悬空镜像
docker image prune

# 清理所有未使用的资源
docker system prune -a
```

## 环境变量配置

如果项目需要环境变量，可以：

### 方法一：使用 .env 文件

1. 创建 `.env.production` 文件（生产环境）或 `.env.local`（开发环境）
2. 在 `docker-compose.yml` 中取消 `env_file` 的注释

```yaml
env_file:
  - .env.production
```

### 方法二：在 docker-compose.yml 中直接配置

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=https://api.example.com
```

## Docker 镜像优化

本项目的 Dockerfile 已经进行了以下优化：

1. **多阶段构建**：分离依赖安装、构建和运行阶段
2. **Standalone 输出**：使用 Next.js 的 standalone 模式减小镜像体积
3. **Alpine Linux**：使用轻量级的 Alpine 基础镜像
4. **非 root 用户**：使用专用用户运行应用，提高安全性
5. **层缓存优化**：合理安排 COPY 指令顺序以利用 Docker 层缓存

## 健康检查

生产环境的 Docker Compose 配置包含健康检查。如果需要自定义健康检查端点，可以创建 `/api/health` 路由：

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' }, { status: 200 });
}
```

## 故障排查

### 容器启动失败

```bash
# 查看容器日志
docker logs hdr-ultra-web

# 检查容器状态
docker inspect hdr-ultra-web
```

### 端口冲突

如果 3000 端口被占用，修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "3001:3000"  # 将宿主机端口改为 3001
```

### 构建失败

```bash
# 清理缓存后重新构建
docker-compose build --no-cache
```

### WASM 文件问题

本项目使用了 WebAssembly，确保 `public/wasm/` 目录下的文件正确复制到容器中。

## 性能调优

### 调整 Node.js 内存限制

如果构建过程中遇到内存问题，可以在 Dockerfile 中增加内存限制：

```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
```

### 使用 BuildKit

启用 Docker BuildKit 可以提高构建速度：

```bash
DOCKER_BUILDKIT=1 docker build -t hdr-ultra-web:latest .
```

## 生产部署建议

1. **使用反向代理**：在生产环境中，建议使用 Nginx 或 Caddy 作为反向代理
2. **配置 HTTPS**：使用 Let's Encrypt 等工具配置 SSL 证书
3. **设置资源限制**：在 docker-compose.yml 中配置内存和 CPU 限制
4. **监控和日志**：集成日志收集和监控系统
5. **备份策略**：定期备份容器配置和数据

## 相关文档

### 项目文档

- [Docker 快速参考](./DOCKER-QUICK-REFERENCE.md) - 常用命令速查
- [Docker 部署检查清单](./DOCKER-CHECKLIST.md) - 部署前后的完整检查列表
- [快速启动指南](./QUICK-START.md) - 项目整体快速启动
- [WASM 集成说明](./WASM-INTEGRATION.md) - WebAssembly 相关文档

### 外部资源

- [Next.js Docker 部署文档](https://nextjs.org/docs/deployment#docker-image)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx Docker 文档](https://hub.docker.com/_/nginx)

