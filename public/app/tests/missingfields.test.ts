import { createStore } from "../state/store.js";
import type { Publisher } from "../types/index.js";
function assert(c: boolean, m: string) { if (!c) throw new Error(m); }
function run() {
  console.log("Running missing fields tests...");
  const base: Publisher = { publisherId: "pub-1", aliasName: "Alias", isActive: true, tags: [], publisherDashboard: "d1", monitorDashboard: "m1", qaStatusDashboard: "q1", allowedDomains: [], customCss: "", notes: "", pages: [] };
  const store = createStore(base, "edit");
  let snap = store.getSnapshot();
  assert(snap.validation.isValid === true, "Initial publisher should be valid");
  store.updateField("aliasName", "");
  snap = store.getSnapshot();
  assert(snap.currentData?.aliasName === "", "aliasName should now be empty");
  console.log("missing fields tests passed");
}
try { run(); process.exit(0); } catch (e: unknown) { console.error("Test failed:", e instanceof Error ? e.message : String(e)); process.exit(1); }