# Dashboard User Guide
## Publisher Configuration Tool - Dashboard Page

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**Audience:** Taboola Support Engineers

---

## Table of Contents

1. [Introduction](#introduction)
2. [Accessing the Dashboard](#accessing-the-dashboard)
3. [Dashboard Overview](#dashboard-overview)
4. [Main Components](#main-components)
   - [Navigation Bar](#navigation-bar)
   - [Page Header](#page-header)
   - [Quick Action Section](#quick-action-section)
   - [Publisher Cards Grid](#publisher-cards-grid)
   - [Search & Filter Sidebar](#search--filter-sidebar)
5. [Working with the Dashboard](#working-with-the-dashboard)
6. [Understanding Status Indicators](#understanding-status-indicators)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

The **Dashboard** is the central hub of the Publisher Configuration Tool. It provides Support Engineers with a comprehensive overview of all publisher configurations, quick access to recent work, and powerful search and filtering capabilities.

### Purpose

The Dashboard serves as your starting point for:
- Viewing all publisher configurations at a glance
- Quickly accessing recently modified publishers
- Understanding the current status of all publishers (Active, Inactive, Draft)
- Creating new publisher configurations
- Searching and filtering publishers by various criteria

### Who Should Use This Guide

This guide is designed for **Taboola Support Engineers** who need to manage publisher configurations. You should be comfortable with web-based dashboards and have basic knowledge of JSON data structures.

---

## Accessing the Dashboard

### Navigation

1. **From the Application Homepage:** When you first load the Publisher Configuration Tool, you'll see the main navigation bar at the top of the page.

2. **Dashboard Tab:** Click on the "Dashboard" tab in the navigation bar to access the Dashboard page. The Dashboard tab features a grid icon (four squares) and is located on the left side of the navigation bar.

3. **Active State:** When you're on the Dashboard page, the Dashboard tab will be highlighted with a darker text color and bold font weight, indicating it's the active page.

### URL

The Dashboard is accessible at: `http://localhost:3000` (when the Dashboard tab is active)

---

## Dashboard Overview

![Dashboard Screenshot](https://github.com/user-attachments/assets/af4c8a80-3704-4091-8e8c-b551d556728f)

The Dashboard is organized into several key areas:

1. **Top Navigation Bar** - Allows switching between Dashboard, Publishers, and Tools pages
2. **Page Header** - Displays the tool name: "Publisher Configuration Tool"
3. **Quick Action Section** - Contains the Create New Publisher button and quick access to recent publishers
4. **Overview Stats** - Shows publisher statistics (Total, Active, Inactive)
5. **Publisher Cards Grid** - Displays all publishers as interactive cards
6. **Search & Filter Sidebar** - Provides search and filtering capabilities (right side)

---

## Main Components

### Navigation Bar

**Location:** Fixed at the top of the page

**Purpose:** Primary navigation between different sections of the tool

**Elements:**
- **Dashboard Tab** (Current page)
  - Icon: Grid of four squares
  - Label: "Dashboard"
  - Indicates you're viewing the Dashboard page
  
- **Publishers Tab**
  - Icon: Open book
  - Label: "Publishers"
  - Navigates to the Publishers list and editor view
  
- **Tools Tab**
  - Icon: Wrench/tool icon
  - Label: "Tools"
  - Access to additional tools (coming soon)

**Visual Feedback:**
- The active tab is displayed with darker text and bold font
- Hovering over tabs shows a white background with subtle shadow
- The navigation bar has a clean, modern design with rounded pill-shaped background

---

### Page Header

**Location:** Top of the main content area, centered

**Content:** "Publisher Configuration Tool"

**Purpose:** Clearly identifies the tool you're working with

**Design:** Large, bold text (4xl size) in dark slate color

---

### Quick Action Section

This section is divided into three main cards that provide immediate access to key functionality:

#### 1. Create New Publisher Button (Left Card)

**Purpose:** Primary action to create a new publisher configuration from scratch

**Visual Design:**
- Large button with a plus icon inside a circle
- Light indigo background (indigo-50)
- Indigo border and text
- Text: "Create New Publisher"
- Rounded corners
- Shadow effect on hover

**How to Use:**
1. Click the "Create New Publisher" button
2. You'll be redirected to the Publishers page where you can start creating a new configuration

**When to Use:**
- When you need to add a new publisher to the system
- When starting a fresh configuration from scratch

---

#### 2. Recent Publishers Card (Center Card)

**Purpose:** Quick access to publishers you've recently worked on

**Layout:**
- Header: "Recent Publishers"
- List of up to 3 most recently updated publishers
- Each publisher shown as an interactive row

**Publisher Row Elements:**

1. **Avatar/Status Icon (Left)**
   - Displays publisher initials (e.g., "AM" for Aurora Media, "BN" for Borealis News)
   - Colored background (varies by publisher)
   - Small status indicator badge in bottom-right corner:
     - ✓ (checkmark) for Active publishers
     - ● (dot) for Inactive publishers

2. **Publisher Name (Center)**
   - Primary text: Full publisher name (e.g., "Aurora Media")
   - Bold, dark text

3. **Metadata (Below Name)**
   - Last updated time (e.g., "10 months ago")
   - Bullet separator (•)
   - Number of configured pages (e.g., "3 pages")
   - Light gray text, smaller font size

**How to Use:**
1. Review the list of recent publishers
2. Click on any publisher row to open it in the Publishers editor page
3. The most recently modified publishers appear at the top

**What You'll See:**
- If you have no publishers yet: An empty state message saying "No publishers yet" with a prompt to create your first one
- If you have publishers: The 3 most recently updated ones

---

#### 3. Overview Stats Card (Right Card)

**Purpose:** At-a-glance summary of all publisher statistics

**Layout:**
- White background with subtle border
- Rounded corners
- Organized in a clear grid

**Statistics Displayed:**

1. **Total Publishers (Top, Large)**
   - Format: "[Number] Publishers" (e.g., "4 Publishers")
   - Large, bold number
   - Header: "Overview"

2. **Active Count (Bottom-Left)**
   - Green background (emerald-50)
   - Shows number of active publishers
   - Label: "Active"
   - Green text (emerald-600)

3. **Inactive Count (Bottom-Right)**
   - Gray background (slate-100)
   - Shows number of inactive publishers
   - Label: "Inactive"
   - Gray text (slate-700)

**Understanding the Numbers:**
- **Total:** All publishers in the system, regardless of status
- **Active:** Publishers with `isActive: true` and all required fields completed
- **Inactive:** Publishers with `isActive: false` but all required fields completed
- **Note:** Draft publishers (incomplete configurations) are counted in Total but not in Active/Inactive

**Real-time Updates:**
- These numbers update dynamically when you apply filters in the Search & Filter sidebar
- The stats reflect only the filtered results when filters are active

---

### Publisher Cards Grid

**Location:** Below the Quick Action section, main content area

**Purpose:** Display all publishers as individual, interactive cards

**Layout:**
- Responsive grid layout
- 2 columns on medium screens, 3 columns on extra-large screens
- Cards have equal spacing between them

**Each Publisher Card Contains:**

1. **Header Row (Top)**
   - Left side: Publisher information
   - Right side: Status badge

2. **Publisher Name**
   - Large, bold text
   - Changes to indigo color on hover
   - Example: "Aurora Media", "Borealis News"

3. **Publisher ID**
   - Below the name
   - Small, monospace font (for technical accuracy)
   - Gray text
   - Example: "pub-aurora", "pub-borealis"

4. **Status Badge (Top-Right)**
   - **Active:** Green background with green text (emerald-100/700)
   - **Inactive:** Gray background with gray text (slate-100/700)
   - **Draft:** Amber/yellow background with amber text (amber-100/700)
   - Text label: "Active", "Inactive", or "Draft"
   - Rounded pill shape

**Card Visual Design:**
- Gradient background (slate-50 to gray-50)
- Light border (slate-200)
- Rounded corners
- Hover effect: Shadow appears, giving depth
- Entire card is clickable (cursor changes to pointer on hover)

**Interaction:**
- **Click any card** to navigate to the Publishers page and load that publisher's full configuration for editing
- **Hover effect** provides visual feedback that the card is interactive

**Card States:**
- **Normal:** Subtle gradient background
- **Hover:** Shadow appears, name color changes to indigo
- **Group hover:** The entire card responds as a single interactive element

---

### Search & Filter Sidebar

**Location:** Right side of the Dashboard, fixed position

**Purpose:** Powerful search and filtering tools to help you find specific publishers quickly

**Visual Design:**
- White background
- Full height of the page
- Distinct sections with clear labels
- Sticky positioning (stays visible while scrolling)

---

#### Sidebar Components:

### 1. Sidebar Header

**Content:** "Search & Filter" with a search icon

**Purpose:** Clearly identifies the sidebar's functionality

---

### 2. Available Tags Section (Top)

**Purpose:** Shows all unique tags used across publishers for quick filtering

**Elements:**
- Label: "Available Tags"
- Tag chips displayed in a wrapped row
- Example tags: "world", "politics", "tech", "finance"

**How to Use:**
1. View the available tags to understand how publishers are categorized
2. Click on any tag chip to automatically populate the search field with that tag
3. The search will filter publishers that have that specific tag

**Visual Design:**
- Each tag is a small, rounded chip
- Light blue/gray background
- Clickable (cursor changes to pointer)
- Up to 8 tags are displayed

---

### 3. Quick Search Section

**Purpose:** Real-time text-based search across multiple publisher fields

**Elements:**
- Label: "Quick Search"
- Search input field with icon
- Placeholder text: "Search by name, ID, or tags..."

**What It Searches:**
- Publisher alias/name (e.g., "Aurora Media")
- Publisher ID (e.g., "pub-aurora")
- Tags (e.g., "world", "politics", "tech")

**How to Use:**
1. Click in the search field
2. Type your search query
3. Results update immediately as you type (real-time filtering)
4. Search is case-insensitive
5. Partial matches are included (e.g., "aurora" will match "Aurora Media")

**Search Behavior:**
- If a publisher matches on ANY field (name, ID, or tags), it will be shown
- Search works in combination with Quick Filters (filters are additive)
- Clear the search field to show all publishers again

---

### 4. Quick Filters Section

**Purpose:** Pre-defined filters for common filtering needs

**Elements:**
- Label: "Quick Filters"
- Three filter buttons

**Filter Buttons:**

1. **Active Only**
   - Text: "Active Only"
   - Default state: Not active (gray appearance)
   - Active state: Blue background and text
   - Behavior: When clicked, shows only Active publishers (excludes Inactive and Draft)

2. **Drafts Only**
   - Text: "Drafts Only"
   - Default state: Not active (gray appearance)
   - Active state: Amber/yellow background and text
   - Behavior: When clicked, shows only Draft publishers (incomplete configurations)

3. **Clear All**
   - Text: "Clear All"
   - Special styling: Lighter background
   - Behavior: Removes all active filters and clears the search field, returning to show all publishers

**How Filters Work:**
- **Single Selection:** Active Only and Drafts Only are mutually exclusive (you can only have one active at a time)
- **Visual Feedback:** Active filters have colored backgrounds matching their purpose
- **Combination:** Filters work together with the search field
- **Instant Update:** The publisher grid and stats update immediately when you apply a filter

**Filter Logic:**
- **Active Only:** Shows publishers where `isActive = true` AND all required fields are complete (not drafts)
- **Drafts Only:** Shows publishers missing one or more required fields (publisherId, aliasName, pages, dashboards)

---

### 5. Results Count

**Purpose:** Shows how many publishers match your current search and filter criteria

**Format:** "[Number] results" (e.g., "4 results", "2 results")

**Location:** Below the Quick Filters section

**Behavior:**
- Updates automatically as you search or apply filters
- Shows total count when no filters are applied
- Shows filtered count when filters or search are active

**Use Case:**
- Quickly understand how many publishers match your criteria
- Verify that filters are working as expected
- Assess the impact of your search query

---

## Working with the Dashboard

### Common Workflows

#### 1. Viewing All Publishers

**Goal:** See a complete list of all publishers in the system

**Steps:**
1. Access the Dashboard page via the navigation bar
2. If any filters are active, click "Clear All" in the Search & Filter sidebar
3. Clear the search field if it contains text
4. View all publisher cards in the main grid
5. Review the Overview stats to see total, active, and inactive counts

---

#### 2. Finding a Specific Publisher

**Method A: Using Search**
1. Locate the "Quick Search" field in the Search & Filter sidebar
2. Type the publisher name, ID, or tag
3. Watch as the grid filters in real-time
4. Review the "results count" to see how many matches were found
5. Click on the matching publisher card to open it

**Method B: Using Recent Publishers**
1. Check the "Recent Publishers" card in the Quick Action section
2. If the publisher you need appears in the list, click on it directly

**Method C: Browsing**
1. Scroll through the publisher cards grid
2. Look for the publisher name or ID on each card
3. Click on the correct card when found

---

#### 3. Filtering by Status

**Show Only Active Publishers:**
1. Click the "Active Only" button in the Quick Filters section
2. The button will turn blue to indicate it's active
3. The grid will show only Active publishers
4. The Overview stats will update to reflect filtered results

**Show Only Draft Publishers:**
1. Click the "Drafts Only" button in the Quick Filters section
2. The button will turn amber/yellow to indicate it's active
3. The grid will show only Draft publishers (incomplete configurations)
4. The Overview stats will update to reflect filtered results

**Return to All Publishers:**
1. Click the "Clear All" button
2. All filters will be removed
3. The grid will show all publishers again

---

#### 4. Searching by Tag

**Option A: Click a Tag Chip**
1. Look at the "Available Tags" section at the top of the sidebar
2. Click on any tag chip (e.g., "politics", "tech")
3. The search field will automatically populate with that tag
4. Publishers with that tag will be filtered automatically

**Option B: Type a Tag**
1. In the "Quick Search" field, type a tag name
2. Publishers containing that tag will be shown
3. The search matches tags along with names and IDs

---

#### 5. Creating a New Publisher

**Steps:**
1. Locate the "Create New Publisher" button in the Quick Action section (large button on the left with a plus icon)
2. Click the button
3. You'll be redirected to the Publishers page
4. Follow the prompts to create a new publisher configuration

---

#### 6. Opening a Recent Publisher

**Steps:**
1. Look at the "Recent Publishers" card in the Quick Action section
2. Review the list of up to 3 recently updated publishers
3. Each entry shows:
   - Publisher initials and status icon
   - Publisher name
   - Last updated time
   - Number of configured pages
4. Click on any publisher row to open it in the editor

---

### Combining Search and Filters

You can combine search text with Quick Filters for powerful, targeted queries:

**Example 1: Find Active Publishers with "news" in the name**
1. Click "Active Only"
2. Type "news" in the search field
3. Result: Only active publishers with "news" in their name, ID, or tags

**Example 2: Find Draft Publishers tagged with "tech"**
1. Click "Drafts Only"
2. Type "tech" in the search field
3. Result: Only incomplete publishers with "tech" in their tags

**Clearing Combined Filters:**
- Click "Clear All" to remove all filters and search terms at once

---

## Understanding Status Indicators

### Publisher Status Types

The system uses three main status types to categorize publishers:

#### 1. Active

**Meaning:** 
- The publisher configuration is complete and currently in use
- All required fields are filled in
- The publisher is actively serving content

**Visual Indicators:**
- Status badge: Green background with green text (emerald-100/700)
- Badge text: "Active"
- In Recent Publishers: Green checkmark (✓) icon

**Required Fields for Active Status:**
- `publisherId` (Publisher ID)
- `aliasName` (Publisher Name)
- `pages` array (At least one page configuration)
- `publisherDashboard` (Dashboard URL)
- `monitorDashboard` (Monitoring Dashboard URL)
- `qaStatusDashboard` (QA Status Dashboard URL)
- `isActive: true`

---

#### 2. Inactive

**Meaning:**
- The publisher configuration is complete but not currently in use
- All required fields are filled in
- The publisher is not actively serving content

**Visual Indicators:**
- Status badge: Gray background with gray text (slate-100/700)
- Badge text: "Inactive"
- In Recent Publishers: Gray dot (●) icon

**Required Fields for Inactive Status:**
- All the same required fields as Active
- `isActive: false`

---

#### 3. Draft

**Meaning:**
- The publisher configuration is incomplete
- One or more required fields are missing
- The publisher cannot be activated until all required fields are completed

**Visual Indicators:**
- Status badge: Amber/yellow background with amber text (amber-100/700)
- Badge text: "Draft"

**What Makes a Publisher a Draft:**
- Missing `publisherId`
- Missing `aliasName`
- No pages configured (`pages` array is empty)
- Missing any of the three required dashboard URLs

---

### Status in Different Contexts

**In Publisher Cards:**
- Status badge appears in the top-right corner of each card
- Badge color and text clearly indicate the status

**In Recent Publishers:**
- Small colored icon appears next to publisher initials
- Checkmark for Active, dot for Inactive

**In Overview Stats:**
- Only Active and Inactive counts are shown (completed publishers)
- Draft publishers are included in the Total count but not broken out separately in the Overview card
- However, Draft count is shown in the main stats when viewing all publishers

---

## Best Practices

### For New Users

1. **Start with the Dashboard**
   - Always begin your session by reviewing the Dashboard
   - Check the Overview stats to understand the current state
   - Review Recent Publishers to see what others have been working on

2. **Use Search Before Creating**
   - Before creating a new publisher, search to make sure it doesn't already exist
   - Check by publisher name, ID, and related tags

3. **Understand Status Before Editing**
   - Look at the status badge before opening a publisher
   - Active publishers may require more careful editing
   - Draft publishers are safe to experiment with

4. **Leverage Quick Filters**
   - Use "Active Only" when you need to review live configurations
   - Use "Drafts Only" when you want to complete incomplete work
   - Combine with search for precise targeting

---

### For Efficient Work

1. **Use Recent Publishers for Quick Access**
   - The Recent Publishers card saves time on frequently edited publishers
   - Recent items are automatically sorted by last updated time

2. **Master the Search Functionality**
   - Search is case-insensitive and matches partial strings
   - You can search by multiple criteria (name, ID, tag) simultaneously
   - Search updates in real-time as you type

3. **Monitor the Results Count**
   - Always check the results count after searching or filtering
   - If you see "0 results", your criteria might be too restrictive

4. **Clear Filters When Done**
   - Click "Clear All" when you finish a filtered task
   - This ensures you see all publishers for your next task
   - Prevents confusion from forgotten active filters

---

### For Team Coordination

1. **Check Recent Publishers for Team Activity**
   - See what other team members have recently modified
   - Coordinate to avoid editing the same publisher simultaneously

2. **Use Consistent Tagging**
   - Tags help the entire team find publishers quickly
   - Review Available Tags to see existing categories
   - Use established tags rather than creating new ones when possible

3. **Complete Draft Publishers**
   - If you start a configuration, try to complete it or note why it's incomplete
   - Draft publishers can accumulate and cause confusion

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Dashboard Appears Empty

**Symptoms:** No publisher cards appear in the grid, or you see "0 results"

**Possible Causes & Solutions:**

1. **Active Filters**
   - Check if "Active Only" or "Drafts Only" is highlighted
   - Check if there's text in the search field
   - Solution: Click "Clear All" to remove all filters

2. **No Publishers in System**
   - If this is a fresh installation, there may be no publishers yet
   - Solution: Click "Create New Publisher" to add your first one

3. **Data Loading Error**
   - The dashboard may have failed to load publisher data
   - Solution: Refresh the page (F5 or Cmd+R)
   - If error persists, check the browser console for error messages

---

#### Issue: Search Not Finding Expected Publishers

**Symptoms:** You know a publisher exists but search doesn't show it

**Possible Causes & Solutions:**

1. **Conflicting Filters**
   - Active filter may exclude your target publisher
   - Example: Publisher is Inactive, but "Active Only" is selected
   - Solution: Clear filters with "Clear All"

2. **Spelling or Case Differences**
   - Publisher name might be spelled differently than expected
   - Solution: Try shorter search terms, search is case-insensitive

3. **Publisher Under Different ID**
   - Publisher might be registered under a different name or ID
   - Solution: Clear search and browse all cards, or search by tag

---

#### Issue: Status Badge Shows Incorrect Status

**Symptoms:** A publisher shows as "Draft" but you think it's complete, or vice versa

**Understanding:**
- Draft status is determined by missing required fields
- A publisher is a Draft if ANY of these are missing:
  - `publisherId`
  - `aliasName`
  - `pages` array (must have at least one entry)
  - `publisherDashboard` URL
  - `monitorDashboard` URL
  - `qaStatusDashboard` URL

**Solution:**
1. Click on the publisher card to open it in the editor
2. Review all required fields
3. Complete any missing fields
4. Save the configuration
5. Return to Dashboard to see updated status

---

#### Issue: Overview Stats Don't Match Card Count

**Symptoms:** The Overview card shows different numbers than what you see in the grid

**Explanation:**
- This is expected when filters are active
- Overview stats update to reflect only the filtered results
- When no filters are active, stats should match visual card count

**Solution:**
1. Click "Clear All" to remove filters
2. Count cards in grid and compare to Overview
3. If still mismatched, refresh the page

---

#### Issue: Recent Publishers Not Updating

**Symptoms:** A publisher you just edited doesn't appear in Recent Publishers list

**Possible Causes & Solutions:**

1. **Recent List Shows Only Top 3**
   - Only the 3 most recently updated publishers are shown
   - Your edit may not be in the top 3 if others were updated more recently
   - Solution: This is expected behavior; use search to find your publisher

2. **Changes Not Saved**
   - If you didn't save your edits, the update timestamp didn't change
   - Solution: Make sure to save changes before returning to Dashboard

3. **Cache Issue**
   - Browser may be showing cached data
   - Solution: Refresh the page (F5 or Cmd+R)

---

#### Issue: Can't Click on Publisher Card

**Symptoms:** Clicking a publisher card doesn't navigate to the editor

**Possible Causes & Solutions:**

1. **JavaScript Error**
   - An error may have broken the click handler
   - Solution: Check browser console for errors, refresh the page

2. **Page Still Loading**
   - The page may not have fully loaded yet
   - Solution: Wait a few seconds and try again

3. **Browser Compatibility**
   - Older browsers may not support all features
   - Solution: Use a modern browser (Chrome, Firefox, Safari, Edge - recent versions)

---

## Summary

The Dashboard is your command center for managing publisher configurations. Key takeaways:

- **Overview at a Glance:** See all publishers, their statuses, and overall statistics instantly
- **Quick Access:** Recent Publishers card provides immediate access to your recent work
- **Powerful Search:** Find publishers by name, ID, or tags with real-time filtering
- **Flexible Filtering:** Use Quick Filters to show only Active or Draft publishers
- **Easy Navigation:** Click any publisher card to open it for editing
- **Status Awareness:** Color-coded badges clearly show Active, Inactive, and Draft statuses

By mastering the Dashboard, you'll be able to efficiently navigate your publisher configurations, find what you need quickly, and maintain awareness of the overall system state.

---

## Need Help?

If you encounter issues not covered in this guide:

1. **Check the Browser Console:** Press F12 to open developer tools and look for error messages
2. **Refresh the Page:** Many issues are resolved with a simple page refresh
3. **Contact Your Team Lead:** For persistent issues or questions about specific publishers
4. **Refer to the Full Documentation:** This guide covers the Dashboard only; additional guides may be available for other features

---

**Document Information:**
- **Created:** November 23, 2025
- **Version:** 1.0
- **Maintained By:** Development Team
- **Target Users:** Taboola Support Engineers
