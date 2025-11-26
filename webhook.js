// GitHub Webhook 接收服务器
// 用于接收 GitHub 的推送事件并自动触发部署

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

// 配置
const PORT = 9000; // Webhook 监听端口
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-key'; // GitHub Webhook Secret
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh');

// 验证 GitHub Webhook 签名
function verifySignature(payload, signature) {
    if (!signature) {
        return false;
    }
    
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

// 执行部署脚本
function deploy() {
    return new Promise((resolve, reject) => {
        console.log(`[${new Date().toISOString()}] 开始执行部署...`);
        
        exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`部署错误: ${error}`);
                reject(error);
                return;
            }
            
            console.log(stdout);
            if (stderr) {
                console.error(stderr);
            }
            
            console.log(`[${new Date().toISOString()}] 部署完成`);
            resolve();
        });
    });
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                // 验证签名
                const signature = req.headers['x-hub-signature-256'];
                
                if (!verifySignature(body, signature)) {
                    console.error(`[${new Date().toISOString()}] 签名验证失败`);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Unauthorized' }));
                    return;
                }
                
                const payload = JSON.parse(body);
                
                // 只处理 push 事件到 main 分支
                if (payload.ref === 'refs/heads/main' && payload.pusher) {
                    console.log(`[${new Date().toISOString()}] 收到 main 分支推送事件`);
                    console.log(`提交信息: ${payload.head_commit?.message || 'N/A'}`);
                    
                    // 异步执行部署，立即返回响应
                    deploy().catch(err => {
                        console.error(`部署失败: ${err.message}`);
                    });
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        status: 'success', 
                        message: 'Deployment triggered' 
                    }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        status: 'ignored', 
                        message: 'Not a main branch push' 
                    }));
                }
            } catch (error) {
                console.error(`处理 Webhook 错误: ${error.message}`);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/health') {
        // 健康检查端点
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`GitHub Webhook 服务器运行在端口 ${PORT}`);
    console.log(`Webhook URL: http://your-server-ip:${PORT}/webhook`);
    console.log(`健康检查: http://your-server-ip:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

