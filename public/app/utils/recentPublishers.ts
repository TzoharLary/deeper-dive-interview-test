export interface RecentPublisherEntry {
  publisherId: string;
  aliasName: string;
  timestamp: number;
}

const STORAGE_KEY = "publisherRecentEdits";
const MAX_RECENT = 5;

function safeWindow(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

function readEntries(): RecentPublisherEntry[] {
  const win = safeWindow();
  if (!win) return [];
  try {
    const raw = win.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentPublisherEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => typeof entry?.publisherId === "string" && typeof entry?.timestamp === "number");
  } catch (e) {
    console.warn("Failed to read recent publishers:", e);
    return [];
  }
}

function writeEntries(entries: RecentPublisherEntry[]) {
  const win = safeWindow();
  if (!win) return;
  try {
    win.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("Failed to persist recent publishers:", e);
  }
}

export function recordRecentPublisher(publisherId: string, aliasName: string) {
  if (!publisherId) return;
  const existing = readEntries().filter((entry) => entry.publisherId !== publisherId);
  const next: RecentPublisherEntry[] = [
    { publisherId, aliasName, timestamp: Date.now() },
    ...existing
  ].slice(0, MAX_RECENT);
  writeEntries(next);
}

export function removeRecentPublisher(publisherId: string) {
  if (!publisherId) return;
  const filtered = readEntries().filter((entry) => entry.publisherId !== publisherId);
  writeEntries(filtered);
}

export function getRecentPublishers(limit = MAX_RECENT): RecentPublisherEntry[] {
  return readEntries().slice(0, limit);
}