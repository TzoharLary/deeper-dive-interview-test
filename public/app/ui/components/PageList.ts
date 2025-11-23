import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot, Page } from "../../types/index.js";

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
    this.container.className = "bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md";

    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-6 pb-4 border-b border-slate-100";
    
    const titleWrap = document.createElement("div");
    titleWrap.className = "flex items-center gap-3";
    const icon = document.createElement("div");
    icon.className = "p-2 bg-indigo-50 text-indigo-600 rounded-lg";
    icon.innerHTML = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line></svg>";
    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-slate-800";
    title.textContent = "Page Configurations";
    titleWrap.appendChild(icon);
    titleWrap.appendChild(title);
    header.appendChild(titleWrap);

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex gap-3";
    
    const addArticle = this.createBtn("Add Article", "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300", () => this.props.store.addPage("article"));
    const addHome = this.createBtn("Add Home", "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300", () => this.props.store.addPage("homepage"));
    
    btnGroup.appendChild(addArticle);
    btnGroup.appendChild(addHome);
    header.appendChild(btnGroup);
    this.container.appendChild(header);

    this.listContainer = document.createElement("div");
    this.listContainer.className = "space-y-4";
    this.container.appendChild(this.listContainer);

    this.update();
  }

  protected update() {
    if (!this.listContainer) return;
    const { currentData } = this.state.snapshot;
    const pages = currentData?.pages || [];

    const children = Array.from(this.listContainer.children) as HTMLElement[];
    
    // Remove excess
    while (children.length > pages.length) {
      this.listContainer.lastChild?.remove();
      children.pop();
    }

    // Update or Create
    pages.forEach((page, idx) => {
      let row = children[idx];
      if (!row) {
        row = this.createRow(page, idx);
        this.listContainer!.appendChild(row);
      } else {
        this.updateRow(row, page, idx);
      }
    });

    if (pages.length === 0 && children.length === 0) {
      this.listContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
          <div class="p-4 bg-white rounded-full shadow-sm mb-4">
            <svg class="text-slate-300" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          </div>
          <h4 class="text-sm font-semibold text-slate-900">No pages configured</h4>
          <p class="text-sm text-slate-500 mt-1 max-w-xs">Add a page configuration to start tracking content on specific URLs.</p>
        </div>
      `;
    } else if (pages.length > 0) {
      const emptyMsg = this.listContainer.querySelector(".border-dashed");
      if (emptyMsg) emptyMsg.remove();
    }
  }

  private createBtn(text: string, classes: string, onClick: () => void) {
    const btn = document.createElement("button");
    btn.className = `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95 ${classes}`;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> ${text}`;
    btn.addEventListener("click", onClick);
    return btn;
  }

  private createRow(page: Page, idx: number) {
    const row = document.createElement("div");
    row.className = "group relative flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200";
    row.setAttribute("data-index", String(idx));

    // Drag Handle
    const handle = document.createElement("div");
    handle.className = "mt-2 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500";
    handle.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"12\" r=\"1\"></circle><circle cx=\"9\" cy=\"5\" r=\"1\"></circle><circle cx=\"9\" cy=\"19\" r=\"1\"></circle><circle cx=\"15\" cy=\"12\" r=\"1\"></circle><circle cx=\"15\" cy=\"5\" r=\"1\"></circle><circle cx=\"15\" cy=\"19\" r=\"1\"></circle></svg>";
    row.appendChild(handle);

    // Type Select
    const typeWrap = document.createElement("div");
    typeWrap.className = "w-40";
    const typeLabel = document.createElement("label");
    typeLabel.className = "block text-xs font-medium text-slate-500 mb-1";
    typeLabel.textContent = "Page Type";
    
    const select = document.createElement("select");
    select.className = "w-full h-9 rounded-md border-slate-200 bg-slate-50 text-sm focus:border-indigo-500 focus:ring-indigo-500/20";
    ["article", "homepage", "section"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      select.appendChild(o);
    });
    select.value = page.pageType;
    select.addEventListener("change", () => {
      const newPages = [...(this.state.snapshot.currentData?.pages || [])];
      newPages[idx] = { ...newPages[idx], pageType: select.value as any };
      this.props.store.updateField("pages", newPages);
    });
    typeWrap.appendChild(typeLabel);
    typeWrap.appendChild(select);
    row.appendChild(typeWrap);

    // Selector Input
    const selWrap = document.createElement("div");
    selWrap.className = "flex-1";
    const selLabel = document.createElement("label");
    selLabel.className = "block text-xs font-medium text-slate-500 mb-1";
    selLabel.textContent = "CSS Selector";

    const selInput = document.createElement("input");
    selInput.className = "w-full h-9 px-3 rounded-md border-slate-200 bg-slate-50 text-sm font-mono text-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder:text-slate-400";
    selInput.placeholder = ".main-content, #article-body";
    selInput.value = page.selector;
    selInput.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      const newPages = [...(this.state.snapshot.currentData?.pages || [])];
      newPages[idx] = { ...newPages[idx], selector: val };
      this.props.store.updateField("pages", newPages);
    });
    selWrap.appendChild(selLabel);
    selWrap.appendChild(selInput);
    row.appendChild(selWrap);

    // Delete
    const delBtn = document.createElement("button");
    delBtn.className = "mt-6 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100";
    delBtn.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18\"></path><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path></svg>";
    delBtn.title = "Remove Page";
    delBtn.addEventListener("click", () => this.props.store.removePage(idx));
    row.appendChild(delBtn);

    return row;
  }

  private updateRow(row: HTMLElement, page: Page, _idx: number) {
    // Update Select
    const select = row.querySelector("select") as HTMLSelectElement;
    if (select && select.value !== page.pageType) {
      select.value = page.pageType;
    }

    // Update Input
    const input = row.querySelector("input") as HTMLInputElement;
    if (input && input.value !== page.selector) {
      // Only update if not focused to avoid cursor jumping? 
      // Actually, if we are typing, the value in store matches input value, so no jump.
      // If update comes from elsewhere, we update.
      if (document.activeElement !== input) {
        input.value = page.selector;
      }
    }

    // Update Delete Handler (closure captures idx, so we might need to recreate button or rely on data-index)
    // Since we rebuild the list on add/remove (length change), indices are stable for in-place updates.
    // But if we swap items, we might have issues. 
    // For now, let's assume simple updates.
    
    // Re-attaching delete listener is hard without recreating button.
    // Let's just update the data-index attribute and use event delegation if we wanted to be perfect.
    // But here, the closure `() => this.props.store.removePage(idx)` is stale if idx changes!
    // CRITICAL: If we insert/delete, we rebuild the list anyway because length changes.
    // So `updateRow` is only called when length is same.
    // If length is same, indices are same. So closure is fine.
  }
}
