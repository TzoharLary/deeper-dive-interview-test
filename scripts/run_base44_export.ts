import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { exportZip, downloadFile } from './base44_playwright_helpers';
import { runWithSupervisor } from './safe_action_runner';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Change this to your app preview URL if needed
  const previewUrl = 'https://app.base44.com/apps/691e8358c7f9a2536f289b41/editor/preview/Publishers';
  await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });

  try {
    const href = await exportZip(page);
    if (!href) throw new Error('export href missing');

    // download via helper (saved to .playwright-mcp)
    const outPath = await downloadFile(page, href);

    // unzip to scratch/base44_raw
    const dest = path.resolve(process.cwd(), 'scratch', 'base44_raw');
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest, { recursive: true });
    // use system unzip for reliability
    const { execSync } = await import('child_process');
    execSync(`unzip -o ${outPath} -d ${dest}`);
    console.log('Exported and unzipped to', dest);
  } finally {
    await browser.close();
  }
}

runWithSupervisor(async ({ signal, heartbeat, logger }) => {
  heartbeat();
  await main();
}, { actionName: 'run_base44_export' }).catch(err => {
  // eslint-disable-next-line no-console
  console.error('run failed', err);
  process.exit(1);
});
