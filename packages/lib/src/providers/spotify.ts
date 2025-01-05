import type { EmbedProvider } from "../provider";

/**
 * A list of supported Spotify content types recognized by the library:
 * - track
 * - album
 * - playlist
 * - artist
 * - show (podcast)
 * - episode (podcast episode)
 *
 * @remarks
 * These values are used to parse and build embeddable Spotify URLs for each specific content type.
 */
export const SPOTIFY_TYPES = [
  "track",
  "album",
  "playlist",
  "artist",
  "show",
  "episode",
] as const;

type SpotifyType = (typeof SPOTIFY_TYPES)[number];

/**
 * A regex that matches open or embed-style Spotify URLs.
 *
 * @example
 * - `https://open.spotify.com/track/1w4etUoKfql47wtTFq031f`
 * - `https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3`
 * - `https://open.spotify.com/show/5YEXv3C5fnMA3lFzNim4Ya`
 * - `https://open.spotify.com/embed/episode/4XplJhQEj1Qp6QzrbA5sYk`
 *
 * @remarks
 * - Derived from [a gist by TrevorJTClarke](https://gist.github.com/TrevorJTClarke/a14c37db3c11ee23a700).
 *   Thank you, **@TrevorJTClarke**!
 *
 * **Pattern Explanation**:
 * 1. Optional protocol (`https?`)
 * 2. Optional `embed.` or `open.` subdomain
 * 3. Must have `"spotify.com/"`
 * 4. Captures one of the recognized `SPOTIFY_TYPES`
 * 5. Followed by a 22-character ID
 * 6. Optionally captures a `?si=` param
 */
export const spotifyUrlRegex = new RegExp(
  `^(?:(?:https?):)?(?:\\/\\/)?(?:embed\\.|open\\.)?spotify\\.com\\/(?:(${SPOTIFY_TYPES.join(
    "|",
  )})\\/)([-\\w]{22})(?:\\?si=[_\\-\\w]{22})?`,
);

/**
 * A regex that matches Spotify URIs, such as:
 * - `spotify:track:1w4etUoKfql47wtTFq031f`
 * - `spotify:album:1DFixLWuPkv3KT3TnV35m3`
 * - `spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ`
 * - `spotify:show:5YEXv3C5fnMA3lFzNim4Ya`
 * - `spotify:episode:4XplJhQEj1Qp6QzrbA5sYk`
 *
 * @remarks
 * Captures both the content type and the 22-character ID.
 */
export const spotifySymbolRegex = new RegExp(
  `^spotify:(?:(${SPOTIFY_TYPES.join("|")}):)([-\\w]{22})`,
);

/**
 * Extracts the Spotify ID and type from a given Spotify URL or URI.
 *
 * @param url - A Spotify web URL or `spotify:` URI.
 * @returns A tuple `[id, type]`, where `id` is the 22-char ID and `type` is one of `track`, `album`, `playlist`, `artist`, `show`, or `episode`.
 * @example
 * ```ts
 * // For "https://open.spotify.com/track/1w4etUoKfql47wtTFq031f"
 * // => ["1w4etUoKfql47wtTFq031f", "track"]
 *
 * // For "spotify:album:1DFixLWuPkv3KT3TnV35m3"
 * // => ["1DFixLWuPkv3KT3TnV35m3", "album"]
 * ```
 *
 * @remarks
 * Returns `["", ""]` if there's no valid match.
 */
export function getSpotifyIdAndTypeFromUrl(url: string): [string, string] {
  // Attempt to match both open URLs and spotify: URIs
  const match = url.match(spotifyUrlRegex) || url.match(spotifySymbolRegex);
  if (!match) {
    // Return ["", ""] if there's no valid match
    return ["", ""];
  }

  // match[1] => type (track/album/playlist/artist/show/episode)
  // match[2] => the 22-char ID
  const spotifyType = match[1] ?? "";
  const spotifyId = match[2] ?? "";
  return [spotifyId, spotifyType];
}

/**
 * Constructs an embeddable Spotify URL from an ID and optional content type.
 *
 * @param id - The 22-character Spotify ID (e.g. track/album/playlist ID).
 * @param args - The first element in `args` may be the content type. If not provided or invalid, defaults to `"track"`.
 * @returns A valid embed URL, e.g. `"https://open.spotify.com/embed/track/12345"`.
 *
 * @remarks
 * - If a recognized `SpotifyType` isn't passed, defaults to `track`.
 * - The function is often used inside the {@link SpotifyProvider}.
 *
 * @example
 * ```ts
 * // Normally you'd pass [id, type] as args:
 * console.log(getSpotifyEmbedUrlFromIdAndType("7ouMYWpwJ422jRcDASZB7P", "track"));
 * // => "https://open.spotify.com/embed/track/7ouMYWpwJ422jRcDASZB7P"
 * ```
 */
export function getSpotifyEmbedUrlFromIdAndType(
  id: string,
  ...args: unknown[]
): string {
  // The second argument, if any, is the type
  const typeCandidate = typeof args[0] === "string" ? args[0] : "";
  const finalType = SPOTIFY_TYPES.includes(typeCandidate as SpotifyType)
    ? typeCandidate
    : "track";

  return `https://open.spotify.com/embed/${finalType}/${id}`;
}

/**
 * A provider object implementing the {@link EmbedProvider} interface for Spotify.
 *
 * @remarks
 * - `canParseUrl()` checks both web and `spotify:` URIs.
 * - `getIdFromUrl()` returns `[id, type]`.
 * - `getEmbedUrlFromId()` calls {@link getSpotifyEmbedUrlFromIdAndType}.
 *
 * This provider allows handling any recognized Spotify media (tracks, albums, playlists, artists, shows, episodes).
 */
export const SpotifyProvider: EmbedProvider = {
  /** @inheritdoc */
  name: "Spotify",

  /**
   * Determines if the given URL or URI matches a recognized Spotify pattern.
   *
   * @param url - A string that could point to a Spotify resource.
   * @returns `true` if the pattern matches, otherwise `false`.
   */
  canParseUrl(url: string): boolean {
    return spotifyUrlRegex.test(url) || spotifySymbolRegex.test(url);
  },

  /**
   * Extracts the ID and type from a recognized Spotify URL or `spotify:` URI.
   *
   * @param url - The Spotify link.
   * @returns `[id, type]` if matched, otherwise `["", ""]`.
   */
  getIdFromUrl(url: string) {
    return getSpotifyIdAndTypeFromUrl(url);
  },

  /**
   * Builds an embeddable Spotify URL from an ID plus optional arguments (e.g. type).
   *
   * @param id - The 22-char Spotify ID.
   * @param args - The first arg may be the content type (`track`, `album`, `playlist`, etc.).
   * @returns The final embed URL, e.g. `"https://open.spotify.com/embed/track/<id>"`.
   */
  getEmbedUrlFromId(id: string, ...args: unknown[]) {
    return getSpotifyEmbedUrlFromIdAndType(id, ...args);
  },
};
