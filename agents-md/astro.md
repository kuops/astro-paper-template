# Astro 项目指南

## 命令（Commands）

- `npm run dev` — 在 `localhost:4321` 启动开发服务器
- `npm run build` — 运行 `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`
- `npm run lint` — 运行 ESLint
- `npm run format:check` — 检查 Prettier 格式
- `npm run format` — 用 Prettier 自动格式化

## 验证（Verification）

写完代码后，必须按 CI 步骤逐一验证，确保全部通过：

1. `npm run lint` — eslint 检查
2. `npm run format:check` — prettier 格式检查
3. `npm run build` — astro check + build + pagefind 搜索索引

以上三项全部通过才算完成。如果 `format:check` 不通过，先运行 `npm run format` 自动修复再重新检查。

## 架构（Architecture）

基于 AstroPaper 的博客项目（Astro 5 + Tailwind CSS 4 + TypeScript）。

- `src/config.ts` — 站点级配置（title、author、lang、timezone、i18n 等）。默认 `lang: "zh"`、`timezone: "Asia/Shanghai"`，支持配置 `zh/en`。
- `src/content.config.ts` — blog 和 books collection 的 schema。博客文章位于 `src/data/blog/`，书籍内容位于 `src/data/books/`。
- `src/layouts/PostDetails.astro` — 文章详情页，采用双栏布局（正文 + TOC 侧边栏）。
- `src/components/TableOfContents.astro` — 右侧 TOC 组件，提取 `h2` 到 `h4` 标题并高亮当前阅读位置。
- `src/styles/global.css` — Tailwind 和主题变量定义，字体变量也在这里声明。
- `src/utils/books.ts` — books 工具模块，从文件系统结构构建 sidebar、title map 和书籍元数据。由于 Astro glob loader 会把 `index.md` 的 `id` 解析为父目录名，因此这里使用 `filePath` 而不是 `id` 检测 `index.md` 和 `_index.md`。
- `src/types/books.ts` — `SidebarGroup` 类型定义。
- `src/i18n/locale.ts` — 默认语言、locale 前缀和本地化 URL 工具。默认语言无前缀，其他语言使用 locale 前缀。
- `src/utils/localizedContent.ts` — 从 collection 文件路径解析内容语言和翻译关系，并按当前语言选择译文或原文 fallback。

## 国际化（i18n）

`astro-paper.config.ts` 中的 `site.lang` 是默认语言，`i18n.locales` 是启用语言列表。当前支持 `zh` 和 `en`。默认语言内容保留在 collection 根目录，其他语言放在 `src/data/<collection>/<locale>/` 下；相同相对路径自动配对，也可使用可选的 `translationKey` 显式配对。

列表页优先显示当前语言译文。没有译文时显示原文语言标记并直接链接原文，不在目标语言前缀下复制正文。修改路由或内容工具时必须同时验证默认语言 URL、locale 前缀 URL、fallback 链接和 `hreflang`。

## 字体（Fonts）

通过 Astro Fonts API 在 `astro.config.ts` 中自托管 Google Sans Code，使用 WOFF2 和 `font-display: swap`。字体 provider 不添加 generic fallback，由全局字体栈继续处理中文。生产构建会把各字重合并为正常体和斜体两个可变字体文件，两者都要预加载；首访先显示 fallback，字体加载完成后自动替换，避免因 `optional` 策略导致刷新前后字体表现不一致。

页面和代码都优先使用 Google Sans Code，中文依次回退到本机的 Noto Sans SC、PingFang SC 或 Microsoft YaHei。不要引入完整的 Noto Sans SC Web Font，也不要在字体加载期间隐藏整个页面；完整中文字库会显著增加传输和构建体积，而整页门控会造成刷新白屏。

## 路径别名（Path aliases）

`@/*` 映射到 `./src/*`（在 `tsconfig.json` 中配置）。

## 部署（Deployment）

通过 GitHub Actions (`.github/workflows/deploy.yml`) 部署到 GitHub Pages。推送到 `gh-pages` 分支时触发，使用 `npm ci` 和 `npm run build`，Node 版本为 24。注意：上游 CI 仍使用 pnpm，而本项目使用 npm。

请把 `src/config.ts` 里的 `website` 设置为真实的 GitHub Pages 地址。如果部署到 `<username>.github.io/<repo>`，还需要在 `astro.config.ts` 中增加 `base: "/<repo>/"`。

## Git

- **禁止 push**——只有用户明确说"推送"时才执行 `git push`
- commit 后也不要 push，等用户自己操作
- commit 风格：`type: short description`（如 `feat: add xxx`、`fix: correct xxx`）

## 代码风格（Code style）

- ESLint：`no-console: error`，使用 Astro plugin 和 `typescript-eslint`
- Prettier：使用 Astro 和 Tailwind 插件
- 除非用户明确要求，否则不要主动添加代码注释
