# AI Caption Generator

一个基于 AI 的社交媒体文案生成与排版工具，专为 Telegram、Instagram 和 X (Twitter) 优化。

## 功能特性

- 🤖 **AI 文案生成** - 使用 GPT-4o-mini 生成高质量的社交媒体文案
- 📱 **多平台支持** - 支持 Telegram、Instagram、X (Twitter) 三大平台
- 🎨 **风格定制** - 支持多种情绪/风格标签（搞笑、可爱、酷、浪漫等）
- 📂 **场景分类** - 按场景分类（自拍、旅行、美食、情侣、健身等）
- #️⃣ **Hashtag 推荐** - 自动推荐相关的热门标签
- 📋 **一键复制** - 复制时自动格式化，适配各平台粘贴
- 🔍 **SEO 优化** - 针对搜索引擎优化的专题落地页
- 🌐 **多语言** - 支持英语、中文等多种语言

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS v4
- **UI 组件**: Shadcn/UI + HeroUI
- **状态管理**: Zustand
- **数据库**: SQLite + Drizzle ORM
- **AI**: Vercel AI SDK + OpenAI GPT-4o-mini
- **语言**: TypeScript

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入必要的配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，设置 OpenAI API Key：

```env
OPENAI_API_KEY=sk-your-openai-api-key
```

### 初始化数据库

```bash
npm run db:push
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── captions-for-instagram/  # Instagram 专题页
│   ├── tg-captions/       # Telegram 专题页
│   ├── x-captions/        # X 专题页
│   └── generator/         # AI 生成器页面
├── components/            # React 组件
│   ├── caption/          # 文案相关组件
│   ├── generator/        # 生成器组件
│   ├── layout/           # 布局组件
│   ├── providers/        # Context Providers
│   ├── search/           # 搜索组件
│   └── ui/               # 基础 UI 组件
├── config/               # 配置常量
├── db/                   # 数据库配置和 Schema
├── lib/                  # 工具函数
├── services/             # 业务服务
├── store/                # Zustand 状态管理
└── types/                # TypeScript 类型定义
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run db:push` - 推送数据库 Schema
- `npm run db:studio` - 打开 Drizzle Studio

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（OPENAI_API_KEY 等）
4. 点击部署

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
