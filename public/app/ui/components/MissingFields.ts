import { Component } from "../core/Component.js";
import type { IStore, StoreSnapshot } from "../../types/index.js";

interface MissingFieldsProps { store: IStore; }
interface MissingFieldsState { snapshot: StoreSnapshot; }

export class MissingFields extends Component<MissingFieldsProps, MissingFieldsState> {
  private unsubscribe: (() => void) | null = null;
  protected getInitialState(): MissingFieldsState { return { snapshot: this.props.store.getSnapshot() }; }
  protected onMount() { this.unsubscribe = this.props.store.subscribe(snap => this.setState({ snapshot: snap })); }
  protected onUnmount() { if (this.unsubscribe) this.unsubscribe(); }
  render() {
    this.container.innerHTML = "";
    this.container.className = "missing-fields-section";

    const header = document.createElement("div");
    header.className = "missing-fields-header";
    
    const title = document.createElement("span");
    title.textContent = "Missing Required Fields";
    
    const badge = document.createElement("span");
    badge.className = "missing-count";
    badge.setAttribute("data-missing-count","0");
    
    header.appendChild(title);
    header.appendChild(badge);
    this.container.appendChild(header);

    const list = document.createElement("ul");
    list.className = "missing-fields-list";
    list.setAttribute("data-missing-list","true");
    this.container.appendChild(list);

    this.update();
  }

  protected update() {
    type RequiredField = "publisherId" | "aliasName" | "publisherDashboard" | "monitorDashboard" | "qaStatusDashboard";
    const data = this.state.snapshot.currentData;
    const required: RequiredField[] = ["publisherId", "aliasName", "publisherDashboard", "monitorDashboard", "qaStatusDashboard"];
    const missing = required.filter((key) => {
      const value = data?.[key];
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return !value;
    });
    
    const badge = this.container.querySelector("[data-missing-count]") as HTMLElement | null;
    const list = this.container.querySelector("[data-missing-list]") as HTMLElement | null;
    
    if (missing.length > 0) {
      this.container.classList.add("has-missing");
      this.container.classList.remove("all-complete");
    } else {
      this.container.classList.remove("has-missing");
      this.container.classList.add("all-complete");
    }

    if (badge) {
      badge.textContent = String(missing.length);
    }

    if (list) {
      list.innerHTML = "";
      if (missing.length === 0) {
        const ok = document.createElement("li");
        ok.className = "missing-fields-empty";
        ok.innerHTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>All required fields complete";
        list.appendChild(ok);
      } else {
        missing.forEach(m => {
          const li = document.createElement("li");
          li.className = "missing-field-item";
          li.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>${m}`;
          list.appendChild(li);
        });
      }
    }
  }
}
