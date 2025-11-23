import type { Publisher, Page } from "../types/index.js";
import { DEFAULT_PAGE_POSITION, DEFAULT_PAGE_SELECTOR, DEFAULT_PAGE_TYPE } from "../constants/pageRules.js";

export function createPage(overrides: Partial<Page> = {}): Page {
  return {
    pageType: overrides.pageType || DEFAULT_PAGE_TYPE,
    selector: overrides.selector || DEFAULT_PAGE_SELECTOR,
    position: overrides.position || DEFAULT_PAGE_POSITION
  };
}

export function createPublisher(overrides: Partial<Publisher> = {}): Publisher {
  return {
    publisherId: overrides.publisherId || "pub-1",
    aliasName: overrides.aliasName || "Publisher One",
    isActive: overrides.isActive ?? true,
    tags: overrides.tags || ["news"],
    publisherDashboard: overrides.publisherDashboard,
    monitorDashboard: overrides.monitorDashboard,
    qaStatusDashboard: overrides.qaStatusDashboard,
    allowedDomains: overrides.allowedDomains || ["example.com"],
    customCss: overrides.customCss,
    notes: overrides.notes,
    pages: overrides.pages || [createPage()],
    id: overrides.id,
    created_date: overrides.created_date,
    updated_date: overrides.updated_date,
    created_by: overrides.created_by,
    updatedAt: overrides.updatedAt
  };
}