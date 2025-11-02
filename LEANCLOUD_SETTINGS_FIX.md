# LeanCloud 设置优化指南

## 当前配置检查

从你提供的控制台截图看到：

### ✅ 已正确配置：
- **应用场景**：web 后端 ✅
- **构建命令**：`npm ci && npm run build` ✅
- **环境变量**：`NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1` ✅

### ⚠️ 需要优化的：

**运行命令**当前是：
```
npx next start -p $LEANCLOUD_APP_PORT -H 0.0.0.0
```

建议改为：
```
npm run start
```

这样会使用 `package.json` 中定义的 start 脚本，更标准。

---

## 关于 `运行环境：static` 的问题

如果控制台中没有"运行环境"或"Runtime"设置选项，但日志仍显示 `static`，可能是：

### 可能的原因：

1. **LeanCloud 根据某些检测逻辑自动判断**
   - 可能检测到项目中没有特定文件
   - 可能需要特定的文件或目录结构

2. **分组类型仍然不对**
   - 虽然应用场景是 "web 后端"
   - 但可能分组本身仍然是"静态站点"类型

### 解决方案：

#### 方案 1：优化运行命令

在 LeanCloud 控制台的"运行命令"中，改为：
```
npm run start
```

（而不是 `npx next start ...`）

#### 方案 2：检查是否有 server.js 或入口文件

某些 LeanCloud 配置可能需要明确的入口文件。但 Next.js 应该不需要。

#### 方案 3：联系 LeanCloud 支持

如果以上都不行，可能需要：
- 确认分组类型是否真的是"云引擎"分组
- 或者询问 LeanCloud 技术支持为什么仍然显示 `static`

---

## 立即操作

### 1. 修改运行命令

在 LeanCloud 控制台 → 设置 → 运行命令：

**改为：**
```
npm run start
```

点击"设置"保存。

### 2. 确保 leanengine.yaml 已提交

确保 `leanengine.yaml` 文件已提交到代码仓库。

### 3. 重新部署

修改运行命令后，重新部署一次。

---

## 验证

部署后检查日志，应该看到：

**如果成功：**
```
[system] 运行环境：nodejs
[instance] - Network:      http://0.0.0.0:$LEANCLOUD_APP_PORT
```

**如果仍然显示 static：**
可能需要联系 LeanCloud 技术支持，因为控制台配置看起来都是正确的。

