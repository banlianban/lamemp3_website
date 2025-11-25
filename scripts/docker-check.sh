#!/bin/bash

# Docker 环境检查脚本

set -e

echo "🔍 检查 Docker 环境..."
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi
echo "✅ Docker 已安装: $(docker --version)"

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未运行"
    echo "请启动 Docker 服务"
    exit 1
fi
echo "✅ Docker 正在运行"

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose 未安装（将使用 docker compose 命令）"
else
    echo "✅ Docker Compose 已安装: $(docker-compose --version)"
fi

# 检查必要文件
echo ""
echo "📋 检查项目文件..."

required_files=(
    "Dockerfile"
    "Dockerfile.dev"
    "docker-compose.yml"
    "docker-compose.dev.yml"
    ".dockerignore"
    "package.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 缺失"
        exit 1
    fi
done

# 检查 WASM 文件
echo ""
echo "📦 检查 WASM 文件..."
if [ -f "public/wasm/ultrahdr.wasm" ] && [ -f "public/wasm/ultrahdr.js" ]; then
    echo "✅ WASM 文件存在"
else
    echo "⚠️  WASM 文件缺失，应用可能无法正常工作"
fi

# 显示磁盘空间
echo ""
echo "💾 Docker 磁盘使用情况:"
docker system df

echo ""
echo "✨ 环境检查完成！"
echo ""
echo "可用命令:"
echo "  make dev      - 启动开发环境"
echo "  make up       - 启动生产环境"
echo "  make help     - 查看所有命令"

