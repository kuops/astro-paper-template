import type { Locale } from "@/types/config";

const cjkCharacterPattern = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const latinWordPattern = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

export interface ReadingMetadata {
  count: number;
  minutes: number;
}

const getReadableText = (body: string) =>
  body
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/export\s+const\s+[\s\S]*?;\s*/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[|*_~`>#]/g, " ")
    .replace(/\{[^{}]*\}/g, " ");

export const getReadingMetadata = (
  body: string | undefined,
  locale: Locale
): ReadingMetadata => {
  const text = getReadableText(body ?? "");
  const cjkCount = text.match(cjkCharacterPattern)?.length ?? 0;
  const latinWordCount = text.match(latinWordPattern)?.length ?? 0;
  const count = cjkCount + latinWordCount;
  const minutes = Math.max(
    1,
    Math.ceil(cjkCount / 400 + latinWordCount / (locale === "zh" ? 200 : 200))
  );

  return { count, minutes };
};
