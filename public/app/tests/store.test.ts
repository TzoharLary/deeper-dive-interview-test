import PublisherStore from "../state/store.js";
import { createPublisher } from "./factories.js";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function run() {
  console.log("Running store tests...");

  const initial = { ...createPublisher({
    publisherId: "pub-1",
    aliasName: "Initial",
    tags: ["t1"],
    allowedDomains: ["example.com"],
    pages: []
  }), extraKey: "extra-value" } as Record<string, unknown>;

  const store = new PublisherStore(initial, "edit");

  let snap = store.getSnapshot();
  assert(snap.isDirty === false, "Freshly loaded store should not be dirty");

  // update a field
  store.updateField("aliasName", "Updated");
  snap = store.getSnapshot();
  assert(store.isFieldModified("aliasName") === true, "aliasName should be marked modified");
  assert(snap.isDirty === true, "Store should be dirty after modification");

  // mark touched
  store.markTouched("aliasName");
  snap = store.getSnapshot();
  assert(snap.touchedFields["aliasName"] === true, "aliasName should be touched");

  // unknown keys preserved in prepareForSave
  const prepared = store.prepareForSave();
  const preparedRecord = prepared as unknown as Record<string, unknown>;
  assert(preparedRecord.extraKey === "extra-value", "Unknown keys should be included in prepareForSave");

  // validation prevents saving (no publisherId)
  store.updateField("publisherId", "");
  snap = store.getSnapshot();
  assert(snap.validation.isValid === false, "Publisher with empty publisherId should be invalid according to validator");

  // pages operations
  const beforePages = store.getSnapshot().currentData?.pages?.length || 0;
  store.addPage("article");
  snap = store.getSnapshot();
  assert((snap.currentData?.pages?.length || 0) === beforePages + 1, "addPage should add a page");

  // add another and move
  store.addPage("homepage");
  snap = store.getSnapshot();
  const len = snap.currentData?.pages?.length || 0;
  assert(len >= 2, "Should have at least two pages");
  const firstBefore = JSON.stringify(snap.currentData?.pages[0]);
  store.movePage(0, 1);
  snap = store.getSnapshot();
  const firstAfter = JSON.stringify(snap.currentData?.pages[0]);
  assert(firstBefore !== firstAfter, "movePage should reorder pages");

  // remove page
  const removeLenBefore = snap.currentData?.pages?.length || 0;
  store.removePage(0);
  snap = store.getSnapshot();
  const removeLenAfter = snap.currentData?.pages?.length || 0;
  assert(removeLenAfter === removeLenBefore - 1, "removePage should remove a page");

  // nested path updates via bracket notation
  store.addPage("article");
  snap = store.getSnapshot();
  const beforeSelector = snap.currentData?.pages?.[0]?.selector;
  store.updateField("pages[0].selector", ".main-content");
  snap = store.getSnapshot();
  assert(snap.currentData?.pages?.[0]?.selector === ".main-content", "Selector should update via bracket path");
  store.updateField("pages[0].position", "sidebar");
  snap = store.getSnapshot();
  assert(snap.currentData?.pages?.[0]?.position === "sidebar", "Position should update via bracket path");
  // restore selector to avoid polluting later checks
  if (beforeSelector) store.updateField("pages[0].selector", beforeSelector);

  console.log("store tests passed");
}

try {
  run();
  process.exit(0);
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Test failed:", msg);
  process.exit(1);
}
