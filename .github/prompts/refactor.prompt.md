---
# ===== Header =====
name: refactor
description: "Engineer prompt template to request a refactor or code improvement."
agent: "RefactorEngineer"
tools:
  - edit/editFiles
  - runSubagent
---
# ===== Body =====
Inputs:
- `${input:files}` — comma-separated list of file paths to change.
- `${input:goal}` — brief description of the refactor goal.

Template:
```
Goal: ${input:goal}
Files: ${input:files}
Constraints:
  - Vanilla TypeScript / HTML / CSS only (NO React/JSX).
  - Any analysis touching >3 files must run via `runSubagent`.
  - No writes to `main` branch. All writes require `requires_approval` and must create a feature branch + backup of modified files.
  - Do not add new external dependencies without explicit approval.
Deliverables:
  1) `apply_patch`-ready diffs for all code changes (or a clear change list if patching is deferred).
  2) Mini‑Zod schema files under `/public/validation/` for changed data shapes.
  3) Minimal unit tests or Playwright example test under `/scratch/tests/` demonstrating the change.
  4) Short rationale (3–5 lines) and a short test plan (steps).
```

Example (filled inputs):
```
Inputs:
  files: scratch/prototype-clean-mvp/src/components/PublisherList.ts, scratch/prototype-clean-mvp/src/pages/Editor.ts
  goal: Convert PublisherList + Editor from framework-specific code to Vanilla TypeScript; add Mini‑Zod schemas for the edited shapes; provide diffs, rationale and test plan.

Template expanded:
  Goal: Convert PublisherList + Editor from framework-specific code to Vanilla TypeScript; add Mini‑Zod schemas for the edited shapes; provide diffs, rationale and test plan.
  Files: scratch/prototype-clean-mvp/src/components/PublisherList.ts, scratch/prototype-clean-mvp/src/pages/Editor.ts
  Constraints:
    - Vanilla TypeScript only.
    - Any heavy analysis (>3 files) via `runSubagent` and store summaries in an approved `scratch/` insights directory.
    - No direct writes to `main` without `requires_approval`.
  Deliverables:
    - apply_patch-ready diffs for converted files.
    - `/public/validation/publisherSchemas.ts` with Mini‑Zod schemas and unit tests under `/scratch/tests/`.
    - Playwright demo script showing the Editor save flow in `/scratch/tests/playwright/editor-save.spec.ts`.
    - Rationale (3 lines) + Test plan (3 steps).
```

Expected agent behavior on submission:
- Return a short JSON `plan` describing the immediate steps (per repository agent contract). If analysis would touch >3 files, call `runSubagent` and attach the subagent summary path in `artifacts`.
- If edits are requested, include `requires_approval:true` for any write actions and provide `apply_patch` diffs ready to run.
- Provide clear artifact paths for screenshots, summaries, diffs and tests.

Notes / Guidelines:
- Keep all artifacts in `scratch/` until a PR is created. Avoid creating paths that include the substring `base` unless explicitly approved.
- Commit messages should use the format: `Phase <n> — <short description>` and reference artifact locations.
- If new dependencies are strictly necessary, stop and request approval (do not auto-add to `package.json`).
