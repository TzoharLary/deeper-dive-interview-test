import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";
import { renderChipsInput } from "../renderers.js";

interface GeneralInfoProps {
  store: IStore;
}

interface GeneralInfoState {
  snapshot: StoreSnapshot;
}

export class GeneralInfo extends Component<GeneralInfoProps, GeneralInfoState> {
  private unsubscribe: (() => void) | null = null;
  private inputs: Record<string, HTMLInputElement> = {};
  private tagsContainer: HTMLElement | null = null;
  private publisherIdIcon: HTMLElement | null = null;

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
    this.container.className = "section-fieldset";

    const legend = document.createElement("legend");
    legend.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        General Information
      </div>
    `;
    this.container.appendChild(legend);

    const content = document.createElement("div");
    this.container.appendChild(content);

    this.publisherIdIcon = null;
    this.createPublisherIdField(content);
    
    this.createField(content, "Alias Name", "aliasName", "Display name shown in dashboards");
    
    // Active Status Toggle
    const activeGroup = document.createElement("div");
    activeGroup.className = "form-group";
    const activeLabel = document.createElement("label");
    activeLabel.textContent = "Active Status";
    activeGroup.appendChild(activeLabel);
    
    const toggleLabel = document.createElement("label");
    toggleLabel.className = "toggle-switch";
    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.addEventListener("change", (e) => {
      this.props.store.updateField("isActive", (e.target as HTMLInputElement).checked);
    });
    this.inputs["isActive"] = toggleInput;
    
    const slider = document.createElement("div");
    slider.className = "toggle-slider";
    
    const toggleText = document.createElement("span");
    toggleText.className = "toggle-text";
    toggleText.textContent = "Enable/Disable publisher";
    
    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(slider);
    toggleLabel.appendChild(toggleText);
    activeGroup.appendChild(toggleLabel);
    content.appendChild(activeGroup);

    // Tags Chips
    const tagsGroup = document.createElement("div");
    tagsGroup.className = "form-group";
    const tagsLabel = document.createElement("label");
    tagsLabel.textContent = "Tags";
    tagsGroup.appendChild(tagsLabel);
    
    this.tagsContainer = document.createElement("div");
    tagsGroup.appendChild(this.tagsContainer);
    content.appendChild(tagsGroup);

    // Initial sync
    this.update();
  }

  // Called on state change
  protected update() {
    const { currentData, validation, touchedFields, mode } = this.state.snapshot;
    const data = currentData || { publisherId: "", aliasName: "", tags: [], isActive: true };

    this.syncField("publisherId", data.publisherId, validation.errors["publisherId"], touchedFields["publisherId"]);
    this.syncField("aliasName", data.aliasName, validation.errors["aliasName"], touchedFields["aliasName"]);
    
    // Sync Toggle
    if (this.inputs["isActive"]) {
      this.inputs["isActive"].checked = !!data.isActive;
    }

    // Sync Tags
    if (this.tagsContainer) {
      renderChipsInput(
        this.tagsContainer, 
        data.tags || [], 
        (newTags) => this.props.store.updateField("tags", newTags),
        "enterprise, active, priority..."
      );
    }

    this.applyPublisherIdModeState(mode, data.publisherId || "");
  }

  private createField(parent: HTMLElement, label: string, field: string, helpText?: string) {
    const group = document.createElement("div");
    group.className = "form-group";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    if (field === "aliasName") {
      labelEl.innerHTML += " <span style='color:var(--color-error)'>*</span>";
    }
    group.appendChild(labelEl);

    const inputWrap = document.createElement("div");
    inputWrap.className = "input-wrapper";

    const input = document.createElement("input");
    input.placeholder = `Enter ${label.toLowerCase()}...`;
    
    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.props.store.markTouched(field);
      this.props.store.updateField(field, val);
    });

    this.inputs[field] = input;
    inputWrap.appendChild(input);

    // Validation Icon Wrapper
    const iconWrap = document.createElement("div");
    iconWrap.className = "input-icon";
    iconWrap.style.opacity = "0"; // Hidden by default
    iconWrap.setAttribute("data-icon-for", field);
    inputWrap.appendChild(iconWrap);

    group.appendChild(inputWrap);

    // Error container
    const err = document.createElement("div");
    err.className = "error-message";
    err.setAttribute("data-error-for", field);
    group.appendChild(err);

    if (helpText) {
      const help = document.createElement("div");
      help.style.fontSize = "12px";
      help.style.color = "var(--color-text-muted)";
      help.style.marginTop = "4px";
      help.textContent = helpText;
      group.appendChild(help);
    }

    parent.appendChild(group);
  }

  private createPublisherIdField(parent: HTMLElement) {
    const group = document.createElement("div");
    group.className = "form-group";

    const labelEl = document.createElement("label");
    labelEl.innerHTML = "Publisher ID <span style='color:var(--color-error)'>*</span>";
    group.appendChild(labelEl);

    const inputWrap = document.createElement("div");
    inputWrap.className = "input-wrapper";

    const input = document.createElement("input");
    input.placeholder = "Enter publisher id...";
    input.autocomplete = "off";
    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.props.store.markTouched("publisherId");
      this.props.store.updateField("publisherId", val);
    });
    this.inputs["publisherId"] = input;
    inputWrap.appendChild(input);

    const iconWrap = document.createElement("div");
    iconWrap.className = "input-icon";
    iconWrap.style.opacity = "0";
    iconWrap.setAttribute("data-icon-for", "publisherId");
    inputWrap.appendChild(iconWrap);
    this.publisherIdIcon = iconWrap;

    group.appendChild(inputWrap);

    const err = document.createElement("div");
    err.className = "error-message";
    err.setAttribute("data-error-for", "publisherId");
    group.appendChild(err);

    const help = document.createElement("div");
    help.style.fontSize = "12px";
    help.style.color = "var(--color-text-muted)";
    help.style.marginTop = "4px";
    help.textContent = "Unique identifier for the publisher";
    group.appendChild(help);

    parent.appendChild(group);

    if (this.state.snapshot.mode === "create") {
      input.readOnly = false;
      input.addEventListener("blur", () => {
        if (!input.value.trim()) return;
        this.lockPublisherIdInput();
      });
    } else {
      this.lockPublisherIdInput();
    }
  }

  private lockPublisherIdInput() {
    const input = this.inputs["publisherId"];
    if (!input) return;
    input.readOnly = true;
    input.dataset.locked = "true";
    if (this.publisherIdIcon) {
      this.publisherIdIcon.style.opacity = "1";
      this.publisherIdIcon.dataset.lockIcon = "true";
      this.publisherIdIcon.innerHTML = this.lockIconSvg;
    }
  }

  private unlockPublisherIdInput() {
    const input = this.inputs["publisherId"];
    if (!input) return;
    input.readOnly = false;
    delete input.dataset.locked;
    if (this.publisherIdIcon) {
      this.publisherIdIcon.style.opacity = "0";
      this.publisherIdIcon.innerHTML = "";
      this.publisherIdIcon.removeAttribute("data-lock-icon");
    }
  }

  private applyPublisherIdModeState(mode: "create" | "edit", value: string) {
    if (mode !== "create") {
      this.lockPublisherIdInput();
      return;
    }

    const input = this.inputs["publisherId"];
    if (!input) return;

    if (!value && input.dataset.locked === "true") {
      this.unlockPublisherIdInput();
    }
  }

  private get lockIconSvg() {
    return "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>";
  }

  private syncField(field: string, value: string, error: string | undefined, touched: boolean) {
    const input = this.inputs[field];
    if (!input) return;

    const nextValue = value ?? "";
    if (input.value !== nextValue) {
      input.value = nextValue;
    }

    // Reset styles
    input.classList.remove("error");
    
    const errEl = this.container.querySelector(`[data-error-for="${field}"]`) as HTMLElement;
    const iconWrap = this.container.querySelector(`[data-icon-for="${field}"]`) as HTMLElement;
    const mode = this.state.snapshot.mode || "edit";

    if (field === "publisherId") {
      if (mode !== "create" || input.dataset.locked === "true") {
        this.lockPublisherIdInput();
        if (errEl) errEl.style.display = "none";
        return;
      }
      if (iconWrap) {
        iconWrap.style.opacity = touched ? "1" : "0";
        iconWrap.removeAttribute("data-lock-icon");
      }
    }
    
    if (touched && iconWrap) {
      iconWrap.style.opacity = "1";
      if (error) {
        // Error State
        input.classList.add("error");
        iconWrap.innerHTML = "<svg class=\"text-red-500\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"color:var(--color-error)\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line></svg>";
        if (errEl) {
          errEl.textContent = error;
          errEl.style.display = "block";
        }
      } else if (value) {
        // Success State
        iconWrap.innerHTML = "<svg class=\"text-emerald-500\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"color:var(--color-success)\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline></svg>";
        if (errEl) errEl.style.display = "none";
      } else {
        // Empty but touched (neutral)
        iconWrap.style.opacity = "0";
        if (errEl) errEl.style.display = "none";
      }
    } else {
      if (iconWrap) iconWrap.style.opacity = "0";
      if (errEl) errEl.style.display = "none";
    }
  }
}
