import { createStore } from "../state/store.js";
import { SaveBar } from "../ui/components/SaveBar.js";

function assert(cond: boolean, msg: string) { if (!cond) throw new Error(msg); }

function run() {
  if (typeof document === "undefined") {
    console.log("(components.test) DOM not available – skipping UI component smoke tests.");
    return;
  }
  console.log("Running UI component smoke tests...");
  const root = document.createElement("div");
  document.body.appendChild(root);
  const store = createStore(null, "edit");
  const bar = new SaveBar(root, { store });
  bar.mount();
  // Initially not dirty
  let snap = store.getSnapshot();
  assert(!snap.isDirty, "Initial store should not be dirty");
  store.updateField("aliasName", "Test Alias");
  snap = store.getSnapshot();
  assert(snap.isDirty, "Store should be dirty after aliasName change");
  console.log("UI component smoke tests passed");
}

try { run(); process.exit(0); } catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error(msg);
  process.exit(1);
}