# LeanCloud 部署问题修复指南

## 当前问题

从日志看到：
```
[system] 运行环境：static
```

这说明 LeanCloud **仍然识别为静态站点模式**，而不是 SSR 模式。

---

## 解决方案：切换到云引擎分组

### 步骤 1：在 LeanCloud 控制台切换分组

1. 登录 LeanCloud 控制台
2. 进入你的应用
3. **关键步骤：切换到"云引擎"分组**
   - 如果当前是"静态站点"分组，需要**切换到"云引擎"分组**
   - 点击左侧菜单的"云引擎"（不是"静态站点"）
   - 或者在应用设置中更改分组类型

### 步骤 2：确认使用场景

在"云引擎"分组中：
- 选择使用场景：**"web 后端"**（不是"静态站点"）
- 这会确保使用 SSR 模式

### 步骤 3：检查并配置

确保以下配置正确：

#### 构建命令
```
npm ci && npm run build
```

#### 启动命令
```
npm run start
```

#### 环境变量
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`

#### Node.js 版本
- 确保选择 Node.js 20
- 或 LeanCloud 会从 `package.json` 的 `engines.node` 读取

---

## 验证配置

切换后重新部署，日志应该显示：
```
[system] 运行环境：nodejs  (不是 static)
```

并且启动日志应该显示：
```
- Network:      http://0.0.0.0:$LEANCLOUD_APP_PORT
```
（而不是固定的 3000 端口）

---

## 为什么会出现这个问题？

LeanCloud 有两种分组类型：
1. **静态站点分组** - 用于纯静态文件，运行环境显示为 `static`
2. **云引擎分组** - 用于 Node.js 应用，运行环境显示为 `nodejs`

即使代码配置正确，如果**分组类型**选择错误，LeanCloud 仍然会按静态站点模式处理。

---

## 完整检查清单

- [ ] 确认使用"云引擎"分组（不是"静态站点"）
- [ ] 确认使用场景选择"web 后端"
- [ ] 构建命令：`npm ci && npm run build`
- [ ] 启动命令：`npm run start`
- [ ] Node.js 版本：20
- [ ] 环境变量已配置
- [ ] 重新部署后验证日志显示 `nodejs` 而不是 `static`

---

**最关键的是：必须在 LeanCloud 控制台切换到"云引擎"分组！**

