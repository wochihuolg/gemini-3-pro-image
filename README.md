# Gemini-3-Pro-Image 生图桌面工具

> 基于 [APIMart API](https://api.apimart.ai) 的 AI 图片生成桌面应用。
> 输入提示词，可选参考图，一键生成高清图片。

---

## 功能特性

| 功能 | 说明 |
|------|------|
| **自定义提示词** | 输入任意文字描述，AI 根据描述生成图片 |
| **参考图上传** | 支持本地图片上传（自动转 base64）或图片 URL 输入 |
| **图片比例** | 支持 1:1 / 16:9 / 9:16 / 4:3 / 3:4 / 3:2 / 2:3 / auto |
| **分辨率** | 1K（基础）/ 2K（推荐）/ 4K（高清） |
| **下载图片** | 直接下载到默认位置 |
| **另存为...** | 调用系统原生保存对话框，自由选择保存位置与文件名 |
| **重新生成** | 基于同一参数再次生成，快速迭代 |
| **费用/耗时** | 每次生成后显示费用与耗时 |
| **API Key 安全** | Key 仅存于会话内存中，关闭页面自动清除，绝不落盘 |

---

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 8

### 安装与运行

\\\ash
# 1. 克隆仓库
git clone https://github.com/wochihuolg/gemini-3-pro-image.git
cd gemini-3-pro-image

# 2. 安装依赖
npm install

# 3. 启动应用
npm start
\\\

> **注意**: 首次启动时会安装 Electron 运行时（~150MB），请保持网络畅通。

### 获取 API Key

1. 访问 [APIMart](https://api.apimart.ai) 注册账号
2. 在控制台创建 API Key
3. 启动应用后，点击 **生成图片**，按提示输入 Key
4. Key 仅在当前会话有效，关闭应用后自动清除

---

## 使用指南

### 基本流程

1. 在 **提示词** 输入框中描述你想要生成的图片
2. （可选）上传参考图或粘贴图片 URL
3. 选择 **图片比例** 与 **分辨率**
4. 点击 **生成图片**
5. 等待生成完成（30秒~2分钟）
6. 查看结果 → **下载** 或 **另存为** 到指定位置

### 提示词技巧

- 描述越详细，生成效果越好
- 建议包含：主体、场景、风格、色调、构图等要素
- 示例：*"一只橘猫在阳光下打盹，水彩风格，温暖色调，柔焦效果"*
- 可参考图时，描述应与参考图风格一致

### 参考图说明

- 本地图片上传后自动转为 base64 内嵌，不上传第三方服务器
- 图片 URL 需可公开访问（支持 https://）
- 参考图会作为生成时的风格/构图参考

---

## 项目结构

\\\
gemini-3-pro-image/
├── src/                     # 前端源码
│   ├── index.html           # 主界面（UI + 交互逻辑）
│   └── assets/
│       └── icon.png         # 应用图标
├── main.js                  # Electron 主进程
├── preload.js               # IPC 桥接层
├── package.json             # 项目配置 & Electron Builder 配置
├── CHANGELOG.md             # 更新日志
└── README.md                # 本文件
\\\

---

## 构建安装包

> 构建后会生成可执行文件，无需安装 Node.js 即可运行。

\\\ash
# 便携版（单个 exe 文件，即开即用）
npm run build

# 安装包版（NSIS 安装程序）
npm run build:installer

# 同时构建两个版本
npm run build:all
\\\

构建产物位于 \elease/\ 目录。

---

## 技术栈

- **桌面框架**: Electron 33
- **UI**: 原生 HTML5 + CSS3 + JavaScript (Vanilla)
- **API**: APIMart API (Gemini-3-Pro-Image-preview 模型)
- **打包**: Electron Builder 25 (Portable + NSIS)

---

## 常见问题

### Q: 生成失败，提示 401
A: API Key 无效或已过期，请检查 APIMart 控制台中的 Key 状态。

### Q: 生成很慢
A: 图片生成通常需要 30秒~2分钟，取决于分辨率和服务器负载。如超过 6 分钟会自动超时。

### Q: 生成的图片可以商用吗？
A: 取决于 APIMart 平台的使用条款，请查阅其服务协议。

### Q: 如何更新应用？
A: 拉取最新代码后重新构建即可：\git pull && npm run build\

---

## License

MIT
