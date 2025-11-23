---
title: Refactor Guidelines — Vanilla TypeScript & Playwright
summary: Consolidated principles from Awesome Copilot collections for Vanilla TypeScript patterns, React→Vanilla migration, and Playwright automation best practices.
---

Purpose
- Provide concise, actionable guidance for the Engineer and Prototyper when converting prototype exports into a clean, maintainable Vanilla TypeScript codebase and when automating generation/export with Playwright.

Vanilla TypeScript Patterns (key principles)
- Prefer small, single-responsibility modules with explicit TypeScript interfaces and types.
- Keep DOM concerns separated from data logic: create a lightweight data access layer (`public/data/api.ts`) and a small Pub/Sub store for app state.
- Use typed contracts for public APIs: define interfaces for `PublishersRegistry`, `PublisherConfig`, and `PageConfig`.
- Avoid runtime framework assumptions: implement rendering with direct DOM APIs and minimal helper utilities (atomic renderers, render once/update value strategy).
- Emphasize accessibility and semantics: use ARIA roles and semantic elements so generated UI remains testable and stable.
- Favor tiny, well-scoped unit tests for utilities and the Mini‑Zod validation logic; prefer manual integration checks for complex UI interactions.

React → Vanilla Migration (conversion strategy)
- Don’t attempt a line-by-line port. Extract UX intentions and map them to modules:
  - Component → DOM container + renderer function
  - Props/state → store segments (initialState vs currentState)
  - Effects → explicit event handlers and lifecycle bootstrap code
- Preserve UX behavior and event contract while replacing React lifecycle with an explicit init/render/update loop.
- Identify and preserve business logic (formatting, validation, derived state) as pure functions; move them into separate utility modules.
- Replace component-local state with a small Store (subscribe/emit) to coordinate updates across modules and avoid DOM desync.
- Sanitize exports first: stub or remove auth overlays and platform-specific modules before analyzing code structure.

Playwright Automation Best Practices (for Prototyper)
- Use resilient selectors: prefer `role`, `data-testid`, or ARIA attributes over brittle class names or deep DOM paths.
- Add explicit waits for network or meaningful UI state (e.g., wait for an element to be visible or a network route to complete) instead of fixed sleeps.
-- Centralize authentication stubs/mocks when running automation against prototype previews to avoid flaky logins; prefer environment-driven credentials when unavoidable.
-- Capture artifacts for audit: screenshots, DOM snapshots, and console logs at each major step (generation, preview verification, export completion).
-- Implement retry/backoff and idempotent operations for export/commit steps; ensure file writes are validated (checksums or basic file presence) before committing.
- Log clearly and produce machine-readable exit codes for automation scripts so downstream tooling can react deterministically.

Operational Notes

- Prefer playbooks from `awesome_copilot` over ad-hoc patterns, but always audit playbook recommendations against `MASTER_PLAN.md` (no framework installs, Vanilla TS rule is authoritative).
- Document any edge-case decisions in `ARCHITECTURE.hybrid.md` and link to this guideline.

Quick Checklist (Engineer)
- [ ] Define TypeScript interfaces for all public data shapes.
- [ ] Implement `public/data/api.ts` with typed fetch/save functions.
- [ ] Add a small Pub/Sub `Store` under `/public/state/` and atomic renderers in `/public/ui/`.
- [ ] Implement Mini‑Zod validators and unit tests.
- [ ] Sanitize prototype exports and add Playwright snapshots under an approved `scratch/` insights directory (avoid `base` in paths). Ensure all chosen scratch paths are approved before creation.
