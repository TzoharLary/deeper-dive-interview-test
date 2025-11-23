import { Publisher, Page } from "../types";

// Mini-Zod: Lightweight chainable runtime validator
export type ValidationError = { path: string; message: string };

type CheckFn<T> = (value: T) => string | null;

export class TypeSchema<T> {
  private checks: CheckFn<T>[] = [];

  constructor(private readonly _parse?: (v: any) => T) {}

  parse(v: any): { success: true; data: T } | { success: false; errors: ValidationError[] } {
    try {
      const value = this._parse ? this._parse(v) : (v as T);
      const errors: ValidationError[] = [];
      this.checks.forEach((ck) => {
        const msg = ck(value);
        if (msg) errors.push({ path: "", message: msg });
      });
      return errors.length ? { success: false, errors } : { success: true, data: value };
    } catch (e: any) {
      return { success: false, errors: [{ path: "", message: e?.message || String(e) }] };
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

  static array<U>(itemSchema?: TypeSchema<U>): TypeSchema<any[]> {
    return new TypeSchema<any[]>((v) => {
      if (!Array.isArray(v)) throw new Error("Expected array");
      return v;
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

  static object<U extends Record<string, any>>(shape: { [K in keyof U]: TypeSchema<U[K]> }): TypeSchema<U> {
    return new TypeSchema<U>((v) => {
      if (typeof v !== "object" || v === null || Array.isArray(v)) throw new Error("Expected object");
      return v as U;
    }).refine((obj) => {
      for (const key of Object.keys(shape)) {
        const schema = shape[key as keyof U];
        const res = schema.parse((obj as any)[key]);
        if (res.success === false) return `Invalid field '${key}': ${res.errors[0].message}`;
      }
      return null;
    });
  }
}

export const PageSchema = TypeSchema.object<Page>({
  pageType: TypeSchema.string().refine(s => ["article", "homepage", "section"].includes(s) ? null : "Invalid page type") as any,
  selector: TypeSchema.string(),
  position: TypeSchema.number()
});

export const PublisherSchema = TypeSchema.object<Publisher>({
  publisherId: TypeSchema.string().refine(s => (s.trim() ? null : "publisherId cannot be empty")),
  aliasName: TypeSchema.string().refine(s => (s.trim() ? null : "aliasName cannot be empty")),
  isActive: TypeSchema.boolean(),
  tags: TypeSchema.array(TypeSchema.string()),
  allowedDomains: TypeSchema.array(TypeSchema.string()),
  // optional fields omitted from strict schema to allow undefined values
  pages: TypeSchema.array(PageSchema)
} as any);

export function validatePublisher(p: any) {
  const res = PublisherSchema.parse(p);
  if (res.success) return { isValid: true, errors: {} };
  const errMap: Record<string, string> = {};
  res.errors.forEach(e => { errMap[e.path || "_"] = e.message; });
  return { isValid: false, errors: errMap };
}
