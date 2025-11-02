# 网球拍档 · Tennis Mate 官方网站

官方网站项目，使用 Next.js 15 + Tailwind CSS + shadcn/ui + Framer Motion 构建。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **UI 组件**: 基于 shadcn/ui 的自定义组件
- **动画**: Framer Motion
- **测试**: Vitest + @testing-library/react
- **图标**: Lucide React
- **语言**: TypeScript

## 本地开发

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 构建与部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务器

```bash
npm run start
# 或
yarn start
```

### 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. Vercel 会自动检测 Next.js 项目并配置构建设置
4. 点击 "Deploy" 完成部署

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 项目结构

```
/
├── app/                      # Next.js App Router
│   ├── (marketing)/         # 营销页面组
│   │   ├── layout.tsx      # 营销页面布局
│   │   └── page.tsx        # 首页
│   ├── layout.tsx          # 根布局
│   ├── globals.css         # 全局样式
│   ├── sitemap.ts          # 网站地图
│   └── robots.txt          # 爬虫配置
├── components/              # 组件目录
│   ├── ui/                 # 基础 UI 组件
│   ├── Hero.tsx            # Hero 区域组件
│   ├── FeatureCard.tsx     # 功能卡片组件
│   ├── Section.tsx         # 区域容器组件
│   ├── Testimonial.tsx     # 用户评价组件
│   ├── Pricing.tsx         # 定价组件
│   ├── FAQ.tsx             # 常见问题组件
│   ├── SiteHeader.tsx      # 网站头部
│   └── SiteFooter.tsx      # 网站底部
├── content/                 # 内容数据
│   └── home.json           # 首页内容数据
├── lib/                     # 工具函数
│   └── utils.ts            # 工具函数
├── public/                  # 静态资源
├── __tests__/              # 测试文件
└── design-tokens.json      # 设计 Tokens
```

## 内容替换

### 修改文案

所有文案内容都在 `/content/home.json` 文件中，直接编辑该文件即可更新网站内容。

主要包含：
- `hero`: 首页 Hero 区域内容
- `features`: 功能特色列表
- `testimonials`: 用户评价
- `pricing`: 定价方案
- `faq`: 常见问题

### 替换产品截图

1. 准备应用截图（建议尺寸：1080x1920，9:16 比例）
2. 将截图放置在 `public/` 目录
3. 在 `components/Hero.tsx` 中更新图片路径：

```tsx
<Image src="/your-screenshot.png" alt="应用截图" />
```

### 替换 Logo 和图标

1. 准备 Logo 文件（建议 SVG 格式）
2. 更新 `public/favicon.ico` 和 `public/icon-*.png`
3. 在 `components/SiteHeader.tsx` 中更新 Logo

## 设计 Tokens

所有设计参数都在 `design-tokens.json` 中定义，包括：

- **颜色**: 品牌色、文字色、背景色、边框色
- **圆角**: `sm`, `md`, `lg`, `xl`, `pill`
- **阴影**: `sm`, `md`, `lg`
- **间距**: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- **字体**: 字号、字重、行高
- **动效**: 持续时间、缓动函数

Tailwind 配置已同步这些 tokens，直接使用即可。

## 测试

运行测试：

```bash
npm run test
# 或
yarn test
```

## 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 遵循 React 18 最佳实践
- 使用语义化 HTML 标签
- 确保可访问性（A11y）合规
- 移动优先响应式设计

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 待替换内容清单

### 图片资源
- [ ] `public/favicon.ico` - 网站图标
- [ ] `public/icon-logo.png` (192x192, 512x512) - PWA 图标
- [ ] `public/screenshot-hero.png` - Hero 区域应用截图
- [ ] 在 `components/Hero.tsx` 中更新图片路径

### 文案内容
- [ ] 所有文案在 `/content/home.json` 中，根据实际产品修改
- [ ] App Store 下载链接（在 `components/Pricing.tsx` 中）
- [ ] 社交媒体链接（在 `components/SiteFooter.tsx` 中）

### 元数据
- [ ] 更新 `app/layout.tsx` 中的 SEO 元数据
- [ ] 更新 `app/sitemap.ts` 中的 baseUrl
- [ ] 更新 `public/manifest.json` 中的应用信息

## 设计风格说明

本项目参考了潮汐 (Tide.fm) 的设计风格特点：
- **极简主义**: 大留白、清晰的信息层次
- **自然色调**: 以绿色系品牌色为主，体现网球的自然活力
- **优雅动效**: 使用 Framer Motion 实现平滑渐入动画
- **卡片式布局**: 信息分组清晰，视觉层次分明
- **移动优先**: 响应式设计，优先考虑移动端体验

## 许可证

Copyright © 2024 网球拍档 Tennis Mate. All rights reserved.

