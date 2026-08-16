import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config from "@/config";
import { getSecondaryLocalePaths, resolveLocale } from "@/i18n";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { resolveLocalizedEntries } from "@/utils/localizedContent";

export function getStaticPaths() {
  return getSecondaryLocalePaths();
}

export const GET: APIRoute = async ({ params }) => {
  const locale = resolveLocale(params.locale);
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sortedPosts = getSortedPosts(
    resolveLocalizedEntries(posts, "blog", locale)
  );

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
};
