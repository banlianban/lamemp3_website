#!/bin/bash

# Docker 快速部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 显示使用说明
usage() {
    echo "使用方法: $0 [dev|prod|prod-nginx]"
    echo ""
    echo "选项:"
    echo "  dev         - 部署开发环境（支持热重载）"
    echo "  prod        - 部署生产环境（仅 Next.js）"
    echo "  prod-nginx  - 部署生产环境（包含 Nginx 反向代理）"
    echo ""
    exit 1
}

# 检查参数
if [ $# -eq 0 ]; then
    usage
fi

MODE=$1

# 检查 Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker 未安装"
    exit 1
fi

print_info "开始部署 HDR Ultra Web..."
echo ""

case $MODE in
    dev)
        print_info "部署模式: 开发环境"
        print_info "停止现有容器..."
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
        
        print_info "构建镜像..."
        docker-compose -f docker-compose.dev.yml build
        
        print_info "启动容器..."
        docker-compose -f docker-compose.dev.yml up -d
        
        print_success "开发环境启动成功！"
        echo ""
        print_info "访问地址: http://localhost:3000"
        print_info "查看日志: docker-compose -f docker-compose.dev.yml logs -f"
        print_info "停止服务: docker-compose -f docker-compose.dev.yml down"
        ;;
        
    prod)
        print_info "部署模式: 生产环境"
        print_info "停止现有容器..."
        docker-compose down 2>/dev/null || true
        
        print_info "构建镜像..."
        docker-compose build --no-cache
        
        print_info "启动容器..."
        docker-compose up -d
        
        print_success "生产环境启动成功！"
        echo ""
        print_info "访问地址: http://localhost:3000"
        print_info "查看日志: docker-compose logs -f"
        print_info "停止服务: docker-compose down"
        ;;
        
    prod-nginx)
        print_info "部署模式: 生产环境（带 Nginx）"
        
        # 检查 Nginx 配置
        if [ ! -f "nginx/nginx.conf" ] || [ ! -f "nginx/conf.d/default.conf" ]; then
            print_error "Nginx 配置文件缺失"
            exit 1
        fi
        
        print_info "停止现有容器..."
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        
        print_info "构建镜像..."
        docker-compose -f docker-compose.prod.yml build --no-cache
        
        print_info "启动容器..."
        docker-compose -f docker-compose.prod.yml up -d
        
        print_success "生产环境（带 Nginx）启动成功！"
        echo ""
        print_info "访问地址: http://localhost"
        print_info "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
        print_info "停止服务: docker-compose -f docker-compose.prod.yml down"
        print_warning "提示: 如需 HTTPS，请配置 SSL 证书"
        ;;
        
    *)
        print_error "未知的部署模式: $MODE"
        usage
        ;;
esac

echo ""
print_info "等待服务启动..."
sleep 5

# 检查容器状态
print_info "容器状态:"
docker ps --filter "name=hdr-ultra" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
print_success "部署完成！"

