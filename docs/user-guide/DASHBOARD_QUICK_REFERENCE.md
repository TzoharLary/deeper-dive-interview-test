# Dashboard Quick Reference Card

## 🎯 Quick Access Guide for Support Engineers

---

## Main Components at a Glance

| Component | Location | Purpose |
|-----------|----------|---------|
| **Create New Publisher** | Left side of Quick Action section | Start creating a new publisher configuration |
| **Recent Publishers** | Center of Quick Action section | Access your 3 most recently edited publishers |
| **Overview Stats** | Right side of Quick Action section | View total, active, and inactive publisher counts |
| **Publisher Cards** | Main grid area | Browse all publishers as interactive cards |
| **Search & Filter** | Right sidebar | Search and filter publishers by various criteria |

---

## Status Badges

| Badge | Color | Meaning |
|-------|-------|---------|
| **Active** | 🟢 Green | Complete configuration, currently in use |
| **Inactive** | ⚪ Gray | Complete configuration, not in use |
| **Draft** | 🟡 Amber | Incomplete configuration, missing required fields |

---

## Search & Filter Quick Tips

### Search Box
- Type to search by **name**, **ID**, or **tags**
- Updates in real-time as you type
- Case-insensitive
- Matches partial strings

### Quick Filters
- **Active Only** → Shows only active publishers
- **Drafts Only** → Shows only incomplete publishers
- **Clear All** → Removes all filters and clears search

### Available Tags
- Click any tag chip to automatically search for that tag
- Shows all unique tags across publishers

---

## Common Tasks - Quick Steps

### Find a Publisher
1. Type name, ID, or tag in search box
2. Or click relevant tag chip
3. Click on the matching card

### View Only Active Publishers
1. Click "Active Only" button (turns blue)
2. Click "Clear All" when done

### Create New Publisher
1. Click the large "Create New Publisher" button (with + icon)
2. You'll be redirected to the Publishers page

### Open Recent Work
1. Look at Recent Publishers card
2. Click on any of the 3 recent items

### Check System Status
1. Look at Overview card (right side)
2. Note Total, Active, and Inactive counts

---

## Status Requirements Checklist

A publisher is **Draft** if ANY of these are missing:
- ☐ Publisher ID (`publisherId`)
- ☐ Publisher Name (`aliasName`)
- ☐ At least one Page Configuration
- ☐ Publisher Dashboard URL
- ☐ Monitor Dashboard URL
- ☐ QA Status Dashboard URL

---

## Keyboard Tips

- **F5** or **Cmd+R** - Refresh page
- **F12** - Open browser console (for troubleshooting)
- **Tab** - Navigate between interactive elements
- **Enter** - Activate focused button or card

---

## Troubleshooting Fast Fixes

| Problem | Quick Fix |
|---------|-----------|
| Can't find publisher | Click "Clear All" to remove filters |
| Dashboard empty | Check if filters are active, click "Clear All" |
| Stats don't match | Filters are active; click "Clear All" to see totals |
| Card won't click | Refresh page (F5) |
| Recent not updating | Only top 3 shown; use search instead |

---

## Visual Indicators

### Publisher Cards
- **Hover** → Shadow appears, name turns indigo
- **Click** → Opens publisher in editor
- Status badge → Top-right corner

### Recent Publishers
- **Initials** → Large letters (e.g., "AM" for Aurora Media)
- **Status icon** → ✓ for Active, ● for Inactive
- **Metadata** → Time + page count

### Filters
- **Gray** → Inactive
- **Blue** → Active Only filter is on
- **Amber** → Drafts Only filter is on

---

## Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| **Dashboard** | ⊞ Grid | Overview and statistics (current page) |
| **Publishers** | 📖 Book | List and editor view |
| **Tools** | 🔧 Wrench | Additional tools (coming soon) |

---

## Best Practices Checklist

- ☐ Always start your session at the Dashboard
- ☐ Check Overview stats to understand current state
- ☐ Use search before creating a new publisher (avoid duplicates)
- ☐ Clear filters when done with a filtered task
- ☐ Review Recent Publishers to see team activity
- ☐ Complete Draft publishers when possible

---

## Need More Detail?

📖 **See the full [Dashboard User Guide](DASHBOARD_USER_GUIDE.md)** for:
- Detailed component descriptions
- Complete workflows
- Extensive troubleshooting
- Understanding status logic
- Advanced search techniques

---

**Print this page for quick desk reference!**

*Version 1.0 | November 23, 2025*
