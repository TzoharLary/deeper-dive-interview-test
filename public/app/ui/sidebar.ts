import { createElement, renderList } from "./renderers.js";
import type { Publisher, IStore, StoreSnapshot } from "../types/index.js";
import { fetchPublisher, fetchPublishers, PublisherListItem, PublisherData } from "../data/api.js";
import { normalizePublisherInput } from "../state/store.js";

type SidebarItem = PublisherListItem | PublisherData;

function isListItem(item: SidebarItem): item is PublisherListItem {
  return (item as PublisherListItem).file !== undefined && (item as PublisherListItem).id !== undefined && (item as PublisherListItem).alias !== undefined;
}

const publisherDetailCache = new Map<string, Publisher>();
let saveListenerRegistered = false;

function cacheKeyFromFile(file?: string) {
  return file ? `file:${file}` : null;
}

function cacheKeyFromPublisherId(id?: string) {
  return id ? `publisher:${id}` : null;
}

function clonePublisher(data: Publisher) {
  return JSON.parse(JSON.stringify(data));
}

export async function renderSidebar(container: HTMLElement, store: IStore) {
  // Clear container
  container.innerHTML = "";
  container.className = "publisher-sidebar";

  const header = createElement("div", "publisher-header");
  const title = createElement("h2", "publisher-title");
  title.textContent = "Publishers";
  header.appendChild(title);

  const createBtn = createElement("button", "new-publisher-btn");
  createBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    <span>New</span>
  `;
  createBtn.addEventListener("click", () => {
    store.startCreate();
  });
  header.appendChild(createBtn);
  container.appendChild(header);

  const searchWrap = createElement("div", "publisher-search-wrapper");
  const searchBoxWrap = createElement("div", "publisher-search-box");
  const searchIcon = createElement("div", "publisher-search-icon");
  searchIcon.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line></svg>";
  
  const input = createElement("input", "publisher-search-input");
  (input as HTMLInputElement).placeholder = "Filter publishers...";
  
  searchBoxWrap.appendChild(searchIcon);
  searchBoxWrap.appendChild(input);
  searchWrap.appendChild(searchBoxWrap);
  container.appendChild(searchWrap);

  const listWrap = createElement("div", "publisher-list-wrapper");
  container.appendChild(listWrap);

  // load publishers and render
  const pubs: SidebarItem[] = await fetchPublishers();

  function renderItems(publishers: SidebarItem[]) {
    return renderList<SidebarItem>(listWrap, publishers, (p) => (isListItem(p) ? p.id : (p.publisherId)), (p, existing) => {
      if (existing) {
        const alias = existing.querySelector("[data-alias]") as HTMLElement;
        const idEl = existing.querySelector("[data-id]") as HTMLElement;
        if (alias) alias.textContent = (isListItem(p) ? p.alias : (p.aliasName || p.publisherId)) || "Untitled Publisher";
        if (idEl) idEl.textContent = (isListItem(p) ? p.id : (p.publisherId || ""));
        return existing;
      }

      const btn = createElement("button", "publisher-item");

      const left = createElement("div", "publisher-info");
      const aliasEl = createElement("div", "publisher-alias");
      aliasEl.setAttribute("data-alias", "true");
      aliasEl.textContent = (isListItem(p) ? p.alias : (p.aliasName || p.publisherId)) || "Untitled Publisher";

      const idLine = createElement("div", "publisher-id");
      idLine.setAttribute("data-id", "true");
      idLine.textContent = (isListItem(p) ? p.id : (p.publisherId || ""));

      left.appendChild(aliasEl);
      left.appendChild(idLine);
      btn.appendChild(left);

      const active = !isListItem(p) && !!p.isActive;
      const dot = createElement("div", `status-dot ${active ? "active" : "inactive"}`);
      btn.appendChild(dot);

      btn.addEventListener("click", async () => {
        const fileKey = isListItem(p) ? cacheKeyFromFile(p.file) : null;
        const publisherKey = !isListItem(p) ? cacheKeyFromPublisherId((p as PublisherData).publisherId) : null;
        try {
          const cachedKey = fileKey || publisherKey;
          if (cachedKey) {
            const cached = publisherDetailCache.get(cachedKey);
            if (cached) {
              store.load(clonePublisher(cached));
              return;
            }
          }

          if (isListItem(p)) {
            const file = p.file;
            const data = await fetchPublisher(file);
            if (data) {
              const normalized = normalizePublisherInput(data);
              if (normalized) {
                store.load(normalized);
                const keys = [cacheKeyFromFile(file), cacheKeyFromPublisherId(data.publisherId)];
                keys.forEach(key => { if (key) publisherDetailCache.set(key, clonePublisher(normalized)); });
              }
            }
          } else {
            const normalized = normalizePublisherInput(p);
            if (normalized) {
              store.load(normalized);
              const key = cacheKeyFromPublisherId(p.publisherId);
              if (key) publisherDetailCache.set(key, clonePublisher(normalized));
            }
          }
        } catch (e) {
          console.error("Failed to load publisher:", e);
        }
      });

      return btn;
    });
  }

  // Initial render
  renderItems(pubs);

  // basic search filter
  input.addEventListener("input", (e) => {
    const v = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = pubs.filter(p => {
      const name = isListItem(p) ? p.alias : (p.aliasName || p.publisherId || "");
      const pid = isListItem(p) ? p.id : (p.publisherId || "");
      const tags = !isListItem(p) ? (p.tags || []) : [];
      return name.toLowerCase().includes(v) || pid.toLowerCase().includes(v) || tags.some(t => t.toLowerCase().includes(v));
    });
    renderItems(filtered);
  });

  // Subscribe to store to show dirty indicator next to active publisher
  store.subscribe((snap: StoreSnapshot) => {
    const currentId = snap.currentData?.publisherId;
    const isDirty = snap.isDirty;
    Array.from(listWrap.children).forEach((child) => {
      const idEl = (child as HTMLElement).querySelector("[data-id]") as HTMLElement | null;
      const btn = child as HTMLElement;
      
      if (idEl) {
        const pid = idEl.textContent || "";
        const isActive = pid === currentId;
        
        // Active state styling
        if (isActive) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }

        // Dirty indicator
        let amber = btn.querySelector(".dirty-dot") as HTMLElement | null;
        if (isActive && isDirty) {
          if (!amber) {
            amber = createElement("div", "dirty-dot");
            amber.setAttribute("title", "Unsaved changes");
            btn.appendChild(amber);
          }
        } else {
          if (amber) amber.remove();
        }
      }
    });
  });

  if (!saveListenerRegistered) {
    window.addEventListener("publisher:saved", () => {
      const latest = store.getSnapshot().currentData;
      if (!latest) return;
      const keys = [cacheKeyFromPublisherId(latest.publisherId)];
      keys.forEach((key) => { if (key) publisherDetailCache.set(key, clonePublisher(latest)); });
    });
    saveListenerRegistered = true;
  }
}