/* eslint-disable no-unused-vars */
import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";
import { renderChipsInput } from "../renderers.js";

interface AdvancedSettingsProps {
  store: IStore;
}

interface AdvancedSettingsState {
  snapshot: StoreSnapshot;
  expanded: boolean;
}

export class AdvancedSettings extends Component<AdvancedSettingsProps, AdvancedSettingsState> {
  private unsubscribe: (() => void) | null = null;
  private inputs: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};
  private domainsContainer: HTMLElement | null = null;

  protected getInitialState(): AdvancedSettingsState {
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
    this.container.innerHTML = "";
    this.container.className = "section-fieldset collapsible" + (this.state.expanded ? " expanded" : "");

    const header = document.createElement("div");
    header.className = "collapsible-header";
    header.innerHTML = `
      <span>Advanced Settings</span>
      <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    `;
    header.addEventListener("click", () => {
      this.setState({ expanded: !this.state.expanded });
    });
    this.container.appendChild(header);

    const content = document.createElement("div");
    content.className = "collapsible-content";
    this.container.appendChild(content);

    // Allowed Domains (Chips)
    const domainsGroup = document.createElement("div");
    domainsGroup.className = "form-group";
    const domainsLabel = document.createElement("label");
    domainsLabel.textContent = "Allowed Domains";
    domainsGroup.appendChild(domainsLabel);
    
    this.domainsContainer = document.createElement("div");
    domainsGroup.appendChild(this.domainsContainer);
    content.appendChild(domainsGroup);

    // Custom CSS (Textarea)
    this.createTextArea(content, "Custom CSS", "customCss", "Enter custom CSS rules...");
    
    // Notes (Textarea)
    this.createTextArea(content, "Notes", "notes", "Internal notes...");

    // Initial sync
    this.update();
  }

  protected update() {
    // Handle expansion toggle
    const isExpanded = this.container.classList.contains("expanded");
    if (this.state.expanded !== isExpanded) {
      this.container.classList.toggle("expanded", this.state.expanded);
    }

    const { currentData } = this.state.snapshot;
    const data = currentData || { allowedDomains: [], customCss: "", notes: "" };

    // Sync Domains
    if (this.domainsContainer) {
      renderChipsInput(
        this.domainsContainer, 
        data.allowedDomains || [], 
        (newDomains) => this.props.store.updateField("allowedDomains", newDomains),
        "Type domain and press Enter (e.g. example.com)..."
      );
    }

    // Sync Textareas
    this.syncField("customCss", data.customCss || "");
    this.syncField("notes", data.notes || "");
  }

  private createTextArea(parent: HTMLElement, label: string, field: string, placeholder: string) {
    const group = document.createElement("div");
    group.className = "form-group";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    group.appendChild(labelEl);

    const textarea = document.createElement("textarea");
    textarea.placeholder = placeholder;
    textarea.rows = 4;
    textarea.style.fontFamily = "monospace";
    
    textarea.addEventListener("input", (e) => {
      const val = (e.target as HTMLTextAreaElement).value;
      this.props.store.markTouched(field);
      this.props.store.updateField(field, val);
    });

    this.inputs[field] = textarea;
    group.appendChild(textarea);
    parent.appendChild(group);
  }

  private syncField(field: string, value: string) {
    const input = this.inputs[field];
    if (!input) return;
    if (input.value !== value) {
      input.value = value;
    }
  }
}
/* eslint-enable no-unused-vars */
