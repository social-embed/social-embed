/**
 * @social-embed/lib - URL matching and transformation for embed providers.
 *
 * @remarks
 * This library provides type-safe URL parsing and embed URL generation
 * for popular media providers (YouTube, Spotify, Vimeo, etc.).
 *
 * ## Tier 1: Zero-Config Usage (Browser)
 *
 * For CDN, JSFiddle, or simple browser use, import from `/browser`:
 *
 * ```typescript
 * import { toEmbedUrl, toEmbed, register } from "@social-embed/lib/browser";
 *
 * // One-liner: get embed URL
 * const embedUrl = toEmbedUrl("https://youtu.be/abc123");
 * // => "https://www.youtube-nocookie.com/embed/abc123"
 *
 * // Rich Embed object with methods
 * const embed = toEmbed("https://youtu.be/abc123");
 * embed.toHtml();   // Full iframe HTML
 * embed.toUrl();    // Just the embed URL
 *
 * // Register custom matcher (notifies all WC subscribers)
 * register(MyCustomMatcher);
 * ```
 *
 * ## Tier 2: SSR / Framework Integration
 *
 * For SSR or when you need more control, use the registry directly:
 *
 * ```typescript
 * import { MatcherRegistry, renderOutput } from "@social-embed/lib";
 *
 * const registry = MatcherRegistry.withDefaults();
 *
 * // Match and get embed URL
 * const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
 *
 * // Get structured output for SSR
 * const output = registry.toOutput("https://youtu.be/abc123", { width: 800 });
 * const html = renderOutput(output);
 * ```
 *
 * ## Tier 3: Custom Matchers
 *
 * Create custom matchers with the unified factory:
 *
 * ```typescript
 * import { defineMatcher, MatcherRegistry } from "@social-embed/lib";
 *
 * const TikTokMatcher = defineMatcher({
 *   type: "iframe",
 *   name: "TikTok",
 *   domains: ["tiktok.com"],
 *   patterns: [/tiktok\.com\/@[\w]+\/video\/(\d+)/],
 *   embedUrl: (id) => `https://www.tiktok.com/embed/${id}`,
 * });
 *
 * const registry = MatcherRegistry.withDefaults().with(TikTokMatcher);
 * ```
 *
 * @packageDocumentation
 */

// ─────────────────────────────────────────────────────────────────────────────
// Core Types
// ─────────────────────────────────────────────────────────────────────────────

// Context types (MatchInput is the stable public API for custom matchers)
export type { MatchContext, MatchInput, ParsedInput } from "./context";
export {
  createContext,
  createMatchInput,
  getBaseDomain,
  getQueryParam,
  hostMatches,
} from "./context";
// Embed types (new v2 API)
// Legacy node type for backward compatibility
export type {
  DangerousHtmlNode,
  EmbedData,
  EmbedNode,
  EmbedOutput,
  HtmlNode,
  IframeNode,
  RawHtmlNode,
  ScriptRequest,
  StyleChunk,
} from "./embed";
export {
  createEmbed,
  createHtmlEmbed,
  createIframeEmbed,
  Embed,
} from "./embed";
export type { MatcherInput, MatchOk, MatchResult, UrlMatcher } from "./matcher";
export { extractMatcher, extractPriority } from "./matcher";

// Output options
export type {
  EmbedOptions,
  OutputOptions,
  PrivacyOptions,
} from "./output";
export {
  createHtmlOutput,
  createIframeOutput,
  mergeOutputOptions,
} from "./output";
export type { MatchError, MatchErrorCode, Result } from "./result";
export {
  err,
  invalidFormat,
  missingId,
  noMatch,
  ok,
  parseError,
  unsupportedPrivacy,
} from "./result";

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export type { RegistryOptions } from "./registry";
export { MatcherRegistry, renderOutput } from "./registry";

// ─────────────────────────────────────────────────────────────────────────────
// Store (Mutable Registry Wrapper with Reactivity)
// ─────────────────────────────────────────────────────────────────────────────

export type { RegisterOptions, RegistryListener, Unsubscribe } from "./store";
export { RegistryStore } from "./store";

// ─────────────────────────────────────────────────────────────────────────────
// Default Store (Re-exported for CDN compatibility)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default registry store singleton.
 *
 * @remarks
 * Re-exported from `@social-embed/lib/browser` for CDN compatibility.
 * This allows esm.sh GitHub imports to work without subpath alias issues.
 *
 * For SSR contexts, use `MatcherRegistry.withDefaults()` instead.
 */
export { defaultStore } from "./browser";

// ─────────────────────────────────────────────────────────────────────────────
// Factories
// ─────────────────────────────────────────────────────────────────────────────

// Unified factory (recommended for new matchers)
export type { MatcherConfig } from "./factories";
export { defineMatcher } from "./factories";

// Specialized factories (for advanced use cases)
export type {
  IframeMatcherConfig,
  IframeParseResult,
} from "./factories/iframe";
export { defineIframeMatcher } from "./factories/iframe";

export type { ScriptMatcherConfig } from "./factories/script";
export { defineScriptMatcher } from "./factories/script";

// ─────────────────────────────────────────────────────────────────────────────
// Built-in Matchers
// ─────────────────────────────────────────────────────────────────────────────

export type {
  DailyMotionData,
  DailyMotionOutputOptions,
  EdPuzzleData,
  LoomData,
  LoomOutputOptions,
  SpotifyContentType,
  SpotifyData,
  SpotifyOutputOptions,
  SpotifySize,
  SpotifyTheme,
  SpotifyView,
  VimeoData,
  VimeoOutputOptions,
  WistiaData,
  WistiaOutputOptions,
  YouTubeData,
  YouTubeOutputOptions,
} from "./matchers";
export {
  ALL_MATCHERS,
  DailyMotionMatcher,
  EdPuzzleMatcher,
  getSpotifyDefaultSize,
  getSpotifyHeight,
  getSpotifyWidth,
  isYouTubeShortsUrl,
  LoomMatcher,
  SPOTIFY_HEIGHTS,
  SPOTIFY_TYPES,
  SpotifyMatcher,
  VimeoMatcher,
  WistiaMatcher,
  YOUTUBE_SHORTS_DIMENSIONS,
  YouTubeMatcher,
  youTubeShortsRegex,
} from "./matchers";

// ─────────────────────────────────────────────────────────────────────────────
// Escape Utilities
// ─────────────────────────────────────────────────────────────────────────────

export {
  escapeAttr,
  escapeHtml,
  renderAttributes,
  renderIframe,
} from "./escape";

// ─────────────────────────────────────────────────────────────────────────────
// Legacy Exports (deprecated, for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

import { MatcherRegistry } from "./registry";

/**
 * Internal default registry for legacy `convertUrlToEmbedUrl` function.
 * Not exported - use `MatcherRegistry.withDefaults()` instead.
 */
const _defaultRegistry = MatcherRegistry.withDefaults();

/**
 * Convert a URL to its embed URL equivalent.
 *
 * @deprecated Use `MatcherRegistry.withDefaults().toEmbedUrl(url)` for more control.
 * This function is provided for backward compatibility with v1.
 *
 * @param url - The URL to convert
 * @returns The embed URL, or empty string if no provider matches
 *
 * @example
 * ```typescript
 * import { convertUrlToEmbedUrl } from "@social-embed/lib";
 *
 * const embedUrl = convertUrlToEmbedUrl("https://youtu.be/FTQbiNvZqaY");
 * // Returns: "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY"
 *
 * const noMatch = convertUrlToEmbedUrl("https://example.com");
 * // Returns: ""
 * ```
 */
export function convertUrlToEmbedUrl(url: string): string {
  return _defaultRegistry.toEmbedUrl(url) ?? "";
}
