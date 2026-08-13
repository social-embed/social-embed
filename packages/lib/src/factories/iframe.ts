import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";

/**
 * Parse result for simple iframe matchers.
 * Contains just the extracted ID.
 */
export interface IframeParseResult {
  /** The extracted ID from the URL */
  id: string;
}

/**
 * Configuration for defining a simple iframe-based matcher.
 *
 * @remarks
 * Use this factory for providers that:
 * - Have a straightforward URL pattern → ID extraction
 * - Embed via a single iframe
 * - Don't need complex parsing logic
 *
 * For more complex scenarios (Spotify's multiple content types,
 * script-based embeds), implement UrlMatcher directly.
 *
 * @typeParam TName - Literal string type for the matcher name
 *
 * @example
 * ```typescript
 * const YouTubeMatcher = defineIframeMatcher({
 *   name: "YouTube",
 *   domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
 *   patterns: [
 *     /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
 *     /youtu\.be\/([a-zA-Z0-9_-]{11})/,
 *   ],
 *   embedUrl: (id, { privacy = true } = {}) =>
 *     privacy
 *       ? `https://www.youtube-nocookie.com/embed/${id}`
 *       : `https://www.youtube.com/embed/${id}`,
 *   defaultDimensions: { width: 560, height: 315 },
 *   supportsPrivacyMode: true,
 * });
 * ```
 */
export interface IframeMatcherConfig<TName extends string> {
  /**
   * Unique name identifying this matcher.
   */
  name: TName;

  /**
   * Domains this matcher handles.
   * Used for O(1) indexed dispatch in the registry.
   *
   * @example ["youtube.com", "youtu.be"]
   */
  domains: readonly string[];

  /**
   * Regex patterns to match URLs.
   * First capture group should be the ID.
   *
   * @remarks
   * Patterns are tried in order until one matches.
   * The first capture group (index 1) is extracted as the ID.
   *
   * @example
   * ```typescript
   * patterns: [
   *   /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
   *   /youtu\.be\/([a-zA-Z0-9_-]{11})/,
   * ]
   * ```
   */
  patterns: readonly RegExp[];

  /**
   * Generate the embed URL from an ID.
   *
   * @param id - The extracted ID
   * @param options - Privacy options
   * @returns The embed URL
   *
   * @example
   * ```typescript
   * embedUrl: (id, { privacy = true } = {}) =>
   *   privacy
   *     ? `https://www.youtube-nocookie.com/embed/${id}`
   *     : `https://www.youtube.com/embed/${id}`
   * ```
   */
  embedUrl: (id: string, options?: PrivacyOptions) => string;

  /**
   * Default iframe dimensions.
   * Used when width/height not specified in options.
   * Can be numbers (pixels) or CSS strings (e.g., "100%").
   */
  defaultDimensions?: {
    width: string | number;
    height: string | number;
  };

  /**
   * Default HTML attributes for the iframe.
   *
   * @example
   * ```typescript
   * iframeAttributes: {
   *   frameborder: "0",
   *   allow: "accelerometer; autoplay; clipboard-write; encrypted-media",
   *   allowfullscreen: "",
   * }
   * ```
   */
  iframeAttributes?: Record<string, string>;

  /**
   * Whether this matcher supports privacy-enhanced mode.
   */
  supportsPrivacyMode?: boolean;
}

/**
 * Define a simple iframe-based URL matcher.
 *
 * @param config - Matcher configuration
 * @returns A UrlMatcher instance
 *
 * @remarks
 * This factory creates matchers for common iframe embed patterns:
 * 1. Match URL against patterns
 * 2. Extract ID from first capture group
 * 3. Generate embed URL from ID
 * 4. Render iframe with configurable attributes
 *
 * @example
 * ```typescript
 * const VimeoMatcher = defineIframeMatcher({
 *   name: "Vimeo",
 *   domains: ["vimeo.com"],
 *   patterns: [/vimeo\.com\/(\d+)/],
 *   embedUrl: (id) => `https://player.vimeo.com/video/${id}`,
 *   defaultDimensions: { width: 640, height: 360 },
 *   iframeAttributes: {
 *     frameborder: "0",
 *     allow: "autoplay; fullscreen; picture-in-picture",
 *     allowfullscreen: "",
 *   },
 * });
 * ```
 */
export function defineIframeMatcher<TName extends string>(
  config: IframeMatcherConfig<TName>,
): UrlMatcher<TName, IframeParseResult> {
  const {
    name,
    domains,
    patterns,
    embedUrl,
    defaultDimensions = { height: 315, width: 560 },
    iframeAttributes = {},
    supportsPrivacyMode = false,
  } = config;

  return {
    canMatch(ctx: MatchContext): boolean {
      return hostMatches(ctx, domains);
    },
    domains,
    name,

    parse(ctx: MatchContext): Result<IframeParseResult> {
      for (const pattern of patterns) {
        const match = ctx.raw.match(pattern);
        if (match?.[1]) {
          return ok({ id: match[1] });
        }
      }
      return noMatch(`No pattern matched for ${name}`);
    },
    supportsPrivacyMode,

    toEmbedUrl(data: IframeParseResult, options?: PrivacyOptions): string {
      return embedUrl(data.id, options);
    },

    toOutput(
      data: IframeParseResult,
      options?: OutputOptions & PrivacyOptions,
    ): EmbedOutput {
      const src = this.toEmbedUrl(data, options);
      const attrs = mergeOutputOptions(
        iframeAttributes,
        options,
        defaultDimensions,
      );

      return {
        nodes: [
          {
            attributes: attrs,
            src,
            type: "iframe",
          },
        ],
      };
    },
  };
}
