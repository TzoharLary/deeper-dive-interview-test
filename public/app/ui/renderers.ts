// Lightweight DOM helpers for Vanilla rendering (no framework)
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classes?: string,
  attributes?: Record<string, string>
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  if (attributes) {
    Object.keys(attributes).forEach((k) => {
      const v = attributes[k];
      if (k === 'textContent') el.textContent = v;
      else el.setAttribute(k, v);
    });
  }
  return el;
}

export function updateInputValue(input: HTMLInputElement | HTMLTextAreaElement, newValue: string) {
  // Preserve cursor/focus: only update when different and not focused
  try {
    if (document.activeElement === input) return;
    if (input.value !== newValue) input.value = newValue;
  } catch (e) {
    // noop - defensive
  }
}

export function renderList<T>(
  container: HTMLElement,
  items: T[],
  keyFn: (item: T) => string,
  renderItem: (item: T, existing?: HTMLElement) => HTMLElement
) {
  // Simple reconciliation by key: reuse existing nodes when keys match
  const existingMap = new Map<string, HTMLElement>();
  Array.from(container.children).forEach((child) => {
    const k = child.getAttribute('data-key');
    if (k) existingMap.set(k, child as HTMLElement);
  });

  const newChildren: HTMLElement[] = [];
  items.forEach((it) => {
    const key = keyFn(it);
    const existing = existingMap.get(key);
    const node = renderItem(it, existing);
    node.setAttribute('data-key', key);
    newChildren.push(node);
    existingMap.delete(key);
  });

  // Remove leftover nodes
  existingMap.forEach((node) => node.remove());

  // Patch container children in order
  // If same node already in position, skip; otherwise append in correct order
  newChildren.forEach((node, idx) => {
    const current = container.children[idx];
    if (current === node) return;
    if (node.parentElement === container) container.insertBefore(node, current || null);
    else container.insertBefore(node, current || null);
  });
}
