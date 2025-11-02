# LeanCloud 部署配置指南

## 两种部署模式

### 方案 1：云引擎分组（推荐，SSR 模式）

**优势：**
- ✅ 支持 Next.js 完整功能
- ✅ 支持动态 headers 配置
- ✅ Universal Links Content-Type 自动正确
- ✅ 支持服务端功能

**LeanCloud 配置：**
1. 使用**云引擎**分组（不是静态站点）
2. **构建命令：** `npm ci && npm run build`
3. **启动命令：** `npm run start`

**配置文件：**
- `next.config.mjs` 需要移除 `output: 'export'`
- 使用 SSR 模式（默认）

---

### 方案 2：静态站点分组（当前配置）

**当前已配置为静态导出模式**

**配置文件已更新：**
- ✅ `next.config.mjs` 已添加 `output: 'export'`
- ✅ 图片优化已禁用（静态导出要求）
- ✅ `package.json` 的 `export` 脚本已更新

**LeanCloud 配置：**
1. 使用**静态站点**分组
2. **构建命令：** `npm ci && npm run build`
3. **输出目录：** `out`（Next.js 15 静态导出默认目录）

**注意事项：**
- ⚠️ 静态导出时 `headers()` 配置不会生效
- ✅ `.well-known` 文件已在 `public` 目录，会被复制到 `out/.well-known/`
- ⚠️ 需要 LeanCloud 静态站点正确配置 MIME 类型

---

## 验证部署

### 静态导出模式验证

构建后检查：
```bash
npm run build
ls -la out/
```

应该看到：
- `out/index.html`
- `out/.well-known/apple-app-site-association`
- 其他静态文件

### Universal Links 验证

部署后访问：
```
https://swingdiary.com/.well-known/apple-app-site-association
```

检查响应头：
```bash
curl -I https://swingdiary.com/.well-known/apple-app-site-association
```

应该包含：
```
Content-Type: application/json
```

如果 Content-Type 不正确，需要在 LeanCloud 静态站点配置中手动设置。

---

## 切换模式

### 从静态导出切换到 SSR（云引擎）

1. 编辑 `next.config.mjs`，移除或注释：
   ```javascript
   // output: 'export',  // 移除这行
   ```

2. 恢复图片优化（可选）：
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     remotePatterns: [...],
   },
   ```

3. 恢复 headers 配置：
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

4. 在 LeanCloud 切换到**云引擎**分组

---

## 常见问题

### Q1: 静态导出后找不到文件

**原因：** 构建命令错误或输出目录不匹配

**解决：**
- 确保构建命令：`npm ci && npm run build`
- 确保输出目录配置为：`out`
- 检查 `out` 目录是否存在

### Q2: Universal Links Content-Type 错误

**原因：** 静态站点未正确配置 MIME 类型

**解决：**
1. 检查 `public/.well-known/apple-app-site-association` 文件是否存在
2. 在 LeanCloud 静态站点配置中添加 MIME 类型映射：
   - 文件扩展名：无（或 `.well-known`）
   - MIME 类型：`application/json`
3. 或切换到云引擎模式（推荐）

### Q3: 图片不显示

**原因：** 静态导出禁用了图片优化

**解决：**
- 已在配置中设置 `images: { unoptimized: true }`
- 确保图片路径正确（使用相对路径或绝对路径）

---

## 推荐方案

**建议使用方案 1（云引擎 SSR 模式）**，因为：
- ✅ Universal Links 配置更可靠
- ✅ 支持更多 Next.js 功能
- ✅ 无需担心静态文件 MIME 类型问题
- ✅ 便于后续扩展（API Routes、动态内容等）

---

**最后更新：** 2025-11-02

