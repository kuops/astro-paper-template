type Locale = "zh" | "en";

interface SiteConfig {
  url: string;
  title: string;
  description: string;
  author: string;
  profile?: string;
  ogImage?: string;
  lang?: Locale;
  timezone?: string;
  dir?: "ltr" | "rtl";
  googleVerification?: string;
}

interface I18nConfig {
  locales?: Locale[];
}

interface PostsConfig {
  perPage?: number;
  perIndex?: number;
  scheduledPostMargin?: number;
}

interface FeaturesConfig {
  lightAndDarkMode?: boolean;
  dynamicOgImage?: boolean;
  showArchives?: boolean;
  showBackButton?: boolean;
  editPost?:
    | {
        enabled: true;
        url: string;
      }
    | { enabled: false };
  search?: "pagefind" | false;
}

interface SocialLink {
  name: string;
  url: string;
  linkTitle?: string;
}

interface ShareLink {
  name: string;
  url: string;
  linkTitle?: string;
}

interface AstroPaperConfig {
  site: SiteConfig;
  i18n?: I18nConfig;
  posts?: PostsConfig;
  features?: FeaturesConfig;
  socials?: SocialLink[];
  shareLinks?: ShareLink[];
}

type ResolvedSiteConfig = Required<
  Pick<
    SiteConfig,
    | "url"
    | "title"
    | "description"
    | "author"
    | "lang"
    | "timezone"
    | "dir"
    | "ogImage"
  >
> &
  Pick<SiteConfig, "profile" | "googleVerification">;

export interface ResolvedAstroPaperConfig {
  site: ResolvedSiteConfig;
  i18n: Required<I18nConfig>;
  posts: Required<PostsConfig>;
  features: Required<FeaturesConfig>;
  socials: SocialLink[];
  shareLinks: ShareLink[];
}

function defineAstroPaperConfig(config: AstroPaperConfig): AstroPaperConfig {
  return config;
}

export type {
  SiteConfig,
  I18nConfig,
  Locale,
  PostsConfig,
  FeaturesConfig,
  SocialLink,
  ShareLink,
  AstroPaperConfig,
};

export { defineAstroPaperConfig };
