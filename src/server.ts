import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes.js"; // Import the new router
import fs from "fs";
import { addClient, triggerRefresh } from "./sse.js";
import { tsCompilerMiddleware } from "./compiler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Reference to public directory (siblings with src)
const publicDir = path.join(__dirname, "../public");
const publicAppDir = path.join(publicDir, "app");

// 1. Global Middleware
app.use(express.json());

// 2. Mount API Routes
// All routes in routes.ts will automatically get the '/api' prefix

// Mount API routes
app.use("/api", apiRouter);

// Use the TypeScript compiler middleware BEFORE static serving so
// requests for /app/*.js are compiled on-the-fly from corresponding .ts files
app.use(tsCompilerMiddleware(publicAppDir));

// SSE endpoint for browser clients to listen for refresh events
app.get("/api/events", (req, res) => {
  addClient(res);
});

// Watch the public directory for changes. We look for .ts/.html/.css files
// and trigger a refresh when TypeScript sources change (or other assets).
fs.watch(path.join(__dirname, "../public"), { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const changed = filename.toLowerCase();
  if (changed.endsWith(".ts") || changed.endsWith(".html") || changed.endsWith(".css")) {
    console.log(`Asset changed: ${filename} -> Refreshing browser...`);
    // Trigger refresh when a TypeScript source changes (or other assets)
    if (changed.endsWith(".ts")) {
      triggerRefresh();
    } else {
      // For html/css changes we also refresh to reflect UI updates
      triggerRefresh();
    }
  }
});

// 3. Serve Static Files
app.use(express.static(publicDir));

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

