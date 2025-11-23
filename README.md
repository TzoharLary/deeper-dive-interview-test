# Publisher Configuration Tool

A web-based tool designed for Taboola Support Engineers to safely view and edit publisher configurations.

---

## 🚀 Quick Start

### New Users - Start Here

1. **[📖 Read Getting Started Guide](docs/GETTING_STARTED.md)** - Complete installation in 8 steps (10-15 minutes)
2. **[📱 View Dashboard Screenshot](#dashboard-screenshot)** - See what you'll be working with
3. **[🎬 Watch Video Demonstrations](docs/videos/VIDEO_SCRIPTS.md)** - 6 minutes of narrated walkthroughs
4. **[📚 Review User Guide](docs/user-guide/DASHBOARD_USER_GUIDE.md)** - Comprehensive reference

### Quick Installation

```bash
# Step 1: Clone repository
git clone https://github.com/TzoharLary/deeper-dive-interview-test.git
cd deeper-dive-interview-test

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev

# Step 4: Open browser
# Navigate to http://localhost:3000
```

**Time Required:** 10-15 minutes  
**Prerequisites:** Node.js 18+, npm 8+, Git

**[See complete installation guide →](docs/GETTING_STARTED.md)**

---

## 📖 Documentation

### Complete Documentation Suite

| Document | Description | Size | Audience |
|----------|-------------|------|----------|
| **[Getting Started](docs/GETTING_STARTED.md)** | Installation, setup, and first-time use | 19KB | New Users |
| **[Dashboard User Guide](docs/user-guide/DASHBOARD_USER_GUIDE.md)** | Complete Dashboard reference | 26KB | All Users |
| **[Quick Reference](docs/user-guide/DASHBOARD_QUICK_REFERENCE.md)** | One-page cheat sheet | 4.3KB | All Users |
| **[Video Scripts](docs/videos/VIDEO_SCRIPTS.md)** | Demonstration video scripts | 23KB | Trainers |
| **[Documentation Index](docs/README.md)** | Complete documentation hub | - | All Users |

### Quick Links

- 📦 **[Installation Guide](docs/GETTING_STARTED.md#installation-steps)** - 8 numbered steps
- 🎯 **[Common Use Cases](docs/GETTING_STARTED.md#common-use-cases)** - Daily workflows
- ❓ **[Troubleshooting](docs/GETTING_STARTED.md#troubleshooting)** - Common issues
- 🎬 **[Video Demonstrations](docs/videos/VIDEO_SCRIPTS.md)** - 3 videos with narration
- 🖼️ **[Screenshots](docs/user-guide/images/)** - High-resolution images
- 📊 **[What's New](docs/GETTING_STARTED.md#whats-new)** - Version 1.0 features

---

## 🎬 Video Demonstrations

Three comprehensive video demonstrations with narration scripts:

### 1. Dashboard Walkthrough (3:00 min)
Complete tour of the Dashboard including navigation, quick actions, publisher grid, and search/filter sidebar.

**[View Script →](docs/videos/VIDEO_SCRIPTS.md#video-1-complete-dashboard-walkthrough)**

### 2. Common Use Cases (2:30 min)
Step-by-step demonstrations of 6 common tasks:
- Finding a publisher
- Filtering by status
- Searching by tag
- Creating new publisher
- Opening recent work
- Combining filters

**[View Script →](docs/videos/VIDEO_SCRIPTS.md#video-2-common-use-cases)**

### 3. Status System Explained (1:30 min)
Understanding Active, Inactive, and Draft status types with visual examples.

**[View Script →](docs/videos/VIDEO_SCRIPTS.md#video-3-status-system-explained)**

**Total Duration:** 6:30 minutes  
**Format:** Screen recording with narration and on-screen text  
**Subtitles:** Included in scripts, .srt files to be generated

---

## 📱 Dashboard Screenshot

![Publisher Configuration Tool Dashboard](docs/user-guide/images/dashboard-overview.png)

**Dashboard Features Shown:**
- Navigation bar (Dashboard/Publishers/Tools tabs)
- Create New Publisher button
- Recent Publishers card (3 most recent)
- Overview stats (Total/Active/Inactive)
- Publisher cards grid with status badges
- Search & Filter sidebar with real-time search
- Available tags for quick filtering
- Quick filter buttons (Active Only, Drafts Only, Clear All)

**[View Full Dashboard Guide →](docs/user-guide/DASHBOARD_USER_GUIDE.md)**

---

## ✨ Features

### Dashboard Page
- ✅ **Overview Statistics** - Real-time Total/Active/Inactive counts
- ✅ **Recent Publishers** - Quick access to 3 most recent with avatars
- ✅ **Create New Publisher** - Primary action button
- ✅ **Publisher Cards Grid** - Responsive layout with status badges
- ✅ **Search & Filter**
  - Real-time search by name, ID, or tags
  - Quick filters (Active Only, Drafts Only)
  - Click-to-search tag chips
  - Dynamic results count
- ✅ **Status Badges** - Color-coded Active/Inactive/Draft indicators
- ✅ **Interactive Elements** - Hover effects, clickable cards

### Publishers Page
- ✅ Browse all publishers
- ✅ Select to view/edit
- ✅ Search functionality
- ✅ Upload/Create options

### Technical Features
- ✅ Hot reload during development
- ✅ TypeScript support
- ✅ RESTful API endpoints
- ✅ JSON-based local storage
- ✅ ESLint code quality

---

## 🛠️ Development

### Available Scripts

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build

# Code linting
npm run lint

# Start production server
npm start
```

### Project Structure

```
deeper-dive-interview-test/
├── data/                    # Publisher JSON configurations
│   ├── publishers.json      # Registry
│   └── publisher-*.json     # Individual configs (4 samples)
├── docs/                    # Documentation
│   ├── GETTING_STARTED.md   # Installation guide
│   ├── user-guide/          # User documentation
│   └── videos/              # Video scripts
├── public/                  # Client-side application
│   ├── app/                 # TypeScript code
│   │   ├── ui/              # UI components (dashboard, publishers)
│   │   ├── data/            # API layer
│   │   └── state/           # State management
│   └── *.css                # Stylesheets
├── src/                     # Server-side code
│   ├── server.ts            # Express server
│   ├── routes.ts            # API endpoints
│   └── compiler.ts          # TypeScript compiler
└── package.json             # Dependencies
```

**[See complete structure →](docs/GETTING_STARTED.md#understanding-the-project-structure)**

---

## 📦 Prerequisites

### Required

- **Node.js** - Version 18.x or higher ([Download](https://nodejs.org/))
- **npm** - Version 8.x or higher (comes with Node.js)
- **Git** - For cloning repository ([Download](https://git-scm.com/))
- **Modern Browser** - Chrome, Firefox, Safari, or Edge (latest)

### Not Required

- ❌ No external credentials
- ❌ No database setup
- ❌ No environment variables for basic operation

**[See full prerequisites →](docs/GETTING_STARTED.md#prerequisites)**

---

## 🎯 What's New - Version 1.0

### Dashboard Features (November 2025)
- Real-time overview statistics
- Recent publishers with avatar system
- Publisher cards grid with status badges
- Comprehensive search and filtering
- Interactive elements with hover effects
- Responsive design (optimized for 1280px+)

### Documentation
- Complete Dashboard User Guide (26KB, ~35 pages)
- Quick Reference Card (4.3KB, 1 page)
- Getting Started Guide with 8 installation steps
- Video scripts with narration and timing
- High-resolution screenshots
- Complete documentation index

### Coming Soon
- ⏳ Recorded video demonstrations (MP4)
- ⏳ Subtitle files (.srt)
- ⏳ Publisher editor interface
- ⏳ Draft auto-save
- ⏳ Export/import configurations

**[See complete changelog →](docs/GETTING_STARTED.md#whats-new)**

---

## 🤝 Usage

### Common Workflows

#### Finding a Publisher
```
1. Navigate to Dashboard
2. Type name/ID/tag in Quick Search
3. Click matching card
```

#### Filtering by Status
```
1. Navigate to Dashboard
2. Click "Active Only" or "Drafts Only"
3. Review filtered results
4. Click "Clear All" when done
```

#### Creating New Publisher
```
1. Navigate to Dashboard
2. Click "Create New Publisher"
3. Enter required fields
4. Save configuration
```

**[See all workflows →](docs/user-guide/DASHBOARD_USER_GUIDE.md#working-with-the-dashboard)**

---

## 🧪 Testing & CI Artifacts

### Automated Tests

```bash
# Install Playwright (if needed)
npm install -D @playwright/test

# Run tests with video recording
npx playwright test --headed --video=on

# Videos saved to: test-results/*/video.webm
```

### CI Artifacts

- Build logs: `logs/dev-build.log`, `logs/prod-build.log`
- Lint output: `logs/lint.log`
- Test videos: `test-results/*/video.webm`

**[See CI artifacts guide →](docs/GETTING_STARTED.md#ci-artifacts-and-logs)**

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Quick Fix |
|-------|-----------|
| Port 3000 in use | `PORT=3001 npm run dev` |
| npm install fails | `sudo npm install` or fix permissions |
| Dashboard empty | Click "Clear All" to remove filters |
| TypeScript errors | `rm -rf node_modules && npm install` |

**[See full troubleshooting guide →](docs/GETTING_STARTED.md#troubleshooting)**

---

## 📊 Sample Data

The application includes 4 pre-configured sample publishers:

1. **Aurora Media** (pub-aurora) - Active, 3 pages
2. **Borealis News** (pub-borealis) - Inactive, 3 pages
3. **Cascade Daily** (pub-cascade) - Active, 3 pages
4. **Summit Insights** (pub-summit) - Active, 3 pages

Located in: `data/publisher-*.json`

---

## 🔧 API Endpoints

```
GET  /api/publishers              # List all publishers
GET  /api/publisher/:filename     # Get specific publisher
PUT  /api/publisher/:filename     # Update publisher
GET  /api/events                  # SSE for hot reload
GET  /data/:filename              # Direct data file access
```

---

## 🌐 Browser Support

Supports modern browsers with ES6+:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Optimized for:** Desktop screens 1280px and above

---

## 📄 License

Private - Taboola Internal Tool

---

## 📞 Support

### Getting Help

1. **Check Documentation:**
   - [Getting Started Guide](docs/GETTING_STARTED.md)
   - [Dashboard User Guide](docs/user-guide/DASHBOARD_USER_GUIDE.md)
   - [Quick Reference](docs/user-guide/DASHBOARD_QUICK_REFERENCE.md)
   - [Documentation Index](docs/README.md)

2. **Watch Videos:**
   - [Video Scripts](docs/videos/VIDEO_SCRIPTS.md)

3. **Review Troubleshooting:**
   - [Installation Issues](docs/GETTING_STARTED.md#troubleshooting)
   - [Runtime Issues](docs/user-guide/DASHBOARD_USER_GUIDE.md#troubleshooting)

4. **Contact:**
   - Team lead
   - Development team
   - File repository issue

---

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**Documentation:** ~80KB (6 guides + scripts + videos)  
**Total Pages:** ~70 pages when printed
