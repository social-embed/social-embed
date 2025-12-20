import { defineIframeMatcher } from "../factories/iframe";

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
 * - Default dimensions: 620x349
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([WistiaMatcher]);
 * const result = registry.match("https://support.wistia.com/medias/26sk4lmiix");
 * if (result.ok) {
 *   console.log(result.data); // { id: "26sk4lmiix" }
 * }
 * ```
 */
export const WistiaMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 349,
    width: 620,
  },

  domains: ["wistia.com", "wi.st", "fast.wistia.net"],

  embedUrl: (id) => `https://fast.wistia.net/embed/iframe/${id}`,

  iframeAttributes: {
    allowtransparency: "true",
    scrolling: "no",
  },
  name: "Wistia",

  patterns: [...WISTIA_PATTERNS],

  supportsPrivacyMode: false,
});
