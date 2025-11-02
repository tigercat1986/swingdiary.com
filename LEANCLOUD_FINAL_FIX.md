# LeanCloud 运行环境 static 问题最终解决方案

## 问题诊断

即使创建了新的 web 后端分组，仍然显示：
- `运行环境：static`
- `未在 package.json 中指定 engines.node`

这说明 LeanCloud **没有正确识别为 Node.js 应用**。

---

## 关键解决方案

### 方案 1：在 LeanCloud 控制台手动设置（最重要）

LeanCloud 可能需要在控制台**手动指定运行环境**，而不只是通过配置文件：

1. **进入云引擎分组**
2. **找到"设置"或"环境配置"**
3. **手动选择运行环境：**
   - 选择：**Node.js**（不是"静态站点"）
   - 版本：**20.x** 或 **20**

4. **设置构建和启动命令：**
   - 构建命令：`npm ci && npm run build`
   - 启动命令：`npm run start`

### 方案 2：确保 package.json 格式正确

LeanCloud 可能对 `engines` 的格式有特定要求。当前配置是：
```json
{
  "engines": {
    "node": ">=20 <21"
  }
}
```

如果仍然无法识别，尝试改为更明确的格式：
```json
{
  "engines": {
    "node": "20.x"
  }
}
```

### 方案 3：使用 leanengine.yaml

已创建 `leanengine.yaml` 文件：
```yaml
functionsMode: strict
```

这个文件告诉 LeanCloud 使用严格模式（云引擎模式）。

---

## 完整操作步骤

### 1. 提交代码
提交以下文件到仓库：
- `leanengine.yaml` ✅
- `package.json`（已包含 engines.node）

### 2. 在 LeanCloud 控制台检查

**在新建的 web 后端分组中，找到以下设置：**

#### A. 运行环境设置
- 位置：云引擎 → 设置 → 运行环境
- **必须手动选择：Node.js**
- **版本：20 或 20.x**

#### B. 构建和启动命令
- 构建命令：`npm ci && npm run build`
- 启动命令：`npm run start`

#### C. 检查应用场景
- 确认显示："web 后端"
- 不是："静态站点"

### 3. 如果找不到运行环境设置

可能需要在以下位置查找：
- **云引擎** → **分组设置**
- **云引擎** → **环境变量**（可能和运行环境在一起）
- **应用设置** → **运行环境**

### 4. 重新部署

完成以上设置后，重新部署。

---

## 验证成功标志

部署后日志应该显示：

**✅ 正确：**
```
[system] 运行环境：nodejs
[system] [Node.js] 使用 Node.js v20.x.x
[instance] - Network:      http://0.0.0.0:$LEANCLOUD_APP_PORT
```

**❌ 仍然错误：**
```
[system] 运行环境：static
[system] [Node.js] 未在 package.json 中指定 engines.node
```

---

## 如果控制台没有"运行环境"选项

如果 LeanCloud 控制台中没有明显的"运行环境"设置选项：

### 可能的原因：
1. LeanCloud 可能根据检测到的文件自动判断
2. 可能需要联系 LeanCloud 技术支持
3. 可能需要使用 LeanCloud CLI 工具手动配置

### 备选方案：

**使用 LeanCloud CLI：**
```bash
# 安装 CLI
npm install -g lean-cli

# 登录
lean login

# 部署（这会自动识别为 Node.js）
lean deploy
```

---

## 总结

**最关键的是：**
1. ✅ 在 LeanCloud 控制台**手动选择运行环境为 Node.js**
2. ✅ 提交 `leanengine.yaml` 文件
3. ✅ 确保 `package.json` 包含 `engines.node`
4. ✅ 重新部署

如果控制台中没有运行环境设置选项，请告诉我，我们可以尝试其他方法。

