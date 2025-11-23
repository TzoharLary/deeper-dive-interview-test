import type { Publisher } from "../types/index.js";

const SAFE_PUBLISHER_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const URL_PROTOCOL_REGEX = /^https?:\/\//i;

const TEXT_LIMITS = {
  publisherId: 60,
  aliasName: 80,
  url: 250,
  notes: 2000,
  customCss: 8000,
  tag: 64,
  domain: 128
} as const;

function stripUnsafeHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

function sanitizeText(value: unknown, maxLength?: number): string {
  if (typeof value !== "string") return "";
  let next = stripUnsafeHtml(value).trim();
  if (maxLength && next.length > maxLength) {
    next = next.slice(0, maxLength);
  }
  return next;
}

function sanitizeStringArray(values: unknown, maxLength: number): string[] {
  if (!Array.isArray(values)) return [];
  const result: string[] = [];

  values.forEach((item) => {
    if (typeof item !== "string") return;
    let cleaned = stripUnsafeHtml(item).trim();
    if (!cleaned) return;
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.slice(0, maxLength);
    }
    result.push(cleaned);
  });

  return result;
}

function ensureArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value as T[] : fallback;
}

function sanitizePublisherDraft(data: Publisher): Publisher {
  const sanitizedNotes = typeof data.notes === "string" ? sanitizeText(data.notes, TEXT_LIMITS.notes) : undefined;
  return {
    ...data,
    publisherId: typeof data.publisherId === "string" ? data.publisherId.trim() : "",
    aliasName: sanitizeText(data.aliasName, TEXT_LIMITS.aliasName) || "",
    notes: sanitizedNotes,
    customCss: typeof data.customCss === "string" ? data.customCss.trim() : "",
    tags: sanitizeStringArray(ensureArray(data.tags, []), TEXT_LIMITS.tag),
    allowedDomains: sanitizeStringArray(ensureArray(data.allowedDomains, []), TEXT_LIMITS.domain),
    pages: ensureArray(data.pages, [])
  } as Publisher;
}

function hasBalancedCssBraces(css: string): boolean {
  let depth = 0;
  for (const char of css) {
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

function hasDuplicateStrings(values: string[]): boolean {
  const normalized = values.map((v) => v.toLowerCase());
  return new Set(normalized).size !== normalized.length;
}

export {
  SAFE_PUBLISHER_ID_REGEX,
  TEXT_LIMITS,
  URL_PROTOCOL_REGEX,
  hasBalancedCssBraces,
  hasDuplicateStrings,
  sanitizePublisherDraft,
  sanitizeStringArray,
  sanitizeText,
  stripUnsafeHtml
};
