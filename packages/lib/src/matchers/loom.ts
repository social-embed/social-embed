import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { LoomData } from "./types";

/**
 * Loom-specific output options.
 *
 * @remarks
 * These options map to Loom's embed URL parameters.
 *
 * @see https://support.atlassian.com/loom/docs/make-embedded-videos-autoplay-or-play-at-a-specific-time/
 *
 * @example
 * ```typescript
 * const options: LoomOutputOptions = {
 *   autoplay: true,
 *   start: 80,
 *   hideTopBar: true,
 * };
 *
 * const output = LoomMatcher.toOutput(data, options);
 * ```
 */
export interface LoomOutputOptions extends OutputOptions {
  /**
   * Auto-start the video.
   * Maps to `autoplay=1` URL parameter.
   */
  autoplay?: boolean;

  /**
   * Hide the embed top bar.
   * Maps to `hideEmbedTopBar=true` URL parameter.
   */
  hideTopBar?: boolean;

  /**
   * Start time in seconds.
   * Maps to `t=SECONDSs` URL parameter (e.g., `t=80s`).
   */
  start?: number;
}

/**
 * Loom URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://www.loom.com/share/VIDEO_ID`
 * - `https://loom.com/share/VIDEO_ID`
 *
 * Video ID is 32 characters (alphanumeric).
 */
const LOOM_PATTERNS = [
  // Share URL
  /loom\.com\/share\/([-\w]+)/,
] as const;

/**
 * Loom matcher for video embeds.
 *
 * @remarks
 * - Supports share URLs
 * - Supports autoplay, start time, and hideTopBar options
 * - Default dimensions: 470x404
 *
 * @see https://support.atlassian.com/loom/docs/make-embedded-videos-autoplay-or-play-at-a-specific-time/
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([LoomMatcher]);
 * const result = registry.match("https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "e883f70b219a49f6ba7fbeac71a72604" }
 * }
 *
 * // With options
 * const output = result.matcher.toOutput(result.data, {
 *   autoplay: true,
 *   start: 80,
 * });
 * ```
 */
export const LoomMatcher: UrlMatcher<"Loom", LoomData> = {
  canMatch(ctx: MatchContext): boolean {
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["loom.com"],
  name: "Loom",

  parse(ctx: MatchContext): Result<LoomData> {
    for (const pattern of LOOM_PATTERNS) {
      const match = ctx.raw.match(pattern);
      if (match?.[1]) {
        return ok({ videoId: match[1] });
      }
    }
    return noMatch("No valid Loom URL pattern matched");
  },

  supportsPrivacyMode: false,

  toEmbedUrl(
    data: LoomData,
    options?: PrivacyOptions & LoomOutputOptions,
  ): string {
    const baseUrl = `https://www.loom.com/embed/${data.videoId}`;

    // Build query parameters
    const params = new URLSearchParams();

    if (options?.start !== undefined && options.start > 0) {
      // Loom uses "t=80s" format
      params.set("t", `${Math.floor(options.start)}s`);
    }

    if (options?.autoplay) {
      params.set("autoplay", "1");
    }

    if (options?.hideTopBar) {
      params.set("hideEmbedTopBar", "true");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  toOutput(
    data: LoomData,
    options?: OutputOptions & PrivacyOptions & LoomOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    const attrs = mergeOutputOptions(
      {
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        allowfullscreen: "true",
        frameborder: "0",
      },
      options,
      { height: 404, width: 470 },
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
