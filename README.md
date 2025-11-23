## Support Console

Lightweight Vanilla TypeScript tool to browse and edit publisher configuration JSON files safely.

### Features (Implemented)
- Publisher list browsing & selection
- Editor for general info (publisherId, aliasName, tags)
- Page configurations (type, selector, position) with add/remove/reorder
- Real-time validation badges (required fields) and dirty state tracking
- Atomic save to server (`PUT /api/publisher/:filename`) with basic publisherId validation

### Tech Stack
- HTML + CSS + Vanilla TypeScript (no frameworks)
- Express server for static assets + JSON API
- Pub/Sub store (`PublisherStore`) for state and dirty tracking
- Lightweight validator (mini schema system)

### Getting Started
```bash
npm install
npm run dev
# open http://localhost:3000
```

### Project Structure
```
public/
	index.html         # Entry HTML
	app/
		ui/              # UI orchestrators & components
		state/store.ts    # PublisherStore (pub/sub state)
		data/api.ts       # Fetch/save helpers
		utils/validator.ts# Validation logic
src/
	server.ts          # Express server
	routes.ts          # API routes
data/                # JSON source files
```

### Data Flow
Fetch publisher → normalize → load into Store → UI subscribes & renders → user edits fields → Store updates & emits snapshot → validation badges update → Save button enables if dirty & no errors → save() persists via API.

### Testing
Simple smoke/unit tests under `public/app/tests/` (store operations, validator, basic component dirty state).

Run (manual):
```bash
node public/app/tests/store.test.ts
node public/app/tests/validator.test.ts
node public/app/tests/components.test.ts
```

### Future Enhancements (Roadmap)
- Change diff panel and undo/redo
- Chip editors for tags & allowedDomains
- Drag & drop page reordering
- Extended validation (semantic checks, warnings)

### Contributing
Keep patches minimal and type-safe. Avoid introducing frameworks. Prefer extending existing component patterns. Run `npm run lint` before submitting.

### License
Internal tooling – no external distribution license specified.
