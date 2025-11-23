import { Component } from "../core/Component.js";
import { IStore } from "../../types/index.js";
import { GeneralInfo } from "./GeneralInfo.js";
import { PageList } from "./PageList.js";
import { SaveBar } from "./SaveBar.js";

interface EditorProps {
  store: IStore;
}

export class Editor extends Component<EditorProps> {
  private children: Component[] = [];

  protected getInitialState() { return {}; }

  render() {
    this.container.innerHTML = "";
    this.container.className = "h-full flex flex-col bg-slate-50";

    const content = document.createElement("div");
    content.className = "flex-1 overflow-y-auto p-8 space-y-8 pb-24";
    this.container.appendChild(content);

    // Mount Sub-Components
    const generalContainer = document.createElement("div");
    content.appendChild(generalContainer);
    const general = new GeneralInfo(generalContainer, { store: this.props.store });
    general.mount();
    this.children.push(general);

    const pagesContainer = document.createElement("div");
    content.appendChild(pagesContainer);
    const pages = new PageList(pagesContainer, { store: this.props.store });
    pages.mount();
    this.children.push(pages);

    const saveContainer = document.createElement("div");
    this.container.appendChild(saveContainer);
    const save = new SaveBar(saveContainer, { store: this.props.store });
    save.mount();
    this.children.push(save);
  }

  protected onUnmount() {
    this.children.forEach(c => c.unmount());
    this.children = [];
  }
}
