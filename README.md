# AstroPaper Template

![AstroPaper](public/astropaper-og.jpg)

一个基于 [AstroPaper](https://github.com/satnaing/astro-paper) 的中文博客与书籍脚手架。

这个仓库保留了 AstroPaper 简洁、响应式、SEO 友好的基础能力，同时补充了更适合中文内容站点的默认配置、书籍内容模型和阅读体验增强。

## 为什么用这个模板（Why This Template）

- 适合做中文博客、教程站、知识库和轻量书籍站点
- 保留 AstroPaper 的整体结构，便于跟进上游更新
- 在不引入重型 CMS 的前提下，补足更适合内容型站点的能力

## 与上游 AstroPaper 的差异（Compared with upstream AstroPaper）

- **可配置中英文站点**：默认语言为 `zh`、默认时区为 `Asia/Shanghai`；默认语言不带 URL 前缀，另一语言使用 `/en/` 或 `/zh/` 前缀。
- **内容目录沿用旧结构**：上游后续把内容目录切换到了 `src/content/`，而这个模板延续了较早版本的 `src/data/` 组织方式，并按 `blog`、`books`、`pages` 分开管理。
- **书籍内容系统**：除了博客，还新增了文件系统驱动的 `books` 集合，支持 `index.md`、`_index.md`、章节分组和书籍目录页。
- **阅读体验补充**：增加了书籍导航、返回按钮、回到顶部、目录体验优化、图片灯箱等能力。
- **搜索实现调整**：从上游的默认搜索 UI 调整为 `@pagefind/component-ui` 方案，并在构建后生成静态搜索索引。
- **字体与代码展示调整**：增加 Google Sans Code、Noto Sans SC、自定义代码块文件名与高亮 transformer，更适合中英文混排和技术写作。

## 项目结构（Project Structure）

```bash
/
├── astro-paper.config.ts
├── public/
│   └── astropaper-og.jpg
├── src/
│   ├── components/
│   ├── data/
│   │   ├── blog/
│   │   └── books/
│   │   └── pages/
│   ├── pages/
│   │   └── books/
│   ├── styles/
│   ├── types/
│   └── utils/
│       └── books.ts
└── .github/
    └── workflows/
        └── deploy.yml
```

与上游相比，最值得关注的是这些路径：

- `astro-paper.config.ts`：模板主配置入口
- `src/data/blog/`：博客文章内容
- `src/data/books/`：书籍内容与分组目录
- `src/data/pages/`：关于页等单页内容
- `src/pages/books/`：书籍首页、章节页路由
- `src/utils/books.ts`：从文件系统推导书籍结构、侧边栏和章节顺序

## 快速开始（Quick Start）

```bash
# 使用 Astro 官方脚手架从这个模板初始化
npm create astro@latest -- --template kuops/astro-paper-template

# 安装依赖并启动
npm install
npm run dev
```

默认本地地址为 `http://localhost:4321`。

## 内容约定（Content Conventions）

### 博客文章（Blog Posts）

博客文章放在 `src/data/blog/`，至少需要这些 frontmatter：

```yaml
title: 标题
pubDatetime: 2026-06-08T12:00:00Z
description: 文章摘要
tags:
  - astro
  - blog
```

### 书籍内容（Books）

书籍内容放在 `src/data/books/`，目录结构本身就是数据源：

```bash
src/data/books/
  astro-guide/
    index.md
    basics/
      _index.md
      intro.md
      installation.md
    advanced/
      _index.md
      components.md
```

- 顶层目录代表一本书
- `index.md` 是书籍元数据
- `_index.md` 是分组元数据
- 其余 `.md` 文件是章节

### 中英文内容（Localized Content）

`astro-paper.config.ts` 使用 `site.lang` 指定默认语言，并通过 `i18n.locales` 启用语言：

```ts
site: {
  lang: "zh",
},
i18n: {
  locales: ["zh", "en"],
},
```

默认语言内容继续放在原目录，其他语言放在对应语言子目录：

```text
src/data/blog/hello.md
src/data/blog/en/hello.md

src/data/pages/about.md
src/data/pages/en/about.md

src/data/books/astro-guide/index.md
src/data/books/en/astro-guide/index.md
```

相同相对路径会自动视为同一内容的译文。不同语言需要使用不同文件路径时，可在 frontmatter 中设置相同的 `translationKey`。没有译文的内容仍会显示在目标语言列表中，并标记原文语言、链接到原语言页面；不会生成重复的目标语言正文页面。

## 命令（Commands）

所有命令都在项目根目录运行：

| Command                | Action                                               |
| :--------------------- | :--------------------------------------------------- |
| `npm install`          | 安装依赖                                             |
| `npm run dev`          | 启动本地开发服务器                                   |
| `npm run lint`         | 运行 ESLint                                          |
| `npm run format:check` | 检查 Prettier 格式                                   |
| `npm run format`       | 自动格式化文件                                       |
| `npm run build`        | 执行 `astro check`、构建站点、生成 Pagefind 搜索索引 |
| `npm run preview`      | 本地预览构建结果                                     |
| `npm run sync`         | 生成 Astro 类型定义                                  |

## 部署说明（Deployment Notes）

- GitHub Pages 工作流位于 `.github/workflows/deploy.yml`
- 工作流在推送到 `gh-pages` 分支时执行 `npm ci` 和 `npm run build`
- 部署前请把 `astro-paper.config.ts` 里的 `site.url`、`title`、`description`、`author` 等站点信息改成你自己的
- 如果站点部署在子路径，例如 `<username>.github.io/<repo>`，请在 `astro.config.ts` 里补充 `base: "/<repo>/"`

## 上游项目（Upstream）

- 上游项目：`satnaing/astro-paper`

## 许可证（License）

Licensed under the MIT License, Copyright © 2025-2026

---

Made with appreciation for [Sat Naing](https://satnaing.dev) and the [AstroPaper contributors](https://github.com/satnaing/astro-paper/graphs/contributors).
