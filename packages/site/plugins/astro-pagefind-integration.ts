/**
 * Astro integration that runs Pagefind CLI after build completes.
 *
 * Pagefind crawls the built HTML files and generates a search index
 * in the output directory. The client-side @pagefind/default-ui
 * library then loads this index at runtime.
 *
 * This pattern is borrowed from Starlight's Pagefind integration.
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

export function pagefindIntegration(): AstroIntegration {
  return {
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const targetDir = fileURLToPath(dir);
        logger.info("Running Pagefind to generate search index...");

        return new Promise<void>((resolve, reject) => {
          const proc = spawn("npx", ["pagefind", "--site", targetDir], {
            shell: true,
            stdio: "inherit",
          });

          proc.on("close", (code) => {
            if (code === 0) {
              logger.info("Pagefind index generated successfully");
              resolve();
            } else {
              reject(new Error(`Pagefind exited with code ${code}`));
            }
          });

          proc.on("error", (err) => {
            reject(err);
          });
        });
      },
    },
    name: "pagefind",
  };
}
