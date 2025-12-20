import { hostMatches, type MatchContext } from "../context";
import type { UrlMatcher } from "../matcher";
import {
  type EmbedOutput,
  mergeOutputOptions,
  type OutputOptions,
  type PrivacyOptions,
} from "../output";
import { noMatch, ok, type Result } from "../result";
import type { SpotifyContentType, SpotifyData } from "./types";

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
 * Regex for Spotify web URLs.
 *
 * @remarks
 * Matches:
 * - `https://open.spotify.com/track/ID`
 * - `https://open.spotify.com/album/ID`
 * - `https://open.spotify.com/playlist/ID`
 * - etc.
 *
 * ID is 22 characters.
 */
const SPOTIFY_URL_REGEX = new RegExp(
  `^(?:https?:)?(?://)?(?:embed\\.)?(?:open\\.)?spotify\\.com/(${SPOTIFY_TYPES.join(
    "|",
  )})/([a-zA-Z0-9_-]{22})(?:\\?si=[a-zA-Z0-9_-]+)?`,
);

/**
 * Regex for Spotify URIs.
 *
 * @remarks
 * Matches:
 * - `spotify:track:ID`
 * - `spotify:album:ID`
 * - etc.
 */
const SPOTIFY_URI_REGEX = new RegExp(
  `^spotify:(${SPOTIFY_TYPES.join("|")}):([a-zA-Z0-9_-]{22})`,
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
      if (id && SPOTIFY_TYPES.includes(contentType)) {
        return ok({ contentType, id });
      }
    }

    // Try spotify: URI
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

  toEmbedUrl(data: SpotifyData, _options?: PrivacyOptions): string {
    return `https://open.spotify.com/embed/${data.contentType}/${data.id}`;
  },

  toOutput(
    data: SpotifyData,
    options?: OutputOptions & PrivacyOptions,
  ): EmbedOutput {
    const src = this.toEmbedUrl(data, options);
    const attrs = mergeOutputOptions(
      {
        allow: "encrypted-media",
        allowtransparency: "true",
        frameborder: "0",
      },
      options,
      { height: 352, width: "100%" },
    );

    // For tracks, use compact player
    if (data.contentType === "track" && !options?.height) {
      attrs.height = "80";
    }

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
