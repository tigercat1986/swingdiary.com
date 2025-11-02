# LeanCloud 静态站点配置说明

## 关于输出目录

**LeanCloud 静态站点会自动检测常见的输出目录：**
- `out` (Next.js 15 默认)
- `dist`
- `build`
- `public`

**无需手动配置输出目录！**

---

## LeanCloud 静态站点配置步骤

### 1. 确认使用"静态站点"分组

在 LeanCloud 控制台中：
- 选择您的应用
- 进入 **"静态站点"** 分组（不是"云引擎"）

### 2. 配置构建命令

在"构建设置"或"部署设置"中：

**构建命令：**
```bash
npm ci && npm run build
```

**不需要设置输出目录**，LeanCloud 会自动检测 `out` 目录。

### 3. 验证构建产物

部署前，可以在本地验证：

```bash
# 本地构建
npm run build

# 检查输出目录
ls -la out/

# 应该看到：
# - out/index.html
# - out/.well-known/apple-app-site-association
# - out/_next/
# - 其他静态文件
```

### 4. 部署

提交代码并推送到 LeanCloud 后，系统会：
1. 执行构建命令
2. 自动检测 `out` 目录
3. 部署静态文件

---

## 如果仍然报错 "Application not Found"

### 检查清单：

1. **确认构建成功**
   - 查看构建日志，确认 `npm run build` 成功
   - 确认生成了 `out` 目录

2. **确认目录结构**
   构建后应该存在：
   ```
   out/
   ├── index.html
   ├── .well-known/
   │   └── apple-app-site-association
   ├── _next/
   └── 其他文件
   ```

3. **检查构建日志**
   在 LeanCloud 控制台查看构建日志，确认：
   - ✅ 构建成功完成
   - ✅ `out` 目录存在
   - ✅ 有文件被生成

4. **手动指定根目录（如果 LeanCloud 支持）**
   某些 LeanCloud 版本可能支持手动指定：
   - 查看是否有"网站根目录"或"发布目录"选项
   - 填写：`out`

---

## 替代方案：切换到云引擎（推荐）

如果静态站点仍然有问题，**强烈建议切换到云引擎分组**：

### 优势：
- ✅ 无需担心输出目录问题
- ✅ 支持 Universal Links 的 Content-Type 头
- ✅ 支持完整的 Next.js 功能
- ✅ 配置更简单

### 切换步骤：

1. **移除静态导出配置**
   
   编辑 `next.config.mjs`，移除：
   ```javascript
   // output: 'export',  // 删除这行
   ```

2. **恢复图片优化（可选）**
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '**',
       },
     ],
   },
   ```

3. **恢复 headers 配置**
   ```javascript
   async headers() {
     return [
       {
         source: '/.well-known/apple-app-site-association',
         headers: [
           {
             key: 'Content-Type',
             value: 'application/json',
           },
         ],
       },
     ];
   },
   ```

4. **在 LeanCloud 中切换到"云引擎"分组**

5. **配置部署：**
   - **构建命令：** `npm ci && npm run build`
   - **启动命令：** `npm run start`

---

## 验证部署

无论使用哪种方式，部署后都应该验证：

1. **网站可访问：**
   ```
   https://swingdiary.com
   ```

2. **Universal Links 文件：**
   ```bash
   curl -I https://swingdiary.com/.well-known/apple-app-site-association
   ```
   
   应该返回：
   ```
   Content-Type: application/json
   ```

---

**建议：** 直接使用云引擎分组，避免静态导出的各种限制和配置问题。

