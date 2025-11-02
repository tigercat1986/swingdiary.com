# LeanCloud 云引擎问题排查

## 问题：运行环境仍显示 `static`

即使创建了新的 web 后端分组，如果仍然显示 `运行环境：static`，需要检查以下配置。

---

## 解决方案 1：创建 leanengine.json 配置文件

已创建 `leanengine.json` 文件，明确指定：
- `runtime: "nodejs"` - 指定为 Node.js 运行时
- `runtimeVersion: "20.x"` - 指定 Node.js 20
- `buildCommand` - 构建命令
- `startCommand` - 启动命令

**文件位置：** `leanengine.json`

---

## 解决方案 2：在 LeanCloud 控制台检查配置

### 1. 确认分组类型

在新创建的分组中，检查：
- 分组类型是否显示为"云引擎"或"Node.js"
- 不是"静态站点"

### 2. 检查运行环境设置

在云引擎分组 → 设置中，查看：
- **运行环境** 应该显示：`Node.js` 或 `nodejs`
- **版本** 应该选择：`20.x` 或 `20`

### 3. 确认构建和启动命令

**构建命令：**
```
npm ci && npm run build
```

**启动命令：**
```
npm run start
```

或者直接：
```
next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0
```

---

## 解决方案 3：检查 package.json

确保 `package.json` 包含：

```json
{
  "engines": {
    "node": ">=20 <21"
  },
  "scripts": {
    "start": "next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0"
  }
}
```

---

## 验证步骤

### 1. 提交代码

确保 `leanengine.json` 已提交到代码仓库。

### 2. 重新部署

在 LeanCloud 控制台触发新的部署。

### 3. 检查日志

部署后，日志应该显示：

**正确：**
```
[system] 运行环境：nodejs
[system] [Node.js] 使用 Node.js v20.x.x
[instance] - Network:      http://0.0.0.0:$LEANCLOUD_APP_PORT
```

**错误（仍然显示）：**
```
[system] 运行环境：static
```

---

## 如果仍然显示 `static`

### 检查清单：

- [ ] `leanengine.json` 文件已创建并提交
- [ ] LeanCloud 控制台中分组类型是"云引擎"（不是"静态站点"）
- [ ] 运行环境设置选择为 `Node.js 20`
- [ ] 构建命令：`npm ci && npm run build`
- [ ] 启动命令：`npm run start`
- [ ] `package.json` 包含 `engines.node` 配置
- [ ] 已重新部署最新代码

### 联系支持

如果以上都正确但仍然显示 `static`，可能需要：
- 联系 LeanCloud 技术支持
- 或检查是否有其他全局设置影响

---

## leanengine.json 配置说明

```json
{
  "version": "2.0",
  "runtime": "nodejs",          // 必须：指定为 Node.js
  "runtimeVersion": "20.x",     // Node.js 版本
  "buildCommand": "npm ci && npm run build",
  "startCommand": "npm run start"
}
```

这个文件会明确告诉 LeanCloud 这是一个 Node.js 应用。

---

**下一步：** 提交 `leanengine.json` 文件，然后重新部署。

