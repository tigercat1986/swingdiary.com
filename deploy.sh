#!/bin/bash

# 腾讯云轻量服务器自动部署脚本
# 用于从 GitHub 拉取最新代码并重新部署

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始部署 挥拍日记 Swing Diary 网站"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 配置变量
PROJECT_DIR="/var/www/swingdiary.com"
GIT_REPO="https://github.com/tigercat1986/swingdiary.com.git"
BRANCH="main"
NODE_VERSION="20"

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "项目目录不存在，正在克隆仓库..."
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    git clone "$GIT_REPO" .
else
    echo "进入项目目录..."
    cd "$PROJECT_DIR"
fi

# 拉取最新代码
echo "正在拉取最新代码..."
git fetch origin
git reset --hard origin/$BRANCH
git clean -fd

# 检查 Node.js 版本
echo "检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "Node.js 未安装，请先安装 Node.js $NODE_VERSION"
    exit 1
fi

NODE_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" != "$NODE_VERSION" ]; then
    echo "警告: Node.js 版本为 v$NODE_CURRENT，建议使用 v$NODE_VERSION"
fi

# 安装/更新依赖
echo "正在安装依赖..."
npm install --production=false

# 构建项目
echo "正在构建项目..."
npm run build

# 重启应用（使用 PM2 管理进程）
if command -v pm2 &> /dev/null; then
    echo "使用 PM2 重启应用..."
    pm2 restart swingdiary || pm2 start npm --name "swingdiary" -- start
    pm2 save
else
    echo "警告: PM2 未安装，无法自动重启应用"
    echo "请手动重启应用: cd $PROJECT_DIR && npm start"
fi

echo "=========================================="
echo "部署完成！"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

