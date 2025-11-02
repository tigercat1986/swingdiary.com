# 编码守则 - LeanCloud 云引擎部署规范

**目标：任何提交到 main 的代码都能在 LeanCloud 云引擎稳定构建与运行。**

---

## 📋 目录

1. [Node 与端口配置](#1-node-与端口配置)
2. [构建与脚本](#2-构建与脚本)
3. [TypeScript / ESLint 检查](#3-typescript--eslint-检查)
4. [UI 组件兼容性](#4-ui-组件兼容性)
5. [环境变量](#5-环境变量)
6. [CI 保护](#6-ci-保护)
7. [静态资源与路由](#7-静态资源与路由)
8. [依赖与锁文件](#8-依赖与锁文件)
9. [提交前自检](#9-提交前自检)
10. [Tailwind CSS 配置规范](#10-tailwind-css-配置规范)
11. [常见错误及解决方案](#11-常见错误及解决方案)

---

## 1. Node 与端口配置

### ✅ 必须遵守

#### Node.js 版本

- **统一使用 Node 20**（`>=20 <21`）
- 在 `package.json` 中添加：
```json
{
  "engines": {
    "node": ">=20 <21"
  }
}
```

- 根目录创建 `.nvmrc` 文件：
```bash
echo "20" > .nvmrc
```

#### 端口配置

⚠️ **禁止写死端口号（如 3000）**

- 所有服务启动必须监听 `$LEANCLOUD_APP_PORT` 环境变量
- Next.js SSR 启动命令**固定**为：
```bash
npx next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0
```

- 在 `package.json` 的 `scripts` 中配置：
```json
{
  "scripts": {
    "start": "next start -p ${LEANCLOUD_APP_PORT:-3000} -H 0.0.0.0"
  }
}
```

**本地开发时使用：**
```bash
npm run dev  # Next.js 默认端口 3000，仅用于本地开发
```

---

## 2. 构建与脚本

### ✅ package.json 必须包含的脚本

```json
{
  "scripts": {
    "build": "next build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint . --ext .ts,.tsx --max-warnings=0",
    "export": "next export",
    "dev": "next dev",
    "start": "next start -p ${LEANCLOUD_APP_PORT:-3000} -H 0.0.0.0",
    "test": "vitest"
  }
}
```

### 构建命令规范

#### SSR 模式（默认）
- **构建阶段：** 使用 `npm ci`（禁止使用 `npm install`）
- **构建命令：** `npm ci && npm run build`
- **运行命令：** `npx next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0`

#### 静态导出模式（如需使用）
- **构建命令：** `npm ci && npm run build && npm run export`
- **运行命令：** `npx serve -s out -l $LEANCLOUD_APP_PORT`
- ⚠️ **禁止混用 SSR 与导出模式**

### npm ci 要求

- 构建阶段**一律**使用 `npm ci`（不可使用 `npm install`）
- 必须提交 `package-lock.json` 到仓库
- `package-lock.json` 必须与 `package.json` 保持一致

---

## 3. TypeScript / ESLint 检查

### ✅ 必须通过

- 代码**必须**通过 `npm run typecheck`
- 代码**必须**通过 `npm run lint`
- **不允许**因 TS/ESLint 报错阻断部署

### 临时跳过规则（仅紧急情况）

如果必须临时跳过检查，**只能在** `next.config.mjs` 中短期设置：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // 临时时可设 true，但需要回退
  },
  eslint: {
    ignoreDuringBuilds: true,  // 构建时跳过 ESLint，CI 里跑
  },
};
```

**使用条件：**
- 必须在 PR 说明中给出原因
- 必须标注临时性，并设置回退计划
- 优先修复错误而非跳过检查

---

## 4. UI 组件兼容性

### ✅ Button 组件必须支持 asChild

`components/ui/button.tsx` **必须**支持 `asChild`（Radix Slot 模式）。

#### 推荐实现（使用 @radix-ui/react-slot）

首先安装依赖：
```bash
npm install @radix-ui/react-slot
```

然后实现：

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "primary" | "secondary";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className = "", size = "md", variant = "default", ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all";
    const variants = {
      default: "bg-brand-primary text-brand-primaryFg",
      outline: "border-2 border-brand-primary",
      ghost: "text-fg-default hover:bg-bg-subtle",
      primary: "bg-brand-primary text-brand-primaryFg",
      secondary: "bg-brand-secondary text-brand-primaryFg",
    };
    const sizes = {
      sm: "px-sm py-xs text-sm",
      md: "px-lg py-md text-base",
      lg: "px-xl py-lg text-lg",
    };
    
    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
```

#### 备选方案（不使用 Radix）

如果无法安装 `@radix-ui/react-slot`，使用 React.cloneElement：

```typescript
if (asChild && React.isValidElement(children)) {
  return React.cloneElement(children as React.ReactElement<any>, {
    className: cn(baseStyles, variants[variant], sizes[size], className, children.props?.className),
    ref,
    ...props,
  });
}
```

#### 错误处理

- 若仍出现 `<Button asChild>` 类型报错，**统一改写**为 Link 包裹 Button：
```typescript
// ❌ 错误
<Button asChild>
  <Link href="/">首页</Link>
</Button>

// ✅ 正确
<Link href="/">
  <Button>首页</Button>
</Link>
```

- **不可留 TS 红线**，所有类型错误必须在提交前修复

---

## 5. 环境变量

### LeanCloud 默认注入

- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `LEANCLOUD_APP_PORT`（动态端口）

### 环境变量规范

- ⚠️ **禁止**把敏感密钥硬编码到仓库
- 所有敏感信息必须使用环境变量
- 在代码中标注环境变量的使用位置
- 在 README 或文档中说明必需的环境变量

**示例：**
```typescript
// 在代码中使用
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
if (!apiKey) {
  throw new Error('NEXT_PUBLIC_API_KEY is required');
}
```

---

## 6. CI 保护

### ✅ GitHub Actions 配置

在 `.github/workflows/check.yml` 中配置：

```yaml
name: CI Check

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js 20
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
```

### 分支保护规则

在 GitHub 仓库设置中打开分支保护：
- ✅ **Require status checks to pass**
- ✅ **Require branches to be up to date**
- ✅ 选择 `check` job 作为必需检查
- ⚠️ **PR 通过 CI 检查后方可合并到 main**

---

## 7. 静态资源与路由

### 静态导出模式（如果使用）

- 所有动态路由**必须**通过 `getStaticPaths` 预生成
- **禁止**导出时产生 404 错误
- 根目录需有入口页（`/pages/index.tsx` 或 `/app` 目录正确配置）

### 路由配置

- 使用 Next.js App Router 时，确保 `app/page.tsx` 存在
- 使用 Pages Router 时，确保 `pages/index.tsx` 存在
- 动态路由必须配置 `generateStaticParams`（App Router）或 `getStaticPaths`（Pages Router）

---

## 8. 依赖与锁文件

### ✅ 必须遵守

- **保留** `package-lock.json`，禁止删除
- **禁止**用不同的包管理器生成锁文件（如 `yarn.lock`、`pnpm-lock.yaml`）
- 统一使用 `npm` 作为包管理器

### 依赖升级规范

- ✅ 允许升级废弃依赖（deprecated）
- ✅ 但需在 PR 中给出替换说明
- ⚠️ **不得**让升级引入新的构建红线

**废弃依赖处理：**
- 检查是否有安全漏洞：`npm audit`
- 查看替代方案
- 在 PR 中说明迁移计划
- 测试通过后再合并

---

## 9. 提交前自检

### ✅ 必须执行的检查

在提交到 main 之前，**依次运行**并确保通过：

```bash
# 1. 清理安装依赖
npm ci

# 2. TypeScript 类型检查
npm run typecheck

# 3. ESLint 检查
npm run lint

# 4. 构建测试
npm run build
```

### 静态导出模式额外检查

如果选择静态导出模式，还需执行：

```bash
# 5. 导出静态文件
npm run export

# 6. 本地验证
npx serve -s out
# 打开浏览器访问 http://localhost:3000，验证首页可打开
```

### Cursor 自动执行

- 在 Cursor 中配置自动运行检查
- 或在提交前手动运行上述命令
- **以上任一条未满足时，不要合并到 main**

---

## 10. Tailwind CSS 配置规范

### ⚠️ 重要：类型转换规则

Tailwind CSS 的某些配置项**必须**是字符串类型，即使设计 tokens 中定义的是数字。

#### `fontWeight` 配置

❌ **错误：**
```typescript
fontWeight: tokens.font.weight, // 数字类型 { regular: 400, ... }
```

✅ **正确：**
```typescript
fontWeight: Object.fromEntries(
  Object.entries(tokens.font.weight).map(([key, value]) => [key, String(value)])
) as Record<string, string>,
```

#### `lineHeight` 配置

❌ **错误：**
```typescript
lineHeight: tokens.font.leading, // 数字类型 { tight: 1.15, ... }
```

✅ **正确：**
```typescript
lineHeight: Object.fromEntries(
  Object.entries(tokens.font.leading).map(([key, value]) => [key, String(value)])
) as Record<string, string>,
```

#### `transitionDuration` 配置

✅ **正确（排除 ease）：**
```typescript
transitionDuration: {
  fast: tokens.motion.fast,
  base: tokens.motion.base,
  slow: tokens.motion.slow,
},
// 注意：ease 应该放在 transitionTimingFunction 中
transitionTimingFunction: {
  ease: tokens.motion.ease,
},
```

#### 颜色配置检查

确保所有在代码中使用的颜色类名都在 `design-tokens.json` 中定义：

- ✅ `bg-bg-subtle` → 需要 `bg.subtle` 在 tokens 中
- ✅ `border-border-default` → 需要 `border.default` 在 tokens 中
- ✅ `bg-bg-elevated` → 需要 `bg.elevated` 在 tokens 中

**Tailwind 配置映射：**
```typescript
colors: {
  bg: tokens.color.bg,        // 必须是 "bg"，不是其他名称
  border: tokens.color.border, // 必须是 "border"，不是 "borderc"
}
```

---

## 11. 常见错误及解决方案

### 错误 1: `Property 'asChild' does not exist`

**原因：** Button 组件接口未定义 `asChild` 属性

**解决：** 
1. 安装 `@radix-ui/react-slot`
2. 在 `ButtonProps` 中添加 `asChild?: boolean;`
3. 实现 Slot 模式或使用 React.cloneElement

### 错误 2: `Type 'number' is not assignable to type 'string'`

**原因：** Tailwind 配置期望字符串，但传入了数字

**解决：** 使用 `Object.fromEntries` + `String(value)` 转换：
```typescript
Object.fromEntries(
  Object.entries(tokens.font.weight).map(([key, value]) => [key, String(value)])
)
```

### 错误 3: `Cannot find module '@vitejs/plugin-react'`

**原因：** 测试配置文件被包含在构建检查中

**解决：** 在 `tsconfig.json` 中排除：
```json
{
  "exclude": ["node_modules", "vitest.config.ts", "__tests__"]
}
```

### 错误 4: 端口冲突或服务无法启动

**原因：** 写死了端口号或未使用环境变量

**解决：** 
- 启动命令使用：`npx next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0`
- 检查 `package.json` 的 `start` 脚本

### 错误 5: `npm ci` 失败

**原因：** `package-lock.json` 与 `package.json` 不同步

**解决：** 
- 删除 `node_modules` 和 `package-lock.json`
- 运行 `npm install` 重新生成锁文件
- 提交更新后的 `package-lock.json`

### 错误 6: CI 检查失败

**原因：** 本地未运行检查或代码不符合规范

**解决：** 
- 在本地运行 `npm run typecheck && npm run lint && npm run build`
- 修复所有错误后再提交 PR

---

## 📝 检查清单

在合并到 main 之前，确认以下所有项：

### 环境与配置
- [ ] `.nvmrc` 文件存在，内容为 `20`
- [ ] `package.json` 包含 `"engines": {"node": ">=20 <21"}`
- [ ] `package.json` 的 `start` 脚本使用 `$LEANCLOUD_APP_PORT`
- [ ] `package-lock.json` 已提交且与 `package.json` 同步

### 脚本与构建
- [ ] `package.json` 包含必需脚本：`build`, `typecheck`, `lint`, `export`
- [ ] 本地运行 `npm ci && npm run typecheck && npm run lint && npm run build` 全部通过
- [ ] 如果使用静态导出，`npm run export` 成功且本地验证通过

### 代码质量
- [ ] `tsconfig.json` 排除了 `vitest.config.ts` 和 `__tests__`
- [ ] `components/ui/button.tsx` 支持 `asChild` 属性
- [ ] `tailwind.config.ts` 中 `fontWeight` 和 `lineHeight` 已转换为字符串
- [ ] 所有颜色类名在 `design-tokens.json` 中都有对应定义

### CI/CD
- [ ] `.github/workflows/check.yml` 配置正确
- [ ] GitHub 分支保护规则已启用
- [ ] PR 已通过所有 CI 检查

### 环境变量
- [ ] 无硬编码的敏感密钥
- [ ] 环境变量使用已标注位置

---

## 参考资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [LeanCloud 云引擎文档](https://leancloud.cn/docs/leanengine_overview.html)
- [Node.js 版本管理](https://nodejs.org/en/about/releases/)
- [Radix UI Slot 文档](https://www.radix-ui.com/primitives/docs/utilities/slot)

---

**最后更新：** 2025-11-02  
**维护者：** 开发团队  
**目标：** 确保任何提交到 main 的代码都能在 LeanCloud 云引擎稳定构建与运行
