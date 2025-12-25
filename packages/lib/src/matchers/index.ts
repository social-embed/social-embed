/**
 * Built-in URL matchers for common embed providers.
 *
 * @remarks
 * All matchers are SSR-safe and can be used in Node.js without DOM.
 *
 * @example
 * ```typescript
 * import { MatcherRegistry, YouTubeMatcher, SpotifyMatcher } from "@social-embed/lib";
 *
 * // Use specific matchers
 * const registry = MatcherRegistry.create([YouTubeMatcher, SpotifyMatcher]);
 *
 * // Or use all defaults
 * const fullRegistry = MatcherRegistry.withDefaults();
 * ```
 */

export { DailyMotionMatcher } from "./dailymotion";
export { EdPuzzleMatcher } from "./edpuzzle";
export { LoomMatcher } from "./loom";
export type { SpotifyOutputOptions } from "./spotify";
export {
  getSpotifyDefaultSize,
  getSpotifyHeight,
  getSpotifyWidth,
  SPOTIFY_HEIGHTS,
  SPOTIFY_TYPES,
  SpotifyMatcher,
} from "./spotify";
// Export data types
export type {
  DailyMotionData,
  EdPuzzleData,
  LoomData,
  SpotifyContentType,
  SpotifyData,
  SpotifySize,
  SpotifyTheme,
  SpotifyView,
  VimeoData,
  WistiaData,
  YouTubeData,
} from "./types";
export { VimeoMatcher } from "./vimeo";
export { WistiaMatcher } from "./wistia";
// Export all matchers
export { YouTubeMatcher } from "./youtube";

import { DailyMotionMatcher } from "./dailymotion";
import { EdPuzzleMatcher } from "./edpuzzle";
import { LoomMatcher } from "./loom";
import { SpotifyMatcher } from "./spotify";
import { VimeoMatcher } from "./vimeo";
import { WistiaMatcher } from "./wistia";
// Re-export for convenience
import { YouTubeMatcher } from "./youtube";

/**
 * All built-in matchers.
 * Used by MatcherRegistry.withDefaults().
 */
export const ALL_MATCHERS = [
  YouTubeMatcher,
  SpotifyMatcher,
  VimeoMatcher,
  DailyMotionMatcher,
  LoomMatcher,
  WistiaMatcher,
  EdPuzzleMatcher,
] as const;
