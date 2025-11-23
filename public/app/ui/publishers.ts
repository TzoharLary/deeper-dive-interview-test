// Minimal orchestrator for publishers page.
// Previous procedural implementation was removed to enable a modular component approach.
// This file now mounts the sidebar and an editor container; component-specific logic
// (general info, pages, links/resources, advanced settings, missing fields, save bar)
// will live inside dedicated component files.

import { createStore } from "../state/store.js";
import type { Publisher, IStore } from "../types/index.js";
import { fetchPublishers, fetchPublisher, PublisherListItem, PublisherData } from "../data/api.js";
import { renderSidebar } from "./sidebar.js";
import { EnhancedEditor } from "./components/EnhancedEditor.js";

const store: IStore = createStore(null, "edit");
let editorInstance: EnhancedEditor | null = null;
type SidebarEntry = PublisherListItem | PublisherData;
let publishersCache: SidebarEntry[] = [];

interface PublishersPageOptions {
  initialPublisherId?: string;
}

export async function renderPublishersPage(container: HTMLElement, options?: PublishersPageOptions) {
  container.innerHTML = "";
  container.className = "publishers-page";

  const layout = document.createElement("div");
  layout.className = "publishers-layout";

  const sidebar = document.createElement("div");
  sidebar.className = "publishers-sidebar";

  const details = document.createElement("div");
  details.className = "publisher-details";

  layout.appendChild(sidebar);
  layout.appendChild(details);
  container.appendChild(layout);

  // Load list
  try {
    publishersCache = await fetchPublishers();
  } catch (e) {
    console.error("Failed to fetch publishers", e);
    publishersCache = [];
  }

  // Render sidebar with current store (sidebar manages store.load on selection)
  await renderSidebar(sidebar, store);

  if (options?.initialPublisherId) {
    await preselectPublisherById(options.initialPublisherId);
  }

  // Mount initial editor state (will render populated data if store already loaded)
  mountEditor(details);

  // React to store changes to (re)mount editor
  store.subscribe(snap => {
    // If there is no current publisher data show empty state
    if (!snap.currentData) {
      if (editorInstance) {
        editorInstance.unmount();
        editorInstance = null;
      }
      details.innerHTML = emptyStateHtml();
      return;
    }
    
    // Only mount if not already mounted. 
    // If already mounted, the components inside are subscribed to the store 
    // and will update themselves without losing focus.
    if (!editorInstance) {
      mountEditor(details);
    }
  });

  // Listen for saved event to refresh sidebar list
  window.addEventListener("publisher:saved", async () => {
    try {
      publishersCache = await fetchPublishers();
      await renderSidebar(sidebar, store);
    } catch (e) {
      console.error("Failed to refresh publishers after save", e);
    }
  });
}

function mountEditor(container: HTMLElement) {
  if (editorInstance) {
    editorInstance.unmount();
    editorInstance = null;
  }
  const snap = store.getSnapshot();
  if (!snap.currentData) {
    container.innerHTML = emptyStateHtml();
    return;
  }
  const editorHost = document.createElement("div");
  container.innerHTML = "";
  container.appendChild(editorHost);
  editorInstance = new EnhancedEditor(editorHost, { store });
  editorInstance.mount();
}

export async function loadPublisher(item: SidebarEntry) {
  try {
    const isListItem = (item as PublisherListItem).file !== undefined;
    const full = isListItem ? await fetchPublisher((item as PublisherListItem).file) : item;
    if (full) store.load(full as unknown as Publisher);
  } catch (e) {
    console.error("Failed to load publisher", e);
  }
}

async function preselectPublisherById(publisherId: string) {
  const match = publishersCache.find((entry) => {
    if (isPublisherListItem(entry)) {
      return entry.id === publisherId;
    }
    return entry.publisherId === publisherId;
  });

  if (match) {
    await loadPublisher(match);
  }
}

function isPublisherListItem(entry: SidebarEntry): entry is PublisherListItem {
  return Boolean((entry as PublisherListItem).file && (entry as PublisherListItem).id);
}

function emptyStateHtml() {
  return `
    <div class="details-content">
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:340px;color:#64748b;text-align:center;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:16px;opacity:.5;">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <h3 style="margin:0 0 8px;font-size:18px;font-weight:500;">Select a Publisher</h3>
        <p style="margin:0;font-size:14px;">Choose a publisher from the list to view and edit.</p>
      </div>
    </div>`;
}

// Convenience for tests / other modules
export function getPublishersCache() { return publishersCache; }