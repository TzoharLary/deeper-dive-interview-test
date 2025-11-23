/* eslint-disable no-unused-vars */
import { Publisher, Page } from "../types/index.js";
import {
  ALLOWED_PAGE_POSITIONS,
  ALLOWED_PAGE_SELECTORS,
  ALLOWED_PAGE_TYPES
} from "../constants/pageRules.js";
import {
  SAFE_PUBLISHER_ID_REGEX,
  TEXT_LIMITS,
  URL_PROTOCOL_REGEX,
  hasBalancedCssBraces,
  hasDuplicateStrings,
  sanitizePublisherDraft
} from "./sanitize.js";

// Mini-Zod: Lightweight chainable runtime validator
export type ValidationError = { path: string; message: string };

type CheckFn<T> = (value: T) => string | null;

export class TypeSchema<T> {
  private checks: CheckFn<T>[] = [];

  constructor(private readonly _parse?: (v: unknown) => T) {}

  parse(v: unknown): { success: true; data: T } | { success: false; errors: ValidationError[] } {
    try {
      const value = this._parse ? this._parse(v) : (v as T);
      const errors: ValidationError[] = [];
      for (const ck of this.checks) {
        const msg = ck(value);
        if (msg) errors.push({ path: "", message: msg });
      }
      return errors.length ? { success: false, errors } : { success: true, data: value };
    } catch (e: unknown) {
      const message = (e instanceof Error) ? e.message : String(e);
      return { success: false, errors: [{ path: "", message }] };
    }
  }

  refine(fn: CheckFn<T>): this {
    this.checks.push(fn);
    return this;
  }

  // build helpers
  static string(): TypeSchema<string> {
    return new TypeSchema<string>((v) => {
      if (typeof v !== "string") throw new Error("Expected string");
      return v;
    });
  }

  static boolean(): TypeSchema<boolean> {
    return new TypeSchema<boolean>((v) => {
      if (typeof v !== "boolean") throw new Error("Expected boolean");
      return v;
    });
  }

  static number(): TypeSchema<number> {
    return new TypeSchema<number>((v) => {
      if (typeof v !== "number") throw new Error("Expected number");
      return v;
    });
  }

  static array<U>(itemSchema?: TypeSchema<U>): TypeSchema<U[]> {
    return new TypeSchema<U[]>((v) => {
      if (!Array.isArray(v)) throw new Error("Expected array");
      return v as U[];
    }).refine((arr) => {
      if (itemSchema) {
        for (let i = 0; i < arr.length; i++) {
          const r = itemSchema.parse(arr[i]);
          if (r.success === false) return `Invalid array item at index ${i}: ${r.errors[0].message}`;
        }
      }
      return null;
    });
  }

  static object<U extends object>(shape: { [K in keyof U]: TypeSchema<U[K]> }): TypeSchema<U> {
    return new TypeSchema<U>((v) => {
      if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error("Expected object");
      return v as U;
    }).refine((obj) => {
      for (const key of Object.keys(shape)) {
        const schema = shape[key as keyof U];
        const res = schema.parse((obj as Record<string, unknown>)[key]);
        if (res.success === false) return `Invalid field '${key}': ${res.errors[0].message}`;
      }
      return null;
    });
  }
  static optional<V>(schema: TypeSchema<V>): TypeSchema<V | undefined> {
    return new TypeSchema<V | undefined>((v) => v as (V | undefined)).refine((val) => {
      if (val === undefined) return null;
      const res = schema.parse(val);
      return res.success ? null : res.errors[0].message;
    });
  }
}

export const PageSchema = TypeSchema.object<Page>({
  pageType: new TypeSchema<Page["pageType"]>((v: unknown) => {
    if (typeof v !== "string" || !(ALLOWED_PAGE_TYPES as readonly string[]).includes(v)) {
      throw new Error("Invalid page type");
    }
    return v as Page["pageType"];
  }),
  selector: new TypeSchema<Page["selector"]>((v: unknown) => {
    if (typeof v !== "string" || !(ALLOWED_PAGE_SELECTORS as readonly string[]).includes(v)) {
      throw new Error("Invalid selector");
    }
    return v as Page["selector"];
  }),
  position: new TypeSchema<Page["position"]>((v: unknown) => {
    if (typeof v !== "string" || !(ALLOWED_PAGE_POSITIONS as readonly string[]).includes(v)) {
      throw new Error("Invalid position");
    }
    return v as Page["position"];
  })
});

type ValidatedPublisher = Pick<Publisher,
"publisherId" | "aliasName" | "isActive" | "tags" | "allowedDomains" | "pages" |
"customCss" | "notes" | "publisherDashboard" | "monitorDashboard" | "qaStatusDashboard"
>;

const nonEmptyField = (field: string) => (value: string) => (value.trim() ? null : `${field} cannot be empty`);
const maxLength = (field: string, limit: number) => (value: string) => (value.length <= limit ? null : `${field} cannot exceed ${limit} characters`);
const requireSafeUrl = (field: string) => (value: string) => {
  if (!value) return null;
  return URL_PROTOCOL_REGEX.test(value) ? null : `${field} must start with http:// or https://`;
};

export const PublisherSchema = TypeSchema.object<ValidatedPublisher>({
  publisherId: TypeSchema.string()
    .refine(nonEmptyField("publisherId"))
    .refine((s) => SAFE_PUBLISHER_ID_REGEX.test(s) ? null : "publisherId can contain only letters, numbers, '-' or '_'")
    .refine(maxLength("publisherId", TEXT_LIMITS.publisherId)),
  aliasName: TypeSchema.string()
    .refine(nonEmptyField("aliasName"))
    .refine(maxLength("aliasName", TEXT_LIMITS.aliasName)),
  isActive: TypeSchema.boolean(),
  tags: TypeSchema.array(
    TypeSchema.string()
      .refine(maxLength("tags", TEXT_LIMITS.tag))
  ).refine((values) => hasDuplicateStrings(values) ? "Duplicate tags detected" : null),
  allowedDomains: TypeSchema.optional(TypeSchema.array(
    TypeSchema.string()
      .refine(maxLength("allowedDomains", TEXT_LIMITS.domain))
  )).refine((values) => {
    if (!values) return null;
    return hasDuplicateStrings(values) ? "Duplicate allowed domains detected" : null;
  }),
  pages: TypeSchema.array(PageSchema),
  customCss: TypeSchema.optional(TypeSchema.string()
    .refine(maxLength("customCss", TEXT_LIMITS.customCss))
    .refine((css) => hasBalancedCssBraces(css) ? null : "customCss has unbalanced braces")),
  notes: TypeSchema.optional(TypeSchema.string()
    .refine(maxLength("notes", TEXT_LIMITS.notes))),
  publisherDashboard: TypeSchema.optional(TypeSchema.string()
    .refine(maxLength("publisherDashboard", TEXT_LIMITS.url))
    .refine(requireSafeUrl("publisherDashboard"))),
  monitorDashboard: TypeSchema.optional(TypeSchema.string()
    .refine(maxLength("monitorDashboard", TEXT_LIMITS.url))
    .refine(requireSafeUrl("monitorDashboard"))),
  qaStatusDashboard: TypeSchema.optional(TypeSchema.string()
    .refine(maxLength("qaStatusDashboard", TEXT_LIMITS.url))
    .refine(requireSafeUrl("qaStatusDashboard")))
});

export function validatePublisher(p: unknown) {
  // Allow extra fields; validation only covers a strict subset
  const sanitized = sanitizePublisherDraft((p || {}) as Publisher);
  const res = PublisherSchema.parse(sanitized as Record<string, unknown>);
  if (res.success) return { isValid: true, errors: {} };
  const errMap: Record<string, string> = {};
  for (const e of res.errors) {
    errMap[e.path || "_"] = e.message;
  }
  return { isValid: false, errors: errMap };
}
/* eslint-enable no-unused-vars */
