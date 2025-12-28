/**
 * CDN source configuration for the playground.
 * Supports local builds, major CDNs, and custom URLs.
 */

export type CdnSourceType =
  | "local"
  | "cdn-dev"
  | "jsdelivr"
  | "unpkg"
  | "esm-sh"
  | "custom";

export type CdnSource =
  | { type: "local" }
  | { type: "cdn-dev" }
  | { type: "jsdelivr" }
  | { type: "unpkg" }
  | { type: "esm-sh" }
  | { type: "custom"; url: string };

export const CDN_SOURCE_LABELS: Record<CdnSourceType, string> = {
  "cdn-dev": "cdn-dev.social-embed.org",
  custom: "Custom URL",
  "esm-sh": "esm.sh",
  jsdelivr: "jsDelivr",
  local: "Local Build",
  unpkg: "unpkg",
};

export const CDN_SOURCE_DESCRIPTIONS: Record<CdnSourceType, string> = {
  "cdn-dev": "Preview CDN (canary/master/latest)",
  custom: "Enter a custom URL",
  "esm-sh": "esm.sh (on-demand ESM)",
  jsdelivr: "cdn.jsdelivr.net (popular, fast)",
  local: "Serve from local Vite plugin",
  unpkg: "unpkg.com (npm-based)",
};

/**
 * Get the CDN URLs for lib and wc bundles from a given source.
 */
export function getCdnUrls(source: CdnSource): { lib: string; wc: string } {
  switch (source.type) {
    case "local":
      return {
        lib: "/cdn/lib.js",
        wc: "/cdn/o-embed.js",
      };
    case "cdn-dev":
      return {
        lib: "https://cdn-dev.social-embed.org/canary/master/latest/lib/dist/lib.js",
        wc: "https://cdn-dev.social-embed.org/canary/master/latest/wc/dist/OEmbedElement.js",
      };
    case "jsdelivr":
      return {
        lib: "https://cdn.jsdelivr.net/npm/@social-embed/lib/dist/lib.js",
        wc: "https://cdn.jsdelivr.net/npm/@social-embed/wc/dist/OEmbedElement.js",
      };
    case "unpkg":
      return {
        lib: "https://unpkg.com/@social-embed/lib/dist/lib.js",
        wc: "https://unpkg.com/@social-embed/wc/dist/OEmbedElement.js",
      };
    case "esm-sh":
      return {
        lib: "https://esm.sh/@social-embed/lib",
        wc: "https://esm.sh/@social-embed/wc",
      };
    case "custom": {
      // For custom URLs, assume a base URL and append standard paths
      // User can provide full URL for wc by separating with comma
      const parts = source.url.split(",").map((s) => s.trim());
      return {
        lib: parts[0],
        wc: parts[1] ?? parts[0].replace("/lib", "/wc"),
      };
    }
  }
}

/**
 * Parse a CdnSource from serialized format.
 */
export function parseCdnSource(value: string): CdnSource {
  if (value.startsWith("custom:")) {
    return { type: "custom", url: value.slice(7) };
  }
  if (
    value === "local" ||
    value === "cdn-dev" ||
    value === "jsdelivr" ||
    value === "unpkg" ||
    value === "esm-sh"
  ) {
    return { type: value };
  }
  return { type: "local" };
}

/**
 * Serialize a CdnSource for URL storage.
 */
export function serializeCdnSource(source: CdnSource): string {
  if (source.type === "custom") {
    return `custom:${source.url}`;
  }
  return source.type;
}

export const DEFAULT_CDN_SOURCE: CdnSource = { type: "local" };
