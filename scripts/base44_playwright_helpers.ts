import fs from 'fs';
import path from 'path';
import type { Page } from 'playwright';
import { runWithSupervisor } from './safe_action_runner';

const DOWNLOAD_DIR = path.resolve(process.cwd(), '.playwright-mcp');

async function ensureDownloadDir() {
  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

export async function openShare(page: Page) {
  return runWithSupervisor(async ({ signal, heartbeat, logger }) => {
    await page.getByRole('button', { name: 'Share' }).click();
    heartbeat();
    const dialog = page.locator('dialog, [role="dialog"]', { hasText: 'Share Your App' });
    await dialog.waitFor({ timeout: 8000 }).catch(() => {});
    logger('openShare: dialog visible');
    return dialog;
  }, { actionName: 'openShare' });
}

export async function openGithubEditor(page: Page) {
  return runWithSupervisor(async ({ signal, heartbeat, logger }) => {
    // Try title-based click, fallback to role/name
    try {
      await page.getByTitle('Github & code editing').click({ timeout: 2000 });
    } catch {
      await page.getByRole('button', { name: 'Github & code editing' }).click();
    }
    heartbeat();
    const menu = page.locator('[role="menu"], .menu, .dropdown');
    await menu.first().waitFor({ timeout: 5000 }).catch(() => {});
    logger('openGithubEditor: menu opened');
    return menu;
  }, { actionName: 'openGithubEditor' });
}

export async function readFileList(page: Page): Promise<string[]> {
  return runWithSupervisor(async ({ signal, heartbeat, logger }) => {
    await openGithubEditor(page);
    heartbeat();
    const items = page.getByRole('menuitem');
    const count = await items.count();
    const files: string[] = [];
    for (let i = 0; i < count; i++) {
      if (signal.aborted) throw new Error('aborted');
      const txt = (await items.nth(i).innerText()).trim();
      // Pick likely file lines (contain file extensions)
      const m = txt.match(/([\w\-./]+?\.(js|jsx|ts|tsx|json|css|html))/);
      if (m) files.push(m[1]);
    }
    logger(`readFileList: found ${files.length} files`);
    return files;
  }, { actionName: 'readFileList' });
}

export async function exportZip(page: Page): Promise<string | null> {
  return runWithSupervisor(async ({ signal, heartbeat, logger }) => {
    await openGithubEditor(page);
    heartbeat();
    const exportItem = page.getByRole('menuitem', { name: /Export project as ZIP|Export to ZIP/i });
    await exportItem.click();
    // Wait for the Export dialog with a Download ZIP link
    const downloadLink = page.locator('a', { hasText: 'Download ZIP' }).first();
    await downloadLink.waitFor({ timeout: 10000 }).catch(() => {});
    const href = await downloadLink.getAttribute('href');
    logger(`exportZip: href=${href}`);
    return href ?? null;
  }, { actionName: 'exportZip' });
}

export async function downloadFile(page: Page, href: string, filename?: string): Promise<string> {
  return runWithSupervisor(async ({ signal, heartbeat, logger }) => {
    await ensureDownloadDir();
    const name = filename ?? path.basename(new URL(href, page.url()).pathname);
    const outPath = path.join(DOWNLOAD_DIR, name);
    logger(`downloadFile: fetching ${href}`);
    const resp = await page.request.get(href);
    if (!resp.ok()) throw new Error(`download failed: ${resp.status()} ${href}`);
    const buffer = await resp.body();
    fs.writeFileSync(outPath, buffer);
    logger(`downloadFile: saved ${outPath}`);
    return outPath;
  }, { actionName: 'downloadFile' });
}

export default {
  openShare,
  openGithubEditor,
  readFileList,
  exportZip,
  downloadFile,
};
