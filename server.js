// LeanCloud 云引擎启动脚本
// 确保正确读取 LEANCLOUD_APP_PORT 环境变量

const { spawn } = require('child_process');

const port = process.env.LEANCLOUD_APP_PORT || process.env.PORT || '3000';

console.log(`Starting Next.js on port ${port}...`);

const nextProcess = spawn('node', ['node_modules/.bin/next', 'start', '-p', port, '-H', '0.0.0.0'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
  },
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  process.exit(code);
});

