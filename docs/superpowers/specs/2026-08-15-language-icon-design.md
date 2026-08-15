# 语言切换图标设计

## 目标

将 Header 中可见的 `中文 / English` 语言切换文字替换为与现有导航一致的图标，同时保持语言切换行为和可访问性不变。

## 设计

- 使用 Tabler Outline 的 Language 图标，保持现有图标的 `24x24`、`stroke-width="2"`、圆角线帽和圆角连接。
- 新增 `src/assets/icons/IconLanguage.svg`，与现有 `IconSearch.svg`、`IconArchive.svg` 使用相同 SVG 约定。
- Header 桌面端和移动端都只显示图标，并使用与搜索按钮一致的点击区域、焦点样式和 hover 颜色。
- `title` 和 `aria-label` 继续显示“切换语言：中文”或“Switch language: English”，让图标的目标语言保持明确。
- 保留 `lang`、`hreflang` 和 `data-astro-reload`，不改变 URL、SEO、fallback 或页面加载行为。

## 验证

- 中文和英文页面都显示 Language 图标。
- tooltip 与无障碍名称包含目标语言。
- 桌面端和移动端导航不溢出、不偏移。
- 语言切换仍执行完整页面导航，不重新触发标题缩放。
- `npm run lint`、`npm run format:check` 和 `npm run build` 全部通过。
