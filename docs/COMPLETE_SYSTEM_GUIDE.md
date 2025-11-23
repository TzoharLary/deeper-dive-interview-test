# Complete System User Guide
## Publisher Configuration Tool

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**For:** Taboola Support Engineers

> **📝 Note about videos:** This guide contains VIDEO SCRIPTS for demonstrations - these are narration scripts to help create actual video recordings. To create the actual videos, follow the recording instructions at the end of each video script section.

> **📸 Note about screenshots:** This guide references the main screenshot. In a complete version, each component would have its own annotated screenshot with arrows and highlights pointing to the specific elements being discussed.

---

## 📚 Table of Contents - Quick Navigation

**Click any section to jump directly to it:**

### 🚀 Getting Started
- [Installation (5 Steps)](#-installation-5-steps)
- [First Time Opening](#first-time-opening)

### 📊 PART 1: Dashboard Page
- [Dashboard Overview with Screenshot](#-part-1-dashboard-page)
- [1. Navigation Bar](#1-navigation-bar)
- [2. Create New Publisher](#2-create-new-publisher-button)
- [3. Recent Publishers](#3-recent-publishers-card)
- [4. Overview Stats](#4-overview-stats-card)
- [5. Publisher Cards](#5-publisher-cards-grid)
- [6. Search & Filter](#6-search--filter-sidebar)
- [Dashboard Video Scripts](#-dashboard-video-scripts-not-actual-videos)

### 📝 PART 2: Publishers Page
- [Publishers Overview](#-part-2-publishers-page)
- [Publishers Sidebar](#publishers-sidebar)
- [Details Panel](#publisher-details-panel)
- [Creating New](#creating-a-new-publisher)
- [Editing Existing](#editing-a-publisher)
- [Publishers Video Scripts](#-publishers-video-scripts-not-actual-videos)

### 📖 Reference & Help
- [Status System](#-status-system-reference)
- [Quick Reference](#-quick-reference-tables)
- [Troubleshooting](#-troubleshooting-guide)
- [Best Practices](#-best-practices)

---

## 🚀 Installation (5 Steps)

### Prerequisites Checklist
- ✅ **Node.js 18+** - [Download here](https://nodejs.org/)
- ✅ **Git** - [Download here](https://git-scm.com/)
- ❌ **NO credentials needed**
- ❌ **NO database required**

### Installation Steps

```bash
# Step 1: Clone the repository
git clone https://github.com/TzoharLary/deeper-dive-interview-test.git

# Step 2: Navigate into the folder
cd deeper-dive-interview-test

# Step 3: Install dependencies
npm install

# Step 4: Start the application
npm run dev

# Step 5: Open your browser
# Go to: http://localhost:3000
```

⏱️ **Total Time:** 10 minutes

---

## First Time Opening

When you open **http://localhost:3000** for the first time:

![Full System Screenshot - Dashboard View](user-guide/images/dashboard-overview.png)

**📸 What you see in this screenshot:**
- **Top:** Navigation bar with 3 tabs (Dashboard, Publishers, Tools)
- **Left:** Large purple "Create New Publisher" button
- **Center:** Recent Publishers card showing 3 recent items
- **Right Top:** Overview stats card (4 Publishers, 3 Active, 1 Inactive)
- **Bottom Center:** Publisher cards grid (4 cards visible)
- **Right Side:** Search & Filter sidebar with tags, search box, and filter buttons

**Three tabs visible at top:**
1. **📊 Dashboard** - Overview of all publishers (default view)
2. **📝 Publishers** - View and edit individual publishers  
3. **🔧 Tools** - Additional tools (coming soon)

**Where to start:** The Dashboard! It gives you the big picture.

---

# 📊 PART 1: DASHBOARD PAGE

## Dashboard Overview

**What is it?** Your central hub for managing publishers. See everything at a glance.

**When to use:**
- 🔍 Starting your work session
- 🔎 Searching for a specific publisher
- 📈 Checking system status
- ⚡ Quick access to recent work

### Screenshot Reference

![Dashboard Page](user-guide/images/dashboard-overview.png)

**📸 In this screenshot, look for:**

1. **Navigation Bar (Very Top)** - Three tabs: Dashboard | Publishers | Tools
2. **Create New Publisher Button (Left)** - Large purple button with + icon
3. **Recent Publishers (Center)** - Card showing "Recent Publishers" with 3 entries (AM, BN, CD)
4. **Overview Stats (Right)** - Card showing "Overview", "4", "3 Active", "1 Inactive"
5. **Publisher Cards (Bottom)** - Grid showing 4 publisher cards (Aurora Media, Borealis News, Cascade Daily, Summit Insights)
6. **Search & Filter (Right Sidebar)** - "Search & Filter" heading with tags, search box, and buttons

---

## 1. Navigation Bar

**📸 Screenshot Location:** Top edge of the screen

![Navigation shown in dashboard screenshot](user-guide/images/dashboard-overview.png)

**Look for:** Horizontal bar at very top with three buttons

**Location:** Top of every page (fixed position)

**Three tabs with icons:**
- **Dashboard** 📊 (grid icon) - Currently active (darker/bold)
- **Publishers** 📝 (book icon) - Click to go to Publishers page
- **Tools** 🔧 (wrench icon) - Coming soon

**Active tab:** Darker text + bold font

**How to use:** Click any tab to switch pages

---

## 2. Create New Publisher Button

**📸 Screenshot Location:** Left side, below navigation

![Create button shown in dashboard screenshot](user-guide/images/dashboard-overview.png)

**Look for:** Large purple/indigo rectangular button on the left with circular + icon and text "Create New Publisher"

**Location:** Left side of Dashboard, prominently displayed

**Appearance:**
- Large purple/indigo button
- **+** icon in circle at top
- Text: "Create New Publisher"
- Vertical layout

**What it does:**
- Opens Publishers page
- Shows empty form
- Ready to create new configuration

**When to click:**
- Adding a new publisher to system
- Starting fresh configuration

---

## 3. Recent Publishers Card

**📸 Screenshot Location:** Center area of Dashboard

![Recent Publishers card in screenshot](user-guide/images/dashboard-overview.png)

**Look for:** White card with "Recent Publishers" heading, showing 3 rows:
- Row 1: Green "AM" avatar with checkmark, "Aurora Media", "10 months ago • 3 pages"
- Row 2: Orange "BN" avatar with dot, "Borealis News", "10 months ago • 3 pages"
- Row 3: Green "CD" avatar with checkmark, "Cascade Daily", "10 months ago • 3 pages"

**Location:** Center of Dashboard

**Shows:** Your 3 most recently edited publishers

**Each entry displays:**
- 🎨 **Colored avatar** with initials (e.g., "AM" for Aurora Media)
- ✅ **Status icon** (✓ = Active in green, ● = Inactive in orange)
- 📝 **Publisher name** (large text)
- ⏰ **Last updated** (e.g., "10 months ago")
- 📄 **Page count** (e.g., "3 pages")

**Example from screenshot:**
- **Aurora Media (AM):** Green avatar with checkmark = Active
- **Borealis News (BN):** Orange avatar with dot = Inactive
- **Cascade Daily (CD):** Green avatar with checkmark = Active

**How to use:**
1. Scan the 3 recent items
2. Click on any row
3. Opens that publisher in Publishers page

**Sorting:** Most recently updated appears first

---

## 4. Overview Stats Card

**📸 Screenshot Location:** Right side, top section

![Overview card in screenshot](user-guide/images/dashboard-overview.png)

**Look for:** White card on right side with:
- "Overview" heading
- Large "4" number
- Green box with "3" and "Active" text
- Gray box with "1" and "Inactive" text

**Location:** Right side of Dashboard, above publisher cards

**Displays:**
- **Total:** Large number "4" with text "Publishers" (all publishers in system)
- **Active:** Green box showing "3" with "Active" label (in use)
- **Inactive:** Gray box showing "1" with "Inactive" label (not in use)

**📊 What the numbers mean:**
- **4 Publishers** = Total count
- **3 Active** = Complete publishers currently serving content
- **1 Inactive** = Complete publishers not serving content

**Dynamic:** Numbers update when you apply filters

**Note:** Draft publishers (incomplete) counted in Total, not shown separately here

---

## 5. Publisher Cards Grid

**📸 Screenshot Location:** Bottom center area

![Publisher cards in screenshot](user-guide/images/dashboard-overview.png)

**Look for:** 4 cards in a grid below the Recent Publishers and Overview sections:
1. "Aurora Media" / "pub-aurora" / Green "Active" badge
2. "Borealis News" / "pub-borealis" / Gray "Inactive" badge
3. "Cascade Daily" / "pub-cascade" / Green "Active" badge
4. "Summit Insights" / "pub-summit" / Green "Active" badge

**Location:** Main content area, below Quick Action section

**Layout:**
- Responsive grid
- 2-3 columns depending on screen size
- Even spacing between cards

**Each card shows:**

### From Screenshot - Aurora Media Card
- **Top:** "Aurora Media" (large, bold text)
- **Below name:** "pub-aurora" (small, gray text)
- **Top-right corner:** Green badge with "Active" text

### From Screenshot - Borealis News Card
- **Top:** "Borealis News" (large, bold text)
- **Below name:** "pub-borealis" (small, gray text)
- **Top-right corner:** Gray badge with "Inactive" text

### Status Badge Colors
- 🟢 **Green "Active"** - Complete + in use (Aurora Media, Cascade Daily, Summit Insights)
- ⚪ **Gray "Inactive"** - Complete + not in use (Borealis News)
- 🟡 **Amber "Draft"** - Incomplete (not shown in screenshot)

### Interactions
- **Hover:** Shadow appears, name turns blue
- **Click:** Opens publisher in Publishers page
- **Cursor:** Pointer icon on hover

---

## 6. Search & Filter Sidebar

**📸 Screenshot Location:** Right side of screen

![Search sidebar in screenshot](user-guide/images/dashboard-overview.png)

**Look for:** Sidebar on right with:
- "Search & Filter" heading at top
- "Available Tags" section with 4 tag chips: world, politics, tech, finance
- "Quick Search" section with search box
- "Quick Filters" section with 3 buttons: Active Only, Drafts Only, Clear All
- "4 results" text at bottom

**Location:** Right side of the Dashboard page (full height)

**Purpose:** Find publishers quickly using multiple methods

### 6A. Available Tags

**📸 In screenshot:** Four rounded chips labeled "world", "politics", "tech", "finance"

**Top of sidebar**

**Shows:** Clickable tag chips for filtering

**How to use:**
1. Click any tag chip (e.g., "tech")
2. Search field auto-fills with that tag
3. Publishers with that tag appear

---

### 6B. Quick Search Field

**📸 In screenshot:** Text input box with placeholder "Search by name, ID, or tags..."

**Below tags section**

**Searches across:**
- Publisher names (e.g., "Aurora Media")
- Publisher IDs (e.g., "pub-aurora")
- Tags (e.g., "tech", "politics")

**Features:**
- ⚡ Real-time filtering (as you type)
- 🔤 Case-insensitive
- 🎯 Partial matches work

**Examples:**
- Type "aurora" → Finds "Aurora Media"
- Type "pub-" → Shows all with "pub-" prefix
- Type "tech" → Shows all with tech tag

---

### 6C. Quick Filters

**📸 In screenshot:** Three buttons in a row: "Active Only", "Drafts Only", "Clear All"

**Three buttons:**

**Active Only** 
- Click to show only Active publishers
- Button turns blue when active
- Excludes Inactive and Draft

**Drafts Only**
- Click to show only Draft publishers  
- Button turns amber when active
- Excludes Active and Inactive

**Clear All**
- Click to remove all filters
- Clears search field
- Shows all publishers

**Note:** Active Only and Drafts Only are mutually exclusive

---

### 6D. Results Count

**📸 In screenshot:** Text reading "4 results" at bottom of sidebar

**Bottom of sidebar**

**Format:** "X results" (e.g., "4 results" as shown in screenshot)

**Updates when you:**
- Type in search
- Click a tag
- Apply a filter

**Purpose:** See how many publishers match your criteria

---

## 🎬 Dashboard Video SCRIPTS (Not Actual Videos)

> **⚠️ IMPORTANT:** The following are **VIDEO SCRIPTS** with narration text and timestamps. These are NOT actual recorded videos. To create actual videos, you would need to:
> 1. Record your screen while using the application
> 2. Follow the script below as narration
> 3. Use video editing software to add on-screen text
> 4. Export as MP4 or WebM format

### Video Script 1: Dashboard Walkthrough (3:00)

**Purpose:** Create a video showing all Dashboard components

**Recording Setup:**
1. Open application at Dashboard page
2. Start screen recording
3. Read narration script below
4. Show each component as mentioned

**Narration Script with Actions:**

```
[00:00-00:15] Opening
ACTION: Show full Dashboard view
NARRATION: "This is the Dashboard - your overview of all publishers in the system."

[00:15-00:45] Navigation
ACTION: Hover over each tab (Dashboard, Publishers, Tools)
NARRATION: "Three tabs at top: Dashboard where we are now, Publishers for editing, and Tools coming soon."

[00:45-01:15] Quick Actions
ACTION: Point to left button, center card, right stats
NARRATION: "Left side: Create New Publisher button. Center: Recent 3 publishers. Right: Overview stats showing 4 total, 3 active, 1 inactive."

[01:15-02:00] Publisher Cards
ACTION: Hover over Aurora Media card, then Borealis News
NARRATION: "Each card shows publisher name, ID, and colored status badge. Green means Active like Aurora Media. Gray means Inactive like Borealis News."

[02:00-02:30] Search & Filter
ACTION: Show sidebar, click tag, type in search
NARRATION: "Right sidebar: click tags to filter, type in search for real-time results, use quick filter buttons."

[02:30-03:00] Closing
ACTION: Click a publisher card
NARRATION: "Click any card to open that publisher for editing. That's the Dashboard overview."
```

**To Create Actual Video:**
```bash
# Option 1: Manual screen recording
# Use OBS Studio, QuickTime, or built-in screen recorder
# Record screen while following script above

# Option 2: Playwright automated recording
npm install -D @playwright/test
npx playwright test --headed --video=on
# Videos save to: test-results/*/video.webm
```

---

### Video Script 2: Dashboard Tasks (2:30)

**Purpose:** Demonstrate 6 common tasks

**Narration Script:**

```
[0:00-0:30] Task 1: Find Publisher
ACTION: Type "aurora" in search, click card
NARRATION: "To find a publisher, type its name in Quick Search. Grid filters instantly. Click the card to open it."

[0:30-1:00] Task 2: Show Active Only
ACTION: Click "Active Only" button, show filtered results, click "Clear All"
NARRATION: "Click 'Active Only' to see only active publishers. Button turns blue. Stats update. Click 'Clear All' when done."

[1:00-1:20] Task 3: Search by Tag
ACTION: Click "tech" tag chip, show results
NARRATION: "Click any tag chip like 'tech'. Search auto-fills and shows tagged publishers."

[1:20-1:40] Task 4: Create New
ACTION: Click "Create New Publisher" button
NARRATION: "Click the large Create New Publisher button. Redirects to Publishers page with empty form."

[1:40-2:00] Task 5: Open Recent
ACTION: Click a row in Recent Publishers card
NARRATION: "Find publisher in Recent Publishers list. Click that row to open it instantly."

[2:00-2:30] Task 6: Combine Filters
ACTION: Click "Active Only", type "media", show results, click "Clear All"
NARRATION: "Combine filters and search. Click Active Only, type 'media'. Shows only active publishers with media in the name. Clear All resets everything."
```

---

# �� PART 2: PUBLISHERS PAGE

## Publishers Page Overview

> **📸 Note:** Publishers page has a different layout than Dashboard. It uses a two-panel design. In a complete version, this section would have its own screenshots showing the sidebar and details panel.

**What is it?** The editing workspace where you view and modify publisher configurations.

**When to use:**
- 📝 Creating a new publisher
- ✏️ Editing existing publisher
- 👀 Viewing full configuration details
- 🔧 Adding/removing page configurations

**Layout Description:**
```
┌────────────────────────────────────────────────────┐
│  Navigation: Dashboard | Publishers | Tools         │
├───────────────┬────────────────────────────────────┤
│ SIDEBAR       │ DETAILS PANEL                      │
│ (25% width)   │ (75% width)                        │
│               │                                    │
│ [Search...]   │ (Selected Publisher or Empty)      │
│               │                                    │
│ ☰ Publisher 1 │ Form fields:                       │
│ ☰ Publisher 2 │ - General Info                     │
│ ☰ Publisher 3 │ - Dashboard URLs                   │
│ ☰ Publisher 4 │ - Page Configurations              │
│               │ - Optional Fields                  │
│ [Upload]      │                                    │
│ [Create New]  │ [Save] [Cancel]                    │
└───────────────┴────────────────────────────────────┘
```

**📸 What you would see (description for screenshot):**
- **Left Panel (Sidebar):** List of all publishers with search box at top
- **Right Panel (Details):** Form with all configuration fields when a publisher is selected

---

## Publishers Sidebar

**📸 Location in Publishers page:** Left side panel (narrow column)

**Location:** Left panel, takes ~25% of screen width

### Sidebar Header

**Contains:**
- **"Publishers"** heading (large text)
- **Search bar** - "Search publishers..." placeholder
- **Upload button** - "Upload Publisher Config" text
- **Create New button** - "Create New Publisher" text

### Publisher List

**Shows:** All publishers as clickable items scrollable list

**Each item displays:**
- Colored circle with **initials** (e.g., "AM" for Aurora Media)
- **Publisher name** below initials
- **Publisher ID** in small gray text below name

**Example items:**
- AM circle → "Aurora Media" → "pub-aurora"
- BN circle → "Borealis News" → "pub-borealis"
- CD circle → "Cascade Daily" → "pub-cascade"

**Interactions:**
- **Hover:** Background color changes (light gray/blue)
- **Click:** Loads publisher in details panel
- **Selected:** Highlighted background (darker blue)

**Search:** Type in search box to filter list in real-time

---

## Publisher Details Panel

**📸 Location in Publishers page:** Right side panel (large area)

**Location:** Right panel, takes ~75% of screen width

**Three possible views:**

### View 1: Empty State

**📸 What you'd see:**
- Large book icon centered
- "Select a Publisher" heading
- "Choose a publisher from the list to view and edit its configuration." text

**When:** No publisher selected yet

**Action:** Click a publisher in sidebar to load details

---

### View 2: Edit Mode

**📸 What you'd see:**
- Top: "Aurora Media" heading, "pub-aurora" subheading, green "Active" badge
- Buttons: Purple "Save Changes" and gray "Cancel"
- Form sections scrollable:
  - General Information (ID input, Name input, Active checkbox)
  - Dashboard URLs (3 URL inputs)
  - Page Configurations (list with Add Page button)
  - Optional Fields (textareas for CSS, tags, notes)

**When:** Publisher selected from sidebar

**Top section displays:**
- Publisher name as main heading
- Publisher ID in gray below
- Status badge (Active/Inactive/Draft)
- **Save Changes** button (purple)
- **Cancel** button (gray)

**Form sections (scrollable):**

#### General Information
- **Publisher ID** - Text input (e.g., "pub-aurora")
- **Publisher Name** - Text input (e.g., "Aurora Media")
- **☑ Publisher is active** - Checkbox (checked = active)

#### Dashboard URLs
- **Publisher Dashboard URL** - Text input with full URL
- **Monitor Dashboard URL** - Text input with full URL
- **QA Status Dashboard URL** - Text input with full URL

#### Page Configurations
- **List of pages** showing:
  - Page Type dropdown (homepage, text, video)
  - Selector input (CSS selector like "main", ".article-top")
  - Position dropdown (top, sidebar, bottom)
  - Red "Remove" button for each page
- **+ Add Page** button (purple) at bottom

#### Optional Fields
- **Custom CSS** - Textarea (multiline)
- **Tags** - Text input (comma-separated)
- **Notes** - Textarea (multiline)

---

### View 3: Create Mode

**📸 What you'd see:**
- Top: "New Publisher" heading
- Purple "Create" button and gray "Cancel"
- All same form fields as Edit mode but empty
- Required fields marked with red asterisk (*)

**When:** "Create New Publisher" clicked

**Displays:**
- "New Publisher" heading
- All same form fields (empty)
- **Create** button instead of "Save Changes"

---

## Creating a New Publisher

### Step-by-Step with Visual Reference

**Step 1: Open Create Form**

**📸 What happens:**
- If from Dashboard: Clicking "Create New Publisher" redirects to Publishers page
- If from Publishers sidebar: Form appears in right panel
- Result: Empty form with "New Publisher" heading visible

**Two methods:**
- **From Dashboard:** Click "Create New Publisher" button (large purple)
- **From Publishers:** Click "Create New Publisher" in sidebar

---

**Step 2: Fill Required Fields**

**📸 What you'd see:**
- Red asterisks (*) next to required field labels
- Empty input boxes waiting for text
- Dropdown menus for page type and position

**Must fill (marked with *):**
- ✅ **Publisher ID*** - e.g., "pub-newmedia"
- ✅ **Publisher Name*** - e.g., "New Media Company"
- ✅ **Publisher Dashboard URL*** - Full URL
- ✅ **Monitor Dashboard URL*** - Full URL
- ✅ **QA Status Dashboard URL*** - Full URL
- ✅ **At least 1 Page Configuration***

**Optional:**
- Active status checkbox
- Custom CSS
- Tags
- Notes

---

**Step 3: Add Page Configurations**

**📸 What you'd see:**
- "Page Configurations" section heading
- Purple "+ Add Page" button
- After clicking: New row appears with 3 fields (Type dropdown, Selector input, Position dropdown)

1. Scroll to "Page Configurations" section
2. Click **"+ Add Page"** button
3. Fill each page:
   - **Page Type** - Select from dropdown (homepage, text, video)
   - **Selector** - Type CSS selector (e.g., "main", ".content")
   - **Position** - Select from dropdown (top, sidebar, bottom)
4. Click **"+ Add Page"** again for more pages

**Example page:**
```
Type: homepage
Selector: main
Position: top
```

---

**Step 4: Save**

**📸 What happens:**
- Click purple "Create" button at top
- If successful: Green success message appears, new publisher appears in sidebar list
- If errors: Red text appears next to invalid fields

1. Review all fields
2. Click **"Create"** button at top
3. Wait for validation
4. Success: New publisher in sidebar + Dashboard updates
5. Error: Fix red error messages and try again

---

## 🎬 Publishers Video SCRIPTS (Not Actual Videos)

> **⚠️ IMPORTANT:** These are VIDEO SCRIPTS for creating demonstrations. Not actual videos.

### Video Script 3: Publishers Page Tour (3:00)

**Narration Script:**

```
[00:00-00:30] Overview
ACTION: Show Publishers page with sidebar and details panel
NARRATION: "Publishers page has two panels: left sidebar lists all publishers, right panel shows full configuration details."

[00:30-01:00] Sidebar
ACTION: Scroll through publisher list, use search
NARRATION: "Left sidebar shows all publishers. Each has colored initials, name, and ID. Use search box to filter. Click Upload to import JSON or Create New to start fresh."

[01:00-01:30] Selection
ACTION: Click a publisher in sidebar
NARRATION: "Click any publisher in the list. Details load on the right panel showing all configuration fields."

[01:30-02:00] Details Panel
ACTION: Scroll through form sections
NARRATION: "Right panel shows general info, three required dashboard URLs, page configurations, and optional fields like custom CSS and notes."

[02:00-02:30] Scrolling
ACTION: Scroll down to show page configs section
NARRATION: "Scroll down to see page configurations. Each page has type, CSS selector, and position. Use Add Page button to add more."

[02:30-03:00] Actions
ACTION: Hover over Save and Cancel buttons
NARRATION: "Top buttons: Save Changes persists your edits. Cancel discards changes and resets the form."
```

---

### Video Script 4: Creating Publisher (2:00)

**Narration Script:**

```
[00:00-00:20] Starting
ACTION: Show both Create buttons (Dashboard and Publishers page)
NARRATION: "Two ways to create: large purple button on Dashboard, or Create New button in Publishers sidebar."

[00:20-00:50] Required Fields
ACTION: Show form with asterisks, fill in ID, Name, URLs
NARRATION: "Fill required fields marked with asterisks: Publisher ID, Name, and three dashboard URLs. These must be completed before you can save."

[00:50-01:20] Pages
ACTION: Click Add Page, fill dropdown and inputs
NARRATION: "Add page configurations: click Add Page button. Select page type from dropdown, enter CSS selector like 'main', choose position like 'top'."

[01:20-01:40] Status
ACTION: Click Active checkbox
NARRATION: "Check the 'Publisher is active' checkbox if this publisher should go live immediately. Leave unchecked for Inactive."

[01:40-02:00] Saving
ACTION: Click Create button, show success message, show sidebar updates
NARRATION: "Click Create button. If successful, new publisher appears in sidebar list and on Dashboard. You'll see a green success message."
```

---

### Video Script 5: Editing Publisher (2:00)

**Narration Script:**

```
[00:00-00:25] Opening
ACTION: Click publisher card on Dashboard, show redirect to Publishers page
NARRATION: "Click any publisher card from Dashboard or select from Publishers sidebar. The full configuration loads in the details panel."

[00:25-00:55] Details Load
ACTION: Show populated form with all existing values
NARRATION: "Details panel displays all current values: name, ID, status, URLs, pages, and any custom settings."

[00:55-01:25] Editing
ACTION: Edit name field, change URL, toggle Active checkbox
NARRATION: "Edit any field by clicking in it. Change publisher name, update URLs, check or uncheck the Active checkbox, modify page configurations."

[01:25-01:50] Pages Management
ACTION: Click Add Page to add new one, click Remove on existing page
NARRATION: "Manage pages: Add Page button creates new page config. Remove button deletes a page. Changes take effect when you save."

[01:50-02:00] Saving
ACTION: Click Save Changes, show success message
NARRATION: "Click Save Changes to persist your edits. Click Cancel to discard. Success message confirms your changes were saved."
```

---

# 📖 REFERENCE SECTION

## 📝 Status System Reference

**Three status types used throughout the system:**

### 🟢 Active (Green Badge)

**📸 Example from Dashboard screenshot:** Aurora Media card shows green "Active" badge

**Meaning:**
- ✅ Configuration complete
- ✅ Currently in use
- ✅ Serving content to users

**Requirements:**
All required fields filled + `isActive: true`

**Required fields:**
- Publisher ID
- Publisher Name
- At least 1 page config
- All 3 dashboard URLs

**Where visible:**
- Dashboard cards: Green badge (see Aurora Media, Cascade Daily, Summit Insights)
- Recent: Green ✓ icon (see Aurora Media, Cascade Daily)
- Overview: Green "3 Active" count
- Publishers: Green badge next to name

---

### ⚪ Inactive (Gray Badge)

**📸 Example from Dashboard screenshot:** Borealis News card shows gray "Inactive" badge

**Meaning:**
- ✅ Configuration complete
- ❌ Not currently in use
- ❌ Not serving content

**Requirements:**
All required fields filled + `isActive: false`

**Where visible:**
- Dashboard cards: Gray badge (see Borealis News)
- Recent: Gray ● icon (see Borealis News row)
- Overview: Gray "1 Inactive" count
- Publishers: Gray badge next to name

---

### 🟡 Draft (Amber Badge)

**📸 Note:** Not shown in current screenshot (all 4 publishers are complete)

**Meaning:**
- ❌ Configuration incomplete
- ❌ Missing required fields
- ❌ Cannot be activated

**Missing any of:**
- Publisher ID
- Publisher Name
- Page configurations (must have ≥1)
- Publisher Dashboard URL
- Monitor Dashboard URL
- QA Status Dashboard URL

**Where visible:**
- Dashboard cards: Amber badge
- Publishers: Amber badge
- Note: NOT in Recent Publishers

**To complete:**
1. Open the draft
2. Fill missing fields
3. Save
4. Becomes Active or Inactive

---

## ⚡ Quick Reference Tables

### Dashboard Tasks

| What You Want | How To Do It | Screenshot Reference |
|---------------|--------------|---------------------|
| Find a publisher | Type name/ID in Quick Search → Click card | Use search box in right sidebar |
| Show only active | Click "Active Only" → Review → "Clear All" | See "Active Only" button in sidebar |
| Create new publisher | Click "Create New Publisher" button | Large purple button on left |
| Open recent work | Click row in Recent Publishers card | Center card with AM/BN/CD entries |
| Search by tag | Click tag chip → See tagged publishers | Tags in sidebar: world, politics, tech, finance |
| Combine search + filter | Click filter → Type in search → See combined | Use sidebar search + filter buttons |
| Reset everything | Click "Clear All" button | Bottom button in Quick Filters section |

---

### Publishers Page Tasks

| What You Want | How To Do It |
|---------------|--------------|
| View publisher details | Click from sidebar → Details load on right |
| Edit publisher | Select → Edit fields → Click "Save Changes" |
| Create new | Click "Create New Publisher" → Fill form → "Create" |
| Add page config | Scroll to Pages → "+ Add Page" → Fill → Save |
| Remove page | Find page → "Remove" button → Save |
| Activate publisher | Check "Active" checkbox → Save |
| Deactivate publisher | Uncheck "Active" → Save |
| Discard changes | Click "Cancel" button |
| Search sidebar | Type in search box above publisher list |

---

## 🔧 Troubleshooting Guide

### Dashboard Problems

| Problem | Solution | Check Screenshot |
|---------|----------|------------------|
| **Dashboard empty/no cards** | Click "Clear All" button in sidebar | See if filter buttons are highlighted |
| **Can't find publisher** | 1. Click "Clear All"<br>2. Try searching by ID<br>3. Check filter status | Look at results count (should show all) |
| **Search not working** | 1. Refresh (F5)<br>2. Clear browser cache | Try typing in search box |
| **Publisher card won't click** | 1. Refresh page<br>2. Check console (F12) | Hover should show pointer cursor |
| **Stats don't match card count** | Filters active - stats show filtered count | Check if "Active Only" or "Drafts Only" is blue/amber |
| **Recent Publishers not updating** | 1. Refresh page<br>2. Check if saved | Recent shows 3 most recent updates |

---

## 🎯 Best Practices

### Dashboard

✅ **DO:**
- Start every session at Dashboard to see overview
- Use search before creating new (avoid duplicates)
- Clear filters when done (click "Clear All")
- Check Recent Publishers for quick access
- Watch Overview stats for system health

❌ **DON'T:**
- Leave filters active and forget about them
- Create duplicates without searching first
- Ignore status badges (colors matter)
- Skip checking recent work first

---

## ✅ SUMMARY

**You now know:**

### Dashboard Page
- ✅ See all publishers at once in grid view
- ✅ Search and filter efficiently with sidebar
- ✅ Access recent work via Recent Publishers card
- ✅ Understand status badges (Green/Gray/Amber)
- ✅ Navigate to Publishers page by clicking cards

### Publishers Page
- ✅ View full publisher details in two-panel layout
- ✅ Edit all configuration fields
- ✅ Create new publishers with required validation
- ✅ Manage page configurations (add/remove)
- ✅ Save and cancel changes

### System Overall
- ✅ No credentials needed (local development)
- ✅ No database required (JSON files)
- ✅ Real-time search/filter on Dashboard
- ✅ Three status types with color coding
- ✅ Hot reload in development mode

### Next Steps
1. Practice with 4 sample publishers in screenshot
2. Try all workflows described
3. Bookmark this guide for reference
4. Share with team members

---

## 📄 DOCUMENT INFO

**Coverage:** Complete system (Dashboard + Publishers)  
**Format:** Single Markdown file with screenshot references  
**Length:** ~1000 lines  
**Sections:** 2 main parts + Reference  
**Navigation:** Clickable Table of Contents  
**Video Scripts:** 5 narration scripts (12 min total) - **NOT actual videos**  
**Screenshots:** 1 main Dashboard screenshot referenced throughout  

> **📝 Note:** For a complete production version, each component section would have its own annotated screenshot with arrows and highlights pointing to the specific elements being discussed.

**Version:** 1.0  
**Date:** November 23, 2025  
**For:** Taboola Support Engineers

---

**✨ This guide covers the entire Publisher Configuration Tool with references to the main screenshot throughout.**
