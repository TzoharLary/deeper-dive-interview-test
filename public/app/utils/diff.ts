import type { Publisher } from "../types/index.js";

export type DiffKind = "added" | "removed" | "changed";

export interface DiffEntry {
  path: string;
  kind: DiffKind;
  before?: unknown;
  after?: unknown;
}

export function diffPublishers(before: Publisher | null | undefined, after: Publisher | null | undefined): DiffEntry[] {
  return diffValues(before ?? {}, after ?? {}, "");
}

function diffValues(before: unknown, after: unknown, path: string): DiffEntry[] {
  if (before === after) {
    return [];
  }

  const beforeIsArray = Array.isArray(before);
  const afterIsArray = Array.isArray(after);

  if (beforeIsArray && afterIsArray) {
    return diffArrays(before as unknown[], after as unknown[], path);
  }

  if (isPlainObject(before) && isPlainObject(after)) {
    return diffObjects(before as Record<string, unknown>, after as Record<string, unknown>, path);
  }

  if (before === undefined) {
    return [{ path: path || "(root)", kind: "added", after }];
  }

  if (after === undefined) {
    return [{ path: path || "(root)", kind: "removed", before }];
  }

  return [{ path: path || "(root)", kind: "changed", before, after }];
}

function diffArrays(before: unknown[], after: unknown[], path: string): DiffEntry[] {
  const max = Math.max(before.length, after.length);
  const entries: DiffEntry[] = [];

  for (let i = 0; i < max; i++) {
    const childPath = path ? `${path}[${i}]` : `[${i}]`;
    if (i >= before.length) {
      entries.push({ path: childPath, kind: "added", after: after[i] });
    } else if (i >= after.length) {
      entries.push({ path: childPath, kind: "removed", before: before[i] });
    } else {
      entries.push(...diffValues(before[i], after[i], childPath));
    }
  }

  return entries;
}

function diffObjects(before: Record<string, unknown>, after: Record<string, unknown>, path: string): DiffEntry[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const entries: DiffEntry[] = [];

  keys.forEach((key) => {
    const childPath = path ? `${path}.${key}` : key;
    if (!(key in after)) {
      entries.push({ path: childPath, kind: "removed", before: before[key] });
      return;
    }
    if (!(key in before)) {
      entries.push({ path: childPath, kind: "added", after: after[key] });
      return;
    }
    entries.push(...diffValues(before[key], after[key], childPath));
  });

  return entries;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
