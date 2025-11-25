# Docker 部署检查清单

在部署前，请确保完成以下检查项。

## 📋 部署前检查

### 1. 环境准备

- [ ] Docker 已安装（版本 >= 20.10）
- [ ] Docker Compose 已安装（版本 >= 2.0）
- [ ] Docker 服务正在运行
- [ ] 有足够的磁盘空间（至少 2GB）

**检查命令:**
```bash
./scripts/docker-check.sh
```

### 2. 项目文件

- [ ] `Dockerfile` 存在
- [ ] `Dockerfile.dev` 存在
- [ ] `docker-compose.yml` 存在
- [ ] `docker-compose.dev.yml` 存在
- [ ] `.dockerignore` 存在
- [ ] `public/wasm/ultrahdr.wasm` 存在
- [ ] `public/wasm/ultrahdr.js` 存在

### 3. 配置文件

- [ ] `next.config.mjs` 中启用了 `output: 'standalone'`
- [ ] `package.json` 依赖完整
- [ ] 环境变量配置正确（如需要）

### 4. 端口检查

- [ ] 开发环境: 端口 3000 未被占用
- [ ] 生产环境（简单）: 端口 3000 未被占用
- [ ] 生产环境（Nginx）: 端口 80 和 443 未被占用

**检查端口:**
```bash
# macOS/Linux
lsof -i :3000
lsof -i :80
lsof -i :443

# 或使用
netstat -an | grep LISTEN
```

## 🚀 部署步骤

### 开发环境部署

```bash
# 方法 1: 使用脚本
./scripts/docker-deploy.sh dev

# 方法 2: 使用 Makefile
make dev

# 方法 3: 使用 docker-compose
docker-compose -f docker-compose.dev.yml up -d
```

**验证:**
- [ ] 访问 http://localhost:3000 正常
- [ ] 修改代码后自动热重载
- [ ] WASM 功能正常工作
- [ ] 多语言切换正常

### 生产环境部署（简单模式）

```bash
# 方法 1: 使用脚本
./scripts/docker-deploy.sh prod

# 方法 2: 使用 Makefile
make build
make up

# 方法 3: 使用 docker-compose
docker-compose build --no-cache
docker-compose up -d
```

**验证:**
- [ ] 访问 http://localhost:3000 正常
- [ ] 所有功能正常工作
- [ ] 静态资源加载正常
- [ ] WASM 模块加载正常

### 生产环境部署（带 Nginx）

```bash
# 方法 1: 使用脚本
./scripts/docker-deploy.sh prod-nginx

# 方法 2: 使用 Makefile
make prod-build
make prod-up

# 方法 3: 使用 docker-compose
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

**验证:**
- [ ] 访问 http://localhost 正常（注意是 80 端口）
- [ ] Nginx 反向代理正常工作
- [ ] 静态资源缓存配置生效
- [ ] Gzip 压缩启用

## 🔍 部署后验证

### 1. 容器状态检查

```bash
# 查看运行中的容器
docker ps

# 应该看到类似输出:
# CONTAINER ID   IMAGE              STATUS         PORTS
# xxxx           hdr-ultra-web      Up 2 minutes   0.0.0.0:3000->3000/tcp
```

**检查项:**
- [ ] 容器状态为 "Up"
- [ ] 端口映射正确
- [ ] 没有持续重启

### 2. 日志检查

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml logs -f

# 生产环境（简单）
docker-compose logs -f

# 生产环境（Nginx）
docker-compose -f docker-compose.prod.yml logs -f
```

**检查项:**
- [ ] 没有错误日志
- [ ] Next.js 启动成功
- [ ] 端口监听正常
- [ ] WASM 文件加载成功

### 3. 健康检查

```bash
# 检查容器健康状态
docker ps --format "table {{.Names}}\t{{.Status}}"

# 应该看到 "healthy" 状态（如果配置了健康检查）
```

### 4. 功能测试

- [ ] **首页加载**: 访问首页，检查是否正常显示
- [ ] **语言切换**: 测试中英文切换功能
- [ ] **图像上传**: 测试上传图片功能
- [ ] **HDR 转换**: 测试 Ultra HDR 转换功能
- [ ] **响应式设计**: 测试不同屏幕尺寸
- [ ] **浏览器兼容**: 测试不同浏览器

### 5. 性能检查

```bash
# 查看资源使用情况
docker stats

# 检查镜像大小
docker images | grep hdr-ultra
```

**预期:**
- [ ] 内存使用 < 512MB（正常运行）
- [ ] CPU 使用率合理
- [ ] 镜像大小 < 500MB

## 🐛 常见问题排查

### 问题 1: 容器启动失败

```bash
# 查看详细日志
docker logs hdr-ultra-web

# 检查容器状态
docker inspect hdr-ultra-web
```

**可能原因:**
- 端口被占用
- 依赖安装失败
- 构建过程出错

### 问题 2: WASM 文件加载失败

**检查项:**
- [ ] `public/wasm/` 目录文件完整
- [ ] `.dockerignore` 没有排除 WASM 文件
- [ ] Nginx 配置正确处理 `.wasm` 文件

### 问题 3: 热重载不工作（开发环境）

**检查项:**
- [ ] 使用的是 `docker-compose.dev.yml`
- [ ] 源代码目录正确挂载
- [ ] `node_modules` 使用容器内的版本

### 问题 4: Nginx 502 错误

```bash
# 检查 Next.js 容器是否运行
docker ps | grep hdr-ultra-web

# 检查网络连接
docker-compose -f docker-compose.prod.yml exec nginx ping hdr-ultra-web
```

**可能原因:**
- Next.js 容器未启动
- 网络配置错误
- 容器间无法通信

## 🔒 安全检查（生产环境）

- [ ] 使用非 root 用户运行容器
- [ ] 设置了资源限制（CPU、内存）
- [ ] 配置了安全头部（Nginx）
- [ ] 环境变量不包含敏感信息
- [ ] 启用了 HTTPS（如果暴露到公网）
- [ ] 定期更新基础镜像

## 📊 监控建议

### 日志管理

```bash
# 创建日志目录
mkdir -p logs

# 配置日志持久化
# 在 docker-compose.yml 中添加:
# volumes:
#   - ./logs:/app/logs
```

### 健康监控

推荐集成以下工具:
- [ ] **Prometheus**: 指标收集
- [ ] **Grafana**: 可视化监控
- [ ] **Loki**: 日志聚合
- [ ] **Uptime Kuma**: 服务状态监控

## 🔄 更新和维护

### 更新应用

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建镜像
docker-compose build --no-cache

# 3. 重启容器
docker-compose up -d
```

### 备份

```bash
# 导出镜像
docker save hdr-ultra-web:latest | gzip > hdr-ultra-web-backup.tar.gz

# 恢复镜像
docker load < hdr-ultra-web-backup.tar.gz
```

### 清理

```bash
# 清理未使用的资源
make clean

# 清理所有资源（包括镜像）
make clean-all
```

## ✅ 部署完成确认

部署成功后，确认以下事项:

- [ ] 所有容器正常运行
- [ ] 应用可以正常访问
- [ ] 所有功能测试通过
- [ ] 日志没有错误信息
- [ ] 性能指标正常
- [ ] 安全配置完成（生产环境）
- [ ] 监控系统配置（生产环境）
- [ ] 备份策略确定（生产环境）

## 📚 参考资料

- [Docker 部署指南](./DOCKER.md)
- [Next.js Docker 文档](https://nextjs.org/docs/deployment#docker-image)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)

---

**提示:** 首次部署建议先在开发环境测试，确认无误后再部署到生产环境。

