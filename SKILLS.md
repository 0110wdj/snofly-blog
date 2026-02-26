# Snofly Blog 项目前端架构文档

## 项目概述

这是一个基于 **Astro 4.4.15** 框架构建的现代化博客应用，包含博客文章展示、技术工具、小游戏等功能。项目采用多框架集成（React + Svelte），支持国际化、主题切换、搜索等高级功能。

## 技术栈

### 核心框架与库
- **Astro 4.4.15**: 静态站点生成器，提供极速的加载体验
- **React 18.3.1**: 用于复杂交互组件（如 2048 游戏、五子棋）
- **Svelte 4.2.12**: 用于轻量级组件
- **Tailwind CSS 3.4.1**: 原子化 CSS 框架，实现响应式设计
- **Ant Design 5.17.0**: React UI 组件库（主要用于工具页面）

### 关键插件与工具
- **@swup/astro**: 页面过渡动画库
- **astro-icon**: 图标管理工具（支持 Material Symbols、FontAwesome 6）
- **astro-compress**: 资源压缩插件
- **pagefind**: 客户端搜索库
- **markdown-it & remark/rehype plugins**: Markdown 处理（支持 KaTeX 数学公式）
- **protobufjs**: Protobuf 编解码工具
- **json-string-pack**: JSON 压缩工具

### 开发工具
- **Biome**: 代码格式化与 linting
- **TypeScript 5.4.2**: 类型安全
- **Husky**: Git hooks 管理

## 项目结构

```
/
├── src/
│   ├── components/          # Astro 组件
│   │   ├── widget/          # 侧边栏组件（Profile、Categories、Tags 等）
│   │   ├── misc/            # 通用组件（ImageWrapper、Markdown、License）
│   │   └── control/         # 控制组件（Pagination、ButtonTag 等）
│   ├── content/             # 内容集合配置
│   ├── i18n/                # 国际化文件（zh_CN、zh_TW、en、ja）
│   ├── layouts/             # 页面布局组件
│   ├── pages/               # 路由页面
│   │   ├── [...page].astro  # 博客列表分页
│   │   ├── posts/[...slug].astro  # 博客文章页面
│   │   ├── components/      # React 组件
│   │   │   ├── Game2048/    # 2048 游戏
│   │   │   ├── Gomoku/      # 五子棋游戏
│   │   │   ├── Hex.jsx      # 十六进制工具
│   │   │   ├── ProtobufJson.jsx  # Protobuf 编解码
│   │   │   └── PackJson.jsx      # JSON 压缩
│   │   ├── talk.astro       # 说说页面
│   │   ├── kits.astro       # 工具页面
│   │   └── about.astro      # 关于页面
│   ├── config/              # 配置文件
│   ├── constants/           # 常量定义
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript 类型定义
│   ├── plugins/             # Astro 插件（Remark 阅读时间计算）
│   └── assets/              # 静态资源（图片、样式）
├── public/                  # 公共资源
├── scripts/                 # 辅助脚本
├── astro.config.mjs         # Astro 配置
├── tailwind.config.cjs      # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

## 核心功能模块

### 1. 博客系统
- **文章管理**: 使用 Astro Content Collections API 管理 Markdown 文章
- **分类/标签**: 支持文章分类和标签过滤
- **搜索**: 使用 Pagefind 实现客户端全文搜索
- **归档**: 按日期、分类、标签归档文章
- **阅读时间**: 自动计算文章阅读时间

### 2. 技术工具
- **Protobuf 编解码**: 支持 Protobuf 与 JSON 互转
- **JSON 压缩**: 使用 json-string-pack 压缩 JSON 数据
- **Hex 工具**: 十六进制字符串处理
- **Java Map 工具**: Java Map 与 JSON 转换
- **Craw 工具**: 网页爬虫工具

### 3. 游戏娱乐
- **2048 游戏**: React 实现的经典数字游戏
- **五子棋**: React 实现的五子棋游戏

### 4. 特色功能
- **主题切换**: 支持自定义主题颜色（HSL 颜色空间）
- **国际化**: 支持中文（简/繁）、英文、日文
- **页面过渡**: 使用 Swup.js 实现平滑页面切换
- **响应式设计**: 完美适配桌面端、平板、移动端
- **SEO 优化**: 自动生成 sitemap、RSS  feed

## 架构特点

### 1. 多框架集成
- **Astro 组件**: 用于静态内容和布局
- **React 组件**: 用于复杂交互（游戏、工具）
- **Svelte 组件**: 用于轻量级交互组件

### 2. 性能优化
- **静态生成**: 所有页面预渲染为 HTML
- **资源压缩**: 使用 astro-compress 自动压缩图片、CSS、JS
- **懒加载**: 图片和组件按需加载
- **CDN 优化**: 支持 Vercel 部署（vercel.json 配置）

### 3. 开发体验
- **TypeScript**: 完整的类型支持
- **Biome**: 自动化代码格式化与 linting
- **Husky**: Git 提交前自动检查
- **Astro 集成**: 开发服务器支持热重载

## 关键文件说明

### 配置文件
- `src/config.ts`: 站点配置（标题、副标题、主题颜色等）
- `src/content/config.ts`: 内容集合定义
- `astro.config.mjs`: Astro 集成和插件配置
- `tailwind.config.cjs`: Tailwind 主题配置

### 工具函数
- `src/utils/content-utils.ts`: 文章排序、分类、标签统计
- `src/utils/url-utils.ts`: URL 生成工具
- `src/utils/setting-utils.ts`: 配置管理
- `src/utils/date-utils.ts`: 日期格式化

### 数据类型
- `src/types/config.ts`: 配置类型定义（SiteConfig、ProfileConfig 等）
- `src/constants/link-presets.ts`: 导航链接预设
- `src/constants/icon.ts`: 图标常量

## 开发流程

### 启动开发服务器
```bash
pnpm install
pnpm start
```

### 构建生产版本
```bash
pnpm build
# 构建后会自动运行 Pagefind 索引
```

### 新建文章
```bash
pnpm new-post
# 会在 src/content/posts/ 目录下生成新的 Markdown 文件
```

### 代码格式化
```bash
pnpm format
# 使用 Biome 格式化代码
```

### 代码检查
```bash
pnpm lint
# 使用 Biome 检查代码
```

## 部署

项目支持 Vercel 自动部署，配置文件 `vercel.json` 已包含构建命令。

## 主题配置

### 修改主题颜色
在 `src/config.ts` 中修改：
```typescript
export const siteConfig: SiteConfig = {
  themeColor: {
    hue: 250, // 主题色调（0-360）
    fixed: false, // 是否固定主题（隐藏颜色选择器）
  },
}
```

### 修改导航菜单
在 `src/config.ts` 中修改 `navBarConfig`：
```typescript
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    LinkPreset.Talk,
    LinkPreset.Kits,
    // 自定义链接
    {
      name: 'GitHub',
      url: 'https://github.com/0110wdj',
      external: true,
    },
  ],
}
```

## 内容管理

### 添加新文章
1. 运行 `pnpm new-post` 生成新文章文件
2. 在 `src/content/posts/` 目录下编辑 Markdown 文件
3. 文章 frontmatter 格式：
```yaml
---
title: '文章标题'
published: 2024-05-02
draft: false
description: '文章描述'
image: '封面图片路径'
tags: ['标签1', '标签2']
category: '分类'
---
```

### 国际文化支持
1. 在 `src/i18n/languages/` 目录下添加对应语言文件
2. 在 `src/i18n/i18nKey.ts` 中添加翻译键
3. 在组件中使用 `i18n()` 函数获取翻译文本

## 扩展功能

### 添加新工具页面
1. 在 `src/pages/components/` 目录下创建 React 组件
2. 在 `src/pages/kitsInner.jsx` 中添加路由和导航
3. 在 `src/pages/kits.astro` 中引入新组件

### 添加新游戏
1. 在 `src/pages/components/` 目录下创建游戏组件
2. 实现游戏逻辑和 UI
3. 在 `src/pages/kitsInner.jsx` 中添加导航链接

## 常见问题

### 1. 如何修改博客标题和副标题？
编辑 `src/config.ts` 中的 `siteConfig` 对象。

### 2. 如何隐藏主题颜色选择器？
在 `src/config.ts` 中设置 `themeColor.fixed = true`。

### 3. 如何添加新的导航链接？
在 `src/config.ts` 的 `navBarConfig.links` 数组中添加新项。

### 4. 如何开启评论功能？
需要集成第三方评论系统（如 Giscus 或 Disqus），在 `src/components/PostPage.astro` 中添加评论组件。

## 架构决策记录

### 为什么选择 Astro？
- 极致的加载速度（静态 HTML + 部分 hydration）
- 支持多框架集成
- 优秀的开发体验
- 灵活的内容管理方式

### 为什么使用 React 而不是纯 Astro？
对于需要复杂状态管理和交互的组件（如游戏），React 提供了更好的开发体验和生态支持。

### 为什么选择 Pagefind 而不是 Algolia？
Pagefind 是开源的客户端搜索库，无需服务器端支持，部署简单且免费。

---

**文档最后更新**: 2026-02-26
**项目版本**: 2.2.0