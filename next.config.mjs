/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出模式（用于 LeanCloud 静态站点）
  output: 'export',
  
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
  },
  
  // 注意：静态导出时 headers() 配置不会生效
  // .well-known 文件已放在 public 目录，会被正确复制
  // 但需要服务器配置正确的 Content-Type（LeanCloud 静态站点会自动处理）
};

export default nextConfig;

