import type { MatchContext } from "./context";
import type { EmbedOutput, OutputOptions, PrivacyOptions } from "./output";
import type { MatchError, Result } from "./result";

/**
 * URL Matcher interface for parsing and rendering embed URLs.
 *
 * @remarks
 * Replaces the old `EmbedProvider` interface with:
 * - Generic type parameters for type-safe parse results
 * - Result<T> monad for explicit error handling
 * - Structured EmbedOutput instead of raw HTML strings
 * - Privacy-first options
 *
 * Matchers must be SSR-safe: no DOM APIs (document, window, etc.)
 *
 * @typeParam TName - Literal string type for the matcher name
 * @typeParam TParseResult - The data type returned by parse()
 * @typeParam TRenderOptions - Additional options for toOutput()
 *
 * @example
 * ```typescript
 * // Simple matcher with string ID
 * const YouTubeMatcher: UrlMatcher<"YouTube", { videoId: string }> = {
 *   name: "YouTube",
 *   domains: ["youtube.com", "youtu.be"],
 *   // ...
 * };
 *
 * // Complex matcher with custom data
 * const SpotifyMatcher: UrlMatcher<"Spotify", SpotifyData, SpotifyOptions> = {
 *   name: "Spotify",
 *   domains: ["spotify.com"],
 *   schemes: ["spotify"],  // For spotify: URIs
 *   // ...
 * };
 * ```
 */
export interface UrlMatcher<
  TName extends string = string,
  TParseResult = unknown,
  TRenderOptions = object,
> {
  /**
   * Unique name identifying this matcher.
   * Used for registry lookup and conflict resolution.
   */
  readonly name: TName;

  /**
   * Domains this matcher handles.
   * Used for O(1) indexed dispatch in the registry.
   *
   * @remarks
   * Include all domain variants (with/without www, subdomains).
   * Omit for matchers that work across domains (uses slower fallback).
   *
   * @example ["youtube.com", "youtu.be", "youtube-nocookie.com"]
   */
  readonly domains?: readonly string[];

  /**
   * URL schemes this matcher handles (besides http/https).
   * Used for matching non-http URLs like `spotify:track:abc`.
   *
   * @example ["spotify"] for spotify: URIs
   */
  readonly schemes?: readonly string[];

  /**
   * Whether this matcher supports privacy-enhanced mode.
   *
   * @remarks
   * If true, the matcher can alter its output for privacy:
   * - YouTube: youtube-nocookie.com domain
   * - Others: DNT attributes, tracking prevention
   */
  readonly supportsPrivacyMode?: boolean;

  /**
   * Quick check if this matcher can handle the URL.
   *
   * @param ctx - Pre-parsed URL context
   * @returns true if this matcher should attempt parsing
   *
   * @remarks
   * Should be fast - just check domain/scheme, not full pattern matching.
   * If returns true, parse() will be called next.
   */
  canMatch(ctx: MatchContext): boolean;

  /**
   * Parse URL into structured data.
   *
   * @param ctx - Pre-parsed URL context
   * @returns Result containing parsed data or error
   *
   * @remarks
   * ⚠️ MUST be SSR-safe: no DOM APIs.
   * Returns Result<T> for explicit error handling.
   *
   * @example
   * ```typescript
   * parse(ctx) {
   *   const match = ctx.raw.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
   *   if (!match) return noMatch();
   *   return ok({ videoId: match[1] });
   * }
   * ```
   */
  parse(ctx: MatchContext): Result<TParseResult>;

  /**
   * Generate embed URL from parsed data.
   *
   * @param data - Parsed data from parse()
   * @param options - Privacy and render options
   * @returns Embed URL string
   *
   * @remarks
   * ⚠️ MUST be SSR-safe: pure string transformation.
   *
   * @example
   * ```typescript
   * toEmbedUrl(data, { privacy = true } = {}) {
   *   const domain = privacy ? "youtube-nocookie.com" : "youtube.com";
   *   return `https://www.${domain}/embed/${data.videoId}`;
   * }
   * ```
   */
  toEmbedUrl(
    data: TParseResult,
    options?: PrivacyOptions & TRenderOptions,
  ): string;

  /**
   * Generate structured output for rendering.
   *
   * @param data - Parsed data from parse()
   * @param options - Output, privacy, and render options
   * @returns Structured EmbedOutput
   *
   * @remarks
   * ⚠️ MUST be SSR-safe: no DOM APIs.
   * Returns structured data that can be:
   * - Rendered to HTML string for SSR
   * - Mounted to DOM in browser
   *
   * @example
   * ```typescript
   * toOutput(data, options) {
   *   return {
   *     nodes: [{
   *       type: "iframe",
   *       src: this.toEmbedUrl(data, options),
   *       attributes: {
   *         width: String(options?.width ?? 560),
   *         height: String(options?.height ?? 315),
   *         allowfullscreen: "",
   *       },
   *     }],
   *   };
   * }
   * ```
   */
  toOutput(
    data: TParseResult,
    options?: OutputOptions & PrivacyOptions & TRenderOptions,
  ): EmbedOutput;
}

// ─────────────────────────────────────────────────────────────────────────────
// Match Result Types (correlated with matcher)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Successful match result with correlated types.
 *
 * @remarks
 * The `data` type is inferred from the matcher's TParseResult.
 * This enables type-safe access to parsed data.
 *
 * @example
 * ```typescript
 * const result = registry.match(url);
 * if (result.ok) {
 *   // result.matcher.name correlates with result.data type
 *   if (result.matcher.name === "YouTube") {
 *     console.log(result.data.videoId);  // Type-safe access
 *   }
 * }
 * ```
 */
export type MatchOk<M extends UrlMatcher> = {
  ok: true;
  matcher: M;
  data: M extends UrlMatcher<infer _TName, infer TData, infer _TOptions>
    ? TData
    : never;
};

/**
 * Match result from registry.match().
 *
 * @remarks
 * Either a successful match with matcher and data,
 * or a failed match with error details.
 */
export type MatchResult<M extends UrlMatcher = UrlMatcher> =
  | MatchOk<M>
  | { ok: false; error: MatchError };

// ─────────────────────────────────────────────────────────────────────────────
// Matcher Input Type (for registry construction)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input type for registry methods that accept matchers.
 * Allows both plain matchers and matchers with priority.
 */
export type MatcherInput<M extends UrlMatcher = UrlMatcher> =
  | M
  | { matcher: M; priority?: number };

/**
 * Extract the matcher from a MatcherInput.
 */
export function extractMatcher<M extends UrlMatcher>(
  input: MatcherInput<M>,
): M {
  return "matcher" in input ? input.matcher : input;
}

/**
 * Extract the priority from a MatcherInput.
 */
export function extractPriority<M extends UrlMatcher>(
  input: MatcherInput<M>,
): number {
  return "matcher" in input ? (input.priority ?? 0) : 0;
}
