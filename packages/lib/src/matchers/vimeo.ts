import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { VimeoData } from "./types";

/**
 * Vimeo-specific output options.
 *
 * @remarks
 * These options map to Vimeo's embed URL parameters.
 *
 * @see https://developer.vimeo.com/player/sdk/embed
 *
 * @example
 * ```typescript
 * const options: VimeoOutputOptions = {
 *   autoplay: true,
 *   muted: true, // Required for autoplay in most browsers
 *   loop: true,
 * };
 *
 * const output = VimeoMatcher.toOutput(data, options);
 * ```
 */
export interface VimeoOutputOptions extends OutputOptions {
  /**
   * Auto-start the video.
   *
   * @remarks
   * Most browsers require `muted: true` for autoplay to work.
   * Maps to `autoplay=1` URL parameter.
   */
  autoplay?: boolean;

  /**
   * Disable pause when video scrolls out of view.
   * Maps to `autopause=0` URL parameter.
   * @defaultValue true (video pauses when scrolled away)
   */
  autopause?: boolean;

  /**
   * Enable background mode (hides all UI).
   *
   * @remarks
   * Background mode is only available for paid Vimeo accounts.
   * Maps to `background=1` URL parameter.
   */
  background?: boolean;

  /**
   * Hide/show the video author byline.
   * Maps to `byline=0` URL parameter.
   * @defaultValue true (byline shown)
   */
  byline?: boolean;

  /**
   * Hide player controls.
   * Maps to `controls=0` URL parameter.
   * @defaultValue true (controls shown)
   */
  controls?: boolean;

  /**
   * Loop the video continuously.
   * Maps to `loop=1` URL parameter.
   */
  loop?: boolean;

  /**
   * Start the video muted.
   * Maps to `muted=1` URL parameter.
   * Required for autoplay to work in most browsers.
   */
  muted?: boolean;

  /**
   * Hide/show the video author portrait.
   * Maps to `portrait=0` URL parameter.
   * @defaultValue true (portrait shown)
   */
  portrait?: boolean;

  /**
   * Hide/show the video title.
   * Maps to `title=0` URL parameter.
   * @defaultValue true (title shown)
   */
  title?: boolean;
}

/**
 * Vimeo URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://vimeo.com/VIDEO_ID`
 * - `https://www.vimeo.com/VIDEO_ID`
 * - `https://player.vimeo.com/video/VIDEO_ID`
 * - `https://vimeo.com/channels/CHANNEL/VIDEO_ID`
 * - `https://vimeo.com/groups/GROUP/videos/VIDEO_ID`
 *
 * Video ID is numeric.
 */
const VIMEO_PATTERNS = [
  // Standard and player URLs
  /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/)?(\d+)/,
] as const;

/**
 * Vimeo matcher for video embeds.
 *
 * @remarks
 * - Supports standard, player, channel, and group URLs
 * - Supports player parameters: autoplay, muted, loop, background, controls, etc.
 * - Default dimensions: 640x268
 *
 * @see https://developer.vimeo.com/player/sdk/embed
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([VimeoMatcher]);
 * const result = registry.match("https://vimeo.com/134668506");
 * if (result.ok) {
 *   console.log(result.data); // { videoId: "134668506" }
 * }
 *
 * // With options
 * const output = result.matcher.toOutput(result.data, {
 *   autoplay: true,
 *   muted: true,
 *   loop: true,
 * });
 * ```
 */
export const VimeoMatcher: UrlMatcher<"Vimeo", VimeoData> = {
  canMatch(ctx: MatchContext): boolean {
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["vimeo.com", "player.vimeo.com"],
  name: "Vimeo",

  parse(ctx: MatchContext): Result<VimeoData> {
    for (const pattern of VIMEO_PATTERNS) {
      const match = ctx.raw.match(pattern);
      if (match?.[1]) {
        return ok({ videoId: match[1] });
      }
    }
    return noMatch("No valid Vimeo URL pattern matched");
  },

  supportsPrivacyMode: false,

  toEmbedUrl(
    data: VimeoData,
    options?: PrivacyOptions & VimeoOutputOptions,
  ): string {
    const baseUrl = `https://player.vimeo.com/video/${data.videoId}`;

    // Build query parameters
    const params = new URLSearchParams();

    if (options?.autoplay) {
      params.set("autoplay", "1");
    }

    if (options?.muted) {
      params.set("muted", "1");
    }

    if (options?.loop) {
      params.set("loop", "1");
    }

    if (options?.background) {
      params.set("background", "1");
    }

    if (options?.autopause === false) {
      params.set("autopause", "0");
    }

    if (options?.controls === false) {
      params.set("controls", "0");
    }

    if (options?.title === false) {
      params.set("title", "0");
    }

    if (options?.byline === false) {
      params.set("byline", "0");
    }

    if (options?.portrait === false) {
      params.set("portrait", "0");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  toOutput(
    data: VimeoData,
    options?: OutputOptions & PrivacyOptions & VimeoOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    const attrs = mergeOutputOptions(
      {
        allow: "autoplay; fullscreen; picture-in-picture",
        frameborder: "0",
      },
      options,
      { height: 268, width: 640 },
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
