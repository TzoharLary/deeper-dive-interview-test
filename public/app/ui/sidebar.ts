import { createElement, renderList } from "./renderers.js";
import type { Publisher } from "../types/index.js";
import { fetchPublisher, fetchPublishers } from "../data/api.js";

export async function renderSidebar(container: HTMLElement, store: any) {
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
    // create a new empty publisher and load into store
    const newPub: Publisher = {
      publisherId: `new-${Date.now()}`,
      aliasName: "",
      isActive: true,
      tags: [],
      publisherDashboard: "",
      monitorDashboard: "",
      qaStatusDashboard: "",
      allowedDomains: [],
      customCss: "",
      notes: "",
      pages: []
    };
    store.load(newPub);
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
  const pubs: any[] = await fetchPublishers();

  function renderItems(publishers: any[]) {
    return renderList<any>(listWrap, publishers, (p) => p.publisherId || p.id, (p, existing) => {
      if (existing) {
        const alias = existing.querySelector("[data-alias]") as HTMLElement;
        const idEl = existing.querySelector("[data-id]") as HTMLElement;
        if (alias) alias.textContent = (p.aliasName || p.alias || p.publisherId || p.id) || "Untitled Publisher";
        if (idEl) idEl.textContent = (p.publisherId || p.id) || "";
        return existing;
      }

      const btn = createElement("button", "publisher-item");

      const left = createElement("div", "publisher-info");
      const aliasEl = createElement("div", "publisher-alias");
      aliasEl.setAttribute("data-alias", "true");
      aliasEl.textContent = (p.aliasName || p.alias || p.publisherId || p.id) || "Untitled Publisher";

      const idLine = createElement("div", "publisher-id");
      idLine.setAttribute("data-id", "true");
      idLine.textContent = (p.publisherId || p.id) || "";

      left.appendChild(aliasEl);
      left.appendChild(idLine);
      btn.appendChild(left);

      const dot = createElement("div", `status-dot ${p.isActive ? "active" : "inactive"}`);
      btn.appendChild(dot);

      btn.addEventListener("click", async () => {
        try {
          const file = (p as any).file || `publisher-${(p as any).publisherId || (p as any).id}.json`;
          const data = await fetchPublisher(file);
          if (data) store.load(data);
        } catch (e) {
          console.error('Failed to load publisher:', e);
        }
      });

      return btn;
    });
  }


  // basic search filter
  input.addEventListener("input", (e) => {
    const v = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = pubs.filter(p => ((p.aliasName || p.alias || "").toLowerCase().includes(v) || (p.publisherId || p.id || "").toLowerCase().includes(v) || (p.tags || []).some((t: string) => t.toLowerCase().includes(v))));
    renderItems(filtered);
  });

  // Subscribe to store to show dirty indicator next to active publisher
  store.subscribe((snap: any) => {
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
}