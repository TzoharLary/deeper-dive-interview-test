import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "../public");
const publicAppDir = path.join(publicDir, "app");

// On-the-fly TypeScript -> JS transpilation for files served from /app
app.get(/^\/app\/?(.*)$/, async (req, res, next) => {
  const requestPath = req.params[0] || "";
  if (!requestPath) {
    return next();
  }

  const pathWithoutExt = requestPath.replace(/\.js$/, "");
  const tsRelative = `${pathWithoutExt}.ts`;
  const tsFullPath = path.join(publicAppDir, tsRelative);
  if (!tsFullPath.startsWith(publicAppDir)) {
    return res.status(400).json({ error: "Invalid module path" });
  }

  try {
    const source = await fs.readFile(tsFullPath, "utf-8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ES2020,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        moduleResolution: ts.ModuleResolutionKind.NodeNext
      },
      fileName: tsFullPath
    });

    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "no-store");
    return res.send(transpiled.outputText);
  } catch (error) {
    return next();
  }
});

// Serve static files from public directory
app.use(express.static(publicDir));

// Parse JSON bodies
app.use(express.json());

// API endpoint to get publishers list
app.get("/api/publishers", async (_req, res) => {
  try {
    const dataPath = path.join(__dirname, "../data/publishers.json");
    const data = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read publishers data" });
  }
});

// API endpoint to get a specific publisher config
app.get("/api/publisher/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const dataPath = path.join(__dirname, "../data", filename);
    const data = await fs.readFile(dataPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ error: "Publisher config not found" });
  }
});

// API endpoint to save a publisher config
app.put("/api/publisher/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const dataPath = path.join(__dirname, "../data", filename);
    await fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save publisher config" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

