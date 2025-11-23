import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";

interface ExtendedDataProps {
  store: IStore;
}

interface ExtendedDataState {
  snapshot: StoreSnapshot;
  expanded: boolean;
}

export class ExtendedData extends Component<ExtendedDataProps, ExtendedDataState> {
  private unsubscribe: (() => void) | null = null;

  protected getInitialState(): ExtendedDataState {
    return { 
      snapshot: this.props.store.getSnapshot(),
      expanded: false
    };
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
    const { unknownKeys } = this.state.snapshot;
    const keysCount = Object.keys(unknownKeys).length;

    if (keysCount === 0) {
      this.container.innerHTML = "";
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "block";
    this.container.innerHTML = "";
    this.container.className = "section-fieldset warning collapsible" + (this.state.expanded ? " expanded" : "");

    const header = document.createElement("div");
    header.className = "collapsible-header warning-header";
    header.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      <span>Extended Data (Unknown Keys)</span>
      <span class="keys-count">${keysCount} keys</span>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    `;
    header.addEventListener("click", () => {
      this.setState({ expanded: !this.state.expanded });
    });
    this.container.appendChild(header);

    const content = document.createElement("div");
    content.className = "collapsible-content";
    
    const msg = document.createElement("div");
    msg.className = "warning-message";
    msg.textContent = "These fields were found in the imported data but are not part of the standard schema. They will be preserved upon save.";
    content.appendChild(msg);

    const preWrap = document.createElement("div");
    preWrap.className = "extended-data-content";
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(unknownKeys, null, 2);
    preWrap.appendChild(pre);
    content.appendChild(preWrap);

    this.container.appendChild(content);
  }
}
