import { validatePublisher } from "../utils/validator.js";
import type { Publisher, IStore, StoreSnapshot, Page } from "../types/index.js";

type Listener = (snapshot: StoreSnapshot) => void;

export class PublisherStore implements IStore {
  private currentData: Publisher | null = null;
  private originalData: Publisher | null = null;
  private touchedFields: Record<string, boolean> = {};
  private unknownKeys: Record<string, any> = {};
  private listeners = new Set<Listener>();
  private mode: "create" | "edit" = "edit";

  constructor(initial?: Publisher | null, mode: "create" | "edit" = "edit") {
    this.mode = mode;
    if (initial) this.load(initial);
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

    const knownKeys = [
      "id","created_date","updated_date","created_by",
      "publisherId","aliasName","isActive","tags",
      "publisherDashboard","monitorDashboard","qaStatusDashboard",
      "allowedDomains","customCss","notes","pages"
    ];

    const known: any = {};
    const unknown: any = {};
    Object.keys(data).forEach(k => {
      if (knownKeys.includes(k)) known[k] = (data as any)[k];
      else unknown[k] = (data as any)[k];
    });

    known.tags = known.tags || [];
    known.pages = known.pages || [];
    known.allowedDomains = known.allowedDomains || [];

    this.currentData = JSON.parse(JSON.stringify(known));
    this.originalData = JSON.parse(JSON.stringify(known));
    this.unknownKeys = unknown;
    this.touchedFields = {};
    this.notify();
  }

  initializeEmpty() {
    const empty: Publisher = {
      publisherId: "", aliasName: "", isActive: true, tags: [],
      publisherDashboard: "", monitorDashboard: "", qaStatusDashboard: "",
      allowedDomains: [], customCss: "", notes: "", pages: []
    };
    this.currentData = JSON.parse(JSON.stringify(empty));
    this.originalData = JSON.parse(JSON.stringify(empty));
    this.unknownKeys = {};
    this.touchedFields = {};
  }

  updateField(path: string, value: any) {
    if (!this.currentData) return;
    const next: any = { ...this.currentData };
    if (path.includes(".")) {
      const parts = path.split(/[.\[\]]/).filter(Boolean);
      let cur: any = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i].match(/^\d+$/) ? parseInt(parts[i]) : parts[i];
        if (cur[key] == null) cur[key] = typeof parts[i+1] === "number" ? [] : {};
        cur = cur[key];
      }
      const last = parts[parts.length - 1];
      const lk = last.match(/^\d+$/) ? parseInt(last) : last;
      cur[lk] = value;
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
    const getVal = (obj: any, p: string) => {
      if (p.includes(".")) {
        const parts = p.split(/[.\[\]]/).filter(Boolean);
        let curr: any = obj;
        for (const k of parts) {
          curr = curr?.[k.match(/^\d+$/) ? parseInt(k) : k];
        }
        return curr;
      }
      return obj[p];
    };
    const a = getVal(this.originalData, path);
    const b = getVal(this.currentData, path);
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  prepareForSave() {
    return { ...(this.currentData || {}), ...this.unknownKeys } as Publisher;
  }

  async save(payload: Publisher) {
      // Persist publisher file to server under data/publisher-<id>.json
      try {
        const id = (payload as any).publisherId || (payload as any).id;
        if (!id || typeof id !== "string" || !id.trim()) {
          throw new Error("Cannot save publisher without a publisherId");
        }

        const filename = `publisher-${id}.json`;

        // Save the publisher file
        await fetch(`/api/publisher/${filename}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload, null, 2)
        });

        // Update the publishers list (publishers.json) to include this publisher
        try {
          const listResp = await fetch("/api/publishers");
          if (listResp.ok) {
            const listData = await listResp.json();
            const publishers: any[] = Array.isArray(listData.publishers) ? listData.publishers.slice() : [];
            const existingIndex = publishers.findIndex((p: any) => p.id === id);
            const alias = (payload as any).aliasName || id;
            const entry = { id, alias, file: filename };
            if (existingIndex !== -1) publishers[existingIndex] = entry;
            else publishers.push(entry);

            await fetch("/api/publisher/publishers.json", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publishers }, null, 2)
            });
          }
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

  getSnapshot(): StoreSnapshot {
    return {
      currentData: this.currentData,
      originalData: this.originalData,
      touchedFields: this.touchedFields,
      unknownKeys: this.unknownKeys,
      validation: validatePublisher(this.currentData || {}),
      isDirty: this.checkDirty()
    };
  }
}

export function createStore(initial?: any, mode: "create" | "edit" = "edit") {
  // Normalize incoming data (PublisherData shape from API may differ)
  const normalize = (input: any): Publisher | null => {
    if (!input) return null;
    const pagesInput = Array.isArray(input.pages) ? input.pages : [];
    const pages: Page[] = pagesInput.map((p: any, i: number) => ({
      pageType: (p.pageType as any) || "article",
      selector: p.selector || "",
      position: p.position != null ? (typeof p.position === "string" ? parseInt(p.position, 10) || (i + 1) : p.position) : (i + 1)
    }));
    return {
      id: input.id,
      publisherId: input.publisherId || input.id || "",
      aliasName: input.aliasName || input.alias || "",
      isActive: input.isActive != null ? Boolean(input.isActive) : true,
      tags: input.tags || [],
      publisherDashboard: input.publisherDashboard,
      monitorDashboard: input.monitorDashboard,
      qaStatusDashboard: input.qaStatusDashboard,
      allowedDomains: input.allowedDomains || [],
      customCss: input.customCss,
      notes: input.notes,
      pages,
      created_date: input.created_date,
      updated_date: input.updated_date,
      created_by: input.created_by,
      updatedAt: input.updatedAt
    } as Publisher;
  };

  return new PublisherStore(normalize(initial), mode);
}

export default PublisherStore;
