import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { DailyMotionData } from "./types";

/**
 * DailyMotion-specific output options.
 *
 * @remarks
 * These options map to DailyMotion's new embed endpoint parameters.
 * Note: Most player customization requires a Player ID configured in
 * the DailyMotion Partner HQ.
 *
 * @see https://developers.dailymotion.com/migration-guide-new-embed-endpoint/
 *
 * @example
 * ```typescript
 * const options: DailyMotionOutputOptions = {
 *   mute: true,
 *   startTime: 90,
 *   loop: true,
 * };
 *
 * const output = DailyMotionMatcher.toOutput(data, options);
 * ```
 */
export interface DailyMotionOutputOptions extends OutputOptions {
  /**
   * Loop the video continuously.
   * Maps to `loop=true` URL parameter.
   */
  loop?: boolean;

  /**
   * Start the video muted.
   * Maps to `mute=true` URL parameter.
   */
  mute?: boolean;

  /**
   * Custom Player ID for advanced customization.
   *
   * @remarks
   * Player IDs are created in the DailyMotion Partner HQ and allow
   * customizing player appearance and behavior beyond the basic options.
   *
   * When provided, the embed URL changes to:
   * `https://geo.dailymotion.com/player/PLAYER_ID.html?video=VIDEO_ID`
   *
   * @example
   * ```typescript
   * const options: DailyMotionOutputOptions = {
   *   playerId: "xc394",
   * };
   * ```
   */
  playerId?: string;

  /**
   * Start time in seconds.
   * Maps to `startTime=SECONDS` URL parameter.
   */
  startTime?: number;
}

/**
 * DailyMotion URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://www.dailymotion.com/video/VIDEO_ID`
 * - `https://dailymotion.com/embed/video/VIDEO_ID`
 * - `https://dai.ly/VIDEO_ID`
 *
 * Video ID is alphanumeric (typically 7 characters).
 */
const DAILYMOTION_PATTERNS = [
  // Standard and embed URLs
  /dailymotion\.com(?:\/embed)?\/video\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/,

  // Short URL
  /dai\.ly\/([a-zA-Z0-9]+)/,
] as const;

/**
 * DailyMotion matcher for video embeds.
 *
 * @remarks
 * - Uses the new geo.dailymotion.com embed endpoint (Feb 2025)
 * - Supports standard, embed, and short URLs
 * - Supports mute, startTime, loop, and playerId options
 * - Default dimensions: 560x315
 *
 * @see https://developers.dailymotion.com/migration-guide-new-embed-endpoint/
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([DailyMotionMatcher]);
 * const result = registry.match("https://www.dailymotion.com/video/x7znrd0");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "x7znrd0" }
 * }
 *
 * // With options
 * const output = result.matcher.toOutput(result.data, {
 *   mute: true,
 *   startTime: 90,
 * });
 * ```
 */
export const DailyMotionMatcher: UrlMatcher<"DailyMotion", DailyMotionData> = {
  canMatch(ctx: MatchContext): boolean {
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["dailymotion.com", "dai.ly"],
  name: "DailyMotion",

  parse(ctx: MatchContext): Result<DailyMotionData> {
    for (const pattern of DAILYMOTION_PATTERNS) {
      const match = ctx.raw.match(pattern);
      if (match?.[1]) {
        return ok({ videoId: match[1] });
      }
    }
    return noMatch("No valid DailyMotion URL pattern matched");
  },

  supportsPrivacyMode: false,

  toEmbedUrl(
    data: DailyMotionData,
    options?: PrivacyOptions & DailyMotionOutputOptions,
  ): string {
    // Build base URL - with or without Player ID
    let baseUrl: string;
    if (options?.playerId) {
      baseUrl = `https://geo.dailymotion.com/player/${options.playerId}.html`;
    } else {
      baseUrl = "https://geo.dailymotion.com/player.html";
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.set("video", data.videoId);

    if (options?.mute) {
      params.set("mute", "true");
    }

    if (options?.startTime !== undefined && options.startTime > 0) {
      params.set("startTime", String(Math.floor(options.startTime)));
    }

    if (options?.loop) {
      params.set("loop", "true");
    }

    return `${baseUrl}?${params.toString()}`;
  },

  toOutput(
    data: DailyMotionData,
    options?: OutputOptions & PrivacyOptions & DailyMotionOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    const attrs = mergeOutputOptions(
      {
        allow: "autoplay; fullscreen; picture-in-picture; web-share",
        frameborder: "0",
      },
      options,
      { height: 315, width: 560 },
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
