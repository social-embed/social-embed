import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { YouTubeData } from "./types";

/**
 * YouTube-specific output options.
 *
 * @remarks
 * These options map to YouTube's embed URL parameters.
 *
 * @see https://developers.google.com/youtube/player_parameters
 *
 * @example
 * ```typescript
 * const options: YouTubeOutputOptions = {
 *   start: 90,
 *   autoplay: true,
 *   mute: true, // Required for autoplay in most browsers
 * };
 *
 * const output = YouTubeMatcher.toOutput(data, options);
 * ```
 */
export interface YouTubeOutputOptions extends OutputOptions {
  /**
   * Auto-start the video.
   *
   * @remarks
   * Most browsers require `mute: true` for autoplay to work.
   * Maps to `autoplay=1` URL parameter.
   */
  autoplay?: boolean;

  /**
   * Hide player controls.
   * Maps to `controls=0` URL parameter.
   * @defaultValue true (controls shown)
   */
  controls?: boolean;

  /**
   * End time in seconds.
   * Maps to `end=SECONDS` URL parameter.
   */
  end?: number;

  /**
   * Loop the video continuously.
   *
   * @remarks
   * For single videos, this adds both `loop=1` and `playlist=VIDEO_ID`
   * parameters, as required by YouTube's player.
   */
  loop?: boolean;

  /**
   * Start the video muted.
   * Maps to `mute=1` URL parameter.
   * Required for autoplay to work in most browsers.
   */
  mute?: boolean;

  /**
   * Start time in seconds.
   * Maps to `start=SECONDS` URL parameter.
   */
  start?: number;
}

/**
 * YouTube URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://www.youtube.com/watch?v=VIDEO_ID`
 * - `https://youtu.be/VIDEO_ID`
 * - `https://www.youtube.com/shorts/VIDEO_ID`
 * - `https://www.youtube-nocookie.com/embed/VIDEO_ID`
 *
 * Video ID is always 11 characters.
 */
const YOUTUBE_PATTERNS = [
  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,

  // Short URL: youtu.be/VIDEO_ID
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,

  // Shorts URL: youtube.com/shorts/VIDEO_ID
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,

  // Embed URL: youtube.com/embed/VIDEO_ID or youtube-nocookie.com/embed/VIDEO_ID
  /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/,
] as const;

/**
 * YouTube matcher for video embeds.
 *
 * @remarks
 * - Supports standard, short, Shorts, and embed URLs
 * - Privacy mode uses youtube-nocookie.com (default: enabled)
 * - Supports player parameters: start, end, autoplay, mute, loop, controls
 * - Default dimensions: 560x315
 *
 * @see https://developers.google.com/youtube/player_parameters
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([YouTubeMatcher]);
 * const result = registry.match("https://youtu.be/dQw4w9WgXcQ");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "dQw4w9WgXcQ" }
 * }
 *
 * // With options
 * const output = result.matcher.toOutput(result.data, {
 *   start: 90,
 *   autoplay: true,
 *   mute: true,
 * });
 * ```
 */
export const YouTubeMatcher: UrlMatcher<"YouTube", YouTubeData> = {
  canMatch(ctx: MatchContext): boolean {
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
  name: "YouTube",

  parse(ctx: MatchContext): Result<YouTubeData> {
    for (const pattern of YOUTUBE_PATTERNS) {
      const match = ctx.raw.match(pattern);
      if (match?.[1]) {
        return ok({ videoId: match[1] });
      }
    }
    return noMatch("No valid YouTube URL pattern matched");
  },

  supportsPrivacyMode: true,

  toEmbedUrl(
    data: YouTubeData,
    options?: PrivacyOptions & YouTubeOutputOptions,
  ): string {
    const privacy = options?.privacy ?? true;
    const domain = privacy ? "youtube-nocookie.com" : "youtube.com";
    const baseUrl = `https://www.${domain}/embed/${data.videoId}`;

    // Build query parameters
    const params = new URLSearchParams();

    if (options?.start !== undefined && options.start > 0) {
      params.set("start", String(Math.floor(options.start)));
    }

    if (options?.end !== undefined && options.end > 0) {
      params.set("end", String(Math.floor(options.end)));
    }

    if (options?.autoplay) {
      params.set("autoplay", "1");
    }

    if (options?.mute) {
      params.set("mute", "1");
    }

    if (options?.loop) {
      params.set("loop", "1");
      // YouTube requires playlist param for single video looping
      params.set("playlist", data.videoId);
    }

    if (options?.controls === false) {
      params.set("controls", "0");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  toOutput(
    data: YouTubeData,
    options?: OutputOptions & PrivacyOptions & YouTubeOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    const attrs = mergeOutputOptions(
      {
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture",
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
