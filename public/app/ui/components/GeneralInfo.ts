import { Component } from "../core/Component";
import { IStore, StoreSnapshot } from "../../types";

interface GeneralInfoProps {
  store: IStore;
}

interface GeneralInfoState {
  snapshot: StoreSnapshot;
}

export class GeneralInfo extends Component<GeneralInfoProps, GeneralInfoState> {
  private unsubscribe: (() => void) | null = null;
  private inputs: Record<string, HTMLInputElement> = {};

  protected getInitialState(): GeneralInfoState {
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

  // Only called once on mount
  render() {
    this.container.innerHTML = "";
    this.container.className = "bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md";

    const header = document.createElement("div");
    header.className = "flex items-center gap-3 mb-6 pb-4 border-b border-slate-100";
    
    const icon = document.createElement("div");
    icon.className = "p-2 bg-indigo-50 text-indigo-600 rounded-lg";
    icon.innerHTML = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle></svg>";
    
    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-slate-800";
    title.textContent = "General Information";
    
    header.appendChild(icon);
    header.appendChild(title);
    this.container.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 gap-6";
    this.container.appendChild(grid);

    this.createField(grid, "Publisher ID", "publisherId", "Unique identifier for the publisher");
    this.createField(grid, "Alias Name", "aliasName", "Display name shown in dashboards");
    this.createField(grid, "Tags", "tags", "Comma separated tags for filtering");

    // Initial sync
    this.update();
  }

  // Called on state change
  protected update() {
    const { currentData, validation, touchedFields } = this.state.snapshot;
    const data = currentData || { publisherId: "", aliasName: "", tags: [] };

    this.syncField("publisherId", data.publisherId, validation.errors["publisherId"], touchedFields["publisherId"]);
    this.syncField("aliasName", data.aliasName, validation.errors["aliasName"], touchedFields["aliasName"]);
    this.syncField("tags", (data.tags || []).join(","), validation.errors["tags"], touchedFields["tags"]);
  }

  private createField(parent: HTMLElement, label: string, field: string, helpText?: string) {
    const wrap = document.createElement("div");
    wrap.className = "group";

    const labelEl = document.createElement("label");
    labelEl.className = "block text-sm font-medium text-slate-700 mb-1.5 ml-1";
    labelEl.textContent = label;
    wrap.appendChild(labelEl);

    const inputWrap = document.createElement("div");
    inputWrap.className = "relative";

    const input = document.createElement("input");
    input.className = "block w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400";
    input.placeholder = `Enter ${label.toLowerCase()}...`;
    
    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.props.store.markTouched(field);
      if (field === "tags") {
        this.props.store.updateField(field, val.split(",").map(s => s.trim()).filter(Boolean));
      } else {
        this.props.store.updateField(field, val);
      }
    });

    this.inputs[field] = input;
    inputWrap.appendChild(input);

    // Validation Icon Wrapper
    const iconWrap = document.createElement("div");
    iconWrap.className = "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity opacity-0";
    iconWrap.setAttribute("data-icon-for", field);
    inputWrap.appendChild(iconWrap);

    wrap.appendChild(inputWrap);

    // Error container
    const err = document.createElement("div");
    err.className = "text-xs text-red-500 mt-1.5 ml-1 font-medium hidden flex items-center gap-1";
    err.setAttribute("data-error-for", field);
    wrap.appendChild(err);

    if (helpText) {
      const help = document.createElement("div");
      help.className = "text-xs text-slate-400 mt-1.5 ml-1";
      help.textContent = helpText;
      wrap.appendChild(help);
    }

    parent.appendChild(wrap);
  }

  private syncField(field: string, value: string, error: string | undefined, touched: boolean) {
    const input = this.inputs[field];
    if (!input) return;

    if (input.value !== value) {
      input.value = value;
    }

    // Reset styles
    input.classList.remove("border-red-300", "bg-red-50", "focus:border-red-500", "focus:ring-red-500/20");
    input.classList.remove("border-emerald-300", "bg-emerald-50", "focus:border-emerald-500", "focus:ring-emerald-500/20");
    
    const errEl = this.container.querySelector(`[data-error-for="${field}"]`) as HTMLElement;
    const iconWrap = this.container.querySelector(`[data-icon-for="${field}"]`) as HTMLElement;
    
    if (touched) {
      iconWrap.classList.remove("opacity-0");
      if (error) {
        // Error State
        input.classList.add("border-red-300", "bg-red-50", "focus:border-red-500", "focus:ring-red-500/20");
        iconWrap.innerHTML = "<svg class=\"text-red-500\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line></svg>";
        if (errEl) {
          errEl.textContent = error;
          errEl.classList.remove("hidden");
        }
      } else if (value) {
        // Success State
        input.classList.add("border-emerald-300", "bg-emerald-50", "focus:border-emerald-500", "focus:ring-emerald-500/20");
        iconWrap.innerHTML = "<svg class=\"text-emerald-500\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline></svg>";
        if (errEl) errEl.classList.add("hidden");
      } else {
        // Empty but touched (neutral)
        iconWrap.classList.add("opacity-0");
        if (errEl) errEl.classList.add("hidden");
      }
    } else {
      iconWrap.classList.add("opacity-0");
      if (errEl) errEl.classList.add("hidden");
    }
  }
}
