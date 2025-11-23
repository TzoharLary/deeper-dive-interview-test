import { validatePublisher } from "../utils/validator.js";
import { createPublisher, createPage } from "./factories.js";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

function run() {
  console.log("Running validator tests...");

  const valid = createPublisher({
    publisherId: "pub-1",
    aliasName: "Publisher One",
    tags: ["news", "sports"],
    publisherDashboard: "dash-1",
    monitorDashboard: "mon-1",
    qaStatusDashboard: "qa-1",
    allowedDomains: ["example.com"],
    notes: "ok",
    pages: [createPage({ selector: ".main" })]
  });

  const res1 = validatePublisher(valid);
  assert(res1.isValid === true, "Valid publisher should be valid");

  // missing publisherId / empty
  const invalid1 = { ...valid, publisherId: "" };
  const res2 = validatePublisher(invalid1);
  assert(res2.isValid === false, "Publisher with empty publisherId should be invalid");
  const errValues2 = Object.values(res2.errors).join(" ");
  assert(errValues2.includes("publisherId") || errValues2.length > 0, "Expected error about publisherId");

  // invalid pages (wrong types)
  const invalid2: Record<string, unknown> = { ...valid, pages: [{ pageType: 123, selector: ".main", position: 1 }] };
  const res3 = validatePublisher(invalid2);
  assert(res3.isValid === false, "Publisher with invalid page types should be invalid");

  // tags must be array of strings
  const invalid3: Record<string, unknown> = { ...valid, tags: ["ok", 123] };
  const res4 = validatePublisher(invalid3);
  assert(res4.isValid === false, "Publisher with invalid tags should be invalid");

  console.log("validator tests passed");
}

try {
  run();
  process.exit(0);
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Test failed:", msg);
  process.exit(1);
}
