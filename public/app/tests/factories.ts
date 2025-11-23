import type { Publisher, Page } from "../types/index.js";

export function createPage(overrides: Partial<Page> = {}): Page {
  return {
    pageType: overrides.pageType || "article",
    selector: overrides.selector || ".main",
    position: overrides.position ?? 1
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