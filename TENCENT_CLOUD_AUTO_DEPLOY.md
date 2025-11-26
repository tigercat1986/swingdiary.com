# 腾讯云轻量服务器自动部署配置指南

本指南将帮助你在腾讯云轻量服务器上配置自动同步 GitHub 代码并部署网站。

## 方案选择

### 方案 1: GitHub Webhook（推荐）
当代码推送到 GitHub 时，自动触发服务器部署。

### 方案 2: 定时拉取（简单）
使用 cron 定时任务定期从 GitHub 拉取代码。

### 方案 3: GitHub Actions
使用 GitHub Actions 自动部署到服务器。

---

## 方案 1: GitHub Webhook 自动部署（推荐）

### 1. 服务器端配置

#### 1.1 安装 Node.js 和 PM2

```bash
# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 进程管理器
sudo npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
```

#### 1.2 克隆项目到服务器

```bash
# 创建项目目录
sudo mkdir -p /var/www/swingdiary.com
sudo chown -R $USER:$USER /var/www/swingdiary.com

# 克隆仓库
cd /var/www/swingdiary.com
git clone https://github.com/tigercat1986/swingdiary.com.git .

# 安装依赖
npm install

# 构建项目
npm run build
```

#### 1.3 配置部署脚本

```bash
# 给部署脚本添加执行权限
chmod +x deploy.sh

# 测试部署脚本
./deploy.sh
```

#### 1.4 启动 Webhook 服务器

```bash
# 设置 Webhook Secret（重要：请修改为强密码）
export WEBHOOK_SECRET="your-strong-random-secret-key-here"

# 使用 PM2 启动 Webhook 服务器
pm2 start webhook.js --name "webhook-server" --env WEBHOOK_SECRET="$WEBHOOK_SECRET"

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup
```

#### 1.5 配置防火墙

```bash
# 开放 Webhook 端口（默认 9000）
sudo ufw allow 9000/tcp

# 或者使用腾讯云控制台的防火墙规则
```

#### 1.6 配置 Nginx 反向代理（可选但推荐）

```bash
# 安装 Nginx
sudo apt-get install -y nginx

# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/webhook
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    location /webhook {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:9000;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. GitHub 配置

#### 2.1 创建 Webhook

1. 访问 GitHub 仓库：https://github.com/tigercat1986/swingdiary.com
2. 进入 **Settings** → **Webhooks** → **Add webhook**
3. 配置如下：
   - **Payload URL**: `http://your-server-ip:9000/webhook` 或 `https://your-domain.com/webhook`
   - **Content type**: `application/json`
   - **Secret**: 与服务器上设置的 `WEBHOOK_SECRET` 相同
   - **Events**: 选择 "Just the push event"
   - **Active**: ✅ 勾选

4. 点击 **Add webhook**

#### 2.2 测试 Webhook

推送一次代码到 GitHub，查看：
- GitHub Webhook 页面的事件日志
- 服务器日志：`pm2 logs webhook-server`

---

## 方案 2: 定时拉取（简单方案）

### 1. 配置定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每 5 分钟检查一次）
*/5 * * * * cd /var/www/swingdiary.com && /usr/bin/git pull origin main && /usr/bin/npm run build && /usr/bin/pm2 restart swingdiary

# 或者使用部署脚本（推荐）
*/5 * * * * /var/www/swingdiary.com/deploy.sh >> /var/log/swingdiary-deploy.log 2>&1
```

### 2. 查看日志

```bash
tail -f /var/log/swingdiary-deploy.log
```

---

## 方案 3: GitHub Actions 自动部署

### 1. 创建 GitHub Actions 工作流

创建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to Tencent Cloud

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/swingdiary.com
            git pull origin main
            npm install
            npm run build
            pm2 restart swingdiary
```

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：
- `SERVER_HOST`: 服务器 IP
- `SERVER_USER`: SSH 用户名（通常是 root 或 ubuntu）
- `SERVER_SSH_KEY`: SSH 私钥

---

## 启动网站应用

### 使用 PM2 管理 Next.js 应用

```bash
cd /var/www/swingdiary.com

# 启动应用
pm2 start npm --name "swingdiary" -- start

# 或者使用 server.js
pm2 start server.js --name "swingdiary"

# 查看状态
pm2 status

# 查看日志
pm2 logs swingdiary

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

### 配置 Nginx 反向代理（生产环境）

```bash
sudo nano /etc/nginx/sites-available/swingdiary
```

```nginx
server {
    listen 80;
    server_name swingdiary.com www.swingdiary.com;  # 替换为你的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/swingdiary /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 安全建议

1. **使用 HTTPS**：配置 SSL 证书（Let's Encrypt 免费）
2. **防火墙规则**：只开放必要端口（80, 443, 22）
3. **SSH 密钥认证**：禁用密码登录
4. **定期更新**：`sudo apt update && sudo apt upgrade`
5. **备份数据**：定期备份项目文件

---

## 故障排查

### 查看 Webhook 日志
```bash
pm2 logs webhook-server
```

### 查看应用日志
```bash
pm2 logs swingdiary
```

### 手动测试部署
```bash
cd /var/www/swingdiary.com
./deploy.sh
```

### 检查服务状态
```bash
pm2 status
sudo systemctl status nginx
```

---

## 快速开始命令总结

```bash
# 1. 安装依赖
sudo apt-get update
sudo apt-get install -y nodejs npm nginx git
sudo npm install -g pm2

# 2. 克隆项目
sudo mkdir -p /var/www/swingdiary.com
sudo chown -R $USER:$USER /var/www/swingdiary.com
cd /var/www/swingdiary.com
git clone https://github.com/tigercat1986/swingdiary.com.git .

# 3. 安装项目依赖
npm install
npm run build

# 4. 配置部署脚本
chmod +x deploy.sh

# 5. 启动 Webhook 服务器
export WEBHOOK_SECRET="your-secret-key"
pm2 start webhook.js --name "webhook-server" --env WEBHOOK_SECRET="$WEBHOOK_SECRET"
pm2 save
pm2 startup

# 6. 启动应用
pm2 start npm --name "swingdiary" -- start
pm2 save

# 7. 配置 GitHub Webhook
# 访问: https://github.com/tigercat1986/swingdiary.com/settings/hooks
# 添加 Webhook: http://your-server-ip:9000/webhook
```

---

## 注意事项

1. 确保服务器有足够的资源（至少 1GB RAM）
2. Node.js 版本需要 20.x
3. 首次部署需要较长时间（安装依赖和构建）
4. 建议在非高峰时段进行首次部署测试

