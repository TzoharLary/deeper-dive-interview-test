import type {
  AllowedPagePosition,
  AllowedPageSelector,
  AllowedPageType
} from "../constants/pageRules.js";

export interface Page {
  pageType: AllowedPageType;
  selector: AllowedPageSelector;
  position: AllowedPagePosition;
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
  unknownKeys: Record<string, unknown>;
  validation: ValidationResult;
  isDirty: boolean;
  mode: "create" | "edit";
}

/* eslint-disable no-unused-vars */
export interface IStore {
  subscribe(_fn: (_snap: StoreSnapshot) => void): () => void;
  getSnapshot(): StoreSnapshot;
  load(_data: Publisher | null): void;
  startCreate(_preset?: Partial<Publisher>): void;
  updateField(_path: string, _value: unknown): void;
  markTouched(_path: string): void;
  addPage(_type?: Page["pageType"]): void;
  movePage(_from: number, _to: number): void;
  removePage(_index: number): void;
  save(_payload: Publisher): Promise<void>;
  delete(): Promise<void>;
  prepareForSave(): Publisher;
  isFieldModified(_path: string): boolean;
}
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
export type Navigate = (
  _view: "dashboard" | "publishers" | "tools",
  _options?: { preselectPublisherId?: string }
) => void;
