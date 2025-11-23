# Documentation

This directory contains comprehensive documentation for the Publisher Configuration Tool, including user guides, video demonstrations, installation instructions, and CI artifacts.

---

## 📚 Quick Links

| Document | Description | Format |
|----------|-------------|--------|
| **[Getting Started Guide](GETTING_STARTED.md)** | Complete installation and setup | Markdown |
| **[Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)** | Comprehensive Dashboard reference | Markdown |
| **[Quick Reference Card](user-guide/DASHBOARD_QUICK_REFERENCE.md)** | One-page cheat sheet | Markdown |
| **[Video Scripts](videos/VIDEO_SCRIPTS.md)** | Demonstration video scripts | Markdown |
| **[Deliverables Summary](DELIVERABLES_SUMMARY.md)** | Project overview and metrics | Markdown |

---

## 🚀 Getting Started

### New Users - Start Here

1. **[Read Getting Started Guide](GETTING_STARTED.md)** (15 minutes)
   - Prerequisites and requirements
   - Step-by-step installation (8 numbered steps)
   - First-time setup and verification
   - Running the application
   - Video demonstrations with narration scripts

2. **[Review Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)** (30 minutes)
   - Complete component descriptions
   - Common workflows
   - Best practices
   - Troubleshooting

3. **[Print Quick Reference Card](user-guide/DASHBOARD_QUICK_REFERENCE.md)** (1 page)
   - Keep at your desk for quick lookups

4. **Watch Video Demonstrations** (6 minutes total)
   - Dashboard Walkthrough (3 min)
   - Common Use Cases (2:30 min)
   - Status System (1:30 min)

---

## 📖 User Guides

### Comprehensive Documentation

#### [Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)
**Size:** 26KB (~35 pages when printed)  
**Audience:** Support Engineers, New Users  
**Content:**
- ✅ Introduction and purpose
- ✅ Accessing the Dashboard
- ✅ Complete component descriptions:
  - Navigation Bar
  - Page Header
  - Quick Action Section (Create/Recent/Overview)
  - Publisher Cards Grid
  - Search & Filter Sidebar (5 sub-components)
- ✅ 6 complete workflows for common tasks
- ✅ Understanding status indicators (Active/Inactive/Draft)
- ✅ Best practices (new users, efficiency, team coordination)
- ✅ Troubleshooting (7 common issues with solutions)
- ✅ Summary and key takeaways

#### [Quick Reference Card](user-guide/DASHBOARD_QUICK_REFERENCE.md)
**Size:** 4.3KB (1 page)  
**Audience:** All Users  
**Content:**
- Component locations table
- Status badge color guide
- Search & filter quick tips
- Common tasks (step-by-step)
- Troubleshooting fast fixes
- Best practices checklist
- Keyboard shortcuts

**Use Case:** Print and keep at your desk for quick reference

---

## 🎬 Video Demonstrations

### Available Videos

All video scripts and narration are available in **[videos/VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md)**

#### Video 1: Complete Dashboard Walkthrough
**Duration:** 3:00 minutes  
**File:** `videos/dashboard-walkthrough-v1-1080p.mp4` (to be recorded)  
**Script:** [See VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md#video-1-complete-dashboard-walkthrough)

**Content:**
- Navigation bar overview
- Quick Action section (Create/Recent/Overview)
- Publisher cards grid with status badges
- Search & Filter sidebar features
- Live demonstrations of filtering and searching
- Clicking cards to view publishers

**Narration:** Included in script with timestamps  
**Subtitles:** Available in `videos/subtitles/dashboard-walkthrough.srt`

#### Video 2: Common Use Cases
**Duration:** 2:30 minutes  
**File:** `videos/dashboard-use-cases-v1-1080p.mp4` (to be recorded)  
**Script:** [See VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md#video-2-common-use-cases)

**Content:**
- Finding a specific publisher
- Viewing only active publishers
- Searching by tag
- Creating a new publisher
- Opening recent work
- Combining search and filters

**Format:** Step-by-step demonstrations with on-screen text

#### Video 3: Status System Explained
**Duration:** 1:30 minutes  
**File:** `videos/dashboard-status-system-v1-1080p.mp4` (to be recorded)  
**Script:** [See VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md#video-3-status-system-explained)

**Content:**
- Active status (green) - Complete + In Use
- Inactive status (gray) - Complete + Not In Use
- Draft status (amber) - Incomplete configuration
- Required fields checklist
- Status indicators in different contexts

**Format:** Educational explanation with visual examples

### Recording Instructions

See **[VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md#recording-instructions)** for:
- Technical requirements (resolution, frame rate, audio)
- Recording software options (OBS Studio, Playwright, QuickTime)
- Post-production steps (editing, subtitles, export formats)
- Automated recording with Playwright
- File naming conventions

---

## 📦 Installation & Setup

### [Getting Started Guide](GETTING_STARTED.md)

Complete installation guide with:

#### Prerequisites
- Node.js (v18.x+)
- npm (v8.x+)
- Git
- Modern browser
- No external credentials required
- No database setup needed

#### Installation Steps (Numbered 1-8)

**Step 1:** Clone the repository  
**Step 2:** Navigate to project directory  
**Step 3:** Install dependencies  
**Step 4:** Verify installation  
**Step 5:** Start development server  
**Step 6:** Open in browser  
**Step 7:** Explore the Dashboard  
**Step 8:** Test basic functionality

**Time Required:** 10-15 minutes total

#### What's Included

- Project structure overview
- Sample data explanation (4 pre-configured publishers)
- First-time setup checklist
- Running the application
- Testing functionality
- Troubleshooting installation issues

---

## 🖼️ Screenshots

### Dashboard Overview

![Dashboard Screenshot](user-guide/images/dashboard-overview.png)

**Full Dashboard View** (1280x1024)  
Shows all components:
- Navigation bar (Dashboard/Publishers/Tools tabs)
- Create New Publisher button (left)
- Recent Publishers card (center) with 3 recent entries
- Overview stats card (right) showing Total/Active/Inactive
- Publisher cards grid (4 publishers)
- Search & Filter sidebar (right) with all features

**Additional Screenshots Available:**
- Located in: `docs/user-guide/images/`
- Format: PNG (high resolution)
- Can be used in presentations and training materials

---

## 🎯 What's New

### Version 1.0 - Initial Release (November 2025)

#### Dashboard Features
- ✅ Real-time overview statistics (Total/Active/Inactive)
- ✅ Recent Publishers with avatar system and metadata
- ✅ Create New Publisher button
- ✅ Publisher cards grid with status badges
- ✅ Search & Filter sidebar:
  - Real-time search (name/ID/tags)
  - Quick filters (Active Only, Drafts Only, Clear All)
  - Click-to-search tag chips
  - Dynamic results count
- ✅ Interactive elements (hover effects, clickable cards)
- ✅ Responsive design (optimized for 1280px+)

#### Documentation
- ✅ Complete Dashboard User Guide (26KB)
- ✅ Quick Reference Card (4.3KB)
- ✅ Getting Started Guide with installation steps
- ✅ Video scripts with narration and timing
- ✅ Screenshots (116KB PNG)
- ✅ Deliverables summary

#### Coming Soon
- ⏳ Video recordings (MP4 format)
- ⏳ Subtitle files (.srt format)
- ⏳ CI artifacts from Playwright tests
- ⏳ Additional annotated screenshots

---

## 🔧 CI Artifacts

### Automated Test Videos

**Playwright Recordings**

When tests are run with video recording enabled, videos are saved to:

```
test-results/
├── dashboard-navigation/
│   └── video.webm
├── search-functionality/
│   └── video.webm
└── publisher-selection/
    └── video.webm
```

**How to Generate:**
```bash
# Install Playwright
npm install -D @playwright/test

# Run tests with video recording
npx playwright test --headed --video=on

# Videos saved to: test-results/*/video.webm
```

### Build Logs

**Development Build:**
```bash
npm run dev 2>&1 | tee logs/dev-build.log
```

**Production Build:**
```bash
npm run build 2>&1 | tee logs/prod-build.log
```

**Linting Output:**
```bash
npm run lint 2>&1 | tee logs/lint.log
```

**Log Files Location:**
```
logs/
├── dev-build.log
├── prod-build.log
├── lint.log
└── test-results/
```

See **[Getting Started Guide - CI Artifacts section](GETTING_STARTED.md#ci-artifacts-and-logs)** for details.

---

## 📝 Documentation Standards

### Viewing the Guides

#### Online (GitHub)
All guides are written in Markdown format and can be viewed directly on GitHub with full formatting, including:
- Clickable table of contents
- Formatted tables
- Code blocks with syntax highlighting
- Embedded images

#### Local Viewing
1. Open Markdown files in VS Code with Markdown preview (Ctrl+Shift+V / Cmd+Shift+V)
2. Use any Markdown viewer or editor
3. Use a Markdown viewer browser extension

#### Converting to PDF

To create PDF versions for distribution:

```bash
# Using pandoc (recommended)
pandoc docs/user-guide/DASHBOARD_USER_GUIDE.md -o DASHBOARD_USER_GUIDE.pdf
pandoc docs/user-guide/DASHBOARD_QUICK_REFERENCE.md -o DASHBOARD_QUICK_REFERENCE.pdf
pandoc docs/GETTING_STARTED.md -o GETTING_STARTED.pdf

# Or use online Markdown to PDF converters:
# - https://www.markdowntopdf.com/
# - https://md2pdf.netlify.app/
# - CloudConvert: https://cloudconvert.com/md-to-pdf
```

**PDF Settings:**
- Page size: Letter or A4
- Margins: 1 inch / 2.54 cm
- Include table of contents
- Preserve formatting and code blocks

---

## 🤝 Contributing

### Adding New Documentation

When adding new guides or documentation:

1. **Location**
   - User-facing guides: `user-guide/` subdirectory
   - Video content: `videos/` subdirectory
   - Setup/installation: Root `docs/` directory

2. **File Naming**
   - Use UPPERCASE for main guides (e.g., `GETTING_STARTED.md`)
   - Use clear, descriptive names
   - Include version in video files (e.g., `dashboard-walkthrough-v1.mp4`)

3. **Structure**
   - Include table of contents for long documents
   - Follow the standard guide structure (see below)
   - Use consistent heading levels
   - Include metadata (version, date, audience)

4. **Screenshots and Images**
   - Store in appropriate `images/` subdirectory
   - Use descriptive filenames
   - High resolution (1280x720 minimum)
   - PNG format for screenshots, JPEG for photos
   - Annotate when helpful (arrows, highlights, labels)

5. **Update Index**
   - Add links to new guides in this README
   - Update the Quick Links table
   - Include brief description and format

### Guide Structure Template

Each user guide should follow this structure:

```markdown
# [Title]
## [Subtitle if needed]

**Version:** 1.0
**Last Updated:** [Date]
**Audience:** [Target users]

---

## Table of Contents
[Auto-generated or manual links]

---

## Introduction
- Purpose
- Who should use this guide
- What you'll learn

## [Main Content Sections]
- Overview with screenshots
- Component descriptions
- Step-by-step workflows
- Examples and use cases

## Best Practices
- Tips for efficient use
- Common patterns
- Team coordination

## Troubleshooting
- Common issues
- Solutions
- Getting help

## Summary
- Key takeaways
- Next steps

---

**Document Information:**
- Created: [Date]
- Version: 1.0
- Maintained By: [Team/Person]
```

---

## 📂 File Structure

```
docs/
├── README.md                           # This file - Documentation index
├── GETTING_STARTED.md                  # Installation and setup guide (19KB)
├── DELIVERABLES_SUMMARY.md             # Project deliverables overview (9KB)
├── user-guide/                         # User-facing guides
│   ├── DASHBOARD_USER_GUIDE.md         # Main dashboard reference (26KB)
│   ├── DASHBOARD_QUICK_REFERENCE.md    # Quick reference card (4.3KB)
│   └── images/                         # Screenshots
│       └── dashboard-overview.png      # Full dashboard screenshot (116KB)
├── videos/                             # Video demonstrations
│   ├── VIDEO_SCRIPTS.md                # Complete video scripts (23KB)
│   ├── dashboard-walkthrough-v1-1080p.mp4    # (To be recorded)
│   ├── dashboard-use-cases-v1-1080p.mp4       # (To be recorded)
│   ├── dashboard-status-system-v1-1080p.mp4   # (To be recorded)
│   └── subtitles/                      # Subtitle files
│       ├── dashboard-walkthrough.srt   # (To be generated)
│       ├── dashboard-use-cases.srt     # (To be generated)
│       └── dashboard-status-system.srt # (To be generated)
└── logs/                               # CI artifacts and logs
    ├── dev-build.log                   # (Generated on build)
    ├── prod-build.log                  # (Generated on build)
    ├── lint.log                        # (Generated on lint)
    └── test-results/                   # (Generated by Playwright)
```

---

## 📊 Documentation Metrics

| Metric | Value |
|--------|-------|
| **Total Documentation** | ~80KB text, 116KB images |
| **User Guides** | 3 comprehensive guides |
| **Video Scripts** | 3 complete scripts with narration |
| **Screenshots** | 1 full-page + more available |
| **Installation Steps** | 8 numbered steps |
| **Common Use Cases** | 6 demonstrated workflows |
| **Troubleshooting Scenarios** | 7+ with solutions |
| **Video Duration** | 6:30 minutes (3 videos) |

---

## 🆘 Support

### Getting Help

If you need assistance:

1. **Check Documentation:**
   - [Getting Started Guide](GETTING_STARTED.md) for setup issues
   - [Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md) for feature questions
   - [Quick Reference](user-guide/DASHBOARD_QUICK_REFERENCE.md) for quick lookups

2. **Watch Videos:**
   - Review video scripts in [VIDEO_SCRIPTS.md](videos/VIDEO_SCRIPTS.md)
   - Check recorded videos when available

3. **Review Troubleshooting:**
   - [Getting Started - Troubleshooting](GETTING_STARTED.md#troubleshooting)
   - [Dashboard Guide - Troubleshooting](user-guide/DASHBOARD_USER_GUIDE.md#troubleshooting)

4. **Contact Team:**
   - Reach out to your team lead
   - Contact the development team
   - File an issue in the repository

---

## 📄 License

Private - Taboola Internal Tool

---

**Documentation Version:** 1.0  
**Last Updated:** November 23, 2025  
**Maintained By:** Development Team  
**Total Pages:** ~70 pages (when printed)
