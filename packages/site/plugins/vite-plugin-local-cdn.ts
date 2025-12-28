/**
 * Vite plugin that builds and serves the CDN bundles on-demand.
 *
 * This plugin intercepts requests to /cdn/*.js and builds the bundles
 * in-memory using vite.build(). Results are cached and automatically
 * invalidated when source files change.
 *
 * Benefits:
 * - No predev step required
 * - Automatic rebuild on source changes
 * - In-memory caching (no disk I/O)
 * - Deduplicates concurrent build requests
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build, type Plugin } from "vite";

const SOURCE_PATTERNS = [/packages\/lib\/src\//, /packages\/wc\/src\//];

type BundleType = "lib" | "wc";

interface BundleCache {
  code: string;
  map: string;
}

export function localCdnPlugin(): Plugin {
  const cache = new Map<BundleType, BundleCache>();
  const buildPromises = new Map<BundleType, Promise<void>>();

  // Get the packages directory (site -> packages)
  const packagesDir = resolve(import.meta.dirname, "../..");

  async function buildBundle(
    type: BundleType,
    logger: {
      info: (msg: string) => void;
      error: (msg: string) => void;
    },
  ): Promise<void> {
    const startTime = Date.now();

    try {
      const isLib = type === "lib";
      const entry = isLib
        ? resolve(packagesDir, "lib/src/index.ts")
        : resolve(packagesDir, "wc/src/OEmbedElement.ts");
      const fileName = isLib ? "lib.js" : "o-embed.js";
      const root = isLib
        ? resolve(packagesDir, "lib")
        : resolve(packagesDir, "wc");
      const alias: Record<string, string> = isLib
        ? {}
        : { "@social-embed/lib": resolve(packagesDir, "lib/src/index.ts") };

      const result = await build({
        build: {
          lib: {
            entry,
            fileName: () => fileName,
            formats: ["es"],
          },
          minify: "esbuild",
          rollupOptions: {
            external: [],
          },
          sourcemap: true,
          write: false,
        },
        configFile: false,
        logLevel: "warn",
        resolve: {
          alias,
        },
        root,
      });

      // Extract code from build result
      if (Array.isArray(result)) {
        for (const output of result[0].output) {
          if (output.type === "chunk" && output.isEntry) {
            cache.set(type, {
              code: output.code,
              map: output.map?.toString() ?? "",
            });
          }
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`[local-cdn] Built ${type} in ${duration}ms`);
    } catch (error) {
      logger.error(
        `[local-cdn] Build ${type} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  return {
    configureServer(server) {
      // Watch for source changes and invalidate cache
      server.watcher.on("change", (file) => {
        if (SOURCE_PATTERNS.some((p) => p.test(file))) {
          cache.clear();
          server.config.logger.info("[local-cdn] Cache invalidated");
        }
      });

      // Serve the CDN bundles
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";

        // Match /cdn/lib.js, /cdn/lib.js.map, /cdn/o-embed.js, /cdn/o-embed.js.map
        const libMatch = url.match(/^\/cdn\/lib\.js(\.map)?$/);
        const wcMatch = url.match(/^\/cdn\/o-embed\.js(\.map)?$/);

        if (!libMatch && !wcMatch) {
          return next();
        }

        const type: BundleType = libMatch ? "lib" : "wc";
        const isMap = !!(libMatch?.[1] || wcMatch?.[1]);

        // Build if needed (with deduplication)
        if (!cache.has(type)) {
          if (!buildPromises.has(type)) {
            const promise = buildBundle(type, server.config.logger).finally(
              () => {
                buildPromises.delete(type);
              },
            );
            buildPromises.set(type, promise);
          }
          try {
            await buildPromises.get(type);
          } catch {
            res.statusCode = 500;
            res.end("Build failed");
            return;
          }
        }

        const bundleCache = cache.get(type);
        if (!bundleCache) {
          res.statusCode = 500;
          res.end("Build failed");
          return;
        }

        // Serve the appropriate file
        if (isMap) {
          res.setHeader("Content-Type", "application/json");
          res.end(bundleCache.map);
        } else {
          res.setHeader("Content-Type", "application/javascript");
          res.end(bundleCache.code);
        }
      });
    },

    name: "local-cdn",

    async writeBundle(options) {
      // Build CDN bundles for production
      const outDir = options.dir ?? "dist";
      const cdnDir = resolve(outDir, "cdn");

      // Ensure cdn directory exists
      await mkdir(cdnDir, { recursive: true });

      // Build both bundles
      const logger = {
        error: (msg: string) => console.error(msg),
        info: (msg: string) => console.log(msg),
      };

      await Promise.all([
        buildBundle("lib", logger),
        buildBundle("wc", logger),
      ]);

      // Write to disk
      const libCache = cache.get("lib");
      const wcCache = cache.get("wc");

      if (libCache) {
        await writeFile(resolve(cdnDir, "lib.js"), libCache.code);
        await writeFile(resolve(cdnDir, "lib.js.map"), libCache.map);
      }

      if (wcCache) {
        await writeFile(resolve(cdnDir, "o-embed.js"), wcCache.code);
        await writeFile(resolve(cdnDir, "o-embed.js.map"), wcCache.map);
      }
    },
  };
}
