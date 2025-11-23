import { Component } from "../core/Component";
import { IStore, StoreSnapshot } from "../../types";

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
    this.container.className = "fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl p-4 flex items-center justify-between z-50 transition-all duration-300 transform translate-y-0";
    
    // Hide if not dirty to reduce noise? Or just show "Ready" state.
    // Let's keep it visible but subtle if clean.
    if (!isDirty) {
        this.container.classList.add("translate-y-24", "opacity-0");
    } else {
        this.container.classList.remove("translate-y-24", "opacity-0");
    }

    const statusWrap = document.createElement("div");
    statusWrap.className = "flex items-center gap-3";
    
    const indicator = document.createElement("div");
    indicator.className = `w-2.5 h-2.5 rounded-full ${isSaving ? "bg-indigo-500 animate-pulse" : hasErrors ? "bg-red-500" : "bg-amber-500"}`;
    
    const statusText = document.createElement("div");
    statusText.className = "text-sm font-medium text-slate-700";
    statusText.textContent = isSaving ? "Saving changes..." : hasErrors ? "Please fix validation errors" : "Unsaved changes";
    
    statusWrap.appendChild(indicator);
    statusWrap.appendChild(statusText);
    this.container.appendChild(statusWrap);

    const btn = document.createElement("button");
    btn.className = `px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
      canSave 
        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0" 
        : "bg-slate-100 text-slate-400 cursor-not-allowed"
    }`;
    btn.innerHTML = isSaving 
        ? "<svg class=\"animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><circle class=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"4\"></circle><path class=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path></svg> Saving..."
        : "Save Changes";
    
    btn.disabled = !canSave;
    
    btn.addEventListener("click", async () => {
      this.setState({ isSaving: true });
      try {
        const payload = this.props.store.prepareForSave();
        await this.props.store.save(payload);
        // Store should handle reset of dirty state, but for now we rely on reload or store logic
      } catch (e) {
        console.error(e);
      } finally {
        this.setState({ isSaving: false });
      }
    });

    this.container.appendChild(btn);
  }
}
