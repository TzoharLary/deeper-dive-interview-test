import { RequestHandler } from "express";
import path from "path";
import fs from "fs/promises";
import ts from "typescript";

/**
 * Middleware factory that compiles TypeScript files under `public/app` on demand.
 * Usage: `app.use(tsCompilerMiddleware(publicAppDir))`
 */
export function tsCompilerMiddleware(publicAppDir: string): RequestHandler {
  return async (req, res, next) => {
    try {
      const urlPath = req.path || "";

      // Only handle requests for JS modules under /app/*.js
      if (!urlPath.startsWith("/app/") || !urlPath.endsWith(".js")) {
        return next();
      }

      // Map /app/foo.js -> public/app/foo.ts
      const jsRelative = urlPath.replace(/^\//, ""); // app/foo.js
      const tsRelative = jsRelative.replace(/\.js$/, ".ts");
      const tsFullPath = path.join(publicAppDir, tsRelative.replace(/^app\//, ""));

      // Prevent directory traversal
      if (!tsFullPath.startsWith(publicAppDir)) {
        return res.status(400).send("Invalid module path");
      }

      // Read the TypeScript source
      const source = await fs.readFile(tsFullPath, "utf-8");

      // Transpile in-memory
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
    } catch (err) {
      // If the file doesn't exist or transpilation fails, pass to next handler
      return next();
    }
  };
}
