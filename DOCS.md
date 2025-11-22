# Support Console User Guide

## What is the Support Console?

The Support Console is a web-based tool designed specifically for Taboola Support Engineers to safely view and edit publisher configurations. Instead of manually editing raw JSON files (which can lead to syntax errors and broken configurations), this tool provides a structured, visual interface that prevents common mistakes and guides you through safe editing workflows.

The console handles all the complexity of JSON syntax, nested structures, and validation rules automatically, so you can focus on the configuration changes you need to make without worrying about breaking anything.

---

## How to Safely Edit a Publisher (Flow A)

Editing a publisher configuration is straightforward with the built-in safety features:

### Step 1: Find Your Publisher
Use the search bar in the left panel to quickly locate the publisher by name or ID. The list shows all available publishers with their current status (active/inactive) and alias names.

### Step 2: Select and Review
Click on the publisher to load their full configuration. The main editor panel displays all editable fields organized into clear sections:
- **Publisher Information**: Basic details like alias name and active status
- **Page Configurations**: A table showing all pages with their selectors, types, and positions
- **Advanced Options**: Custom CSS, tags, allowed domains, and notes

### Step 3: Make Your Changes
Edit any field directly in the form. The system validates your input in real-time:
- Text fields check for valid formats
- Number fields only accept numeric values
- Required fields are marked and won't allow empty values
- The system prevents invalid characters or formats automatically

### Step 4: Review Changes
As you edit, the Changes Panel at the bottom shows exactly what you've modified, displaying both the old value and the new value for each change. This gives you a clear overview before saving.

### Step 5: Save with Confidence
Click the "Save" button when ready. The system performs a final validation check and will show clear error messages if anything needs attention. If validation passes, your changes are safely saved and the configuration is updated.

---

## How to Add Tags or Domains Without Breaking JSON (Flow B)

Arrays like tags and allowed domains can be tricky in raw JSON, but the console makes them simple:

### Adding Items
1. Navigate to the **Advanced Options** section in the editor
2. Find the "Tags" or "Allowed Domains" field
3. Use the "Add" button to insert a new entry
4. Type your value in the new field that appears
5. The system automatically handles all JSON array syntax (commas, brackets, quotes)

### Removing Items
Click the "Remove" button next to any tag or domain entry. The system automatically adjusts the array structure properly.

### Editing Existing Items
Simply click on a tag or domain and type your changes. The JSON formatting is maintained automatically.

**Important:** You don't need to worry about commas between items, quotation marks, or brackets. The console handles all of that behind the scenes and ensures the JSON structure remains valid.

---

## The 'Traffic Light' Validation System

The console uses a color-coded validation system to help you understand the state of your edits at a glance:

### 🟢 Green (Valid)
Everything is correct and safe to save. All required fields are filled, all values meet their format requirements, and the configuration is ready to be saved.

### 🟡 Yellow (Warning)
Your changes are technically valid, but there may be something to review. For example:
- Optional fields are empty (which might be intentional)
- Values are at the edge of acceptable ranges
- The system detected an unusual pattern

You can still save, but you might want to double-check the flagged fields.

### 🔴 Red (Error)
Something must be fixed before you can save. Common issues include:
- Required fields are empty
- Values are in the wrong format (e.g., text in a number field)
- Values exceed minimum or maximum limits
- Invalid characters in specific fields

**Error messages are written in plain language** - no technical jargon or stack traces. Each message tells you exactly what's wrong and where to fix it, such as "Page 2 is missing a selector" or "Publisher ID cannot be empty."

The validation runs automatically as you type, so you get immediate feedback and can correct issues right away.

---

## How to Use the 'Undo' Feature

The console includes built-in change tracking and undo capabilities:

### Reviewing Your Changes
The **Changes Panel** at the bottom of the screen shows a real-time diff of all modifications:
- Field path (e.g., "pages[0].selector")
- Original value (what it was before)
- New value (what you changed it to)

This panel updates automatically as you edit, giving you a complete audit trail of your session.

### Undoing Changes
To revert your edits:

**Individual Field Undo:**
Click the "Revert" icon next to any change in the Changes Panel to undo just that specific modification while keeping your other changes.

**Discard All Changes:**
Click the "Discard Changes" button to abandon all your edits and restore the configuration to its original state (as it was when you loaded the publisher).

**Reload Publisher:**
Select a different publisher or click "Refresh" to reload the current publisher's configuration from disk, discarding any unsaved changes.

### Important Notes
- Undo only works for **unsaved changes** in your current editing session
- Once you click "Save," changes are committed and become the new baseline
- The system keeps the original configuration in memory until you save, so you can always go back to where you started
- If you accidentally save something, contact your engineering team to restore from backups

---

## Quick Tips for Safe Editing

1. **Always review the Changes Panel before saving** - it's your safety net to catch unintended modifications
2. **Pay attention to validation colors** - don't ignore yellow warnings even if you can technically save
3. **Use the search feature** - faster than scrolling through long lists
4. **Test after major changes** - if you're editing page selectors or CSS, verify the changes work as expected in the publisher's environment
5. **Keep notes** - use the "Notes" field to document why you made significant configuration changes
6. **Don't rush** - the tool is designed to prevent mistakes, but careful review is always valuable

---

## Getting Help

If you encounter issues or need assistance:
- Check the validation error messages - they usually explain what needs to be fixed
- Review the Changes Panel to see if an unintended edit was made
- Contact the Engineering team if you see technical errors or unexpected behavior
- Report any confusing error messages so they can be improved

The Support Console is designed to make your work easier and safer. If something doesn't feel intuitive, let the team know so we can improve it.
