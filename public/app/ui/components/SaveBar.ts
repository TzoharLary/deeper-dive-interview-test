import { Component } from "../core/Component.js";
import { IStore, StoreSnapshot } from "../../types/index.js";
import { diffPublishers, DiffEntry } from "../../utils/diff.js";

interface SaveBarProps {
  store: IStore;
}

interface SaveBarState {
  snapshot: StoreSnapshot;
  isSaving: boolean;
}

export class SaveBar extends Component<SaveBarProps, SaveBarState> {
  private unsubscribe: (() => void) | null = null;
  private diffOverlay: HTMLElement | null = null;

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

  protected onUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.closeDiffModal();
  }

  render() {
    const { snapshot, isSaving } = this.state;
    const { isDirty, validation } = snapshot;
    const hasErrors = Object.keys(validation.errors).length > 0;
    const canSave = this.canSave();

    this.container.innerHTML = "";
    this.container.className = "save-bar";
    this.container.style.display = isDirty ? "block" : "none";

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

    const review = document.createElement("button");
    review.className = "review-btn";
    review.textContent = "Review Changes";
    review.disabled = !isDirty;
    review.addEventListener("click", () => this.openDiffModal());

    const cancel = document.createElement("button");
    cancel.className = "cancel-btn";
    cancel.textContent = "Discard";
    cancel.addEventListener("click", () => this.handleDiscard());

    const save = document.createElement("button");
    save.className = "save-btn";
    save.innerHTML = isSaving ? "Saving..." : "Save Changes";
    save.disabled = !canSave;
    save.addEventListener("click", () => this.handleSave());

    actions.appendChild(review);
    actions.appendChild(cancel);
    actions.appendChild(save);
  }

  private canSave(): boolean {
    const { isDirty, validation } = this.state.snapshot;
    if (!isDirty) return false;
    if (Object.keys(validation.errors).length > 0) return false;
    return !this.state.isSaving;
  }

  private handleDiscard() {
    this.closeDiffModal();
    window.location.reload();
  }

  private async handleSave() {
    if (!this.canSave()) return;
    this.closeDiffModal();
    this.setState({ isSaving: true });
    try {
      const payload = this.props.store.prepareForSave();
      await this.props.store.save(payload);
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ isSaving: false });
    }
  }

  private openDiffModal() {
    if (this.diffOverlay || !this.state.snapshot.isDirty) return;
    const { originalData, currentData } = this.state.snapshot;
    const entries = diffPublishers(originalData || null, currentData || null);
    this.renderDiffModal(entries);
  }

  private closeDiffModal() {
    if (this.diffOverlay) {
      this.diffOverlay.remove();
      this.diffOverlay = null;
    }
  }

  private renderDiffModal(entries: DiffEntry[]) {
    this.closeDiffModal();
    const overlay = document.createElement("div");
    overlay.className = "diff-overlay";
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.closeDiffModal();
      }
    });

    const panel = document.createElement("div");
    panel.className = "diff-panel";
    overlay.appendChild(panel);

    const header = document.createElement("div");
    header.className = "diff-header";
    const title = document.createElement("h3");
    title.textContent = "Review Changes";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "diff-close-btn";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => this.closeDiffModal());
    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    const body = document.createElement("div");
    body.className = "diff-body";
    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "diff-empty";
      empty.textContent = "No differences detected.";
      body.appendChild(empty);
    } else {
      entries.forEach((entry) => {
        const row = document.createElement("div");
        row.className = `diff-row diff-${entry.kind}`;

        const path = document.createElement("div");
        path.className = "diff-path";
        path.textContent = entry.path || "(root)";
        row.appendChild(path);

        const valuesWrap = document.createElement("div");
        valuesWrap.className = "diff-values";

        if (entry.kind !== "added") {
          valuesWrap.appendChild(this.createValueBlock("Before", entry.before));
        }

        if (entry.kind !== "removed") {
          valuesWrap.appendChild(this.createValueBlock("After", entry.after));
        }

        row.appendChild(valuesWrap);
        body.appendChild(row);
      });
    }
    panel.appendChild(body);

    const footer = document.createElement("div");
    footer.className = "diff-footer";

    const discard = document.createElement("button");
    discard.className = "cancel-btn";
    discard.textContent = "Discard Changes";
    discard.addEventListener("click", () => this.handleDiscard());

    const save = document.createElement("button");
    save.className = "save-btn";
    save.textContent = this.state.isSaving ? "Saving..." : "Save Changes";
    save.disabled = !this.canSave();
    save.addEventListener("click", () => this.handleSave());

    footer.appendChild(discard);
    footer.appendChild(save);
    panel.appendChild(footer);

    document.body.appendChild(overlay);
    this.diffOverlay = overlay;
  }

  private createValueBlock(label: string, value: unknown): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "diff-value";

    const labelEl = document.createElement("div");
    labelEl.className = "diff-value-label";
    labelEl.textContent = label;
    wrapper.appendChild(labelEl);

    const pre = document.createElement("pre");
    pre.textContent = this.formatValue(value);
    wrapper.appendChild(pre);

    return wrapper;
  }

  private formatValue(value: unknown): string {
    if (value === undefined) return "—";
    if (value === null) return "null";
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
}
