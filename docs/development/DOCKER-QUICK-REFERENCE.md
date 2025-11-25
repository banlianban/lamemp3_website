# Docker 快速参考

本文档提供常用 Docker 命令的快速参考。

## 🚀 快速开始

### 首次使用

```bash
# 1. 检查环境
./scripts/docker-check.sh

# 2. 选择部署模式
./scripts/docker-deploy.sh dev        # 开发环境
./scripts/docker-deploy.sh prod       # 生产环境
./scripts/docker-deploy.sh prod-nginx # 生产环境 + Nginx
```

### 使用 Makefile（推荐）

```bash
make help      # 查看所有命令
make dev       # 开发环境
make up        # 生产环境
make prod-up   # 生产环境 + Nginx
```

## 📦 常用命令

### 开发环境

```bash
# 启动（前台）
docker-compose -f docker-compose.dev.yml up

# 启动（后台）
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止
docker-compose -f docker-compose.dev.yml down

# 重新构建
docker-compose -f docker-compose.dev.yml build --no-cache
```

### 生产环境（简单）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 重启
docker-compose restart
```

### 生产环境（带 Nginx）

```bash
# 构建并启动
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f hdr-ultra-web

# 停止
docker-compose -f docker-compose.prod.yml down
```

## 🔍 调试命令

### 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 进入容器
docker exec -it hdr-ultra-web sh

# 查看容器详情
docker inspect hdr-ultra-web

# 查看容器资源使用
docker stats hdr-ultra-web
```

### 日志查看

```bash
# 查看最近 100 行日志
docker logs --tail 100 hdr-ultra-web

# 实时跟踪日志
docker logs -f hdr-ultra-web

# 查看带时间戳的日志
docker logs -t hdr-ultra-web
```

### 网络调试

```bash
# 查看网络列表
docker network ls

# 查看网络详情
docker network inspect hdr-ultra-network

# 测试容器间连接（在 Nginx 容器中）
docker exec hdr-ultra-nginx ping hdr-ultra-web
```

## 🛠️ 维护命令

### 清理

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理所有未使用的资源
docker system prune

# 清理所有（包括镜像）
docker system prune -a

# 查看磁盘使用情况
docker system df
```

### 镜像管理

```bash
# 查看镜像列表
docker images

# 删除镜像
docker rmi hdr-ultra-web:latest

# 导出镜像
docker save hdr-ultra-web:latest > hdr-ultra-web.tar

# 导入镜像
docker load < hdr-ultra-web.tar

# 标记镜像
docker tag hdr-ultra-web:latest hdr-ultra-web:v1.0.0
```

### 备份与恢复

```bash
# 备份容器数据（如果有挂载卷）
docker run --rm --volumes-from hdr-ultra-web \
  -v $(pwd):/backup alpine \
  tar czf /backup/data-backup.tar.gz /app/data

# 恢复数据
docker run --rm --volumes-from hdr-ultra-web \
  -v $(pwd):/backup alpine \
  tar xzf /backup/data-backup.tar.gz -C /
```

## ⚙️ 配置文件

### 环境变量

```bash
# 创建环境变量文件
cp .env.example .env.local          # 开发环境
cp .env.example .env.production     # 生产环境

# 在 docker-compose.yml 中使用
# env_file:
#   - .env.production
```

### 端口修改

如果默认端口被占用，修改 `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # 将主机端口改为 3001
```

### 资源限制

在 `docker-compose.yml` 中添加:

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细错误
docker logs hdr-ultra-web

# 检查容器配置
docker inspect hdr-ultra-web

# 重新构建（无缓存）
docker-compose build --no-cache
```

### 端口冲突

```bash
# 查找占用端口的进程
lsof -i :3000

# 或
netstat -an | grep 3000

# 修改 docker-compose.yml 中的端口映射
```

### 磁盘空间不足

```bash
# 检查空间使用
docker system df

# 清理
docker system prune -a

# 查看大镜像
docker images --format "{{.Size}}\t{{.Repository}}:{{.Tag}}" | sort -h
```

### WASM 文件无法加载

```bash
# 检查文件是否存在于容器中
docker exec hdr-ultra-web ls -la /app/public/wasm/

# 检查 .dockerignore 配置
cat .dockerignore | grep wasm
```

## 📊 性能优化

### 构建优化

```bash
# 使用 BuildKit（更快的构建）
DOCKER_BUILDKIT=1 docker build -t hdr-ultra-web .

# 使用缓存
docker-compose build  # 使用缓存
docker-compose build --no-cache  # 不使用缓存
```

### 运行优化

```bash
# 限制日志大小
docker run -d \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  hdr-ultra-web

# 在 docker-compose.yml 中配置
# logging:
#   driver: "json-file"
#   options:
#     max-size: "10m"
#     max-file: "3"
```

## 📱 多环境部署

### 开发环境

```bash
export ENV=development
docker-compose -f docker-compose.dev.yml up -d
```

### 测试环境

```bash
export ENV=staging
docker-compose -f docker-compose.staging.yml up -d
```

### 生产环境

```bash
export ENV=production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔗 常用组合命令

```bash
# 完全重建并启动
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# 查看状态并跟踪日志
docker-compose ps && docker-compose logs -f

# 停止、清理并重启
docker-compose down && docker system prune -f && docker-compose up -d

# 更新并重启
git pull && docker-compose build && docker-compose up -d
```

## 📝 备忘录

### 服务访问地址

| 环境 | 地址 |
|-----|------|
| 开发环境 | http://localhost:3000 |
| 生产环境（简单） | http://localhost:3000 |
| 生产环境（Nginx） | http://localhost |

### 容器名称

- `hdr-ultra-web-dev` - 开发环境容器
- `hdr-ultra-web` - 生产环境容器
- `hdr-ultra-nginx` - Nginx 容器

### 网络名称

- `hdr-ultra-network` - 应用网络

### 常用文件路径

- 容器内应用路径: `/app`
- 容器内 WASM 路径: `/app/public/wasm`
- Nginx 配置: `./nginx/nginx.conf`
- Nginx 站点配置: `./nginx/conf.d/`
- Nginx 日志: `./nginx/logs/`

## 🆘 获取帮助

```bash
# Docker 帮助
docker --help
docker-compose --help

# 特定命令帮助
docker run --help
docker-compose up --help

# 项目帮助
make help
./scripts/docker-check.sh
```

## 📚 相关文档

- [完整 Docker 部署指南](./DOCKER.md)
- [Docker 部署检查清单](./DOCKER-CHECKLIST.md)
- [快速启动指南](./QUICK-START.md)

---

**提示:** 将此文件加入书签，方便随时查阅！

