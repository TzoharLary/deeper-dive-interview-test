import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";

interface DangerZoneProps {
  store: IStore;
}

interface DangerZoneState {
  snapshot: StoreSnapshot;
}

export class DangerZone extends Component<DangerZoneProps, DangerZoneState> {
  private unsubscribe: (() => void) | null = null;

  protected getInitialState(): DangerZoneState {
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
    const { currentData } = this.state.snapshot;
    // Only show in edit mode (when we have an ID)
    if (!currentData || (!currentData.id && !currentData.publisherId)) {
      this.container.innerHTML = "";
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "block";
    this.container.innerHTML = "";
    this.container.className = "section-fieldset danger";

    const legend = document.createElement("legend");
    legend.innerHTML = `
      <div class="danger-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Danger Zone
      </div>
    `;
    this.container.appendChild(legend);

    const content = document.createElement("div");
    
    const warning = document.createElement("p");
    warning.textContent = "Once you delete a publisher, there is no going back. Please be certain.";
    content.appendChild(warning);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-publisher-btn";
    deleteBtn.textContent = "Delete Publisher";
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this publisher? This action cannot be undone.")) {
        try {
          await this.props.store.delete();
        } catch (e) {
          alert("Failed to delete publisher");
        }
      }
    });
    content.appendChild(deleteBtn);

    this.container.appendChild(content);
  }
}
