import { Component } from "../core/Component.js";
import type { IStore } from "../../types/index.js";
import { GeneralInfo } from "./GeneralInfo.js";
import { LinksResources } from "./LinksResources.js";
import { MissingFields } from "./MissingFields.js";
import { AdvancedSettings } from "./AdvancedSettings.js";
import { PageList } from "./PageList.js";
import { SaveBar } from "./SaveBar.js";
import { ExtendedData } from "./ExtendedData.js";
import { DangerZone } from "./DangerZone.js";

interface EnhancedEditorProps { store: IStore; }

export class EnhancedEditor extends Component<EnhancedEditorProps> {
  private children: Component[] = [];
  protected getInitialState() { return {}; }
  protected onUnmount() { this.children.forEach(c => c.unmount()); this.children = []; }
  render() {
    this.container.innerHTML = "";
    this.container.className = "details-content";
    
    const header = document.createElement("div");
    header.className = "page-header";
    
    const title = document.createElement("h1");
    title.textContent = "Publisher Configuration";
    
    const editing = document.createElement("div");
    editing.className = "editing-indicator";
    editing.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"></path></svg><span>Editing</span>";
    
    header.appendChild(title); 
    header.appendChild(editing); 
    this.container.appendChild(header);
    
    // New 2-column grid layout
    const grid = document.createElement("div"); 
    grid.className = "editor-grid-v2"; 
    this.container.appendChild(grid);
    
    // Left Panel
    const leftPanel = document.createElement("div"); 
    leftPanel.className = "left-panel"; 
    grid.appendChild(leftPanel);
    
    // Right Panel
    const rightPanel = document.createElement("div"); 
    rightPanel.className = "right-panel"; 
    grid.appendChild(rightPanel);
    
    // Left Panel Content
    const generalHost = document.createElement("div"); leftPanel.appendChild(generalHost); const general = new GeneralInfo(generalHost, { store: this.props.store }); general.mount(); this.children.push(general);
    const linksHost = document.createElement("div"); leftPanel.appendChild(linksHost); const links = new LinksResources(linksHost, { store: this.props.store }); links.mount(); this.children.push(links);
    
    // Right Panel Content - Row 1 (Page Config + Missing Fields)
    const configRow = document.createElement("div");
    configRow.className = "config-row-wrapper";
    rightPanel.appendChild(configRow);

    const pagesHost = document.createElement("div"); 
    pagesHost.className = "pages-host";
    configRow.appendChild(pagesHost); 
    const pages = new PageList(pagesHost, { store: this.props.store }); pages.mount(); this.children.push(pages);
    
    const missingHost = document.createElement("div"); 
    missingHost.className = "missing-host";
    configRow.appendChild(missingHost); 
    const missing = new MissingFields(missingHost, { store: this.props.store }); missing.mount(); this.children.push(missing);
    
    // Right Panel Content - Row 2 (Advanced + Extended + Danger)
    const advancedHost = document.createElement("div"); rightPanel.appendChild(advancedHost); const adv = new AdvancedSettings(advancedHost, { store: this.props.store }); adv.mount(); this.children.push(adv);
    const extendedHost = document.createElement("div"); rightPanel.appendChild(extendedHost); const ext = new ExtendedData(extendedHost, { store: this.props.store }); ext.mount(); this.children.push(ext);
    const dangerHost = document.createElement("div"); rightPanel.appendChild(dangerHost); const danger = new DangerZone(dangerHost, { store: this.props.store }); danger.mount(); this.children.push(danger);
    
    // Save Bar (Fixed at bottom)
    const saveHost = document.createElement("div"); this.container.appendChild(saveHost); const save = new SaveBar(saveHost, { store: this.props.store }); save.mount(); this.children.push(save);
  }
}
