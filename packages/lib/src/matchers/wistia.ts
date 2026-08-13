import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { WistiaData } from "./types";

/**
 * Wistia-specific output options.
 *
 * @remarks
 * These options map to Wistia's embed URL parameters.
 * Note that Wistia uses camelCase for its parameters.
 *
 * @see https://docs.wistia.com/docs/iframe-embed-options
 *
 * @example
 * ```typescript
 * const options: WistiaOutputOptions = {
 *   autoPlay: true,
 *   muted: true, // Required for autoplay in most browsers
 *   playerColor: "ff69b4", // Pink player color
 * };
 *
 * const output = WistiaMatcher.toOutput(data, options);
 * ```
 */
export interface WistiaOutputOptions extends OutputOptions {
  /**
   * Auto-start the video.
   *
   * @remarks
   * Most browsers require `muted: true` for autoplay to work.
   * Maps to `autoPlay=true` URL parameter (note: camelCase).
   */
  autoPlay?: boolean;

  /**
   * Start the video muted.
   * Maps to `muted=true` URL parameter.
   * Required for autoplay to work in most browsers.
   */
  muted?: boolean;

  /**
   * Custom player accent color.
   *
   * @remarks
   * Hex color code WITHOUT the # prefix.
   * Maps to `playerColor=HEXCODE` URL parameter.
   *
   * @example "ff69b4" for pink
   */
  playerColor?: string;

  /**
   * Enable responsive sizing (Video Foam).
   *
   * @remarks
   * When enabled, the video scales responsively within its container.
   * Maps to `videoFoam=true/false` URL parameter.
   */
  videoFoam?: boolean;
}

/**
 * Wistia URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://support.wistia.com/medias/VIDEO_ID`
 * - `https://fast.wistia.com/embed/VIDEO_ID`
 * - `https://support.wi.st/medias/VIDEO_ID`
 *
 * Video ID is alphanumeric (typically 10 characters).
 */
const WISTIA_PATTERNS = [
  // Media and embed URLs
  /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/([-\w]+)/,
] as const;

/**
 * Wistia matcher for video embeds.
 *
 * @remarks
 * - Supports media and embed URLs
 * - Supports both wistia.com and wi.st domains
 * - Supports player parameters: autoPlay, muted, playerColor, videoFoam
 * - Default dimensions: 470x404
 *
 * @see https://docs.wistia.com/docs/iframe-embed-options
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([WistiaMatcher]);
 * const result = registry.match("https://support.wistia.com/medias/26sk4lmiix");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "26sk4lmiix" }
 * }
 *
 * // With options
 * const output = result.matcher.toOutput(result.data, {
 *   autoPlay: true,
 *   muted: true,
 *   playerColor: "ff69b4",
 * });
 * ```
 */
export const WistiaMatcher: UrlMatcher<"Wistia", WistiaData> = {
  canMatch(ctx: MatchContext): boolean {
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["wistia.com", "wi.st", "fast.wistia.net"],
  name: "Wistia",

  parse(ctx: MatchContext): Result<WistiaData> {
    for (const pattern of WISTIA_PATTERNS) {
      const match = ctx.raw.match(pattern);
      if (match?.[1]) {
        return ok({ videoId: match[1] });
      }
    }
    return noMatch("No valid Wistia URL pattern matched");
  },

  supportsPrivacyMode: false,

  toEmbedUrl(
    data: WistiaData,
    options?: PrivacyOptions & WistiaOutputOptions,
  ): string {
    const baseUrl = `https://fast.wistia.net/embed/iframe/${data.videoId}`;

    // Build query parameters
    const params = new URLSearchParams();

    if (options?.autoPlay) {
      params.set("autoPlay", "true");
    }

    if (options?.muted) {
      params.set("muted", "true");
    }

    if (options?.playerColor) {
      // Remove # if provided, Wistia expects hex without #
      const color = options.playerColor.replace(/^#/, "");
      params.set("playerColor", color);
    }

    if (options?.videoFoam !== undefined) {
      params.set("videoFoam", options.videoFoam ? "true" : "false");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  toOutput(
    data: WistiaData,
    options?: OutputOptions & PrivacyOptions & WistiaOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    const attrs = mergeOutputOptions(
      {
        allow: "autoplay; fullscreen",
        allowtransparency: "true",
        frameborder: "0",
        scrolling: "no",
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
