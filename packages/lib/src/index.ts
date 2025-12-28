/**
 * @social-embed/lib - URL matching and transformation for embed providers.
 *
 * @remarks
 * This library provides type-safe URL parsing and embed URL generation
 * for popular media providers (YouTube, Spotify, Vimeo, etc.).
 *
 * ## Quick Start
 *
 * ```typescript
 * import { MatcherRegistry } from "@social-embed/lib";
 *
 * const registry = MatcherRegistry.withDefaults();
 *
 * // Match and get embed URL (privacy-enhanced by default)
 * const embedUrl = registry.toEmbedUrl("https://youtu.be/abc123");
 * // => "https://www.youtube-nocookie.com/embed/abc123"
 *
 * // Get structured output for SSR
 * const output = registry.toOutput("https://youtu.be/abc123", { width: 800 });
 * const html = renderOutput(output);
 * ```
 *
 * ## Browser Usage
 *
 * ```typescript
 * import { MatcherRegistry } from "@social-embed/lib";
 * import { mount } from "@social-embed/lib/browser";
 *
 * const registry = MatcherRegistry.withDefaults();
 * const output = registry.toOutput("https://youtu.be/abc123");
 *
 * await mount(output, { container: "#embed" });
 * ```
 *
 * ## Custom Matchers
 *
 * ```typescript
 * import { defineIframeMatcher, MatcherRegistry } from "@social-embed/lib";
 *
 * const TikTokMatcher = defineIframeMatcher({
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

export type { MatchContext, ParsedInput } from "./context";
export {
  createContext,
  getBaseDomain,
  getQueryParam,
  hostMatches,
} from "./context";
export type { MatcherInput, MatchOk, MatchResult, UrlMatcher } from "./matcher";
export { extractMatcher, extractPriority } from "./matcher";

export type {
  EmbedNode,
  EmbedOutput,
  HtmlNode,
  IframeNode,
  OutputOptions,
  PrivacyOptions,
  ScriptRequest,
  StyleChunk,
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
} from "./result";

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

export type { RegisterOptions, RegistryOptions } from "./registry";
export { MatcherRegistry, renderOutput } from "./registry";

// ─────────────────────────────────────────────────────────────────────────────
// Factories
// ─────────────────────────────────────────────────────────────────────────────

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
  LoomMatcher,
  SPOTIFY_HEIGHTS,
  SPOTIFY_TYPES,
  SpotifyMatcher,
  VimeoMatcher,
  WistiaMatcher,
  YouTubeMatcher,
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
 * Default registry instance with all built-in matchers.
 *
 * @deprecated Use `MatcherRegistry.withDefaults()` instead.
 * This export is provided for backward compatibility with v1 code that used
 * `defaultRegistry.register()` or similar instance methods.
 */
export const defaultRegistry = MatcherRegistry.withDefaults();

/**
 * Convert a URL to its embed URL equivalent.
 *
 * @deprecated Use `defaultRegistry.toEmbedUrl(url)` instead for more control.
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
  return defaultRegistry.toEmbedUrl(url) ?? "";
}
