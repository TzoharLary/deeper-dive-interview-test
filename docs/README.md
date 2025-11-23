# Documentation

This directory contains user guides and documentation for the Publisher Configuration Tool.

## Available Guides

### User Guides

- **[Dashboard User Guide](user-guide/DASHBOARD_USER_GUIDE.md)** - Comprehensive guide for the Dashboard page
  - Complete overview of the Dashboard interface
  - Component-by-component explanations
  - Step-by-step workflows and best practices
  - Troubleshooting common issues
  - Status indicators and filtering guide

## Viewing the Guides

### Online (GitHub)
All guides are written in Markdown format and can be viewed directly on GitHub with full formatting.

### Local Viewing
1. Open the Markdown files in any Markdown viewer or editor
2. Use VS Code with Markdown preview
3. Use a Markdown viewer browser extension

### Converting to PDF

To create PDF versions of these guides for distribution:

```bash
# Using pandoc (if installed)
pandoc docs/user-guide/DASHBOARD_USER_GUIDE.md -o docs/user-guide/DASHBOARD_USER_GUIDE.pdf

# Or use online Markdown to PDF converters
# - https://www.markdowntopdf.com/
# - https://md2pdf.netlify.app/
```

## Contributing

When adding new documentation:

1. Place user-facing guides in the `user-guide/` subdirectory
2. Use clear, descriptive filenames
3. Include a table of contents for long documents
4. Add screenshots and images to an `images/` subdirectory
5. Update this README with links to new guides

## Guide Structure

Each user guide should follow this structure:

1. **Introduction** - Purpose and audience
2. **Overview** - High-level description with screenshots
3. **Component Descriptions** - Detailed breakdown of UI elements
4. **Workflows** - Step-by-step instructions for common tasks
5. **Best Practices** - Tips for efficient use
6. **Troubleshooting** - Common issues and solutions

## Screenshots

Screenshots for guides should be:
- High resolution and clear
- Annotated when helpful (arrows, highlights, labels)
- Named descriptively
- Stored in `user-guide/images/` directory
- Referenced in Markdown with relative paths

---

**Last Updated:** November 23, 2025
