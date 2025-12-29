/**
 * Browser-only utilities for DOM execution.
 *
 * @remarks
 * This module is for browser environments only.
 * It will throw if used in Node.js or other non-browser runtimes.
 *
 * For SSR, use `renderOutput()` from the main module instead.
 *
 * ## Zero-Config Usage (Tier 1)
 *
 * For simple use cases, use the convenience functions:
 *
 * ```typescript
 * import { toEmbedUrl, toEmbed, register } from "@social-embed/lib/browser";
 *
 * // Convert URL to embed URL (one-liner)
 * const embedUrl = toEmbedUrl("https://youtu.be/abc123");
 *
 * // Get structured output
 * const embed = toEmbed("https://youtu.be/abc123");
 * console.log(embed.toHtml());
 *
 * // Register custom matcher (updates all listening components)
 * register(MyCustomMatcher);
 * ```
 *
 * ## Advanced Usage (Tier 2)
 *
 * For more control, access the default store directly:
 *
 * ```typescript
 * import { defaultStore } from "@social-embed/lib/browser";
 *
 * // Subscribe to matcher changes
 * const unsub = defaultStore.subscribe((registry) => {
 *   console.log("Matchers changed:", registry.list());
 * });
 *
 * // Access current registry
 * const result = defaultStore.match(url);
 * ```
 *
 * ## DOM Mounting
 *
 * ```typescript
 * import { mount, toEmbed } from "@social-embed/lib/browser";
 *
 * const embed = toEmbed("https://youtu.be/abc123");
 * await mount(embed, { container: "#embed" });
 * ```
 */

import { Embed } from "../embed";
import type { MatcherInput, MatchResult } from "../matcher";
import type { EmbedOptions, PrivacyOptions } from "../output";
import { RegistryStore } from "../store";

export { clearScriptCache, type MountOptions, mount } from "./mount";

// ─────────────────────────────────────────────────────────────────────────────
// Default Store Singleton
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default registry store with all built-in matchers.
 *
 * @remarks
 * This is the singleton store used by convenience functions.
 * Web components and other reactive consumers should subscribe to this store.
 *
 * For SSR or custom registry scenarios, create your own `RegistryStore` instance.
 */
export const defaultStore = new RegistryStore();

// ─────────────────────────────────────────────────────────────────────────────
// Tier 1 Convenience Functions (Zero-Config API)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a URL to its embed URL.
 *
 * @param url - The URL to convert
 * @param options - Privacy options
 * @returns Embed URL, or undefined if no matcher found
 *
 * @example
 * ```typescript
 * const embedUrl = toEmbedUrl("https://youtu.be/abc123");
 * // => "https://www.youtube-nocookie.com/embed/abc123"
 * ```
 */
export function toEmbedUrl(
  url: string,
  options?: PrivacyOptions,
): string | undefined {
  return defaultStore.toEmbedUrl(url, options);
}

/**
 * Convert a URL to an Embed object with rendering methods.
 *
 * @param url - The URL to convert
 * @param options - Embed and privacy options
 * @returns Embed instance, or undefined if no matcher found
 *
 * @example
 * ```typescript
 * const embed = toEmbed("https://youtu.be/abc123");
 * if (embed) {
 *   console.log(embed.toHtml());  // Full iframe HTML
 *   console.log(embed.toUrl());   // Just the embed URL
 * }
 * ```
 */
export function toEmbed(
  url: string,
  options?: EmbedOptions,
): Embed | undefined {
  const result = defaultStore.match(url);
  if (!result.ok) return undefined;

  return new Embed(
    result.matcher.name,
    result.data,
    result.matcher.toOutput(result.data, options),
  );
}

/**
 * Match a URL against registered matchers.
 *
 * @param url - The URL to match
 * @returns Match result with matcher and parsed data
 *
 * @example
 * ```typescript
 * const result = match("https://youtu.be/abc123");
 * if (result.ok) {
 *   console.log(result.matcher.name);  // "YouTube"
 *   console.log(result.data);          // { videoId: "abc123" }
 * }
 * ```
 */
export function match(url: string): MatchResult {
  return defaultStore.match(url);
}

/**
 * Register a custom matcher.
 *
 * @param matcher - The matcher to register
 *
 * @remarks
 * This modifies the `defaultStore`, which notifies all subscribers.
 * Web components listening to the store will automatically re-render.
 *
 * @example
 * ```typescript
 * import { register, defineMatcher } from "@social-embed/lib/browser";
 *
 * const TikTokMatcher = defineMatcher({
 *   type: "iframe",
 *   name: "TikTok",
 *   domains: ["tiktok.com"],
 *   patterns: [/tiktok\.com\/@[\w]+\/video\/(\d+)/],
 *   embedUrl: (id) => `https://www.tiktok.com/embed/${id}`,
 * });
 *
 * register(TikTokMatcher);
 * ```
 */
export function register(matcher: MatcherInput): void {
  defaultStore.register(matcher);
}

/**
 * Unregister a matcher by name.
 *
 * @param name - Name of the matcher to remove
 *
 * @remarks
 * This modifies the `defaultStore`, which notifies all subscribers.
 */
export function unregister(name: string): void {
  defaultStore.unregister(name);
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports for Convenience
// ─────────────────────────────────────────────────────────────────────────────

export type { EmbedOutput } from "../embed";
// Re-export core types and factories for browser bundles
export { Embed } from "../embed";
export type { MatcherConfig } from "../factories";
export { defineMatcher } from "../factories";
export { defineIframeMatcher } from "../factories/iframe";
export type { MatcherInput, MatchResult, UrlMatcher } from "../matcher";
export type { EmbedOptions, PrivacyOptions } from "../output";
export { RegistryStore } from "../store";
