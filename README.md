# 🎯 我的待办清单

一个清新简洁的待办事项管理应用，使用 Next.js + Tailwind CSS 构建。

## ✨ 功能特性

- ✅ 添加、编辑、删除任务
- 🏷️ 任务优先级设置（高/中/低）
- ✅ 完成任务标记（带删除线效果）
- 🗑️ 清空已完成/全部清空
- 💾 本地存储，持久化保存
- 📱 响应式设计，支持手机和桌面
- 🎨 清新的渐变配色和流畅动画

## 🛠️ 技术栈

- **框架**: Next.js 16
- **样式**: Tailwind CSS 4
- **图标**: Lucide React
- **类型**: TypeScript

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建部署

```bash
pnpm build
```

## 📦 部署

项目已配置 GitHub Actions，可自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 访问 `https://<username>.github.io/<repository-name>/`

## 📁 项目结构

```
├── app/
│   ├── globals.css      # 全局样式
│   ├── layout.tsx      # 应用布局
│   └── page.tsx        # 主页面
├── .github/
│   └── workflows/      # GitHub Actions
├── public/             # 静态资源
├── package.json
└── README.md
```

## 🎨 界面预览

- 渐变背景：浅蓝 → 浅紫
- 毛玻璃效果卡片
- 圆角设计 + 柔和阴影
- 优先级颜色标识（红/黄/绿）
