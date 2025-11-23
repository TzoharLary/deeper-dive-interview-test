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
  } catch (error: any) {
    if (error.code === 'ENOENT') {
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
    const content = JSON.stringify(req.body, null, 2);

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
    try { await fs.unlink(tempPath); } catch {}
    
    res.status(500).json({ error: "Internal Server Error: Failed to save file" });
  }
});

export const apiRouter = router;
