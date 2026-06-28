import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type {
  SpotifyContentType,
  SpotifyData,
  SpotifySize,
  SpotifyTheme,
  SpotifyView,
} from "./types";

/**
 * Supported Spotify content types.
 */
export const SPOTIFY_TYPES: readonly SpotifyContentType[] = [
  "track",
  "album",
  "playlist",
  "artist",
  "show",
  "episode",
];

/**
 * Height lookup table for Spotify embeds by content type and size tier.
 *
 * @remarks
 * Heights are optimized for each content type:
 * - Tracks: Compact (80px) shows just controls, normal/large add artwork
 * - Albums/Playlists/Artists: Need more height for track listings
 * - Shows/Episodes: Podcast players with description visibility
 * - Coverart: Fixed heights for minimal cover art view
 * - Video: Fixed 624x351 for video podcasts
 *
 * @example
 * ```typescript
 * // Get height for a compact album player
 * const height = SPOTIFY_HEIGHTS.album.compact; // 152
 *
 * // Get video podcast dimensions
 * const { width, height } = SPOTIFY_HEIGHTS.video; // 624, 351
 * ```
 */
export const SPOTIFY_HEIGHTS = {
  album: { compact: 152, large: 500, normal: 352 },
  artist: { compact: 152, large: 500, normal: 352 },
  coverart: { compact: 80, large: 352, normal: 152 },
  episode: { compact: 152, large: 352, normal: 232 },
  playlist: { compact: 152, large: 500, normal: 352 },
  show: { compact: 152, large: 352, normal: 232 },
  track: { compact: 80, large: 352, normal: 152 },
  video: { height: 351, width: 624 },
} as const;

/**
 * Spotify-specific output options.
 *
 * @remarks
 * These options extend the base OutputOptions with Spotify-specific features:
 * - Size tiers for different player heights
 * - Theme selection (dark/light)
 * - View mode (list/coverart)
 * - Start time for podcasts
 *
 * @example
 * ```typescript
 * const options: SpotifyOutputOptions = {
 *   size: "compact",
 *   theme: "dark",
 *   view: "coverart",
 * };
 *
 * const output = SpotifyMatcher.toOutput(data, options);
 * ```
 */
export interface SpotifyOutputOptions extends OutputOptions {
  /**
   * Size tier for the embed.
   * Auto-detected from content type if not specified.
   */
  size?: SpotifySize;

  /**
   * Start time in seconds (podcasts only).
   * Maps to `t=` URL parameter.
   */
  start?: number;

  /**
   * Theme (dark or light).
   * Maps to `theme=0` (dark) or `theme=1` (light).
   */
  theme?: SpotifyTheme;

  /**
   * View mode (list or coverart).
   * Maps to `view=coverart` URL parameter.
   */
  view?: SpotifyView;
}

/**
 * Get the default size tier for a Spotify content type.
 *
 * @param contentType - The Spotify content type
 * @returns Default size tier for auto-detection
 *
 * @remarks
 * - Tracks default to "compact" for minimal display
 * - Albums/playlists/artists default to "normal" for tracklist visibility
 * - Podcasts default to "normal" for description visibility
 *
 * @example
 * ```typescript
 * getSpotifyDefaultSize("track")    // "compact"
 * getSpotifyDefaultSize("album")    // "normal"
 * getSpotifyDefaultSize("episode")  // "normal"
 * ```
 */
export function getSpotifyDefaultSize(
  contentType: SpotifyContentType,
): SpotifySize {
  switch (contentType) {
    case "track":
      return "compact";
    default:
      return "normal";
  }
}

/**
 * Get the height for a Spotify embed configuration.
 *
 * @param contentType - The Spotify content type
 * @param size - Size tier (auto-detected if not specified)
 * @param options - Optional view and video settings
 * @returns Height in pixels
 *
 * @remarks
 * Priority order:
 * 1. Video podcasts use fixed 351px height
 * 2. Coverart view uses coverart heights
 * 3. Standard heights by content type and size
 *
 * @example
 * ```typescript
 * getSpotifyHeight("track", "compact")                      // 80
 * getSpotifyHeight("album", "large")                        // 500
 * getSpotifyHeight("episode", "normal", { video: true })    // 351
 * getSpotifyHeight("track", "normal", { view: "coverart" }) // 152
 * ```
 */
export function getSpotifyHeight(
  contentType: SpotifyContentType,
  size?: SpotifySize,
  options?: { video?: boolean; view?: SpotifyView },
): number {
  // Video podcasts have fixed dimensions
  if (options?.video && (contentType === "show" || contentType === "episode")) {
    return SPOTIFY_HEIGHTS.video.height;
  }

  // Coverart view has its own heights
  if (options?.view === "coverart") {
    const effectiveSize = size ?? "normal";
    return SPOTIFY_HEIGHTS.coverart[effectiveSize];
  }

  // Standard heights by content type and size
  const effectiveSize = size ?? getSpotifyDefaultSize(contentType);
  return SPOTIFY_HEIGHTS[contentType][effectiveSize];
}

/**
 * Get the width for a Spotify embed.
 *
 * @param options - Optional video flag
 * @returns Width (number for video, "100%" for standard)
 *
 * @remarks
 * Video podcasts use fixed 624px width; all other embeds use 100%.
 *
 * @example
 * ```typescript
 * getSpotifyWidth()                  // "100%"
 * getSpotifyWidth({ video: true })   // 624
 * ```
 */
export function getSpotifyWidth(options?: {
  video?: boolean;
}): string | number {
  if (options?.video) {
    return SPOTIFY_HEIGHTS.video.width;
  }
  return "100%";
}

/**
 * Regex for Spotify web URLs with video detection.
 *
 * @remarks
 * Matches:
 * - `https://open.spotify.com/track/ID`
 * - `https://open.spotify.com/album/ID`
 * - `https://open.spotify.com/episode/ID/video`
 * - `https://open.spotify.com/show/ID?theme=0`
 *
 * Captures:
 * - Group 1: Content type (track, album, etc.)
 * - Group 2: ID (22 characters)
 * - Group 3: Optional /video suffix
 *
 * ID is 22 characters.
 */
const SPOTIFY_URL_REGEX = new RegExp(
  `^(?:https?:)?(?://)?(?:embed\\.)?(?:open\\.)?spotify\\.com/(${SPOTIFY_TYPES.join(
    "|",
  )})/([a-zA-Z0-9_-]{22})(/video)?(?:\\?.*)?$`,
);

/**
 * Regex for Spotify URIs.
 *
 * @remarks
 * Matches:
 * - `spotify:track:ID`
 * - `spotify:album:ID`
 * - etc.
 *
 * Note: URIs don't support video suffix or theme.
 */
const SPOTIFY_URI_REGEX = new RegExp(
  `^spotify:(${SPOTIFY_TYPES.join("|")}):([a-zA-Z0-9_-]{22})$`,
);

/**
 * Spotify matcher for audio embeds.
 *
 * @remarks
 * - Supports web URLs and `spotify:` URIs
 * - Handles all content types: track, album, playlist, artist, show, episode
 * - Default dimensions: 100% width x 352 height
 *
 * @example
 * ```typescript
 * const registry = MatcherRegistry.create([SpotifyMatcher]);
 *
 * // Web URL
 * const result = registry.match("https://open.spotify.com/track/abc123...");
 * if (result.ok) {
 *   console.log(result.data); // { id: "abc123...", contentType: "track" }
 * }
 *
 * // Spotify URI
 * const result2 = registry.match("spotify:album:xyz789...");
 * if (result2.ok) {
 *   console.log(result2.data); // { id: "xyz789...", contentType: "album" }
 * }
 * ```
 */
export const SpotifyMatcher: UrlMatcher<"Spotify", SpotifyData> = {
  canMatch(ctx: MatchContext): boolean {
    // Check for spotify: URI scheme
    if (ctx.scheme === "spotify") {
      return true;
    }
    // Check for spotify.com domain
    return hostMatches(ctx, this.domains ?? []);
  },

  domains: ["spotify.com", "open.spotify.com", "embed.spotify.com"],
  name: "Spotify",

  parse(ctx: MatchContext): Result<SpotifyData> {
    // Try web URL first
    const urlMatch = ctx.raw.match(SPOTIFY_URL_REGEX);
    if (urlMatch) {
      const contentType = urlMatch[1] as SpotifyContentType;
      const id = urlMatch[2];
      const hasVideo = urlMatch[3] === "/video";

      if (id && SPOTIFY_TYPES.includes(contentType)) {
        const data: SpotifyData = { contentType, id };

        // Detect video for podcast content (shows and episodes only)
        if (hasVideo && (contentType === "show" || contentType === "episode")) {
          data.video = true;
        }

        // Extract theme from URL query params
        const themeParam = ctx.parsed.searchParams?.get("theme");
        if (themeParam === "0") {
          data.theme = "dark";
        } else if (themeParam === "1") {
          data.theme = "light";
        }

        return ok(data);
      }
    }

    // Try spotify: URI (no video or theme support)
    const uriMatch = ctx.raw.match(SPOTIFY_URI_REGEX);
    if (uriMatch) {
      const contentType = uriMatch[1] as SpotifyContentType;
      const id = uriMatch[2];
      if (id && SPOTIFY_TYPES.includes(contentType)) {
        return ok({ contentType, id });
      }
    }

    return noMatch("No valid Spotify URL or URI pattern matched");
  },

  schemes: ["spotify"],

  supportsPrivacyMode: false,

  toEmbedUrl(
    data: SpotifyData,
    options?: PrivacyOptions & SpotifyOutputOptions,
  ): string {
    const baseUrl = `https://open.spotify.com/embed/${data.contentType}/${data.id}`;
    const params = new URLSearchParams();

    // Theme: prefer options, fall back to data (extracted from input URL)
    const theme = options?.theme ?? data.theme;
    if (theme === "dark") {
      params.set("theme", "0");
    } else if (theme === "light") {
      params.set("theme", "1");
    }

    // View mode
    if (options?.view === "coverart") {
      params.set("view", "coverart");
    }

    // Start time (podcasts only)
    if (
      options?.start !== undefined &&
      options.start > 0 &&
      (data.contentType === "show" || data.contentType === "episode")
    ) {
      params.set("t", String(Math.floor(options.start)));
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },

  toOutput(
    data: SpotifyData,
    options?: OutputOptions & PrivacyOptions & SpotifyOutputOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);

    // Determine dimensions using utility functions
    const isVideo =
      data.video &&
      (data.contentType === "show" || data.contentType === "episode");

    let width: string | number;
    let height: number;

    if (isVideo) {
      // Video podcasts use fixed 624x351 dimensions
      width = getSpotifyWidth({ video: true });
      height = getSpotifyHeight(data.contentType, options?.size, {
        video: true,
      });
    } else if (options?.height !== undefined) {
      // Explicit height provided - use it
      width = options.width ?? "100%";
      if (typeof options.height === "string") {
        const parsed = Number.parseInt(options.height, 10);
        // Fall back to calculated default if parseInt returns NaN (e.g., "auto")
        height = Number.isNaN(parsed)
          ? getSpotifyHeight(data.contentType, options?.size, {
              view: options?.view,
            })
          : parsed;
      } else {
        height = options.height;
      }
    } else {
      // Auto-calculate height based on content type and size
      width = options?.width ?? "100%";
      height = getSpotifyHeight(data.contentType, options?.size, {
        view: options?.view,
      });
    }

    const attrs = mergeOutputOptions(
      {
        allow:
          "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
        allowtransparency: "true",
        frameborder: "0",
        loading: "lazy",
      },
      options,
      { height, width },
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
