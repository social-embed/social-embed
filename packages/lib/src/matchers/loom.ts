import { defineIframeMatcher } from "../factories/iframe";

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
 * - Default dimensions: 100% width, responsive height
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([LoomMatcher]);
 * const result = registry.match("https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604");
 * if (result.ok) {
 *   console.log(result.data); // { id: "e883f70b219a49f6ba7fbeac71a72604" }
 * }
 * ```
 */
export const LoomMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 360,
    width: 640,
  },

  domains: ["loom.com"],

  embedUrl: (id) => `https://www.loom.com/embed/${id}`,

  iframeAttributes: {},
  name: "Loom",

  patterns: [...LOOM_PATTERNS],

  supportsPrivacyMode: false,
});
