import { createElement } from './renderers';
import { fetchPublishers, fetchPublisher, PublisherData } from '../data/api';

// Helper function to get time ago string
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export async function renderDashboard(container: HTMLElement, store: any, navigate: (v: string) => void) {
  container.innerHTML = '';
  container.className = 'dashboard-container';

  // Load publisher data first
  const pubs = await fetchPublishers();
  const samplePubs = [
    { aliasName: 'Daily News Corp', publisherId: 'news-daily', isActive: true, pages: [1], updatedAt: '11/20/2025' },
    { aliasName: 'Tech Crunchier', publisherId: 'tech-crunchier', isActive: true, pages: [], updatedAt: '11/20/2025' },
    { aliasName: 'Sports Central', publisherId: 'sports-central', isActive: false, pages: [], updatedAt: '11/20/2025' }
  ];
  const pubsData = (pubs && pubs.length >= 3) ? pubs : samplePubs;

  // Main layout: content + sidebar
  const mainLayout = createElement('div', 'dashboard-layout');
  const contentArea = createElement('div', 'dashboard-content');
  const searchSidebar = createElement('div', 'sidebar');
  
  // Wrapper that will extend beyond the content area to center relative to full screen
  const wrapper = createElement('div', 'relative px-8 py-8');
  
  // Create a container that centers content relative to the entire viewport (including sidebar)
  const contentContainer = createElement('div', 'relative');
  // Make the container span the full available width
  contentContainer.style.width = '100%';
  contentContainer.style.position = 'relative';
  
  mainLayout.appendChild(contentArea);
  mainLayout.appendChild(searchSidebar);
  container.appendChild(mainLayout);

  // Header - centered relative to full viewport
  const header = createElement('div', 'mb-8 flex justify-center');
  const h1 = createElement('h1', 'text-4xl font-bold text-slate-900 tracking-tight');
  h1.textContent = 'Publisher Configuration Tool';
  header.appendChild(h1);
  contentContainer.appendChild(header);

  // Function to check if publisher is draft (missing required fields)
  function isDraft(publisher: PublisherData): boolean {
    return !publisher.publisherId ||
           !publisher.aliasName ||
           !publisher.pages?.length ||
           !publisher.publisherDashboard ||
           !publisher.monitorDashboard ||
           !publisher.qaStatusDashboard;
  }
  
  // Calculate stats with new logic
  const draftCount = pubsData.filter(isDraft).length;
  const completedPublishers = pubsData.filter(p => !isDraft(p));
  const activeCount = completedPublishers.filter(p => p.isActive).length;
  const inactiveCount = completedPublishers.filter(p => !p.isActive).length;
  const totalCount = pubsData.length;

  // Top section - reorganized for new user experience
  // Flow: Start Here → Quick Actions → Overview
  const topSection = createElement('div', 'flex items-stretch justify-center gap-6 mb-8');
  
  // 1. Create New Publisher Button (left side) - Primary CTA
  const createBtnWrapper = createElement('div', 'flex items-center justify-center flex-shrink-0');
  const createBtn = createElement('button', 'flex flex-col items-center justify-center gap-4 px-12 py-8 bg-white border-2 border-dashed border-slate-200 text-slate-700 rounded-xl font-semibold text-lg transition-all hover:bg-slate-50 hover:border-slate-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md min-h-full');
  createBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg><span class="text-center leading-tight">Create New<br>Publisher</span>`;
  createBtn.addEventListener('click', () => {
    navigate('editor');
    const newPub = {
      publisherId: `new-${Date.now()}`,
      aliasName: '', isActive: true, tags: [], publisherDashboard: '', monitorDashboard: '', qaStatusDashboard: '', allowedDomains: [], customCss: '', notes: '', pages: []
    };
    store.load(newPub);
  });
  createBtnWrapper.appendChild(createBtn);
  
  // 2. Recent Publishers Card (center) - Recently worked on publishers
  const recentPublishersCard = createElement('div', 'recent-publishers-card');
  
  const recentHeader = createElement('div', 'recent-header');
  const recentTitle = createElement('h2', 'recent-title');
  recentTitle.textContent = 'Recent Publishers';
  recentHeader.appendChild(recentTitle);
  
  const recentList = createElement('div', 'recent-list');
  
  // Get recent publishers (sorted by updatedAt, limit to 3 for this card)
  const recentPublishers = [...pubsData]
    .sort((a, b) => new Date(b.updatedAt || '2025-01-01').getTime() - new Date(a.updatedAt || '2025-01-01').getTime())
    .slice(0, 3);
  
  recentPublishers.forEach((p: any) => {
    const recentItem = createElement('button', 'recent-item');
    recentItem.addEventListener('click', () => { navigate('editor'); store.load(p); });
    
    // Status indicator icon with avatar-style background
    const statusIcon = createElement('div', `recent-status-icon ${p.isActive ? 'active' : 'inactive'}`);
    
    // Create initials from publisher name
    const initials = (p.aliasName || 'UN').split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase();
    const initialsEl = createElement('span', 'status-initials');
    initialsEl.textContent = initials;
    statusIcon.appendChild(initialsEl);
    
    // Status badge
    const statusBadge = createElement('div', `status-badge ${p.isActive ? 'active' : 'inactive'}`);
    statusBadge.innerHTML = p.isActive 
      ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 12l2 2 4-4"></path></svg>`
      : `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="3"></circle></svg>`;
    statusIcon.appendChild(statusBadge);
    
    const itemContent = createElement('div', 'recent-item-content');
    const itemName = createElement('div', 'recent-item-name');
    itemName.textContent = p.aliasName || 'Untitled Publisher';
    
    const itemMeta = createElement('div', 'recent-item-meta');
    const timeAgo = getTimeAgo(p.updatedAt || '2025-01-01');
    itemMeta.innerHTML = `<span class="meta-time">${timeAgo}</span> • <span class="meta-pages">${p.pages?.length || 0} pages</span>`;
    
    itemContent.appendChild(itemName);
    itemContent.appendChild(itemMeta);
    
    recentItem.appendChild(statusIcon);
    recentItem.appendChild(itemContent);
    recentList.appendChild(recentItem);
  });
  
  // If no publishers, show empty state
  if (recentPublishers.length === 0) {
    const emptyState = createElement('div', 'recent-empty-state');
    emptyState.innerHTML = `
      <div class="empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>
      <p class="empty-title">No publishers yet</p>
      <p class="empty-subtitle">Create your first one to get started!</p>
    `;
    recentList.appendChild(emptyState);
  }
  
  recentPublishersCard.appendChild(recentHeader);
  recentPublishersCard.appendChild(recentList);
  
  // 3. Overview Stats (right side) - Status overview
  const overviewCard = createElement('div', 'bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-shrink-0 w-80');
  
  const overviewHeader = createElement('div', 'text-center mb-4');
  const overviewTitle = createElement('h2', 'text-lg font-semibold text-slate-700 mb-2');
  overviewTitle.textContent = 'Overview';
  const totalNumber = createElement('div', 'text-2xl font-bold text-slate-800 total-number-main');
  totalNumber.textContent = String(totalCount) + ' Publishers';
  overviewHeader.appendChild(overviewTitle);
  overviewHeader.appendChild(totalNumber);
  
  // Stats grid
  const statsGrid = createElement('div', 'grid grid-cols-2 gap-4 mt-4');
  
  // Active count
  const activeStats = createElement('div', 'text-center p-3 bg-emerald-50 rounded-lg');
  const activeStatsNumber = createElement('div', 'text-xl font-bold text-emerald-600 mb-1 active-number-main');
  activeStatsNumber.textContent = String(activeCount);
  const activeStatsLabel = createElement('div', 'text-xs font-medium text-emerald-700');
  activeStatsLabel.textContent = 'Active';
  activeStats.appendChild(activeStatsNumber);
  activeStats.appendChild(activeStatsLabel);
  
  // Inactive count
  const inactiveStats = createElement('div', 'text-center p-3 bg-slate-50 rounded-lg');
  const inactiveStatsNumber = createElement('div', 'text-xl font-bold text-slate-600 mb-1 inactive-number-main');
  inactiveStatsNumber.textContent = String(inactiveCount);
  const inactiveStatsLabel = createElement('div', 'text-xs font-medium text-slate-700');
  inactiveStatsLabel.textContent = 'Inactive';
  inactiveStats.appendChild(inactiveStatsNumber);
  inactiveStats.appendChild(inactiveStatsLabel);
  
  // Draft count
  const draftStats = createElement('div', 'text-center p-3 bg-amber-50 rounded-lg');
  const draftStatsNumber = createElement('div', 'text-xl font-bold text-amber-600 mb-1 draft-number-main');
  draftStatsNumber.textContent = String(draftCount);
  const draftStatsLabel = createElement('div', 'text-xs font-medium text-amber-700');
  draftStatsLabel.textContent = 'Draft';
  draftStats.appendChild(draftStatsNumber);
  draftStats.appendChild(draftStatsLabel);
  
  statsGrid.appendChild(activeStats);
  statsGrid.appendChild(inactiveStats);
  if (draftCount > 0) {
    statsGrid.appendChild(draftStats);
  }
  
  overviewCard.appendChild(overviewHeader);
  overviewCard.appendChild(statsGrid);
  
  topSection.appendChild(createBtnWrapper);
  topSection.appendChild(recentPublishersCard);
  topSection.appendChild(overviewCard);
  contentContainer.appendChild(topSection);




  
  // Add content container to wrapper and wrapper to content area
  wrapper.appendChild(contentContainer);
  contentArea.appendChild(wrapper);

  // Stats already calculated above

  // Section that lists publishers beneath the hero stats
  const publisherGrid = createElement('div', 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 px-2 md:px-0');
  contentContainer.appendChild(publisherGrid);

  // Search & Filter functionality
  let filteredData = [...(pubsData || [])];
  let activeFilters = { activeOnly: false, draftsOnly: false, searchQuery: '' };

  function updateDisplay() {
    publisherGrid.innerHTML = '';
    
    filteredData.forEach((p: any) => {
      const pubCard = createElement('div', 'bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer group');
      pubCard.addEventListener('click', () => { navigate('editor'); store.load(p); });
      
      const pubHeader = createElement('div', 'flex items-center justify-between mb-3');
      const pubInfo = createElement('div', '');
      const pubName = createElement('div', 'font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors');
      pubName.textContent = p.aliasName || 'Untitled Publisher';
      const pubId = createElement('div', 'text-xs text-slate-500 font-mono mt-1');
      pubId.textContent = p.publisherId;
      
      pubInfo.appendChild(pubName);
      pubInfo.appendChild(pubId);
      
      const pubStatus = createElement('div', 'flex flex-col items-end gap-1');
      const statusBadge = createElement('span', `px-2 py-1 rounded-full text-xs font-medium ${
        p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`);
      statusBadge.textContent = p.isActive ? 'Active' : 'Draft';
      
      const pageCount = createElement('div', 'text-xs text-slate-500');
      pageCount.textContent = `${p.pages?.length || 0} pages`;
      
      pubStatus.appendChild(statusBadge);
      pubStatus.appendChild(pageCount);
      
      pubHeader.appendChild(pubInfo);
      pubHeader.appendChild(pubStatus);
      
      // Configuration details
      const configDetails = createElement('div', 'space-y-2 mt-3 pt-3 border-t border-slate-200');
      
      if (p.publisherDashboard) {
        const dashItem = createElement('div', 'flex items-center gap-2 text-xs text-slate-600');
        const dashIcon = createElement('div', 'w-3 h-3 text-blue-500');
        dashIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect></svg>`;
        const dashText = createElement('span', '');
        dashText.textContent = 'Publisher Dashboard';
        dashItem.appendChild(dashIcon);
        dashItem.appendChild(dashText);
        configDetails.appendChild(dashItem);
      }
      
      if (p.monitorDashboard) {
        const monitorItem = createElement('div', 'flex items-center gap-2 text-xs text-slate-600');
        const monitorIcon = createElement('div', 'w-3 h-3 text-green-500');
        monitorIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
        const monitorText = createElement('span', '');
        monitorText.textContent = 'Monitor Dashboard';
        monitorItem.appendChild(monitorIcon);
        monitorItem.appendChild(monitorText);
        configDetails.appendChild(monitorItem);
      }
      
      if (p.qaStatusDashboard) {
        const qaItem = createElement('div', 'flex items-center gap-2 text-xs text-slate-600');
        const qaIcon = createElement('div', 'w-3 h-3 text-purple-500');
        qaIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg>`;
        const qaText = createElement('span', '');
        qaText.textContent = 'QA Status Dashboard';
        qaItem.appendChild(qaIcon);
        qaItem.appendChild(qaText);
        configDetails.appendChild(qaItem);
      }
      
      pubCard.appendChild(pubHeader);
      if (configDetails.children.length > 0) {
        pubCard.appendChild(configDetails);
      }
      publisherGrid.appendChild(pubCard);
    });
    
    // Update results count
    const resultsCount = searchSidebar.querySelector('.results-count') as HTMLElement;
    if (resultsCount) {
      resultsCount.textContent = `${filteredData.length} results`;
    }
    
    // Update metrics cards based on filtered data
    const activeCountFiltered = filteredData.filter((p: any) => p.isActive).length;
    const inactiveCountFiltered = filteredData.length - activeCountFiltered;
    
    // Update main stats card
    const totalNumberMainEl = wrapper.querySelector('.total-number-main') as HTMLElement;
    const activeNumberMainEl = wrapper.querySelector('.active-number-main') as HTMLElement;
    const inactiveNumberMainEl = wrapper.querySelector('.inactive-number-main') as HTMLElement;
    const draftNumberMainEl = wrapper.querySelector('.draft-number-main') as HTMLElement;
    
    const draftCountFiltered = filteredData.filter(isDraft).length;
    const completedFiltered = filteredData.filter(p => !isDraft(p));
    const activeCountFiltered = completedFiltered.filter(p => p.isActive).length;
    const inactiveCountFiltered = completedFiltered.filter(p => !p.isActive).length;
    
    if (totalNumberMainEl) totalNumberMainEl.textContent = String(filteredData.length);
    if (activeNumberMainEl) activeNumberMainEl.textContent = String(activeCountFiltered);
    if (inactiveNumberMainEl) inactiveNumberMainEl.textContent = String(inactiveCountFiltered);
    if (draftNumberMainEl) draftNumberMainEl.textContent = String(draftCountFiltered);
  }

  function applyFilters() {
    filteredData = (pubsData || []).filter((p: any) => {
      // Search query filter
      if (activeFilters.searchQuery) {
        const query = activeFilters.searchQuery.toLowerCase();
        const matchesAlias = (p.aliasName || '').toLowerCase().includes(query);
        const matchesId = (p.publisherId || '').toLowerCase().includes(query);
        const matchesTags = (p.tags || []).some((tag: string) => tag.toLowerCase().includes(query));
        
        if (!matchesAlias && !matchesId && !matchesTags) {
          return false;
        }
      }
      
      // Active only filter
      if (activeFilters.activeOnly && !p.isActive) {
        return false;
      }
      
      // Drafts only filter
      if (activeFilters.draftsOnly && p.isActive) {
        return false;
      }
      
      return true;
    });
    
    updateDisplay();
  }

  // Build Search Sidebar
  const sidebarHeader = createElement('div', 'sidebar-header');
  const sidebarTitle = createElement('h3', 'sidebar-title');
  const searchIcon = createElement('div', 'search-icon');
  searchIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`;
  sidebarTitle.appendChild(searchIcon);
  sidebarTitle.appendChild(document.createTextNode('Search & Filter'));
  sidebarHeader.appendChild(sidebarTitle);
  searchSidebar.appendChild(sidebarHeader);
  
  const sidebarContent = createElement('div', 'sidebar-content');
  
  // Global Search Bar
  const searchSection = createElement('div', 'search-section');
  const searchLabel = createElement('label', 'search-label');
  searchLabel.textContent = 'Quick Search';
  
  const searchInputWrapper = createElement('div', 'search-input-wrapper');
  const searchInput = createElement('input', 'search-input') as HTMLInputElement;
  searchInput.type = 'text';
  searchInput.placeholder = 'Search by name, ID, or tags...';
  
  const searchInputIcon = createElement('div', 'search-icon');
  searchInputIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`;
  
  searchInputWrapper.appendChild(searchInputIcon);
  searchInputWrapper.appendChild(searchInput);
  
  searchInput.addEventListener('input', (e) => {
    activeFilters.searchQuery = (e.target as HTMLInputElement).value;
    applyFilters();
  });
  
  searchSection.appendChild(searchLabel);
  searchSection.appendChild(searchInputWrapper);
  
  // Quick Filter Chips
  const filtersSection = createElement('div', 'filters-section');
  const filtersLabel = createElement('label', 'filters-label');
  filtersLabel.textContent = 'Quick Filters';
  
  const filtersWrapper = createElement('div', 'filters-wrapper');
  
  // Active Only Filter
  const activeChip = createElement('button', 'filter-chip');
  activeChip.textContent = 'Active Only';
  
  // Drafts Only Filter
  const draftsChip = createElement('button', 'filter-chip');
  draftsChip.textContent = 'Drafts Only';
  
  // Clear Filters
  const clearChip = createElement('button', 'filter-chip clear');
  clearChip.textContent = 'Clear All';
  
  activeChip.addEventListener('click', () => {
    activeFilters.activeOnly = !activeFilters.activeOnly;
    if (activeFilters.activeOnly) {
      activeFilters.draftsOnly = false;
      draftsChip.className = 'filter-chip';
    }
    activeChip.className = activeFilters.activeOnly 
      ? 'filter-chip active'
      : 'filter-chip';
    applyFilters();
  });
  
  draftsChip.addEventListener('click', () => {
    activeFilters.draftsOnly = !activeFilters.draftsOnly;
    if (activeFilters.draftsOnly) {
      activeFilters.activeOnly = false;
      activeChip.className = 'filter-chip';
    }
    draftsChip.className = activeFilters.draftsOnly 
      ? 'filter-chip active-drafts'
      : 'filter-chip';
    applyFilters();
  });
  
  clearChip.addEventListener('click', () => {
    activeFilters = { activeOnly: false, draftsOnly: false, searchQuery: '' };
    searchInput.value = '';
    activeChip.className = 'filter-chip';
    draftsChip.className = 'filter-chip';
    applyFilters();
  });
  
  filtersWrapper.appendChild(activeChip);
  filtersWrapper.appendChild(draftsChip);
  filtersWrapper.appendChild(clearChip);
  
  filtersSection.appendChild(filtersLabel);
  filtersSection.appendChild(filtersWrapper);
  
  // Results Count
  const resultsSection = createElement('div', 'results-section');
  const resultsCount = createElement('div', 'results-count');
  resultsCount.textContent = `${pubsData.length} results`;
  resultsSection.appendChild(resultsCount);
  
  // Available Tags (for reference)
  const allTags = [...new Set((pubsData || []).flatMap((p: any) => p.tags || []))];
  if (allTags.length > 0) {
    const tagsSection = createElement('div', 'tags-section');
    const tagsLabel = createElement('label', 'tags-label');
    tagsLabel.textContent = 'Available Tags';
    
    const tagsWrapper = createElement('div', 'tags-wrapper');
    allTags.slice(0, 8).forEach((tag: string) => {
      const tagChip = createElement('span', 'tag-chip');
      tagChip.textContent = tag;
      tagChip.addEventListener('click', () => {
        searchInput.value = tag;
        activeFilters.searchQuery = tag;
        applyFilters();
      });
      tagsWrapper.appendChild(tagChip);
    });
    
    tagsSection.appendChild(tagsLabel);
    tagsSection.appendChild(tagsWrapper);
    sidebarContent.appendChild(tagsSection);
  }
  
  sidebarContent.appendChild(searchSection);
  sidebarContent.appendChild(filtersSection);
  sidebarContent.appendChild(resultsSection);
  
  searchSidebar.appendChild(sidebarContent);
  
  // Initialize display
  updateDisplay();
}