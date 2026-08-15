import { getCollection, type CollectionEntry } from "astro:content";
import config from "@/config";
import { getLocalizedPath } from "@/i18n";
import type { Locale } from "@/types/config";
import type { SidebarGroup } from "@/types/books";
import {
  getContentLocale,
  getContentRelativePath,
  resolveLocalizedEntries,
} from "@/utils/localizedContent";

type BookEntry = CollectionEntry<"books">;

interface BookMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  href: string;
  sourceLocale: Locale;
}

export function isBookIndex(e: BookEntry) {
  const path = getContentRelativePath(e, "books");
  return path.endsWith("/index") || path === "index";
}

export function isGroupIndex(e: BookEntry) {
  return getContentRelativePath(e, "books").endsWith("/_index");
}

function getBookSlug(entry: BookEntry) {
  return getContentRelativePath(entry, "books").split("/")[0];
}

function getRelativePath(entry: BookEntry) {
  return getContentRelativePath(entry, "books").split("/").slice(1).join("/");
}

export function getChapterSlug(entry: BookEntry) {
  return getRelativePath(entry);
}

function getGroupDir(entry: BookEntry) {
  const parts = getContentRelativePath(entry, "books").split("/");
  return parts.length >= 3 ? parts[1] : null;
}

export async function getAllBooks(
  locale: Locale = config.site.lang
): Promise<BookMeta[]> {
  const allEntries = await getCollection("books", e => !e.data.draft);
  const entries = resolveLocalizedEntries(allEntries, "books", locale).filter(
    isBookIndex
  );
  return entries
    .map(e => {
      const slug = getBookSlug(e);
      const sourceLocale = getContentLocale(e, "books");
      return {
        slug,
        title: e.data.title,
        description: e.data.description,
        order: e.data.order ?? 0,
        href: getLocalizedPath(`/books/${slug}`, sourceLocale),
        sourceLocale,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export async function getBookEntries(
  bookSlug: string,
  locale: Locale = config.site.lang
): Promise<BookEntry[]> {
  const allEntries = await getCollection("books", ({ data }) => !data.draft);
  return resolveLocalizedEntries(allEntries, "books", locale).filter(
    entry => getBookSlug(entry) === bookSlug
  );
}

interface GroupMeta {
  dir: string;
  title: string;
  order: number;
}

export function buildSidebar(
  bookSlug: string,
  entries: BookEntry[]
): SidebarGroup[] {
  const groupIndexEntries = entries.filter(
    e => getBookSlug(e) === bookSlug && isGroupIndex(e)
  );

  const groupMap = new Map<string, GroupMeta>();
  for (const e of groupIndexEntries) {
    const dir = getGroupDir(e)!;
    groupMap.set(dir, {
      dir,
      title: e.data.group || dir,
      order: e.data.order ?? 0,
    });
  }

  const chapters = entries.filter(
    e => getBookSlug(e) === bookSlug && !isBookIndex(e) && !isGroupIndex(e)
  );

  const hasGroups = groupMap.size > 0;

  if (!hasGroups) {
    const sorted = [...chapters].sort(
      (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)
    );
    return [
      {
        text: "",
        items: sorted.map(getRelativePath),
      },
    ];
  }

  const groupsByDir = new Map<string, BookEntry[]>();
  const rootChapters: BookEntry[] = [];

  for (const ch of chapters) {
    const dir = getGroupDir(ch);
    if (dir && groupMap.has(dir)) {
      if (!groupsByDir.has(dir)) groupsByDir.set(dir, []);
      groupsByDir.get(dir)!.push(ch);
    } else {
      rootChapters.push(ch);
    }
  }

  const result: SidebarGroup[] = [];

  if (rootChapters.length > 0) {
    const sorted = [...rootChapters].sort(
      (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)
    );
    result.push({
      text: "",
      items: sorted.map(getRelativePath),
    });
  }

  const sortedGroups = [...groupMap.values()].sort((a, b) => a.order - b.order);

  for (const g of sortedGroups) {
    const items = [...(groupsByDir.get(g.dir) || [])].sort(
      (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)
    );
    if (items.length > 0) {
      result.push({
        text: g.title,
        items: items.map(getRelativePath),
      });
    }
  }

  return result;
}

export function buildTitleMap(entries: BookEntry[], bookSlug: string) {
  const map: Record<string, string> = {};
  for (const e of entries) {
    if (!isBookIndex(e) && !isGroupIndex(e) && getBookSlug(e) === bookSlug) {
      map[getRelativePath(e)] = e.data.title;
    }
  }
  return map;
}

export function getFlatItems(sidebar: SidebarGroup[]) {
  return sidebar.flatMap(g => g.items);
}

export function getFirstChapter(
  bookSlug: string,
  entries: BookEntry[]
): string | null {
  const sidebar = buildSidebar(bookSlug, entries);
  const flat = getFlatItems(sidebar);
  return flat.length > 0 ? flat[0] : null;
}

export function getChapterEntry(
  entries: BookEntry[],
  bookSlug: string,
  relativeSlug: string
): BookEntry | undefined {
  return entries.find(
    e =>
      !isBookIndex(e) &&
      !isGroupIndex(e) &&
      getBookSlug(e) === bookSlug &&
      getRelativePath(e) === relativeSlug
  );
}

export function buildHrefMap(entries: BookEntry[], bookSlug: string) {
  const map: Record<string, string> = {};

  for (const entry of entries) {
    if (
      isBookIndex(entry) ||
      isGroupIndex(entry) ||
      getBookSlug(entry) !== bookSlug
    ) {
      continue;
    }

    const relativePath = getRelativePath(entry);
    const locale = getContentLocale(entry, "books");
    map[relativePath] = getLocalizedPath(
      `/books/${bookSlug}/${relativePath}`,
      locale
    );
  }

  return map;
}
