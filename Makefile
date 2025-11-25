.PHONY: help dev dev-build dev-up dev-down dev-logs build up down logs restart clean prod-build prod-up prod-down prod-logs ps

# 默认目标
help:
	@echo "HDR Ultra Web - Docker 命令"
	@echo ""
	@echo "开发环境:"
	@echo "  make dev         - 启动开发环境（带热重载）"
	@echo "  make dev-build   - 构建开发环境镜像"
	@echo "  make dev-down    - 停止开发环境"
	@echo "  make dev-logs    - 查看开发环境日志"
	@echo ""
	@echo "生产环境（简单）:"
	@echo "  make build       - 构建生产镜像"
	@echo "  make up          - 启动生产环境"
	@echo "  make down        - 停止生产环境"
	@echo "  make logs        - 查看生产环境日志"
	@echo "  make restart     - 重启生产环境"
	@echo ""
	@echo "生产环境（带 Nginx）:"
	@echo "  make prod-build  - 构建生产镜像（带 Nginx）"
	@echo "  make prod-up     - 启动生产环境（带 Nginx）"
	@echo "  make prod-down   - 停止生产环境（带 Nginx）"
	@echo "  make prod-logs   - 查看生产环境日志（带 Nginx）"
	@echo ""
	@echo "维护:"
	@echo "  make clean       - 清理未使用的 Docker 资源"
	@echo "  make clean-all   - 清理所有未使用资源（包括镜像）"
	@echo "  make ps          - 查看运行中的容器"
	@echo ""

# 开发环境命令
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml build --no-cache

dev-up:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# 生产环境命令
build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

ps:
	docker ps

# 生产环境命令（带 Nginx）
prod-build:
	docker-compose -f docker-compose.prod.yml build --no-cache

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

# 清理命令
clean:
	@echo "清理未使用的 Docker 资源..."
	docker system prune -f
	@echo "清理完成！"

# 完全清理（包括镜像）
clean-all:
	@echo "清理所有未使用的 Docker 资源（包括镜像）..."
	docker system prune -a -f
	@echo "清理完成！"

