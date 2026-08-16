import config from "@/config";
import type { Locale } from "@/types/config";

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && config.i18n.locales.includes(value as Locale));
}

export function resolveLocale(value?: string): Locale {
  return isLocale(value) ? value : config.site.lang;
}

export function getLocalePrefix(locale: Locale): string {
  return locale === config.site.lang ? "" : `/${locale}`;
}

export function stripLocalePrefix(pathname: string): {
  locale: Locale;
  pathname: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (isLocale(firstSegment) && firstSegment !== config.site.lang) {
    const stripped = `/${segments.slice(1).join("/")}`;
    return {
      locale: firstSegment,
      pathname: stripped === "/" ? "/" : stripped,
    };
  }

  return { locale: config.site.lang, pathname };
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const { pathname: unprefixedPath } = stripLocalePrefix(pathname);
  const normalizedPath = unprefixedPath.startsWith("/")
    ? unprefixedPath
    : `/${unprefixedPath}`;
  const path = normalizedPath === "/" ? "/" : normalizedPath.replace(/\/$/, "");
  const prefix = getLocalePrefix(locale);

  return prefix ? `${prefix}${path === "/" ? "/" : path}` : path;
}

export function getLocaleFromPath(pathname: string): Locale {
  return stripLocalePrefix(pathname).locale;
}

export function getAlternateLocale(locale: Locale): Locale | undefined {
  return config.i18n.locales.find(candidate => candidate !== locale);
}

export function getSecondaryLocales(): Locale[] {
  return config.i18n.locales.filter(locale => locale !== config.site.lang);
}

export function getSecondaryLocalePaths() {
  return getSecondaryLocales().map(locale => ({ params: { locale } }));
}
