import { defineIframeMatcher } from "../factories/iframe";

/**
 * EdPuzzle URL patterns.
 *
 * @remarks
 * Matches:
 * - `https://edpuzzle.com/media/MEDIA_ID`
 * - `https://www.edpuzzle.com/media/MEDIA_ID`
 *
 * Media ID is 24 characters (alphanumeric).
 */
const EDPUZZLE_PATTERNS = [
  // Media URL
  /edpuzzle\.com\/media\/([-\w]+)/,
] as const;

/**
 * EdPuzzle matcher for interactive video embeds.
 *
 * @remarks
 * - Supports media URLs
 * - Default dimensions: 470x404
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([EdPuzzleMatcher]);
 * const result = registry.match("https://edpuzzle.com/media/606b413369971e424ec6021e");
 * if (result.ok) {
 *   console.log(result.data); // { id: "606b413369971e424ec6021e" }
 * }
 * ```
 */
export const EdPuzzleMatcher = defineIframeMatcher({
  defaultDimensions: {
    height: 404,
    width: 470,
  },

  domains: ["edpuzzle.com"],

  embedUrl: (id) => `https://edpuzzle.com/embed/media/${id}`,

  iframeAttributes: {},
  name: "EdPuzzle",

  patterns: [...EDPUZZLE_PATTERNS],

  supportsPrivacyMode: false,
});
