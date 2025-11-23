import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot, Page } from "../../types/index.js";
import {
  ALLOWED_PAGE_POSITIONS,
  ALLOWED_PAGE_SELECTORS,
  ALLOWED_PAGE_TYPES
} from "../../constants/pageRules.js";

interface PageListProps {
  store: IStore;
}

interface PageListState {
  snapshot: StoreSnapshot;
}

export class PageList extends Component<PageListProps, PageListState> {
  private unsubscribe: (() => void) | null = null;
  private listContainer: HTMLElement | null = null;

  protected getInitialState(): PageListState {
    return { snapshot: this.props.store.getSnapshot() };
  }

  protected onMount() {
    this.unsubscribe = this.props.store.subscribe((snap) => {
      this.setState({ snapshot: snap });
    });
  }

  protected onUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    this.container.innerHTML = "";
    this.container.className = "section-fieldset";

    const legend = document.createElement("legend");
    legend.style.display = "flex";
    legend.style.justifyContent = "space-between";
    legend.style.alignItems = "center";
    legend.style.width = "100%";
    
    const title = document.createElement("div");
    title.style.display = "flex";
    title.style.alignItems = "center";
    title.style.gap = "8px";
    title.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
      Page Configurations
    `;
    legend.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "header-actions";
    
    const addArticle = this.createBtn("+ Add Article Page", "add-btn", () => this.props.store.addPage("article"));
    const addHome = this.createBtn("+ Add Home Page", "add-btn", () => this.props.store.addPage("homepage"));
    
    actions.appendChild(addArticle);
    actions.appendChild(addHome);
    legend.appendChild(actions);
    
    this.container.appendChild(legend);

    this.listContainer = document.createElement("div");
    this.listContainer.className = "page-configs";
    this.listContainer.style.border = "none"; // Remove border from container as cards have borders
    this.container.appendChild(this.listContainer);

    this.update();
  }

  protected update() {
    if (!this.listContainer) return;
    const { currentData } = this.state.snapshot;
    const pages = currentData?.pages || [];

    // If empty, show empty state
    if (pages.length === 0) {
      if (this.listContainer.children.length !== 1 || !this.listContainer.querySelector(".empty-state")) {
        this.listContainer.innerHTML = `
          <div class="empty-state">
            <div style="margin-bottom:8px">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-text-muted)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            </div>
            <h4 style="margin:0;font-size:14px;font-weight:600;color:var(--color-text-primary)">No pages configured</h4>
            <p style="margin:4px 0 0;font-size:13px;color:var(--color-text-secondary)">Add a page configuration to start tracking content on specific URLs.</p>
          </div>
        `;
      }
      return;
    }

    // If row count changed, full rebuild (simplest way to handle add/remove)
    // We check if the first child is empty-state, if so we need rebuild too
    const existingRows = this.listContainer.querySelectorAll(".page-card");
    if (existingRows.length !== pages.length) {
      this.listContainer.innerHTML = "";
      pages.forEach((page, idx) => {
        this.listContainer?.appendChild(this.createRow(page, idx));
      });
      return;
    }

    // Smart update: sync values
    pages.forEach((page, idx) => {
      const row = existingRows[idx] as HTMLElement;
      if (!row) return;

      // Update Type
      const typeSelect = row.querySelector(".page-type-select") as HTMLSelectElement;
      if (typeSelect && typeSelect.value !== page.pageType) {
        typeSelect.value = page.pageType;
      }

      // Update Selector
      const selectorSelect = row.querySelector(".page-selector-select") as HTMLSelectElement;
      if (selectorSelect && selectorSelect.value !== page.selector) {
        selectorSelect.value = page.selector;
      }

      // Update Position
      const positionSelect = row.querySelector(".page-pos-select") as HTMLSelectElement;
      if (positionSelect && positionSelect.value !== page.position) {
        positionSelect.value = page.position;
      }
      
      // Update Delete Button Index (closure capture in createRow is stale, but we rely on index in loop? 
      // Actually createRow uses closure 'idx'. If we don't rebuild, the click handler uses OLD idx.
      // This is a problem if we reorder. But here we only update values.
      // If we reorder, the array changes order, but length might be same.
      // If we swap items, 'pages' order changes.
      // If we rely on closure 'idx', we MUST rebuild if order changes?
      // Or we can update the click handler?
      // For now, let's assume simple edits. If we implement drag/drop reorder later, we need full rebuild or better logic.
      // But wait, if I delete item 0, length changes -> rebuild. Correct.
      // If I just type in item 0, length same -> update. Correct.
      // So closure 'idx' is fine because it matches the row index which doesn't change for *that row element* unless we move it.
      // Actually, if we swap, row 0 becomes row 1's data. The closure 'idx' 0 still refers to index 0.
      // So clicking delete on row 0 (now showing data B) will delete index 0 (Data B). Correct.
    });
  }

  private createBtn(text: string, classes: string, onClick: () => void) {
    const btn = document.createElement("button");
    btn.className = classes;
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
  }

  private createRow(page: Page, idx: number) {
    const row = document.createElement("div");
    row.className = "config-row page-card"; 
    row.setAttribute("data-index", String(idx));
    
    // Drag Handle
    const handle = document.createElement("div");
    handle.className = "drag-handle";
    handle.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"12\" r=\"1\"></circle><circle cx=\"9\" cy=\"5\" r=\"1\"></circle><circle cx=\"9\" cy=\"19\" r=\"1\"></circle><circle cx=\"15\" cy=\"12\" r=\"1\"></circle><circle cx=\"15\" cy=\"5\" r=\"1\"></circle><circle cx=\"15\" cy=\"19\" r=\"1\"></circle></svg>";
    row.appendChild(handle);

    // Type Select
    const typeWrap = document.createElement("div");
    typeWrap.className = "config-field";
    typeWrap.style.flex = "0 0 140px";
    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Type";
    
    const select = document.createElement("select");
    select.className = "page-type-select";
    ALLOWED_PAGE_TYPES.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      select.appendChild(o);
    });
    select.value = page.pageType;
    select.addEventListener("change", () => {
      const rawType = select.value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nextType = rawType as any; 
      this.updatePage(idx, draft => ({ ...draft, pageType: nextType }));
    });
    typeWrap.appendChild(typeLabel);
    typeWrap.appendChild(select);
    row.appendChild(typeWrap);

    // Selector Input
    const selWrap = document.createElement("div");
    selWrap.className = "config-field";
    selWrap.style.flex = "1"; 
    const selLabel = document.createElement("label");
    selLabel.innerHTML = "Selector <span style='color:var(--color-error)'>*</span>";

    const selectorSelect = document.createElement("select");
    selectorSelect.className = "page-selector-select";
    ALLOWED_PAGE_SELECTORS.forEach((selector) => {
      const option = document.createElement("option");
      option.value = selector;
      option.textContent = selector;
      selectorSelect.appendChild(option);
    });
    selectorSelect.value = page.selector;
    selectorSelect.addEventListener("change", () => {
      const next = selectorSelect.value as Page["selector"];
      this.updatePage(idx, draft => ({ ...draft, selector: next }));
    });
    selWrap.appendChild(selLabel);
    selWrap.appendChild(selectorSelect);
    row.appendChild(selWrap);

    // Position Input
    const posWrap = document.createElement("div");
    posWrap.className = "config-field position";
    const posLabel = document.createElement("label");
    posLabel.textContent = "Pos";
    const posSelect = document.createElement("select");
    posSelect.className = "page-pos-select";
    ALLOWED_PAGE_POSITIONS.forEach((position) => {
      const option = document.createElement("option");
      option.value = position;
      option.textContent = position;
      posSelect.appendChild(option);
    });
    posSelect.value = page.position;
    posSelect.addEventListener("change", () => {
      const next = posSelect.value as Page["position"];
      this.updatePage(idx, draft => ({ ...draft, position: next }));
    });
    posWrap.appendChild(posLabel);
    posWrap.appendChild(posSelect);
    row.appendChild(posWrap);

    // Delete
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18\"></path><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path></svg>";
    delBtn.title = "Remove Page";
    delBtn.style.marginTop = "20px"; 
    delBtn.addEventListener("click", () => this.props.store.removePage(idx));
    row.appendChild(delBtn);

    return row;
  }

  // eslint-disable-next-line no-unused-vars
  private updatePage(idx: number, updater: (page: Page) => Page) {
    const pages = [...(this.state.snapshot.currentData?.pages || [])];
    if (!pages[idx]) return;
    pages[idx] = updater({ ...pages[idx] });
    this.props.store.updateField("pages", pages);
  }
}
