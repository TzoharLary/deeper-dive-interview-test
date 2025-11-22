import { fetchPublishers } from '../data/api.js';
import { createStore } from '../state/store.js';
import type { Publisher } from '../types/index.js';

let currentStore: any = null;

export async function renderPublishersPage(container: HTMLElement) {
  container.innerHTML = '';
  container.className = 'publishers-page';

  // Create the main layout
  const layout = document.createElement('div');
  layout.className = 'publishers-layout';

  // Left sidebar for publishers list
  const sidebar = document.createElement('div');
  sidebar.className = 'publishers-sidebar';

  // Right panel for publisher details/editor
  const detailsPanel = document.createElement('div');
  detailsPanel.className = 'publisher-details';

  layout.appendChild(sidebar);
  layout.appendChild(detailsPanel);
  container.appendChild(layout);

  // Load publishers data
  let publishers: Publisher[] = [];
  try {
      const data = await fetchPublishers();
      // `fetchPublishers()` returns an array of publisher list items.
      // Some callers expected an object { publishers: [...] } — handle both shapes.
      if (Array.isArray(data)) publishers = data as any;
      else publishers = (data && (data.publishers || [])) as any;
  } catch (error) {
    console.error('Error loading publishers:', error);
    publishers = [];
  }

  // Render sidebar
  renderSidebar(sidebar, publishers, detailsPanel);

  // Listen for saves so we can refresh the publishers list when a new
  // publisher is created or an existing one is updated.
  const onSaved = async () => {
    try {
        const data = await fetchPublishers();
        if (Array.isArray(data)) publishers = data as any;
        else publishers = (data && (data.publishers || [])) as any;
      renderSidebar(sidebar, publishers, detailsPanel);
    } catch (err) {
      console.error('Failed to refresh publishers after save:', err);
    }
  };
  window.addEventListener('publisher:saved', onSaved as EventListener);

  // If the container is removed/unmounted, it's good hygiene to remove the listener.
  // We can't reliably detect unmount here, but attach a WeakRef-based guard would be overkill.
  // For now leaving the listener attached for the lifetime of the page is acceptable.

  // Show empty state in details panel initially
  showEmptyState(detailsPanel);
}

function renderSidebar(sidebar: HTMLElement, publishers: Publisher[], detailsPanel: HTMLElement) {
  sidebar.innerHTML = '';

  // Header with title and create button
  const header = document.createElement('div');
  header.className = 'publishers-header';
  
  const title = document.createElement('h1');
  title.textContent = 'Publishers';
  
  const headerActions = document.createElement('div');
  headerActions.className = 'header-actions';
  
  // Upload button
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'upload-btn';
  uploadBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7,10 12,15 17,10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;
  uploadBtn.title = 'Upload Publisher Config';
  
  const createBtn = document.createElement('button');
  createBtn.className = 'create-btn';
  createBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `;
  createBtn.title = 'Create New Publisher';
  
  createBtn.addEventListener('click', () => {
    // Create new publisher
    const newPublisher: Publisher = {
      publisherId: '',
      aliasName: '',
      isActive: true,
      tags: [],
      publisherDashboard: '',
      monitorDashboard: '',
      qaStatusDashboard: '',
      allowedDomains: [],
      customCss: '',
      notes: '',
      pages: []
    };
    
    currentStore = createStore(newPublisher, 'create');
    renderPublisherEditor(detailsPanel, currentStore);
  });
  
  headerActions.appendChild(uploadBtn);
  headerActions.appendChild(createBtn);
  header.appendChild(title);
  header.appendChild(headerActions);
  
  // Search wrapper
  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-wrapper';
  
  const searchIcon = document.createElement('div');
  searchIcon.className = 'search-icon';
  searchIcon.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  `;
  
  const searchInput = document.createElement('input');
  searchInput.className = 'search-input';
  searchInput.type = 'text';
  searchInput.placeholder = 'Search publishers...';
  
  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);
  
  // Publishers list
  const publishersList = document.createElement('div');
  publishersList.className = 'publishers-list';
  
  // Filter and render publishers
  let filteredPublishers = publishers;
  
  function renderPublishersList() {
    publishersList.innerHTML = '';
    
    if (filteredPublishers.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = searchInput.value ? 'No matching publishers found' : 'No publishers found';
      publishersList.appendChild(emptyState);
      return;
    }
    
    filteredPublishers.forEach(publisher => {
      const item = document.createElement('button');
      item.className = 'publisher-item';
      
      const info = document.createElement('div');
      info.className = 'publisher-info';
      
      const name = document.createElement('div');
      name.className = 'publisher-name';
      name.textContent = publisher.aliasName || publisher.publisherId || 'Untitled';
      
      const id = document.createElement('div');
      id.className = 'publisher-id';
      id.textContent = publisher.publisherId || '';
      
      const status = document.createElement('div');
      status.className = `status-indicator ${publisher.isActive ? 'active' : 'inactive'}`;
      
      info.appendChild(name);
      info.appendChild(id);
      item.appendChild(info);
      item.appendChild(status);
      
      item.addEventListener('click', () => {
        // Remove selected class from all items
        publishersList.querySelectorAll('.publisher-item').forEach(el => {
          el.classList.remove('selected');
        });
        
        // Add selected class to clicked item
        item.classList.add('selected');
        
        // Load publisher in store and render editor
        currentStore = createStore(publisher, 'edit');
        renderPublisherEditor(detailsPanel, currentStore);
      });
      
      publishersList.appendChild(item);
    });
  }
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    filteredPublishers = publishers.filter(pub => 
      (pub.aliasName || '').toLowerCase().includes(query) ||
      (pub.publisherId || '').toLowerCase().includes(query) ||
      (pub.tags || []).some((tag: string) => tag.toLowerCase().includes(query))
    );
    renderPublishersList();
  });
  
  // Assemble sidebar
  sidebar.appendChild(header);
  sidebar.appendChild(searchWrapper);
  sidebar.appendChild(publishersList);
  
  // Initial render
  renderPublishersList();
}

function renderPublisherEditor(detailsPanel: HTMLElement, store: any) {
  detailsPanel.innerHTML = '';
  
  const content = document.createElement('div');
  content.className = 'details-content';
  
  // Page header with editing indicator
  const pageHeader = document.createElement('div');
  pageHeader.className = 'page-header';
  
  const h1 = document.createElement('h1');
  h1.textContent = 'Publisher Configuration';
  
  const editingIndicator = document.createElement('div');
  editingIndicator.className = 'editing-indicator';
  editingIndicator.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
    <span>Editing</span>
  `;
  
  pageHeader.appendChild(h1);
  pageHeader.appendChild(editingIndicator);
  content.appendChild(pageHeader);
  
  // Three column layout
  const threeColumnLayout = document.createElement('div');
  threeColumnLayout.className = 'three-column-layout';
  
  // Left column
  const leftColumn = document.createElement('div');
  leftColumn.className = 'left-column';
  
  // General Info section
  const generalSection = createFieldset('General Info');
  
  // Publisher ID
  const publisherIdRow = document.createElement('div');
  publisherIdRow.className = 'form-row';
  const publisherIdGroup = createFormGroup('Publisher ID', 'publisherId', 'text', store);
  publisherIdRow.appendChild(publisherIdGroup);
  generalSection.appendChild(publisherIdRow);
  
  // Alias Name
  const aliasNameRow = document.createElement('div');
  aliasNameRow.className = 'form-row';
  const aliasNameGroup = createFormGroup('Alias Name', 'aliasName', 'text', store);
  aliasNameRow.appendChild(aliasNameGroup);
  generalSection.appendChild(aliasNameRow);
  
  // Tags
  const tagsRow = document.createElement('div');
  tagsRow.className = 'form-row';
  const tagsGroup = createTagsGroup(store);
  tagsRow.appendChild(tagsGroup);
  generalSection.appendChild(tagsRow);
  
  // Active Status Toggle
  const statusRow = document.createElement('div');
  statusRow.className = 'form-row';
  const statusGroup = createToggleGroup('Active Status', 'isActive', 'Enable/Disable publisher', store);
  statusRow.appendChild(statusGroup);
  generalSection.appendChild(statusRow);
  
  leftColumn.appendChild(generalSection);
  
  // Right column
  const rightColumn = document.createElement('div');
  rightColumn.className = 'right-column';
  
  // Links & Resources section
  const linksSection = createFieldset('Links & Resources');
  
  // Publisher Dashboard
  const pubDashRow = document.createElement('div');
  pubDashRow.className = 'form-row';
  const pubDashGroup = createFormGroup('Publisher Dashboard', 'publisherDashboard', 'url', store);
  pubDashRow.appendChild(pubDashGroup);
  linksSection.appendChild(pubDashRow);
  
  // Monitor Dashboard
  const monitorDashRow = document.createElement('div');
  monitorDashRow.className = 'form-row';
  const monitorDashGroup = createFormGroup('Monitor Dashboard', 'monitorDashboard', 'url', store);
  monitorDashRow.appendChild(monitorDashGroup);
  linksSection.appendChild(monitorDashRow);
  
  // QA Status Dashboard
  const qaDashRow = document.createElement('div');
  qaDashRow.className = 'form-row';
  const qaDashGroup = createFormGroup('QA Status Dashboard', 'qaStatusDashboard', 'url', store);
  qaDashRow.appendChild(qaDashGroup);
  linksSection.appendChild(qaDashRow);
  
  rightColumn.appendChild(linksSection);
  
  // Missing fields column (third column)
  const missingFieldsColumn = document.createElement('div');
  missingFieldsColumn.className = 'missing-fields-column';
  
  const missingFieldsSection = createMissingFieldsSection(store);
  missingFieldsColumn.appendChild(missingFieldsSection);
  
  threeColumnLayout.appendChild(leftColumn);
  threeColumnLayout.appendChild(rightColumn);
  threeColumnLayout.appendChild(missingFieldsColumn);
  content.appendChild(threeColumnLayout);
  
  // Page configurations section (full width)
  const pageConfigsSection = createPageConfigsSection(store);
  content.appendChild(pageConfigsSection);
  
  // Advanced Settings section (collapsible)
  const advancedSection = createAdvancedSection(store);
  content.appendChild(advancedSection);
  
  detailsPanel.appendChild(content);
  
  // Add save bar
  const saveBar = createSaveBar(store);
  detailsPanel.appendChild(saveBar);
  
  // Subscribe to store updates
  const unsubscribe = store.subscribe((snapshot: any) => {
    updateFormFromStore(content, snapshot);
    updateSaveBar(saveBar, snapshot);
  });
  
  // Initial update - make sure this happens after DOM is ready
  setTimeout(() => {
    const initialSnapshot = store.getSnapshot();
    updateFormFromStore(content, initialSnapshot);
    updateSaveBar(saveBar, initialSnapshot);
  }, 0);
}

function createFieldset(legend: string, className = '') {
  const fieldset = document.createElement('fieldset');
  fieldset.className = `section-fieldset ${className}`;
  
  const legendEl = document.createElement('legend');
  legendEl.textContent = legend;
  fieldset.appendChild(legendEl);
  
  return fieldset;
}

function createFormGroup(label: string, fieldName: string, type: string, store: any) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  group.appendChild(labelEl);
  
  const input = document.createElement('input');
  input.type = type;
  input.name = fieldName;
  
  // Set initial value from store
  const currentData = store.getSnapshot().currentData;
  if (currentData && currentData[fieldName] !== undefined) {
    input.value = currentData[fieldName] || '';
  }
  
  input.addEventListener('input', (e) => {
    store.markTouched(fieldName);
    store.updateField(fieldName, (e.target as HTMLInputElement).value);
  });
  
  group.appendChild(input);
  return group;
}

function createTagsGroup(store: any) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const label = document.createElement('label');
  label.textContent = 'Tags';
  group.appendChild(label);
  
  const wrapper = document.createElement('div');
  wrapper.className = 'tags-input-wrapper';
  
  const container = document.createElement('div');
  container.className = 'tags-container';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add tags...';
  input.name = 'tags';
  
  // Render initial tags
  function renderTags() {
    const currentData = store.getSnapshot().currentData;
    const tags = currentData?.tags || [];
    container.innerHTML = '';
    tags.forEach((tag: string, index: number) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.innerHTML = `${tag} <span class="tag-close">×</span>`;
      const closeBtn = tagEl.querySelector('.tag-close');
      closeBtn?.addEventListener('click', () => {
        const newTags = tags.filter((_: string, i: number) => i !== index);
        store.updateField('tags', newTags);
      });
      container.appendChild(tagEl);
    });
  }
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = input.value.trim();
      if (value) {
        const currentTags = store.getSnapshot().currentData?.tags || [];
        store.updateField('tags', [...currentTags, value]);
        input.value = '';
      }
    }
  });
  
  // Subscribe to store changes to update tags display
  store.subscribe(() => {
    renderTags();
  });
  
  // Initial render
  renderTags();
  
  wrapper.appendChild(container);
  wrapper.appendChild(input);
  group.appendChild(wrapper);
  
  return group;
}

function createToggleGroup(label: string, fieldName: string, description: string, store: any) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const toggleSwitch = document.createElement('label');
  toggleSwitch.className = 'toggle-switch';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = fieldName;
  
  // Set initial value from store
  const currentData = store.getSnapshot().currentData;
  if (currentData && currentData[fieldName] !== undefined) {
    input.checked = Boolean(currentData[fieldName]);
  }
  
  input.addEventListener('change', (e) => {
    store.updateField(fieldName, (e.target as HTMLInputElement).checked);
  });
  
  const slider = document.createElement('span');
  slider.className = 'toggle-slider';
  
  const text = document.createElement('span');
  text.className = 'toggle-text';
  text.textContent = description;
  
  toggleSwitch.appendChild(input);
  toggleSwitch.appendChild(slider);
  toggleSwitch.appendChild(text);
  group.appendChild(toggleSwitch);
  
  return group;
}

function createMissingFieldsSection(store: any) {
  const section = createFieldset('Missing Fields', 'missing-fields-section');
  
  const content = document.createElement('div');
  content.className = 'missing-fields-content';
  
  section.appendChild(content);
  return section;
}

function createPageConfigsSection(store: any) {
  const section = createFieldset('Page Configurations');
  
  const actions = document.createElement('div');
  actions.className = 'section-actions';
  
  const addArticleBtn = document.createElement('button');
  addArticleBtn.className = 'add-btn';
  addArticleBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add Article Page
  `;
  addArticleBtn.addEventListener('click', () => store.addPage('article'));
  
  const addHomeBtn = document.createElement('button');
  addHomeBtn.className = 'add-btn';
  addHomeBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add Home Page
  `;
  addHomeBtn.addEventListener('click', () => store.addPage('homepage'));
  
  actions.appendChild(addArticleBtn);
  actions.appendChild(addHomeBtn);
  section.appendChild(actions);
  
  const configs = document.createElement('div');
  configs.className = 'page-configs';
  section.appendChild(configs);
  
  return section;
}

function createAdvancedSection(store: any) {
  const section = createFieldset('Advanced Settings', 'collapsible');
  
  const header = document.createElement('div');
  header.className = 'collapsible-header';
  header.innerHTML = `
    <span>Advanced Settings</span>
    <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  `;
  
  const content = document.createElement('div');
  content.className = 'collapsible-content';
  
  // Allowed Domains
  const domainsGroup = createFormGroup('Allowed Domains', 'allowedDomains', 'text', store);
  content.appendChild(domainsGroup);
  
  // Custom CSS
  const cssGroup = document.createElement('div');
  cssGroup.className = 'form-group';
  const cssLabel = document.createElement('label');
  cssLabel.textContent = 'Custom CSS';
  const cssTextarea = document.createElement('textarea');
  cssTextarea.name = 'customCss';
  cssTextarea.rows = 5;
  
  // Set initial value
  const currentData = store.getSnapshot().currentData;
  if (currentData && currentData.customCss !== undefined) {
    cssTextarea.value = currentData.customCss || '';
  }
  
  cssTextarea.addEventListener('input', (e) => {
    store.updateField('customCss', (e.target as HTMLTextAreaElement).value);
  });
  cssGroup.appendChild(cssLabel);
  cssGroup.appendChild(cssTextarea);
  content.appendChild(cssGroup);
  
  // Notes
  const notesGroup = document.createElement('div');
  notesGroup.className = 'form-group';
  const notesLabel = document.createElement('label');
  notesLabel.textContent = 'Notes';
  const notesTextarea = document.createElement('textarea');
  notesTextarea.name = 'notes';
  notesTextarea.rows = 3;
  
  // Set initial value
  if (currentData && currentData.notes !== undefined) {
    notesTextarea.value = currentData.notes || '';
  }
  
  notesTextarea.addEventListener('input', (e) => {
    store.updateField('notes', (e.target as HTMLTextAreaElement).value);
  });
  notesGroup.appendChild(notesLabel);
  notesGroup.appendChild(notesTextarea);
  content.appendChild(notesGroup);
  
  section.appendChild(header);
  section.appendChild(content);
  
  // Toggle functionality
  header.addEventListener('click', () => {
    section.classList.toggle('expanded');
  });
  
  return section;
}

function createSaveBar(store: any) {
  const saveBar = document.createElement('div');
  saveBar.className = 'save-bar';
  
  const content = document.createElement('div');
  content.className = 'save-bar-content';
  
  const text = document.createElement('div');
  text.className = 'save-bar-text';
  text.textContent = 'Ready';
  
  const actions = document.createElement('div');
  actions.className = 'save-bar-actions';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'cancel-btn';
  cancelBtn.textContent = 'Cancel';
  
  const saveBtn = document.createElement('button');
  saveBtn.className = 'save-btn';
  saveBtn.textContent = 'Save Changes';
  saveBtn.addEventListener('click', async () => {
    try {
      const payload = store.prepareForSave();
      await store.save(payload);
    } catch (error) {
      console.error('Save failed:', error);
    }
  });
  
  actions.appendChild(cancelBtn);
  actions.appendChild(saveBtn);
  content.appendChild(text);
  content.appendChild(actions);
  saveBar.appendChild(content);
  
  return saveBar;
}

function updateFormFromStore(content: HTMLElement, snapshot: any) {
  const data = snapshot.currentData || {};
  
  // Update form fields
  const inputs = content.querySelectorAll('input, textarea, select');
  inputs.forEach((input: any) => {
    if (input.name && data.hasOwnProperty(input.name)) {
      if (input.type === 'checkbox') {
        input.checked = Boolean(data[input.name]);
      } else if (input.name === 'tags') {
        // Tags are handled separately
      } else {
        const value = data[input.name];
        // Don't overwrite the value of the field the user is actively
        // editing — this can clobber the cursor/selection and make typing
        // feel impossible when store updates happen synchronously.
        // Update only when the element is not focused.
        try {
          if (document.activeElement !== input) {
            if (input.value !== value) {
              input.value = value || '';
            }
          }
        } catch (e) {
          // Defensive: in rare sandboxed contexts accessing document.activeElement
          // might throw; fall back to safe update.
          if (input.value !== value) {
            input.value = value || '';
          }
        }
      }
    }
  });
  
  // Update tags
  const tagsContainer = content.querySelector('.tags-container');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    (data.tags || []).forEach((tag: string) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.innerHTML = `${tag} <span class="tag-close" onclick="this.parentElement.remove()">×</span>`;
      tagsContainer.appendChild(tagEl);
    });
  }
  
  // Update page configurations
  const pageConfigs = content.querySelector('.page-configs');
  if (pageConfigs) {
    pageConfigs.innerHTML = '';
    (data.pages || []).forEach((page: any, index: number) => {
      const row = createPageConfigRow(page, index, currentStore);
      pageConfigs.appendChild(row);
    });
  }
}

function createPageConfigRow(page: any, index: number, store: any) {
  const row = document.createElement('div');
  row.className = 'config-row';
  
  // Drag handle
  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  handle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>`;
  
  // Position
  const positionField = document.createElement('div');
  positionField.className = 'config-field position';
  const positionLabel = document.createElement('label');
  positionLabel.textContent = 'Position';
  const positionInput = document.createElement('input');
  positionInput.type = 'number';
  positionInput.value = String(page.position || index + 1);
  positionInput.addEventListener('change', () => {
    const newPages = [...(store.getSnapshot().currentData?.pages || [])];
    if (newPages[index]) {
      newPages[index] = { ...newPages[index], position: parseInt(positionInput.value) || 1 };
      store.updateField('pages', newPages);
    }
  });
  positionField.appendChild(positionLabel);
  positionField.appendChild(positionInput);
  
  // Type
  const typeField = document.createElement('div');
  typeField.className = 'config-field';
  const typeLabel = document.createElement('label');
  typeLabel.textContent = 'Type';
  const typeSelect = document.createElement('select');
  ['article', 'homepage', 'section'].forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    if (opt === page.pageType) option.selected = true;
    typeSelect.appendChild(option);
  });
  typeSelect.addEventListener('change', () => {
    const newPages = [...(store.getSnapshot().currentData?.pages || [])];
    if (newPages[index]) {
      newPages[index] = { ...newPages[index], pageType: typeSelect.value };
      store.updateField('pages', newPages);
    }
  });
  typeField.appendChild(typeLabel);
  typeField.appendChild(typeSelect);
  
  // Selector
  const selectorField = document.createElement('div');
  selectorField.className = 'config-field';
  const selectorLabel = document.createElement('label');
  selectorLabel.textContent = 'Selector';
  const selectorInput = document.createElement('input');
  selectorInput.type = 'text';
  selectorInput.value = page.selector || '';
  selectorInput.addEventListener('input', () => {
    const newPages = [...(store.getSnapshot().currentData?.pages || [])];
    if (newPages[index]) {
      newPages[index] = { ...newPages[index], selector: selectorInput.value };
      store.updateField('pages', newPages);
    }
  });
  selectorField.appendChild(selectorLabel);
  selectorField.appendChild(selectorInput);
  
  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
  deleteBtn.addEventListener('click', () => store.removePage(index));
  
  row.appendChild(handle);
  row.appendChild(positionField);
  row.appendChild(typeField);
  row.appendChild(selectorField);
  row.appendChild(deleteBtn);
  
  return row;
}

function updateSaveBar(saveBar: HTMLElement, snapshot: any) {
  const saveBtn = saveBar.querySelector('.save-btn') as HTMLButtonElement;
  const text = saveBar.querySelector('.save-bar-text') as HTMLElement;
  
  const isDirty = snapshot.isDirty;
  const hasErrors = Object.keys(snapshot.validation.errors).length > 0;
  
  if (isDirty) {
    if (hasErrors) {
      text.textContent = 'Please fix validation errors';
      saveBtn.disabled = true;
    } else {
      text.textContent = 'Unsaved changes';
      saveBtn.disabled = false;
    }
  } else {
    text.textContent = 'All changes saved';
    saveBtn.disabled = true;
  }
}

function showEmptyState(detailsPanel: HTMLElement) {
  detailsPanel.innerHTML = `
    <div class="details-content">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; color: #64748b; text-align: center;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; opacity: 0.5;">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 500;">Select a Publisher</h3>
        <p style="margin: 0; font-size: 14px;">Choose a publisher from the list to view and edit its configuration.</p>
      </div>
    </div>
  `;
}