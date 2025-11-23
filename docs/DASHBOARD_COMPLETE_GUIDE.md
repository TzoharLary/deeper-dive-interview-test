# Dashboard Complete User Guide
## Publisher Configuration Tool

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**For:** Taboola Support Engineers

---

## 📱 Dashboard Overview

![Dashboard Screenshot](user-guide/images/dashboard-overview.png)

The Dashboard is your central hub for managing all publisher configurations. Everything you need is on one screen.

---

## 🚀 Quick Start - Installation (5 Steps)

### Step 1: Install Prerequisites
You need:
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **No credentials needed** ✅
- **No database needed** ✅

### Step 2: Clone & Install
```bash
# Clone the repository
git clone https://github.com/TzoharLary/deeper-dive-interview-test.git
cd deeper-dive-interview-test

# Install dependencies
npm install
```

### Step 3: Start the Application
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

### Step 5: Click Dashboard Tab
You'll see the Dashboard page as shown in the screenshot above.

**Total Time:** 10 minutes

---

## 📊 Dashboard Components

### 1. Navigation Bar (Top)

![Navigation Bar](https://github.com/user-attachments/assets/af4c8a80-3704-4091-8e8c-b551d556728f)

Three tabs:
- **Dashboard** (current page) - Overview of all publishers
- **Publishers** - Edit publisher configurations
- **Tools** - Additional tools (coming soon)

---

### 2. Create New Publisher (Left Button)

Large purple button with **+ icon**

**What it does:** Start creating a new publisher configuration

**When to use:** When you need to add a new publisher to the system

**Click it** → Redirects to Publishers page to enter details

---

### 3. Recent Publishers (Center Card)

Shows your 3 most recently edited publishers

**Each entry shows:**
- **Initials** (e.g., "AM" for Aurora Media) with colored background
- **Publisher name** in large text
- **Status icon** (✓ for Active, ● for Inactive)
- **Last updated** time (e.g., "10 months ago")
- **Page count** (e.g., "3 pages")

**Click any row** → Opens that publisher for editing

---

### 4. Overview Stats (Right Card)

Quick statistics:
- **Total:** 4 Publishers (all publishers in system)
- **Active:** 3 (green background - currently in use)
- **Inactive:** 1 (gray background - not in use)

**These numbers update** when you use filters

---

### 5. Publisher Cards (Main Grid)

Each card shows:
- **Publisher Name** (large, bold) - e.g., "Aurora Media"
- **Publisher ID** (small, gray) - e.g., "pub-aurora"
- **Status Badge** (top-right corner):
  - 🟢 **Green "Active"** - Complete, in use
  - ⚪ **Gray "Inactive"** - Complete, not in use
  - 🟡 **Amber "Draft"** - Incomplete

**Hover over card** → Shadow appears, name turns blue

**Click any card** → Opens publisher for editing

---

### 6. Search & Filter Sidebar (Right Side)

#### Available Tags
Click any tag (world, politics, tech, finance) → Automatically searches for publishers with that tag

#### Quick Search
Type name, ID, or tag → **Instant filtering** as you type

Example: Type "aurora" → Shows only Aurora Media

#### Quick Filters
- **Active Only** → Shows only active publishers (button turns blue)
- **Drafts Only** → Shows only incomplete publishers (button turns amber)
- **Clear All** → Removes all filters

#### Results Count
Shows how many publishers match your search/filters (e.g., "4 results")

---

## 🎬 Video Demonstrations

### Video 1: Dashboard Walkthrough (3 minutes)

**Watch how to:**
1. Navigate the Dashboard
2. Use the Create New Publisher button
3. View Recent Publishers
4. Understand Overview Stats
5. Browse Publisher Cards
6. Use Search & Filter

**Script:**
```
[00:00-00:15] "Welcome to the Dashboard. This is what you see first."
[00:15-00:45] "Navigation bar has Dashboard, Publishers, and Tools tabs."
[00:45-01:15] "Left: Create New Publisher. Center: Recent 3 publishers. Right: Overview stats."
[01:15-02:15] "Publisher cards show name, ID, and status. Active = green, Inactive = gray."
[02:15-03:00] "Search & Filter sidebar: Type to search, click tags, use quick filters."
```

**To record this video:**
```bash
# Install Playwright
npm install -D @playwright/test

# Run with video recording
npx playwright test --headed --video=on
```

Videos save to: `test-results/*/video.webm`

---

### Video 2: Common Tasks (2:30 minutes)

**6 Quick Tasks:**

**Task 1: Find a Publisher**
1. Type "aurora" in Quick Search
2. Click the matching card

**Task 2: Show Only Active**
1. Click "Active Only" button
2. See only active publishers
3. Click "Clear All" when done

**Task 3: Search by Tag**
1. Click "tech" tag chip
2. See publishers with tech tag

**Task 4: Create New Publisher**
1. Click "Create New Publisher" button
2. Enter details on Publishers page

**Task 5: Open Recent Work**
1. Look at Recent Publishers card
2. Click desired publisher

**Task 6: Combine Filters**
1. Click "Active Only"
2. Type "media" in search
3. See active publishers with "media"
4. Click "Clear All"

---

### Video 3: Status System (1:30 minutes)

**3 Status Types:**

**🟢 Active (Green Badge)**
- Configuration is complete
- Currently in use
- All required fields filled
- Serving content

**⚪ Inactive (Gray Badge)**
- Configuration is complete
- Not currently in use
- All required fields filled
- Not serving content

**🟡 Draft (Amber Badge)**
- Configuration incomplete
- Missing one or more fields:
  - ☐ Publisher ID
  - ☐ Publisher Name
  - ☐ Page Configuration
  - ☐ Dashboard URLs (3 required)

**Where you see status:**
- Top-right corner of publisher cards
- Small icon in Recent Publishers list
- Overview Stats card (Active/Inactive count)

---

## ⚡ Quick Reference

### Common Workflows

| Task | Steps |
|------|-------|
| **Find Publisher** | Type name in Quick Search → Click card |
| **Show Active Only** | Click "Active Only" button → Review → Click "Clear All" |
| **Create New** | Click "Create New Publisher" button → Fill form |
| **Open Recent** | Click desired publisher in Recent Publishers card |
| **Search by Tag** | Click tag chip → View filtered results |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **F5** | Refresh page |
| **Tab** | Navigate between elements |
| **Enter** | Activate focused button |
| **F12** | Open browser console (for troubleshooting) |

---

## 🔧 Troubleshooting

### Problem: Dashboard is empty
**Solution:** Click "Clear All" button to remove filters

### Problem: Can't find a publisher
**Solution:** 
1. Clear all filters first
2. Try searching by ID instead of name
3. Check if it's filtered out by Active/Drafts filter

### Problem: Port 3000 already in use
**Solution:**
```bash
# Use different port
PORT=3001 npm run dev
```

### Problem: Search not working
**Solution:**
1. Refresh page (F5)
2. Clear browser cache
3. Check browser console for errors (F12)

---

## 📝 Status Badge Logic

A publisher shows as **Draft** (amber) if ANY of these are missing:
- Publisher ID
- Publisher Name
- At least 1 page configuration
- Publisher Dashboard URL
- Monitor Dashboard URL
- QA Status Dashboard URL

Once all fields are complete:
- **Active** (green) if `isActive: true`
- **Inactive** (gray) if `isActive: false`

---

## 🎯 Best Practices

1. **Always start at Dashboard** to see overview
2. **Use search before creating** to avoid duplicates
3. **Clear filters when done** to see all publishers
4. **Check Recent Publishers** for quick access to your work
5. **Watch overview stats** to understand system state

---

## 📞 Getting Help

1. **Refresh page** (F5) - fixes most issues
2. **Clear filters** (Click "Clear All")
3. **Check browser console** (F12 → Console tab)
4. **Contact your team lead** for persistent issues

---

## 📦 Sample Data

The system comes with 4 sample publishers:
1. **Aurora Media** (pub-aurora) - Active, 3 pages
2. **Borealis News** (pub-borealis) - Inactive, 3 pages
3. **Cascade Daily** (pub-cascade) - Active, 3 pages
4. **Summit Insights** (pub-summit) - Active, 3 pages

---

## 🔗 API Endpoints (for developers)

```
GET  /api/publishers              # List all publishers
GET  /api/publisher/:filename     # Get specific publisher
PUT  /api/publisher/:filename     # Update publisher
```

---

## ✅ Summary

The Dashboard provides:
- ✅ **Overview at a glance** - See all publishers and stats instantly
- ✅ **Quick access** - Recent Publishers card for quick editing
- ✅ **Powerful search** - Real-time filtering by name, ID, or tags
- ✅ **Easy filtering** - Quick filters for Active/Drafts
- ✅ **Status awareness** - Color-coded badges (Green/Gray/Amber)
- ✅ **One-click actions** - Click any card to open for editing

**Total Features:** 6 main components, 3 status types, real-time search, dynamic filtering

**All data is local** - No external credentials, no database setup required

---

**Document Version:** 1.0 - Complete Guide  
**Last Updated:** November 23, 2025  
**Pages:** Single comprehensive document  
**Screenshots:** Embedded dashboard overview  
**Videos:** 3 demonstrations with scripts (6:30 minutes total)
