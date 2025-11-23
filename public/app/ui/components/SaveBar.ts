import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";

interface SaveBarProps {
  store: IStore;
}

interface SaveBarState {
  snapshot: StoreSnapshot;
  isSaving: boolean;
}

export class SaveBar extends Component<SaveBarProps, SaveBarState> {
  private unsubscribe: (() => void) | null = null;

  protected getInitialState(): SaveBarState {
    return { 
      snapshot: this.props.store.getSnapshot(),
      isSaving: false
    };
  }

  protected onMount() {
    this.unsubscribe = this.props.store.subscribe((snap) => {
      this.setState({ snapshot: snap });
    });
  }

  render() {
    const { isDirty, validation } = this.state.snapshot;
    const { isSaving } = this.state;
    const hasErrors = Object.keys(validation.errors).length > 0;
    const canSave = isDirty && !hasErrors && !isSaving;

    this.container.innerHTML = "";
    this.container.className = "save-bar";
    
    if (!isDirty) {
        this.container.style.display = "none";
    } else {
        this.container.style.display = "block";
    }

    const content = document.createElement("div");
    content.className = "save-bar-content";
    this.container.appendChild(content);
    
    const text = document.createElement("div");
    text.className = "save-bar-text";
    text.textContent = isSaving ? "Saving changes..." : hasErrors ? "Please fix validation errors" : "You have unsaved changes";
    content.appendChild(text);
    
    const actions = document.createElement("div");
    actions.className = "save-bar-actions";
    content.appendChild(actions);
    
    const cancel = document.createElement("button");
    cancel.className = "cancel-btn";
    cancel.textContent = "Discard";
    cancel.addEventListener("click", () => {
        // Reload current publisher to discard changes
        if (this.state.snapshot.currentData) {
            this.props.store.load(this.state.snapshot.currentData); // This might not work if currentData is already dirty. 
            // Ideally store should have a reset method or we reload from server.
            // For now, let's just reload the page or re-fetch.
            // Actually, store.load overwrites everything, so if we had the original data...
            // But currentData IS the dirty data.
            // We need to re-fetch.
            const id = this.state.snapshot.currentData.publisherId;
            // We can't easily re-fetch here without importing api.
            // Let's just reload the window for now as a simple "Discard".
            window.location.reload();
        }
    });
    
    const save = document.createElement("button");
    save.className = "save-btn";
    save.innerHTML = isSaving 
        ? "Saving..."
        : "Save Changes";
    
    save.disabled = !canSave;
    
    save.addEventListener("click", async () => {
      this.setState({ isSaving: true });
      try {
        const payload = this.props.store.prepareForSave();
        await this.props.store.save(payload);
      } catch (e) {
        console.error(e);
      } finally {
        this.setState({ isSaving: false });
      }
    });

    actions.appendChild(cancel);
    actions.appendChild(save);
  }
}
