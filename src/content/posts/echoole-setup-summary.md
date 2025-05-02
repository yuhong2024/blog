---
title: "个人博客 echoole.com 搭建技术路线总结"
published: 2025-05-02
description: "从 0 到上线，完整记录 echoole 博客构建过程与技术选型"
tags: [博客, Astro, 部署, Vercel, Markdown]
category: 建站日志
lang: zh
draft: false
---

# ✅ 技术路线总结：个人博客站点 echoole.com 搭建过程

## 📌 项目目标

构建一个**简洁高效、现代风格、支持 Markdown 写作、自动部署与自定义域名**的博客系统，用于记录 AI、生物信息、项目进展与个人思考。

## 🧱 技术栈架构

| 模块 | 技术选型 |
|------|----------|
| 前端框架 | [Astro](https://astro.build)（构建静态站点） |
| UI 框架 | Tailwind CSS + Fuwari 主题模板 |
| 内容系统 | Markdown（文章）+ Frontmatter 元数据 |
| 自动构建 | GitHub + Vercel（CI/CD） |
| 图标/logo | AI 生成自定义图标（科技风） |
| 自定义域名 | echoole.com（阿里云 DNS 配置） |

## ⚙️ 搭建流程

### 1. 本地开发环境准备

- 安装 Node.js、pnpm、Git
- 克隆 Fuwari 博客模板并运行：

```bash
git clone https://github.com/saicaca/Fuwari.git blog
cd blog
pnpm install && pnpm add sharp
pnpm dev
```

### 2. 博客内容与配置初始化

- 修改 `src/config.ts`
- 修改首页文章 / `pnpm new-post <title>` 创建文章
- 文章路径：`src/content/posts/*.md`
- 页面路径：`src/pages/about.astro` 等

### 3. 托管与自动部署

```bash
git init
git remote add origin https://github.com/yuhong2024/blog.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

- Vercel 自动部署生成 `.vercel.app` 访问地址

### 4. 绑定自定义域名（阿里云）

- 添加 `echoole.com` 与 `www.echoole.com` 至 Vercel 项目
- 阿里云解析设置：
  - `@` → A 记录 →xxxxxxxx
  - `www` → CNAME → `cname.vercel-dns.com.`

### 5. 图标设计与优化（可选）

- AI 生成科技风 Logo
- 添加 favicon.ico 或 SVG 图标至 `public/`

## ✍️ 内容更新流程

```bash
pnpm new-post my-new-article
git add .
git commit -m "新增文章"
git push
```

Vercel 自动重新构建并上线。

## 📦 项目成果展示

- 访问地址：[https://echoole.com](https://echoole.com)
- 自动部署 + 自定义域名 + HTTPS + 图标美化
- 内容结构清晰、写作体验极佳
