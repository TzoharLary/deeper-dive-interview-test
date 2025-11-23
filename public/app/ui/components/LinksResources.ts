import { Component } from "../core/Component.js";
import type { IStore, StoreSnapshot } from "../../types/index.js";

type DashboardKey = "publisherDashboard" | "monitorDashboard" | "qaStatusDashboard";

interface LinksResourcesProps { store: IStore; }
interface LinksResourcesState { snapshot: StoreSnapshot; }

export class LinksResources extends Component<LinksResourcesProps, LinksResourcesState> {
  private unsubscribe: (() => void) | null = null;
  private inputs: Partial<Record<DashboardKey, HTMLInputElement>> = {};
  protected getInitialState(): LinksResourcesState { return { snapshot: this.props.store.getSnapshot() }; }
  protected onMount() { this.unsubscribe = this.props.store.subscribe(snap => this.setState({ snapshot: snap })); }
  protected onUnmount() { if (this.unsubscribe) this.unsubscribe(); }
  render() {
    this.container.innerHTML = "";
    this.container.className = "section-fieldset";

    const legend = document.createElement("legend");
    legend.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 7 7L14 23l-1-1"></path><path d="M14 11a5 5 0 0 0-7-7L4 5l1 1"></path><line x1="2" y1="12" x2="22" y2="12"></line></svg>
        Links & Dashboards
      </div>
    `;
    this.container.appendChild(legend);

    const content = document.createElement("div");
    this.container.appendChild(content);

    this.addField(content, "Publisher Dashboard", "publisherDashboard");
    this.addField(content, "Monitor Dashboard", "monitorDashboard");
    this.addField(content, "QA Status Dashboard", "qaStatusDashboard");
    this.update();
  }

  protected update() {
    const data = this.state.snapshot.currentData;
    const fields: DashboardKey[] = ["publisherDashboard", "monitorDashboard", "qaStatusDashboard"];
    fields.forEach((key) => {
      const el = this.inputs[key];
      const nextVal = (data?.[key] as string | undefined) || "";
      if (el && el.value !== nextVal) {
        el.value = nextVal;
      }
    });
  }

  private addField(parent: HTMLElement, label: string, field: DashboardKey) {
    const group = document.createElement("div");
    group.className = "form-group";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    group.appendChild(labelEl);

    const input = document.createElement("input");
    input.placeholder = label + "...";
    input.addEventListener("input", e => { this.props.store.markTouched(field); this.props.store.updateField(field, (e.target as HTMLInputElement).value); });
    
    this.inputs[field] = input;
    group.appendChild(input);
    parent.appendChild(group);
  }
}
