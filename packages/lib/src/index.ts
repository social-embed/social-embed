export * from "./providers";
export type { EmbedProvider } from "./provider";
import { EmbedProviderRegistry } from "./registry";
export { EmbedProviderRegistry };

import { DailyMotionProvider } from "./providers/dailymotion";
import { EdPuzzleProvider } from "./providers/edpuzzle";
import { LoomProvider } from "./providers/loom";
import { SpotifyProvider } from "./providers/spotify";
import { VimeoProvider } from "./providers/vimeo";
import { WistiaProvider } from "./providers/wistia";
import { YouTubeProvider } from "./providers/youtube";

/**
 * Array of all built-in providers.
 */
export const defaultProviders = [
  DailyMotionProvider,
  EdPuzzleProvider,
  LoomProvider,
  SpotifyProvider,
  VimeoProvider,
  WistiaProvider,
  YouTubeProvider,
];

import {
  convertUrlToEmbedUrl,
  getProviderFromUrl,
  internalRegistry,
} from "./utils";

/**
 * Create a default registry and register all built-in providers.
 */
export const defaultRegistry = new EmbedProviderRegistry();

// Register all built-in providers in both registries
for (const provider of defaultProviders) {
  defaultRegistry.register(provider);
  internalRegistry.register(provider);
}

// Re-export utility functions
export { getProviderFromUrl, convertUrlToEmbedUrl };

/**
 * Get the default registry with all built-in providers.
 *
 * @returns The default registry with all built-in providers.
 */
export function getDefaultRegistry(): EmbedProviderRegistry {
  return defaultRegistry;
}

/**
 * Create a custom registry with all built-in providers.
 *
 * @returns A new registry with all built-in providers.
 *
 * @example
 * ```ts
 * import { createRegistry, type EmbedProvider } from "@social-embed/lib";
 *
 * const MyCustomProvider: EmbedProvider = {
 *   name: "MyCustom",
 *   canParseUrl(url) { return /mycustom\.example\.com/.test(url); },
 *   getIdFromUrl(url) { return url.split("/").pop() || ""; },
 *   getEmbedUrlFromId(id) { return `https://mycustom.example.com/embed/${id}`; },
 * };
 *
 * // Create a custom registry with all built-in providers
 * const myRegistry = createRegistry();
 *
 * // Register your custom provider
 * myRegistry.register(MyCustomProvider);
 * ```
 */
export function createRegistry(): EmbedProviderRegistry {
  return defaultRegistry.clone();
}
