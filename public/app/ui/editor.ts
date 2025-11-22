import { createElement, updateInputValue, renderList } from './renderers';
import { validatePublisher } from '../utils/validator';

export function renderEditor(container: HTMLElement, store: any) {
  container.innerHTML = '';

  const shell = createElement('div', 'h-full flex flex-col bg-white');
  shell.setAttribute('data-ui-snapshot', 'editor');

  const content = createElement('div', 'flex-1 overflow-y-auto p-8 space-y-8 pb-24');
  shell.appendChild(content);

  // --- General Info ---
  const general = createElement('section', 'bg-white border rounded-lg p-6');
  const title = createElement('h3', 'text-lg font-semibold mb-4');
  title.textContent = 'General Info';
  general.appendChild(title);

  const pidWrap = createElement('div', 'mb-3');
  const pidInput = createElement('input', 'w-full h-10 px-3 rounded-md border border-slate-300') as HTMLInputElement;
  pidInput.placeholder = 'Publisher ID';
  pidWrap.appendChild(pidInput);

  const aliasWrap = createElement('div', 'mb-3');
  const aliasInput = createElement('input', 'w-full h-10 px-3 rounded-md border border-slate-300') as HTMLInputElement;
  aliasInput.placeholder = 'Alias Name';
  aliasWrap.appendChild(aliasInput);

  const tagsWrap = createElement('div', 'mb-3');
  const tagsInput = createElement('input', 'w-full h-10 px-3 rounded-md border border-slate-300') as HTMLInputElement;
  tagsInput.placeholder = 'comma,separated,tags';
  tagsWrap.appendChild(tagsInput);

  general.appendChild(pidWrap);
  general.appendChild(aliasWrap);
  general.appendChild(tagsWrap);
  content.appendChild(general);

  // --- Pages Table ---
  const pagesSection = createElement('section', 'bg-white border rounded-lg p-6');
  const pagesHeader = createElement('div', 'flex justify-between items-center mb-4');
  const pagesTitle = createElement('h3', 'text-lg font-semibold');
  pagesTitle.textContent = 'Page Configurations';
  const addBtns = createElement('div', 'flex gap-2');
  const addArticleBtn = createElement('button', 'text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md') as HTMLButtonElement;
  addArticleBtn.textContent = '+ Add Article Page';
  addArticleBtn.addEventListener('click', () => store.addPage('article'));
  const addHomeBtn = createElement('button', 'text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md') as HTMLButtonElement;
  addHomeBtn.textContent = '+ Add Home Page';
  addHomeBtn.addEventListener('click', () => store.addPage('homepage'));
  addBtns.appendChild(addArticleBtn);
  addBtns.appendChild(addHomeBtn);
  pagesHeader.appendChild(pagesTitle);
  pagesHeader.appendChild(addBtns);
  pagesSection.appendChild(pagesHeader);

  const pagesListWrap = createElement('div', 'space-y-3');
  pagesSection.appendChild(pagesListWrap);
  content.appendChild(pagesSection);

  // --- Bottom Save Bar ---
  const bottomBar = createElement('div', 'fixed left-0 right-0 bottom-0 p-4 bg-white border-t flex items-center justify-between');
  const statusText = createElement('div', 'text-sm text-slate-500');
  statusText.textContent = 'Ready';
  const saveBtn = createElement('button', 'px-4 py-2 rounded bg-slate-200 text-slate-600') as HTMLButtonElement;
  saveBtn.textContent = 'Save Changes';
  saveBtn.disabled = true;
  bottomBar.appendChild(statusText);
  bottomBar.appendChild(saveBtn);
  shell.appendChild(bottomBar);

  container.appendChild(shell);

  // Touched fields tracking - don't show errors for untouched fields
  const touched: Record<string, boolean> = {};
  function touch(field: string) { touched[field] = true; }

  // Validation render helper (traffic-light)
  function renderValidationState(inputEl: HTMLElement, fieldPath: string, snap: any) {
    const errs = snap?.validation?.errors || {};
    const err = errs[fieldPath];
    let badge = inputEl.parentElement?.querySelector('.validation-badge') as HTMLElement | null;
    if (badge) badge.remove();
    inputEl.classList.remove('border-red-500', 'border-green-500');
    if (err && touched[fieldPath]) {
      inputEl.classList.add('border-red-500');
      const icon = createElement('span', 'validation-badge text-red-600 ml-2', { });
      icon.textContent = '⚠';
      inputEl.parentElement?.appendChild(icon);
    } else {
      const val = (inputEl as HTMLInputElement).value || '';
      if (val.trim()) {
        inputEl.classList.add('border-green-500');
        const icon = createElement('span', 'validation-badge text-green-600 ml-2', { });
        icon.textContent = '✓';
        inputEl.parentElement?.appendChild(icon);
      }
    }
  }

  // Save flow (uses store.prepareForSave if present)
  async function doSave() {
    try {
      statusText.textContent = 'Saving...';
      saveBtn.disabled = true;
      const payload = store.prepareForSave ? store.prepareForSave() : store.getSnapshot().currentData;
      if (typeof store.save === 'function') {
        await store.save(payload);
      } else if (typeof (window as any).__api?.savePublisher === 'function') {
        await (window as any).__api.savePublisher(payload);
      }
      statusText.textContent = 'Saved';
      setTimeout(() => { statusText.textContent = 'Ready'; }, 1500);
    } catch (e) {
      statusText.textContent = 'Save failed';
    } finally {
      // recompute button state after save
      recomputeSaveState(currentSnap);
    }
  }

  saveBtn.addEventListener('click', doSave);

  // Keep the latest snapshot for validation/rendering
  let currentSnap: any = {};

  function recomputeSaveState(snap: any) {
    const dirty = !!snap?.dirty;
    const hasErrors = snap?.validation?.errors && Object.keys(snap.validation.errors).length > 0;
    saveBtn.disabled = !dirty || hasErrors;
    if (saveBtn.disabled) {
      saveBtn.className = 'px-4 py-2 rounded bg-slate-200 text-slate-600';
    } else {
      saveBtn.className = 'px-4 py-2 rounded bg-blue-600 text-white';
    }
  }

  // Subscribe to store updates
  const unsub = store.subscribe((snap: any) => {
    currentSnap = snap;
    const data = snap.currentData || {};
    updateInputValue(pidInput, data.publisherId || '');
    updateInputValue(aliasInput, data.aliasName || '');
    updateInputValue(tagsInput, (data.tags || []).join(','));

    // pages rendering
    const pages = data.pages || [];
    renderList(pagesListWrap, pages, (p: any) => String(p.position || Math.random()), (p: any, existing?: HTMLElement) => {
      if (existing) {
        const sel = existing.querySelector('input[data-selector]') as HTMLInputElement;
        if (sel) sel.value = p.selector || '';
        return existing;
      }

      const row = createElement('div', 'flex items-start gap-4 p-4 bg-slate-50 rounded-lg border');
      const typeWrap = createElement('div', 'w-40');
      const select = createElement('select', 'w-full h-9 rounded border border-slate-300 text-sm') as HTMLSelectElement;
      ['article','homepage','section'].forEach(opt => {
        const o = createElement('option') as HTMLOptionElement;
        o.value = opt; o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
        if (opt === p.pageType) o.selected = true;
        select.appendChild(o);
      });
      select.addEventListener('change', () => {
        const newPages = (store.getSnapshot().currentData.pages || []).map((pp: any) => ({ ...pp }));
        const idx = newPages.findIndex((pp: any) => pp.position === p.position);
        if (idx >= 0) { newPages[idx].pageType = select.value; store.updateField('pages', newPages); }
      });
      typeWrap.appendChild(select);
      row.appendChild(typeWrap);

      const selectorWrap = createElement('div', 'flex-1');
      const selLabel = createElement('label', 'block text-xs font-medium text-slate-500 mb-1');
      selLabel.textContent = 'Selector';
      const selInput = createElement('input', 'w-full h-9 px-3 rounded border border-slate-300 text-sm font-mono') as HTMLInputElement;
      selInput.setAttribute('data-selector', 'true');
      selInput.value = p.selector || '';
      selInput.addEventListener('blur', () => {
        const newPages = (store.getSnapshot().currentData.pages || []).map((pp: any) => ({ ...pp }));
        const idx = newPages.findIndex((pp: any) => pp.position === p.position);
        if (idx >= 0) { newPages[idx].selector = selInput.value; store.updateField('pages', newPages); }
      });
      selectorWrap.appendChild(selLabel);
      selectorWrap.appendChild(selInput);
      row.appendChild(selectorWrap);

      const posWrap = createElement('div', 'w-20');
      const posInput = createElement('input', 'w-full h-9 px-2 rounded border border-slate-300 text-sm text-center') as HTMLInputElement;
      posInput.type = 'number';
      posInput.value = String(p.position || 0);
      posInput.addEventListener('change', () => {
        const newPages = (store.getSnapshot().currentData.pages || []).map((pp: any) => ({ ...pp }));
        const idx = newPages.findIndex((pp: any) => pp.position === p.position);
        if (idx >= 0) { newPages[idx].position = parseInt(posInput.value || '0'); store.updateField('pages', newPages); }
      });
      posWrap.appendChild(posInput);
      row.appendChild(posWrap);

      const delBtn = createElement('button', 'mt-2 p-1 text-slate-400 hover:text-red-500') as HTMLButtonElement;
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        const newPages = (store.getSnapshot().currentData.pages || []).filter((pp: any) => pp.position !== p.position).map((pp: any, i: number) => ({ ...pp, position: i + 1 }));
        store.updateField('pages', newPages);
      });
      row.appendChild(delBtn);

      return row;
    });

    // validation rendering
    renderValidationState(pidInput, 'publisherId', snap);
    renderValidationState(aliasInput, 'aliasName', snap);

    // save button state
    recomputeSaveState(snap);
  });

  // Wire inputs
  aliasInput.addEventListener('input', (e) => { touch('aliasName'); store.updateField('aliasName', (e.target as HTMLInputElement).value); });
  pidInput.addEventListener('input', (e) => { touch('publisherId'); store.updateField('publisherId', (e.target as HTMLInputElement).value); });
  tagsInput.addEventListener('change', () => { touch('tags'); const vals = tagsInput.value.split(',').map((s) => s.trim()).filter(Boolean); store.updateField('tags', vals); });

  // initial touch suppression: mark no fields touched until user interacts

  // expose unsubscribe if needed
  return unsub;
}
