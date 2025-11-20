# Base44 Interface Guide — Playwright / MCP Server

This guide summarizes the Base44 editor UI and provides Playwright-focused automation tips for interacting with the interface, exporting code, and reading the in-app file list.

## Quick orientation
- Top nav: site title/logo, global search (`Open search`), and `More actions`.
- Preview tab: shows the running app inside an iframe. Use `Preview` to interact with the app UI.
- Right-side control group: `Network Activity`, `Github & code editing`, `Share`, `Publish`.

## Primary workflows

- Open Preview
  - Manual: click `Preview` tab. The app runs in an iframe.
  - Automation: use `frameLocator('iframe')` or `page.frame(...)` and wait for a known heading (e.g., `Publisher Configs`).

- Share (share URL / invite)
  - Manual: top-right `Share` button → `Share Your App` dialog with a copyable URL and invite fields.
  - Automation: click `Share` by role/name and read the URL from the dialog textbox.

- Publish (deploy)
  - Manual: `Publish` → domain selection and `Publish App` button.
  - Automation: click `Publish` and inspect menu items; use explicit waits.

- Github & code editing (file list / export)
  - Manual: click `Github & code editing` → file list and beta features including `Export project as ZIP`.
  - Automation: click by title or button name, then query `role=menuitem` entries to enumerate files.

- Export project as ZIP
  - Manual: `Github & code editing` → `Export project as ZIP` → `Download ZIP` link (pattern: `/api/apps/<appId>/coding/export-to-zip?api_key=...`).
  - Automation: either trigger the download event with Playwright or read the `href` and fetch it via `page.request`.

## Selectors & strategies
- Use semantic selectors: `page.getByRole('button', { name: 'Share' })`, `getByRole('menuitem', { name: 'Export project as ZIP' })`.
- For preview/editor iframe: use `page.frameLocator('iframe').locator(...)` and wait for a known element inside the frame.
- Avoid snapshot refs or ephemeral DOM ids — prefer visible text, roles, and attributes.

## Playwright patterns

- Click export and capture download (conceptual):
  - Use `page.waitForEvent('download')` around the click.
  - If the page returns a direct `href` link, use `page.request.get(href)` to fetch the ZIP.

- Access preview iframe:
  ```ts
  const frame = page.frameLocator('iframe');
  await frame.getByRole('heading', { name: 'Publisher Configs' }).waitFor();
  await frame.getByRole('button', { name: 'Pin list' }).click();
  ```

- Read file list from Github menu:
  ```ts
  await page.getByTitle('Github & code editing').click();
  const files = await page.getByRole('menuitem').allTextContents();
  ```

## Export & code-editing automation tips
- Prefer the ZIP export for full source; in-app editor extraction is fragile due to iframe/editor internals.
- The `Download ZIP` link often contains an `api_key` and can be fetched directly.
- If you must read in-app editor content, click `See all files` → select a file and attempt to read the raw content area; fallback to ZIP if content is not available.

## Common gotchas
- Controls are dynamic — always wait for visible text or role.
- Many controls live inside iframes — use `frameLocator`.
- Vite/dev messages can cause transient delays; wait for a stable app heading before acting.

## Reliability checklist
- Use role+name selectors where possible.
- Use `frameLocator` for preview/editor frames.
- Use `page.waitForEvent('download')` or `page.request.get(href)` to fetch exports.
- Add short retries for dialogs and menu openings.

## Recommended helper functions
- `openShare(page)` — opens Share dialog and returns dialog locator.
- `openGithubEditor(page)` — opens the Github & code editing menu.
- `readFileList(page)` — returns an array of candidate file names from the menu.
- `exportZip(page)` — clicks export and returns the download `href` (or null).
- `downloadFile(page, href)` — fetches the href and writes the ZIP into `.playwright-mcp/`.

---

Keep this guide next to your automation scripts. If you want, I can add a small Playwright helper module implementing the recommended functions and a sample test that downloads the ZIP automatically.
