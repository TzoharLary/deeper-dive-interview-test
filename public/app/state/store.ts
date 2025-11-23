/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { validatePublisher } from "../utils/validator.js";
import { savePublisher, updatePublishersList, deletePublisher, PublisherData } from "../data/api.js";
import type { Publisher, IStore, StoreSnapshot, Page } from "../types/index.js";

// Param name underscored to avoid unused-vars lint noise in type signature
type Listener = (_snap: StoreSnapshot) => void;

export class PublisherStore implements IStore {
  private currentData: Publisher | null = null;
  private originalData: Publisher | null = null;
  private touchedFields: Record<string, boolean> = {};
  private unknownKeys: Record<string, unknown> = {};
  private listeners = new Set<Listener>();
  private mode: "create" | "edit" = "edit";

  constructor(initial?: Publisher | PublisherData | Record<string, unknown> | null, mode: "create" | "edit" = "edit") {
    this.mode = mode;
    const normalized = normalizePublisherInput(initial ?? null);
    if (normalized) this.load(normalized);
    else if (mode === "create") this.initializeEmpty();
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach(fn => fn(snap));
  }

  load(data: Publisher | null) {
    if (!data && this.mode === "create") {
      this.initializeEmpty();
      this.notify();
      return;
    }
    if (!data) {
      this.currentData = null;
      this.originalData = null;
      this.unknownKeys = {};
      this.touchedFields = {};
      this.notify();
      return;
    }

    this.mode = "edit";

    const knownKeys = [
      "id","created_date","updated_date","created_by",
      "publisherId","aliasName","isActive","tags",
      "publisherDashboard","monitorDashboard","qaStatusDashboard",
      "allowedDomains","customCss","notes","pages"
    ];

    const known: Record<string, unknown> = {};
    const unknown: Record<string, unknown> = {};
    for (const k of Object.keys(data)) {
      const value = (data as any)[k];
      if (knownKeys.includes(k)) {
        known[k] = value;
      } else {
        unknown[k] = value;
      }
    }

    known.tags = known.tags || [];
    known.pages = known.pages || [];
    known.allowedDomains = known.allowedDomains || [];

    this.currentData = JSON.parse(JSON.stringify(known));
    this.originalData = JSON.parse(JSON.stringify(known));
    this.unknownKeys = unknown;
    this.touchedFields = {};
    this.notify();
  }

  // Local dynamic path reader (localized 'any' usage acceptable internally)
  private dynamicGet(obj: Publisher | null, path: string): unknown {
    if (!obj) return undefined;
    if (!path.includes(".")) return (obj as any)[path];
        const parts = path.split(/[.[\]]/).filter(Boolean);
    let cur: any = obj;
    for (const segment of parts) {
      const key = segment.match(/^\d+$/) ? parseInt(segment, 10) : segment;
      cur = cur?.[key];
      if (cur == null) return cur;
    }
    return cur;
  }

  initializeEmpty(overrides: Partial<Publisher> = {}) {
    const empty: Publisher = {
      publisherId: "", aliasName: "", isActive: true, tags: [],
      publisherDashboard: "", monitorDashboard: "", qaStatusDashboard: "",
      allowedDomains: [], customCss: "", notes: "", pages: [],
      ...overrides
    };
    this.currentData = JSON.parse(JSON.stringify(empty));
    this.originalData = JSON.parse(JSON.stringify(empty));
    this.unknownKeys = {};
    this.touchedFields = {};
  }

  startCreate(overrides?: Partial<Publisher>) {
    this.mode = "create";
    this.initializeEmpty(overrides);
    this.notify();
  }

  updateField(path: string, value: unknown) {
    if (!this.currentData) return;
    const next = JSON.parse(JSON.stringify(this.currentData)) as Publisher;
    if (path.includes(".")) {
      // Preserve original dynamic path behavior with localized 'any' for deep mutation
          const parts = path.split(/[.[\]]/).filter(Boolean);
      let cur: any = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const raw = parts[i];
        const key = raw.match(/^\d+$/) ? parseInt(raw, 10) : raw;
        if (cur[key] == null) cur[key] = parts[i + 1]?.match(/^\d+$/) ? [] : {};
        cur = cur[key];
      }
      const lastRaw = parts[parts.length - 1];
      const lastKey = lastRaw.match(/^\d+$/) ? parseInt(lastRaw, 10) : lastRaw;
      cur[lastKey] = value;
    } else {
      (next as any)[path] = value;
    }
    this.currentData = next;
    this.notify();
  }

  markTouched(path: string) {
    this.touchedFields = { ...this.touchedFields, [path]: true };
    this.notify();
  }

  addPage(type: string = "article") {
    if (!this.currentData) return;
    const selector = type === "article" ? ".main-content" : type === "homepage" ? "main" : "";
    const newPage = { pageType: type, selector, position: (this.currentData.pages?.length || 0) + 1 };
    const pages = [...(this.currentData.pages || []), newPage];
    this.updateField("pages", pages);
  }

  movePage(from: number, to: number) {
    if (!this.currentData?.pages) return;
    const arr = this.currentData.pages.slice();
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    const updated = arr.map((p, i) => ({ ...p, position: i + 1 }));
    this.updateField("pages", updated);
  }

  removePage(index: number) {
    if (!this.currentData?.pages) return;
    const arr = this.currentData.pages.slice();
    arr.splice(index, 1);
    this.updateField("pages", arr.map((p, i) => ({ ...p, position: i + 1 })));
  }

  checkDirty() {
    return JSON.stringify(this.originalData) !== JSON.stringify(this.currentData);
  }

  isFieldModified(path: string) {
    if (!this.originalData || !this.currentData) return false;
    const a = this.dynamicGet(this.originalData, path);
    const b = this.dynamicGet(this.currentData, path);
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  prepareForSave() {
    return { ...(this.currentData || {}), ...this.unknownKeys } as Publisher;
  }

  async save(payload: Publisher) {
      // Persist publisher file to server under data/publisher-<id>.json
      try {
        const id = payload.publisherId || payload.id;
        if (!id || typeof id !== "string" || !id.trim()) {
          throw new Error("Cannot save publisher without a publisherId");
        }

        const filename = `publisher-${id}.json`;

        // Save the publisher file using shared API helpers
        // Transform pages position (number -> string) to satisfy PublisherData shape
        const persistence: PublisherData = {
          publisherId: payload.publisherId,
          aliasName: payload.aliasName,
          pages: (payload.pages || []).map(p => ({ pageType: p.pageType, selector: p.selector, position: String(p.position) })),
          publisherDashboard: payload.publisherDashboard,
          monitorDashboard: payload.monitorDashboard,
          qaStatusDashboard: payload.qaStatusDashboard,
          isActive: payload.isActive,
          customCss: payload.customCss,
          tags: payload.tags,
          allowedDomains: payload.allowedDomains,
          notes: payload.notes
        };
        await savePublisher(filename, persistence);

        // Update the publishers list (publishers.json) to include this publisher
        try {
          const alias = payload.aliasName || id;
          await updatePublishersList(id, alias, filename);
        } catch (e) {
          // Non-fatal: publisher file was saved, but updating the list failed
          console.warn("Failed to update publishers list:", e);
        }

        // Notify other parts of the UI that a publisher was saved so they can refresh lists
        try {
          const ev = new CustomEvent("publisher:saved", { detail: { id } });
          window.dispatchEvent(ev as Event);
        } catch (e) {
          // ignore
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
  }

  async delete() {
    if (!this.currentData) return;
    const id = this.currentData.publisherId || this.currentData.id;
    if (!id) return;
    
    try {
      await deletePublisher(id);
      // Notify UI
      const ev = new CustomEvent("publisher:deleted", { detail: { id } });
      window.dispatchEvent(ev as Event);
    } catch (e) {
      console.error("Failed to delete publisher:", e);
      throw e;
    }
  }

  getSnapshot(): StoreSnapshot {
    return {
      currentData: this.currentData,
      originalData: this.originalData,
      touchedFields: this.touchedFields,
      unknownKeys: this.unknownKeys,
      validation: validatePublisher(this.currentData || {}),
      isDirty: this.checkDirty(),
      mode: this.mode
    };
  }
}

export function createStore(initial?: Publisher | PublisherData | Record<string, unknown> | null, mode: "create" | "edit" = "edit") {
  const normalized = normalizePublisherInput(initial ?? null);
  return new PublisherStore(normalized, mode);
}

// Local helper for dynamic path reads (kept private, small scoped 'any' acceptable here)
export default PublisherStore;
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-explicit-any */

export function normalizePublisherInput(input: Publisher | PublisherData | Record<string, unknown> | null): Publisher | null {
  if (!input) return null;
  const raw: Record<string, unknown> = input as Record<string, unknown>;
  const pagesRaw = Array.isArray(raw.pages) ? raw.pages : [];
  const pages: Page[] = pagesRaw.map((p, i) => {
    const obj = p as Record<string, unknown>;
    const pageTypeVal = typeof obj.pageType === "string" ? obj.pageType : "article";
    const selectorVal = typeof obj.selector === "string" ? obj.selector : "";
    const rawPos = obj.position;
    const positionVal = typeof rawPos === "number" ? rawPos :
      (typeof rawPos === "string" ? (parseInt(rawPos, 10) || (i + 1)) : (i + 1));
    return { pageType: pageTypeVal as Page["pageType"], selector: selectorVal, position: positionVal };
  });
  return {
    id: (raw.id as string | undefined),
    publisherId: typeof raw.publisherId === "string" ? raw.publisherId : (typeof raw.id === "string" ? raw.id : ""),
    aliasName: typeof raw.aliasName === "string" ? raw.aliasName : (typeof raw.alias === "string" ? raw.alias : ""),
    isActive: raw.isActive != null ? Boolean(raw.isActive) : true,
    tags: Array.isArray(raw.tags) ? raw.tags as string[] : [],
    publisherDashboard: typeof raw.publisherDashboard === "string" ? raw.publisherDashboard : undefined,
    monitorDashboard: typeof raw.monitorDashboard === "string" ? raw.monitorDashboard : undefined,
    qaStatusDashboard: typeof raw.qaStatusDashboard === "string" ? raw.qaStatusDashboard : undefined,
    allowedDomains: Array.isArray(raw.allowedDomains) ? raw.allowedDomains as string[] : [],
    customCss: typeof raw.customCss === "string" ? raw.customCss : undefined,
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
    pages,
    created_date: typeof raw.created_date === "string" ? raw.created_date : undefined,
    updated_date: typeof raw.updated_date === "string" ? raw.updated_date : undefined,
    created_by: typeof raw.created_by === "string" ? raw.created_by : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined
  } as Publisher;
}
