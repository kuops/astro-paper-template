import type { CollectionEntry } from "astro:content";
import config from "@/config";
import type { Locale } from "@/types/config";
import { isLocale } from "@/i18n/locale";

type CollectionName = "blog" | "books" | "pages";
type ContentEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"books">
  | CollectionEntry<"pages">;

const collectionRoots: Record<CollectionName, string> = {
  blog: "src/data/blog",
  books: "src/data/books",
  pages: "src/data/pages",
};

function getRelativeFilePath(
  entry: Pick<ContentEntry, "filePath">,
  collection: CollectionName
): string {
  const filePath = entry.filePath?.replaceAll("\\", "/") ?? "";
  const root = collectionRoots[collection];
  const rootIndex = filePath.indexOf(root);
  const relativePath =
    rootIndex >= 0 ? filePath.slice(rootIndex + root.length) : filePath;

  return relativePath.replace(/^\//, "");
}

export function getContentLocale(
  entry: Pick<ContentEntry, "filePath">,
  collection: CollectionName
): Locale {
  const firstSegment = getRelativeFilePath(entry, collection).split("/")[0];
  return isLocale(firstSegment) ? firstSegment : config.site.lang;
}

export function getContentRelativePath(
  entry: Pick<ContentEntry, "filePath">,
  collection: CollectionName
): string {
  const segments = getRelativeFilePath(entry, collection).split("/");
  if (isLocale(segments[0])) segments.shift();

  return segments.join("/").replace(/\.(md|mdx)$/i, "");
}

export function getTranslationKey(
  entry: ContentEntry,
  collection: CollectionName
): string {
  return entry.data.translationKey ?? getContentRelativePath(entry, collection);
}

export function resolveLocalizedEntries<T extends ContentEntry>(
  entries: T[],
  collection: CollectionName,
  locale: Locale
): T[] {
  const groups = new Map<string, T[]>();

  for (const entry of entries) {
    const key = getTranslationKey(entry, collection);
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([key, group]) => {
    const byLocale = new Map<Locale, T>();

    for (const entry of group) {
      const entryLocale = getContentLocale(entry, collection);
      if (byLocale.has(entryLocale)) {
        throw new Error(
          `Duplicate ${collection} translation for key "${key}" and locale "${entryLocale}".`
        );
      }
      byLocale.set(entryLocale, entry);
    }

    return byLocale.get(locale) ?? byLocale.get(config.site.lang) ?? group[0];
  });
}

export function hasTranslation<T extends ContentEntry>(
  entries: T[],
  collection: CollectionName,
  entry: T,
  locale: Locale
): boolean {
  const key = getTranslationKey(entry, collection);
  return entries.some(
    candidate =>
      getTranslationKey(candidate, collection) === key &&
      getContentLocale(candidate, collection) === locale
  );
}
