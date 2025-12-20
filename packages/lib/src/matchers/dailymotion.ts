import { defineIframeMatcher } from "../factories/iframe";

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
 * - Supports standard, embed, and short URLs
 * - Default dimensions: 560x315
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([DailyMotionMatcher]);
 * const result = registry.match("https://www.dailymotion.com/video/x7znrd0");
 * if (result.ok) {
 *   console.log(result.data); // { id: "x7znrd0" }
 * }
 * ```
 */
export const DailyMotionMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 315,
    width: 560,
  },

  domains: ["dailymotion.com", "dai.ly"],

  embedUrl: (id) => `https://www.dailymotion.com/embed/video/${id}`,

  iframeAttributes: {
    allow: "autoplay",
  },
  name: "DailyMotion",

  patterns: [...DAILYMOTION_PATTERNS],

  supportsPrivacyMode: false,
});
