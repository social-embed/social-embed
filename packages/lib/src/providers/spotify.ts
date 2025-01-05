import type { EmbedProvider } from "../provider";

/**
 * Supported Spotify content types:
 * - track
 * - album
 * - playlist
 * - artist
 * - show (podcast)
 * - episode (podcast episode)
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
 * Regex to match open/embed Spotify URLs:
 * e.g.
 *   https://open.spotify.com/track/1w4etUoKfql47wtTFq031f
 *   https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3
 *   https://open.spotify.com/show/5YEXv3C5fnMA3lFzNim4Ya
 *   https://open.spotify.com/embed/episode/4XplJhQEj1Qp6QzrbA5sYk
 *
 * @remarks
 * regex: derived from https://gist.github.com/TrevorJTClarke/a14c37db3c11ee23a700
 * Thank you @TrevorJTClarke
 */
export const spotifyUrlRegex = new RegExp(
  // Explanation:
  //  1. Optional protocol (https?), optional 'embed.' or 'open.'
  //  2. Must have "spotify.com/"
  //  3. Must capture one of SPOTIFY_TYPES
  //  4. Followed by "/" and a 22-character ID
  //  5. Optional ?si= param
  `^(?:(?:https?):)?(?:\\/\\/)?(?:embed\\.|open\\.)?spotify\\.com\\/(?:(${SPOTIFY_TYPES.join(
    "|",
  )})\\/)([-\\w]{22})(?:\\?si=[_\\-\\w]{22})?`,
);

/**
 * Regex to match Spotify URIs:
 * e.g.
 *   spotify:track:1w4etUoKfql47wtTFq031f
 *   spotify:album:1DFixLWuPkv3KT3TnV35m3
 *   spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ
 *   spotify:show:5YEXv3C5fnMA3lFzNim4Ya
 *   spotify:episode:4XplJhQEj1Qp6QzrbA5sYk
 */
export const spotifySymbolRegex = new RegExp(
  `^spotify:(?:(${SPOTIFY_TYPES.join("|")}):)([-\\w]{22})`,
);

/**
 * Extract [ID, type] from a Spotify URL or URI.
 *
 * Examples:
 *  - Input:  "https://open.spotify.com/track/1w4etUoKfql47wtTFq031f"
 *    Output: ["1w4etUoKfql47wtTFq031f", "track"]
 *  - Input:  "spotify:album:1DFixLWuPkv3KT3TnV35m3"
 *    Output: ["1DFixLWuPkv3KT3TnV35m3", "album"]
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
 * Build the Spotify embed URL from [id, type].
 * If no valid type is passed, defaults to "track" to avoid double slashes.
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
 * Provider object implementing your common EmbedProvider interface.
 * - canParseUrl() checks both web URL and spotify: URIs.
 * - getIdFromUrl() returns [id, type].
 * - getEmbedUrlFromId() calls getSpotifyEmbedUrlFromIdAndType,
 *   but you may also pass "type" in your calling code if you wish.
 */
export const SpotifyProvider: EmbedProvider = {
  name: "Spotify",

  canParseUrl(url: string) {
    return spotifyUrlRegex.test(url) || spotifySymbolRegex.test(url);
  },

  getIdFromUrl(url: string) {
    // returns [id, type]
    return getSpotifyIdAndTypeFromUrl(url);
  },

  getEmbedUrlFromId(id: string, ...args: unknown[]) {
    // If your code expects [id, type], pass them as .getEmbedUrlFromId(...myArray)
    // e.g. getEmbedUrlFromId(id, type)
    return getSpotifyEmbedUrlFromIdAndType(id, ...args);
  },
};
