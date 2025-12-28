/**
 * Provider-specific data types.
 *
 * @remarks
 * Each matcher parses URLs into a specific data structure.
 * These types enable type-safe access to parsed data.
 */

/**
 * YouTube video data.
 */
export interface YouTubeData {
  /** 11-character YouTube video ID */
  videoId: string;
}

/**
 * Spotify content types.
 */
export type SpotifyContentType =
  | "track"
  | "album"
  | "playlist"
  | "artist"
  | "show"
  | "episode";

/**
 * Spotify embed size tiers.
 *
 * @remarks
 * - `compact`: Minimal player (80px for tracks, 152px for others)
 * - `normal`: Standard player (152px for tracks, 352px for albums/playlists)
 * - `large`: Full-featured player with more details (352-500px)
 */
export type SpotifySize = "compact" | "normal" | "large";

/**
 * Spotify embed theme.
 *
 * @remarks
 * Maps to URL param: dark → theme=0, light → theme=1
 */
export type SpotifyTheme = "dark" | "light";

/**
 * Spotify embed view mode.
 *
 * @remarks
 * - `list`: Standard view showing track listings (default)
 * - `coverart`: Minimal view emphasizing album/track artwork
 */
export type SpotifyView = "list" | "coverart";

/**
 * Spotify content data.
 */
export interface SpotifyData {
  /** Content type (track, album, playlist, etc.) */
  contentType: SpotifyContentType;

  /** 22-character Spotify ID */
  id: string;

  /**
   * Theme extracted from input URL.
   * Preserved so it can be passed through to embed URL.
   */
  theme?: SpotifyTheme;

  /**
   * Whether this is a video podcast.
   * Detected from /video suffix in URL for show/episode content.
   */
  video?: boolean;
}

/**
 * Vimeo video data.
 */
export interface VimeoData {
  /** Numeric Vimeo video ID */
  videoId: string;
}

/**
 * DailyMotion video data.
 */
export interface DailyMotionData {
  /** 7-character DailyMotion video ID */
  videoId: string;
}

/**
 * Loom video data.
 */
export interface LoomData {
  /** 32-character Loom share ID */
  videoId: string;
}

/**
 * Wistia video data.
 */
export interface WistiaData {
  /** 10-character Wistia media ID */
  videoId: string;
}

/**
 * EdPuzzle media data.
 */
export interface EdPuzzleData {
  /** 24-character EdPuzzle media ID */
  mediaId: string;
}
