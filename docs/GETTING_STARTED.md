# Getting Started Guide
## Publisher Configuration Tool - Complete Setup and Demo

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**Audience:** New Users and Support Engineers

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [First-Time Setup](#first-time-setup)
4. [Running the Application](#running-the-application)
5. [Video Demonstrations](#video-demonstrations)
6. [Common Use Cases](#common-use-cases)
7. [What's New](#whats-new)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing the Publisher Configuration Tool, ensure you have:

### Required Software

- **Node.js** (version 18.x or higher)
  - Download from: https://nodejs.org/
  - Check version: `node --version`

- **npm** (version 8.x or higher, comes with Node.js)
  - Check version: `npm --version`

- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/
  - Check version: `git --version`

### Required Credentials

- No external credentials required for local demo
- No database setup needed (uses local JSON files)

### Environment Variables

No environment variables are required for basic operation. The application runs with default settings:

- **Port:** 3000 (configurable via `PORT` environment variable)
- **Data Directory:** `./data/` (local JSON files)

### System Requirements

- **Operating System:** Windows, macOS, or Linux
- **RAM:** Minimum 2GB available
- **Disk Space:** 100MB for application and dependencies
- **Browser:** Modern browser (Chrome, Firefox, Safari, or Edge - latest versions)

---

## Installation Steps

Follow these numbered steps to install the Publisher Configuration Tool:

### Step 1: Clone the Repository

Open a terminal/command prompt and run:

```bash
git clone https://github.com/TzoharLary/deeper-dive-interview-test.git
```

**Expected Output:**
```
Cloning into 'deeper-dive-interview-test'...
remote: Enumerating objects: 150, done.
remote: Counting objects: 100% (150/150), done.
...
Resolving deltas: 100% (80/80), done.
```

### Step 2: Navigate to Project Directory

```bash
cd deeper-dive-interview-test
```

**Verify you're in the correct directory:**
```bash
ls -la
```

**You should see:**
- `package.json`
- `src/` directory
- `public/` directory
- `data/` directory
- `docs/` directory

### Step 3: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 225 packages, and audited 226 packages in 15s

51 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**What this does:**
- Downloads all required npm packages
- Installs TypeScript compiler
- Installs ESLint for code quality
- Installs Express server framework
- Sets up development tools (tsx)

**Time Required:** 1-3 minutes depending on internet connection

### Step 4: Verify Installation

Check that all required files are present:

```bash
# List key directories
ls -d src public data docs

# Check package.json exists
cat package.json | grep "name"
```

**Expected Output:**
```
src  public  data  docs
  "name": "deeper-dive-interview-test",
```

---

## First-Time Setup

### Understanding the Project Structure

Before running the application, familiarize yourself with the structure:

```
deeper-dive-interview-test/
├── data/                           # Publisher configuration files
│   ├── publishers.json             # Registry of all publishers
│   ├── publisher-aurora.json       # Sample publisher 1
│   ├── publisher-borealis.json     # Sample publisher 2
│   ├── publisher-cascade.json      # Sample publisher 3
│   └── publisher-summit.json       # Sample publisher 4
├── public/                         # Client-side application
│   ├── index.html                  # Main HTML page
│   ├── app/                        # TypeScript application code
│   │   ├── main.ts                 # Application entry point
│   │   ├── ui/                     # UI components
│   │   │   ├── dashboard.ts        # Dashboard page
│   │   │   └── publishers.ts       # Publishers page
│   │   └── data/                   # API layer
│   └── *.css                       # Stylesheets
├── src/                            # Server-side code
│   ├── server.ts                   # Express server
│   ├── routes.ts                   # API endpoints
│   └── compiler.ts                 # TypeScript compiler
├── docs/                           # Documentation
│   └── user-guide/                 # User guides
│       ├── DASHBOARD_USER_GUIDE.md # Main dashboard guide
│       └── images/                 # Screenshots
└── package.json                    # Project dependencies
```

### Review Sample Data

The application comes with 4 sample publishers pre-configured:

1. **Aurora Media** (pub-aurora) - Active publisher with 3 pages
2. **Borealis News** (pub-borealis) - Inactive publisher with 3 pages
3. **Cascade Daily** (pub-cascade) - Active publisher with 3 pages
4. **Summit Insights** (pub-summit) - Active publisher with 3 pages

**View sample data:**

```bash
cat data/publishers.json
cat data/publisher-aurora.json
```

---

## Running the Application

### Step 5: Start the Development Server

Run the following command:

```bash
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
Watching for file changes...
```

**What this does:**
- Starts the Express server on port 3000
- Compiles TypeScript files
- Watches for file changes and auto-reloads
- Serves the application at http://localhost:3000

### Step 6: Open the Application in Your Browser

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the Publisher Configuration Tool homepage

**What you'll see:**
- Navigation bar with Dashboard, Publishers, and Tools tabs
- Publishers page (default view) with list of publishers
- Search functionality
- Publisher cards

### Step 7: Explore the Dashboard

1. Click on the **"Dashboard"** tab in the navigation bar
2. You should see:
   - **Create New Publisher** button (left)
   - **Recent Publishers** card (center)
   - **Overview Stats** card (right)
   - **Publisher Cards Grid** (main area)
   - **Search & Filter Sidebar** (right side)

### Step 8: Test Basic Functionality

#### Test 1: View Publisher Details
1. Click on any publisher card (e.g., "Aurora Media")
2. Verify you're redirected to the Publishers page
3. Observe the publisher details

#### Test 2: Use Search
1. Return to Dashboard (click Dashboard tab)
2. In the Search & Filter sidebar, type "aurora" in the Quick Search field
3. Verify the grid filters to show only matching publishers

#### Test 3: Use Quick Filters
1. Click "Active Only" button in the sidebar
2. Verify only active publishers are displayed
3. Click "Clear All" to reset

---

## Video Demonstrations

### Video 1: Complete Dashboard Walkthrough
**Duration:** 3:00 minutes  
**Description:** Full tour of the Dashboard page including all components and features

**Video Script:**
```
[00:00 - 00:15] Introduction
"Welcome to the Publisher Configuration Tool Dashboard. This is what you'll see when you first log into the system."

[00:15 - 00:45] Navigation Bar
"At the top, you have three main tabs: Dashboard, Publishers, and Tools. We're currently on the Dashboard page."

[00:45 - 01:15] Quick Action Section
"The Dashboard is organized into three main areas. On the left, you have the 'Create New Publisher' button for adding new configurations. In the center, the 'Recent Publishers' card shows your three most recently edited publishers with status indicators. On the right, the 'Overview' card displays total, active, and inactive publisher counts."

[01:15 - 01:45] Publisher Cards Grid
"Below, you'll see all publishers displayed as interactive cards. Each card shows the publisher name, ID, and status badge. Active publishers have a green badge, inactive have gray, and incomplete drafts have amber."

[01:45 - 02:15] Search & Filter Sidebar
"On the right side is the Search & Filter sidebar. You can click on available tags to quickly filter, use the search box for real-time filtering by name, ID, or tags, or use quick filter buttons for common views."

[02:15 - 02:45] Demonstration
"Let me show you how it works. I'll search for 'aurora'... and you can see the grid updates instantly. Now I'll click 'Active Only'... and only active publishers are shown. The overview stats update too. I'll click 'Clear All' to reset."

[02:45 - 03:00] Conclusion
"That's the Dashboard overview. Click on any publisher card to open it for editing. See the full user guide for detailed documentation."
```

**Video File:** `docs/videos/dashboard-walkthrough.mp4` (to be generated)

**Screenshot from Video:**

![Dashboard Video Frame](images/dashboard-overview.png)

### Video 2: Common Use Cases
**Duration:** 2:30 minutes  
**Description:** Step-by-step demonstrations of common tasks

**Video Script:**
```
[00:00 - 00:20] Use Case 1: Finding a Specific Publisher
"Use Case 1: Finding a specific publisher. Type the name, ID, or tag in the search box. The results filter in real-time. Click on the matching card to open it."

[00:20 - 00:45] Use Case 2: Viewing Only Active Publishers
"Use Case 2: Viewing only active publishers. Click the 'Active Only' button in the sidebar. The grid shows only active publishers, and stats update to reflect filtered results."

[00:45 - 01:10] Use Case 3: Searching by Tag
"Use Case 3: Searching by tag. In the 'Available Tags' section, click any tag chip. The search field populates automatically, and publishers with that tag are displayed."

[01:10 - 01:35] Use Case 4: Creating a New Publisher
"Use Case 4: Creating a new publisher. Click the large 'Create New Publisher' button with the plus icon. You'll be redirected to the Publishers page where you can enter configuration details."

[01:35 - 02:00] Use Case 5: Opening Recent Work
"Use Case 5: Accessing recent work. Look at the 'Recent Publishers' card. Click on any of the three recent items to quickly open it for editing."

[02:00 - 02:30] Use Case 6: Combining Search and Filters
"Use Case 6: Advanced filtering. You can combine search with quick filters. For example, click 'Active Only', then type 'news' to find active publishers with 'news' in the name. Click 'Clear All' when done."
```

**Video File:** `docs/videos/common-use-cases.mp4` (to be generated)

### Video 3: Status System Explained
**Duration:** 1:30 minutes  
**Description:** Understanding Active, Inactive, and Draft statuses

**Video Script:**
```
[00:00 - 00:30] Status Types Overview
"The system uses three status types: Active, Inactive, and Draft. Active publishers are complete and in use, shown with a green badge. Inactive publishers are complete but not in use, shown with a gray badge. Draft publishers are incomplete and missing required fields, shown with an amber badge."

[00:30 - 01:00] Draft Status Requirements
"A publisher is marked as Draft if ANY of these are missing: Publisher ID, Publisher Name, at least one page configuration, or any of the three required dashboard URLs: Publisher Dashboard, Monitor Dashboard, and QA Status Dashboard."

[01:00 - 01:30] Status in Different Contexts
"Status appears in different places: in the top-right corner of publisher cards, as small icons next to initials in the Recent Publishers list, and in the Overview stats which count Active and Inactive separately but include all publishers in the Total."
```

**Video File:** `docs/videos/status-system.mp4` (to be generated)

---

## Common Use Cases

### Quick Reference for Daily Tasks

#### Finding a Publisher
```
Step 1: Navigate to Dashboard
Step 2: Use Quick Search (type name, ID, or tag)
Step 3: Click on matching card
```

#### Filtering by Status
```
Step 1: Navigate to Dashboard
Step 2: Click "Active Only" or "Drafts Only" button
Step 3: Review filtered results
Step 4: Click "Clear All" when done
```

#### Creating a New Publisher
```
Step 1: Navigate to Dashboard
Step 2: Click "Create New Publisher" button
Step 3: Enter required fields in Publishers page
Step 4: Save configuration
```

#### Accessing Recent Work
```
Step 1: Navigate to Dashboard
Step 2: Look at Recent Publishers card
Step 3: Click on desired publisher
```

---

## What's New

### Version 1.0 - Initial Release (November 2025)

#### Dashboard Page Features
- ✅ **Overview Statistics**: Real-time display of total, active, and inactive publisher counts
- ✅ **Recent Publishers Card**: Quick access to 3 most recently edited publishers with avatar system
- ✅ **Create New Publisher Button**: Primary action for adding new configurations
- ✅ **Publisher Cards Grid**: Responsive grid layout displaying all publishers
- ✅ **Status Badges**: Color-coded badges (Active/Inactive/Draft) on all cards
- ✅ **Search & Filter Sidebar**: Comprehensive filtering capabilities
  - Real-time search by name, ID, or tags
  - Quick filters: Active Only, Drafts Only
  - Available tags for click-to-search
  - Dynamic results count
- ✅ **Interactive Elements**: Hover effects, clickable cards, status indicators
- ✅ **Responsive Design**: Works on desktop screens (optimized for 1280px and above)

#### Publishers Page Features
- ✅ **Publisher List View**: Browse all publishers
- ✅ **Publisher Selection**: Click to view/edit
- ✅ **Search Functionality**: Filter publishers
- ✅ **Upload/Create Options**: Add new publishers

#### Technical Features
- ✅ **Hot Reload**: Automatic browser refresh on code changes
- ✅ **TypeScript Support**: Full type safety
- ✅ **API Layer**: RESTful endpoints for data access
- ✅ **Local Storage**: JSON-based data files
- ✅ **ESLint Integration**: Code quality enforcement

### Coming in Future Versions

#### Planned Features
- ⏳ **Publisher Editor**: Full configuration editing interface
- ⏳ **Draft Auto-Save**: Automatically save work in progress
- ⏳ **Validation System**: Real-time field validation
- ⏳ **Export/Import**: Download and upload configuration files
- ⏳ **Version History**: Track configuration changes over time
- ⏳ **Bulk Operations**: Select and modify multiple publishers
- ⏳ **Advanced Filtering**: Filter by multiple criteria simultaneously
- ⏳ **Custom Tags**: Create and manage your own tags
- ⏳ **User Preferences**: Save dashboard layout and filter settings

---

## CI Artifacts and Logs

### Automated Test Artifacts

The application includes automated testing capabilities:

#### Playwright Test Videos

Playwright can record videos of test runs showing real user interactions:

**Location:** `/tmp/playwright-logs/` (during test execution)

**How to Generate:**
```bash
# Install Playwright (if needed)
npm install -D @playwright/test

# Run tests with video recording
npx playwright test --headed --video=on
```

**Available Test Videos:**
1. `dashboard-navigation.mp4` - Navigation between pages
2. `search-functionality.mp4` - Search and filter testing
3. `publisher-selection.mp4` - Clicking and opening publishers

#### Build Logs

**Development Build:**
```bash
npm run dev 2>&1 | tee logs/dev-build.log
```

**Production Build:**
```bash
npm run build 2>&1 | tee logs/prod-build.log
```

#### Test Logs

**Linting Output:**
```bash
npm run lint 2>&1 | tee logs/lint.log
```

**Sample Log Output:**
```
✔ No linting errors found
  Checked 45 files
  0 warnings, 0 errors
```

#### Server Logs

When running the application, monitor server logs:

```bash
npm run dev
```

**Sample Output:**
```
[23:45:12] Starting TypeScript compilation...
[23:45:14] Compilation complete
[23:45:14] Server running on http://localhost:3000
[23:45:14] GET /api/publishers 200 15ms
[23:45:15] GET /api/publisher/publisher-aurora.json 200 8ms
```

### Log Files

Generated log files are stored in:

```
logs/
├── dev-build.log          # Development build output
├── prod-build.log         # Production build output
├── lint.log               # Code linting results
└── test-results/          # Test execution logs
    ├── test-run-1.log
    └── test-run-2.log
```

---

## Troubleshooting

### Common Installation Issues

#### Issue: "npm install" fails

**Error Message:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**
```bash
# Use sudo (Linux/Mac)
sudo npm install

# Or fix npm permissions
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### Issue: Port 3000 already in use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 [PID]

# Or use a different port
PORT=3001 npm run dev
```

#### Issue: TypeScript compilation errors

**Error Message:**
```
error TS2307: Cannot find module
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild TypeScript
npm run build
```

### Runtime Issues

#### Issue: Dashboard appears empty

**Possible Causes:**
1. Data files missing or corrupted
2. API endpoint errors
3. JavaScript errors in browser console

**Solution:**
```bash
# Verify data files exist
ls -la data/

# Check server logs for errors
# Check browser console (F12) for JavaScript errors

# Refresh the page
# Clear browser cache
```

#### Issue: Search not working

**Solution:**
1. Clear all active filters (click "Clear All")
2. Refresh the page
3. Check browser console for errors

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console:** Press F12 to open developer tools
2. **Review Server Logs:** Look at terminal output where `npm run dev` is running
3. **Check Documentation:** Review the [Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)
4. **Contact Support:** Reach out to your team lead or development team

---

## Next Steps

After completing this setup:

1. **Read the User Guide:** Review the comprehensive [Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)
2. **Keep Quick Reference Handy:** Print or bookmark the [Quick Reference Card](user-guide/DASHBOARD_QUICK_REFERENCE.md)
3. **Watch Video Demonstrations:** View all demo videos in the `docs/videos/` directory
4. **Try Common Use Cases:** Practice the workflows outlined in this guide
5. **Explore Advanced Features:** Read about filters, tags, and status management

---

## Additional Resources

### Documentation
- **[Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)** - Complete reference
- **[Quick Reference Card](user-guide/DASHBOARD_QUICK_REFERENCE.md)** - One-page cheat sheet
- **[Deliverables Summary](DELIVERABLES_SUMMARY.md)** - Project overview

### Video Library
- **[Dashboard Walkthrough](videos/dashboard-walkthrough.mp4)** - Full tour
- **[Common Use Cases](videos/common-use-cases.mp4)** - Task demonstrations
- **[Status System](videos/status-system.mp4)** - Status explanation

### Sample Data
- `data/publishers.json` - Publisher registry
- `data/publisher-*.json` - Sample configurations

### API Documentation
- `GET /api/publishers` - List all publishers
- `GET /api/publisher/:filename` - Get specific publisher
- `PUT /api/publisher/:filename` - Update publisher

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Maintained By:** Development Team
