# Reading Metadata Design

## Goal

Show estimated reading time and content length on article detail pages and book chapter pages. Statistics must describe the content that is actually rendered, not a shared value from a translation pair.

## User Experience

- Article detail pages show the metadata beside the publication date, before the edit action.
- Book chapter pages show the metadata below the chapter title and above the content.
- List cards and book sidebars do not show the metadata in this iteration to keep navigation compact.
- Chinese content uses `约 X 分钟 · Y 字`.
- English content uses `X min read · Y words`.
- An English URL rendering Chinese fallback content uses Chinese-content statistics and an explicit Chinese-content label.

## Data Flow

The statistic utility receives the raw source body of the selected collection entry during the Astro build. Each locale entry is calculated independently. A fallback route passes the source-language entry, so its statistics match the visible fallback content automatically.

The utility returns a structured result containing the detected content locale, Chinese character count, Latin word count, and rounded reading minutes. Presentation components choose the localized label from the content locale rather than from the URL locale.

## Counting Rules

- Ignore Markdown syntax, frontmatter, URLs, JSX tags, exported MDX declarations, and whitespace-only content.
- Count CJK characters as content units.
- Count contiguous Latin and numeric sequences as words.
- Use the larger applicable count for mixed content only after removing markup and code noise.
- Estimate reading time with separate Chinese and Latin reading speeds, always rounding up to at least one minute.
- Do not store derived values in frontmatter; recalculation keeps metadata current after edits or translations.

## Boundaries

- No client-side JavaScript is required.
- No Astro integration or content plugin is required.
- No changes are made to list-card density, book navigation, or search metadata in this iteration.

## Verification

- Confirm Chinese and English versions of the same translated article can display different values.
- Confirm an English fallback page uses the Chinese source content statistics.
- Confirm a book chapter displays the same metadata treatment as an article detail page without a publication date.
- Run `npm run lint`, `npm run format:check`, and `npm run build` in that order.
