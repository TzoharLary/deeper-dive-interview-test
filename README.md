# Publisher Configuration Tool

A web-based tool designed for Taboola Support Engineers to safely view and edit publisher configurations.

## Overview

The Publisher Configuration Tool provides an intuitive interface for managing publisher configurations without the risk of JSON syntax errors. Built with TypeScript, HTML, and CSS, it offers a modern dashboard and editor interface.

## Features

- **Dashboard**: Overview of all publishers with statistics, search, and filtering
- **Publishers Page**: Browse and select publishers for editing
- **Editor**: Safe configuration editing with validation
- **Real-time Updates**: Hot reload during development
- **Status Management**: Track Active, Inactive, and Draft publishers

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at: `http://localhost:3000`

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Documentation

Comprehensive user guides are available in the `docs/` directory:

- **[Dashboard User Guide](docs/user-guide/DASHBOARD_USER_GUIDE.md)** - Complete guide to the Dashboard page
  - Navigation and layout
  - Search and filtering
  - Status management
  - Workflows and best practices
  - Troubleshooting

- **[Dashboard Quick Reference](docs/user-guide/DASHBOARD_QUICK_REFERENCE.md)** - Quick reference card for common tasks

## Project Structure

```
├── data/                    # Publisher configuration JSON files
│   ├── publishers.json      # Publisher registry
│   └── publisher-*.json     # Individual publisher configs
├── docs/                    # User guides and documentation
│   └── user-guide/          # End-user documentation
├── public/                  # Client-side code and assets
│   ├── app/                 # TypeScript application
│   │   ├── data/            # API layer
│   │   ├── state/           # State management
│   │   ├── types/           # TypeScript types
│   │   ├── ui/              # UI components and pages
│   │   └── utils/           # Utilities
│   ├── index.html           # Main HTML file
│   └── *.css               # Stylesheets
├── src/                     # Server-side code
│   ├── server.ts            # Express server
│   ├── routes.ts            # API routes
│   ├── compiler.ts          # TypeScript compilation
│   └── sse.ts              # Server-sent events for hot reload
└── package.json            # Dependencies and scripts
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Express** - Server framework
- **Vanilla HTML/CSS** - No frontend frameworks
- **ESLint** - Code linting
- **tsx** - TypeScript execution with hot reload

## Documentation

For detailed information on using the Dashboard, see:
- [Dashboard User Guide](docs/user-guide/DASHBOARD_USER_GUIDE.md) - Complete documentation
- [Dashboard Quick Reference](docs/user-guide/DASHBOARD_QUICK_REFERENCE.md) - Quick reference card

---

**Version:** 1.0  
**Last Updated:** November 23, 2025
