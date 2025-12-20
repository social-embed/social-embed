import { defineIframeMatcher } from "../factories/iframe";

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
 * - Default dimensions: 640x360
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([VimeoMatcher]);
 * const result = registry.match("https://vimeo.com/134668506");
 * if (result.ok) {
 *   console.log(result.data); // { id: "134668506" }
 * }
 * ```
 */
export const VimeoMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 360,
    width: 640,
  },

  domains: ["vimeo.com", "player.vimeo.com"],

  embedUrl: (id) => `https://player.vimeo.com/video/${id}`,

  iframeAttributes: {
    allow: "autoplay; fullscreen; picture-in-picture",
  },
  name: "Vimeo",

  patterns: [...VIMEO_PATTERNS],

  supportsPrivacyMode: false,
});
