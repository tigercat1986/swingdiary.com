# Universal Links 配置指南

本文档说明如何配置 Universal Links，让 `swingdiary.com` 的链接能够在 iOS 应用中打开。

## 已配置的文件

### 1. Apple App Site Association 文件

文件位置：`public/.well-known/apple-app-site-association`

⚠️ **重要：需要填写你的 Team ID**

当前配置：
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.swingdiary.app",
        "paths": [
          "*"
        ]
      }
    ]
  }
}
```

### 2. Next.js 配置

`next.config.mjs` 已配置正确的 Content-Type 头：
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
}
```

## 配置步骤

### 第一步：获取 Team ID

1. 登录 [Apple Developer](https://developer.apple.com/account)
2. 进入 **Membership** 页面
3. 找到 **Team ID**（格式类似：`ABC123DEF4`）

或者：

1. 在 Xcode 中打开项目
2. 选择项目 Target → **Signing & Capabilities**
3. 查看 **Team** 信息，找到 Team ID

### 第二步：更新配置文件

编辑 `public/.well-known/apple-app-site-association`，将 `TEAM_ID` 替换为你的实际 Team ID：

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "你的TeamID.com.swingdiary.app",
        "paths": [
          "*"
        ]
      }
    ]
  }
}
```

**路径配置说明：**
- `"paths": ["*"]` - 所有路径都可在应用中打开
- `"paths": ["/match/*", "/profile/*"]` - 只有特定路径在应用中打开
- `"paths": ["*", "NOT /web-only/*"]` - 所有路径除了 /web-only/*

### 第三步：部署到服务器

1. 提交代码并推送到仓库
2. 部署到 LeanCloud 云引擎
3. 确保 HTTPS 证书已正确配置

### 第四步：验证文件可访问

部署后，在浏览器中访问：
```
https://swingdiary.com/.well-known/apple-app-site-association
```

应该能看到 JSON 内容，且：
- ✅ Content-Type 为 `application/json`
- ✅ 文件无扩展名
- ✅ 可以直接访问（无重定向）
- ✅ HTTPS 访问

**验证命令：**
```bash
curl -v https://swingdiary.com/.well-known/apple-app-site-association
```

检查响应头中是否包含：
```
Content-Type: application/json
```

### 第五步：iOS 应用配置

在 Xcode 中配置 Associated Domains：

1. 打开 iOS 项目
2. 选择 Target → **Signing & Capabilities**
3. 点击 **+ Capability** → 选择 **Associated Domains**
4. 添加域名：`applinks:swingdiary.com`
   - ⚠️ 注意：必须以 `applinks:` 开头
   - ⚠️ 不要加 `https://` 或尾随斜杠

### 第六步：iOS 代码配置

在 `AppDelegate.swift` 或 `SceneDelegate.swift` 中添加处理逻辑：

**SwiftUI App (推荐):**
```swift
import SwiftUI

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    // 处理 Universal Link
                    handleUniversalLink(url)
                }
        }
    }
    
    func handleUniversalLink(_ url: URL) {
        // 解析 URL 并导航到对应页面
        print("Universal Link opened: \(url)")
    }
}
```

**UIKit App:**
```swift
func application(_ application: UIApplication, 
                continue userActivity: NSUserActivity, 
                restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
        return false
    }
    
    // 处理 Universal Link
    handleUniversalLink(url)
    return true
}

func handleUniversalLink(_ url: URL) {
    // 解析 URL 并导航到对应页面
    print("Universal Link opened: \(url)")
}
```

## 测试 Universal Links

### 方法 1：使用 Apple 验证工具

访问 [Apple App Site Association Validator](https://search.developer.apple.com/appsearch-validation-tool/)

输入：`https://swingdiary.com`

### 方法 2：在 iOS 设备上测试

1. 在 Safari 中打开：`https://swingdiary.com/`
2. 长按链接，应该看到 "在 Swing Diary 中打开" 选项
3. 或者直接在 Notes（备忘录）中粘贴链接，点击应该直接打开应用

### 方法 3：使用命令行验证

```bash
# 检查文件是否存在
curl -I https://swingdiary.com/.well-known/apple-app-site-association

# 查看文件内容
curl https://swingdiary.com/.well-known/apple-app-site-association
```

## 常见问题

### Q1: 文件返回 404

**原因：** Next.js 静态文件路由配置问题

**解决：**
1. 确保文件在 `public/.well-known/` 目录下
2. 确保文件名没有扩展名（不是 `.json`）
3. 重新构建并部署

### Q2: Content-Type 不正确

**原因：** 服务器没有设置正确的 MIME 类型

**解决：** `next.config.mjs` 中的 headers 配置已处理，确保已部署最新版本

### Q3: Universal Links 不工作

**检查清单：**
- [ ] 文件可访问（返回 200）
- [ ] Content-Type 为 `application/json`
- [ ] 使用 HTTPS
- [ ] iOS 应用中配置了 Associated Domains
- [ ] Team ID 正确
- [ ] Bundle ID 正确
- [ ] 应用已签名（开发或生产证书）

### Q4: 只想要特定路径打开应用

修改 `paths` 数组：
```json
{
  "paths": [
    "/match/*",
    "/profile/*",
    "/share/*",
    "NOT /web/*"
  ]
}
```

## 进阶配置

### 支持 App Store 未安装场景

添加 `appclips` 配置（iOS 14+）：
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.swingdiary.app",
        "paths": ["*"]
      }
    ]
  },
  "appclips": {
    "apps": ["TEAM_ID.com.swingdiary.app.Clip"]
  }
}
```

### 支持 App Clips

如果开发了 App Clip，需要额外配置 App Clip 的 Bundle ID。

## 参考资源

- [Apple Universal Links 文档](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [Apple App Site Association 规范](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
- [Next.js 静态文件服务](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)

---

**最后更新：** 2025-11-02  
**域名：** swingdiary.com  
**Bundle ID：** com.swingdiary.app  
**App Store ID：** 6753740438

