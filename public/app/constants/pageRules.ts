export const ALLOWED_PAGE_TYPES = [
  "homepage",
  "text",
  "article",
  "category",
  "tag",
  "search",
  "gallery",
  "video",
  "product",
  "listing",
  "author",
  "topic",
  "section",
  "other"
] as const;

export const ALLOWED_PAGE_POSITIONS = [
  "top",
  "bottom",
  "sidebar",
  "inline",
  "before-content",
  "after-content",
  "before-title",
  "after-title",
  "overlay",
  "popup"
] as const;

export const ALLOWED_PAGE_SELECTORS = [
  "main",
  "#root",
  "#root main",
  "article",
  ".article-main",
  ".post-body",
  ".content",
  "#content",
  ".entry-content",
  ".article-content",
  ".post-content",
  ".single-post",
  "#primary",
  ".main-content",
  ".page-content",
  ".container",
  "#category-feed",
  ".gallery-grid"
] as const;

export type AllowedPageType = typeof ALLOWED_PAGE_TYPES[number];
export type AllowedPagePosition = typeof ALLOWED_PAGE_POSITIONS[number];
export type AllowedPageSelector = typeof ALLOWED_PAGE_SELECTORS[number];

export const DEFAULT_PAGE_TYPE: AllowedPageType = "article";
export const DEFAULT_PAGE_SELECTOR: AllowedPageSelector = "main";
export const DEFAULT_PAGE_POSITION: AllowedPagePosition = "inline";

export function isAllowedPageType(value: unknown): value is AllowedPageType {
  return typeof value === "string" && (ALLOWED_PAGE_TYPES as readonly string[]).includes(value);
}

export function isAllowedPagePosition(value: unknown): value is AllowedPagePosition {
  return typeof value === "string" && (ALLOWED_PAGE_POSITIONS as readonly string[]).includes(value);
}

export function isAllowedPageSelector(value: unknown): value is AllowedPageSelector {
  return typeof value === "string" && (ALLOWED_PAGE_SELECTORS as readonly string[]).includes(value);
}
