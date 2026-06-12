# MBTI 性格测试小程序

基于微信小程序原生框架 + TypeScript 开发的 MBTI 16 型人格测试应用。Apple Design 浅色风格，毛玻璃质感，支持快速/完整双模式测试、结果可视化、Canvas 分享卡片、类型百科浏览和匹配度分析。

## 功能

| 模块 | 说明 |
|------|------|
| 🏠 **首页** | 品牌展示 + 版本选择（速测 28 题 / 完整 60 题） + 续测入口 + 上次结果回看 |
| 📝 **答题** | 逐题呈现，毛玻璃选中动画，进度条，支持回退修改答案，退出自动保存进度 |
| 📊 **结果** | 类型展示 + 四维倾向图 + 性格画像 + 优势盲区 + 职业方向 + 兼容类型 |
| 🎴 **分享卡片** | Canvas 2D 绘制精美分享图（含特质标签），一键保存到相册 |
| 📋 **我的记录** | 本地历史记录 + 测试次数/主导类型汇总 + 一键清空 |
| 📖 **16 型百科** | 浏览全部 16 种人格类型，查看完整详情 |
| 🔗 **匹配度** | 任意两种类型的匹配度分析（总览 / 沟通 / 工作 / 情感），支持一键交换 |

底部 **自定义 TabBar**（测试 / 百科 / 匹配 / 我的）统一导航，毛玻璃质感、适配全面屏安全区。

## 技术栈

- **框架**: 微信小程序原生
- **语言**: TypeScript
- **样式**: WXSS + CSS 变量（Apple Design Language）
- **绘图**: Canvas 2D
- **存储**: 微信本地 Storage
- **状态管理**: 无依赖，Page data 自行管理

## 项目结构

```
miniprogram/
├── app.json / app.ts / app.wxss    # 应用入口、全局样式、TabBar 配置
├── custom-tab-bar/                  # 自定义底部 TabBar 组件
├── components/
│   └── nav-bar/                     # 二级页顶部导航条（返回 / 首页）
├── data/
│   ├── questions.ts                 # 60 道题目（速测28 + 完整32）
│   └── types.ts                     # 16 型人格数据
├── utils/
│   ├── scorer.ts                    # 四维计分引擎
│   └── matcher.ts                   # 匹配度引擎
├── pages/
│   ├── index/                       # 首页（测试 Tab）
│   ├── quiz/                        # 答题页
│   ├── result/                      # 结果页
│   ├── history/                     # 我的记录（Tab）
│   ├── types/                       # 16 型百科列表（Tab）
│   ├── type-detail/                 # 单类型详情
│   ├── share-card/                  # Canvas 分享卡片
│   └── match/                       # 匹配度分析（Tab）
├── global.d.ts
└── sitemap.json
project.config.json
tsconfig.json
```

## 微信开发者工具配置

### 1. 下载工具

前往 [微信开发者工具下载页](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 下载并安装最新稳定版。

### 2. 导入项目

1. 克隆仓库：
   ```bash
   git clone https://github.com/Heisenberg1159/MBTI-wechat.git
   ```

2. 打开微信开发者工具，点击「导入项目」或「+」号

3. 填写项目信息：

   | 字段 | 内容 |
   |------|------|
   | 项目名称 | MBTI 测试（或自定义） |
   | 目录 | 选择克隆后的项目根目录 |
   | AppID | 使用自己的小程序 AppID，或点击「测试号」使用临时 ID |
   | 开发模式 | 小程序 |
   | 后端服务 | 不使用云服务 |

4. 点击「确定」导入

### 3. 修改 AppID

打开项目根目录 `project.config.json`，将 `appid` 字段修改为你自己的小程序 AppID：

```json
{
  "appid": "你的AppID",
  "projectname": "mbti-test"
}
```

> 如果使用测试号，微信开发者工具会自动分配一个临时 AppID。

### 4. 配置基础库版本

项目配置了 TypeScript 编译插件，需要基础库 ≥ 3.3.4：

在微信开发者工具右上角「详情」→「本地设置」中：
- **调试基础库**: 选择 `3.3.4` 或更高版本
- **将 JS 编译成 ES5**: 勾选
- **不校验合法域名…**: 开发阶段建议勾选

### 5. 启动编译

点击工具栏「编译」按钮，即可在模拟器中预览。手机扫码可进行真机调试。

## 开发命令

```bash
# 克隆仓库
git clone https://github.com/Heisenberg1159/MBTI-wechat.git
cd MBTI-wechat

# 项目使用微信开发者工具进行编译和预览
# 无需 npm install，无需额外构建步骤
```

## 设计规范

遵循 Apple Design Language：

- **底色**: `#F5F5F7`（浅灰）/ `#FFFFFF`（纯白）
- **卡片**: 毛玻璃 `backdrop-filter: blur(40px) saturate(180%)`
- **主色**: 系统蓝 `#007AFF`
- **辅色**: 柔和紫 `#AF52DE` / 绿 `#34C759` / 橙 `#FF9500`
- **圆角**: 14-28rpx
- **字体**: `-apple-system` 系统默认

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

本项目仅限学习、研究和非商业用途使用。

**重要声明**：
- MBTI 测试仅供趣味参考，不构成心理学诊断或专业建议。测试结果不应被用于任何人事决策、临床诊断或其他严肃场合。
- 项目中的人格描述、题目内容为原创编写或基于公开资料整理，如有雷同纯属巧合。
- 请勿将本项目用于任何违法违规目的。
- 商业使用需获得作者授权。

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
