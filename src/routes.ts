import { Router } from "express";
import path from "path";
import fs from "fs/promises";
import { triggerRefresh } from "./sse.js";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the data directory
const dataDir = path.resolve(__dirname, "../data");

/**
 * Security Helper:
 * 1. Ensures file extension is .json
 * 2. Resolves full path
 * 3. Verifies path is strictly inside dataDir (Prevents Directory Traversal)
 */
function getSafeFilePath(filename: string): string | null {
  if (!filename.endsWith(".json")) {
    return null;
  }

  const safePath = path.resolve(dataDir, filename);

  // Security Check: Ensure the resolved path starts with the allowed data directory
  if (!safePath.startsWith(dataDir)) {
    return null;
  }

  return safePath;
}

// 1. Get Publishers List
router.get("/publishers", async (_req, res) => {
  try {
    const filePath = getSafeFilePath("publishers.json");
    if (!filePath) throw new Error("Invalid path configuration");

    const data = await fs.readFile(filePath, "utf-8");
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading publishers list:", error);
    res.status(500).json({ error: "Internal Server Error: Could not read publishers list" });
  }
});

// 2. Get Specific Publisher Config
router.get("/publisher/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = getSafeFilePath(filename);

  if (!filePath) {
    return res.status(400).json({ error: "Bad Request: Invalid filename or extension" });
  }

  try {
    const data = await fs.readFile(filePath, "utf-8");
    res.status(200).json(JSON.parse(data));
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return res.status(404).json({ error: "Not Found: Publisher config does not exist" });
    }
    console.error(`Error reading ${filename}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Save Publisher Config (Atomic Write)
router.put("/publisher/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = getSafeFilePath(filename);

  if (!filePath) {
    return res.status(400).json({ error: "Bad Request: Invalid filename or extension" });
  }

  // Temp file for atomic writing
  const tempPath = `${filePath}.tmp`;

  try {
    const body = req.body as Record<string, unknown>;
    // Basic validation: require non-empty publisherId when saving individual publisher file (not list)
    if (filename !== "publishers.json") {
      const pid = body.publisherId;
      if (typeof pid !== "string" || !pid.trim()) {
        return res.status(422).json({ error: "Unprocessable Entity: publisherId is required" });
      }
    }
    const content = JSON.stringify(body, null, 2);

    // Step A: Write to temp file
    await fs.writeFile(tempPath, content, "utf-8");

    // Step B: Atomic Rename (Replaces original file instantly)
    await fs.rename(tempPath, filePath);

    // Notify connected browsers to refresh
    triggerRefresh();

    res.status(200).json({ success: true, message: "File saved successfully" });
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
    // Cleanup temp file if exists
    try { await fs.unlink(tempPath); } catch (cleanupErr) { /* ignore cleanup error */ }
    
    res.status(500).json({ error: "Internal Server Error: Failed to save file" });
  }
});

// 4. Delete Publisher Config
router.delete("/publisher/:filename", async (req, res) => {
  const { filename } = req.params;
  if (filename === "publishers.json") {
    return res.status(403).json({ error: "Forbidden: Cannot delete publishers list" });
  }

  const filePath = getSafeFilePath(filename);
  if (!filePath) {
    return res.status(400).json({ error: "Bad Request: Invalid filename or extension" });
  }

  try {
    await fs.unlink(filePath);
    await removePublisherFromList(filename);
    triggerRefresh();
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return res.status(404).json({ error: "Not Found: Publisher file does not exist" });
    }
    console.error(`Error deleting ${filename}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const apiRouter = router;

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}

async function removePublisherFromList(filename: string) {
  const listPath = getSafeFilePath("publishers.json");
  if (!listPath) {
    throw new Error("Invalid path configuration for publishers.json");
  }

  const tempPath = `${listPath}.tmp`;
  try {
    const raw = await fs.readFile(listPath, "utf-8");
    const data = JSON.parse(raw) as { publishers?: Array<{ id?: string; alias?: string; file?: string }> };
    if (!Array.isArray(data.publishers)) {
      return;
    }

    const filtered = data.publishers.filter((entry) => entry.file !== filename);
    if (filtered.length === data.publishers.length) {
      return;
    }

    const content = JSON.stringify({ publishers: filtered }, null, 2);
    await fs.writeFile(tempPath, content, "utf-8");
    await fs.rename(tempPath, listPath);
  } catch (error) {
    console.error("Failed to update publishers list during delete:", error);
    try {
      await fs.unlink(tempPath);
    } catch {
      /* ignore cleanup errors */
    }
    throw error;
  }
}
