export interface Page {
  pageType: "article" | "homepage" | "section";
  selector: string;
  position: number;
}

export interface Publisher {
  id?: string;
  publisherId: string;
  aliasName: string;
  isActive: boolean;
  tags: string[];
  publisherDashboard?: string;
  monitorDashboard?: string;
  qaStatusDashboard?: string;
  allowedDomains?: string[];
  customCss?: string;
  notes?: string;
  pages: Page[];
  created_date?: string;
  updated_date?: string;
  created_by?: string;
  updatedAt?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface StoreSnapshot {
  currentData: Publisher | null;
  originalData: Publisher | null;
  touchedFields: Record<string, boolean>;
  unknownKeys: Record<string, any>;
  validation: ValidationResult;
  isDirty: boolean;
}

export interface IStore {
  subscribe(fn: (snap: StoreSnapshot) => void): () => void;
  getSnapshot(): StoreSnapshot;
  load(data: Publisher | null): void;
  updateField(path: string, value: any): void;
  markTouched(path: string): void;
  addPage(type: string): void;
  movePage(from: number, to: number): void;
  removePage(index: number): void;
  save(payload: Publisher): Promise<void>;
  prepareForSave(): Publisher;
  isFieldModified(path: string): boolean;
}

export type Navigate = (view: "dashboard" | "publishers" | "tools") => void;
