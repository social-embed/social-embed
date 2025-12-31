/**
 * URL pools for playground reroll functionality.
 * Each provider has a list of example URLs that can be randomly selected.
 */

export type ProviderType =
  | "youtube"
  | "youtube-shorts"
  | "vimeo"
  | "spotify-track"
  | "spotify-playlist"
  | "dailymotion"
  | "loom"
  | "wistia";

/**
 * URL pools per provider - used for random URL selection in playground.
 * Add more URLs to increase variety when rerolling.
 */
export const URL_POOLS: Record<ProviderType, readonly string[]> = {
  dailymotion: [
    "https://www.dailymotion.com/video/x7znrd0",
    // TODO: Add more DailyMotion URLs
  ],
  loom: [
    "https://www.loom.com/share/6670e3eba3c84dc09ada8306c7138075",
    // TODO: Add more Loom URLs
  ],
  "spotify-playlist": [
    "https://open.spotify.com/playlist/37i9dQZF1DZ06evO0AI4xi",
    // TODO: Add more Spotify playlist URLs
  ],
  "spotify-track": [
    "https://open.spotify.com/track/7Ca8EuTCyU3pjJR4TNOXqs",
    // TODO: Add more Spotify track URLs
  ],
  vimeo: [
    "https://vimeo.com/134668506",
    // TODO: Add more Vimeo URLs
  ],
  wistia: [
    "https://support.wistia.com/medias/26sk4lmiix",
    // TODO: Add more Wistia URLs
  ],
  youtube: [
    "https://www.youtube.com/watch?v=EJxwWpaGoJs",
    // TODO: Add more YouTube URLs
  ],
  "youtube-shorts": [
    "https://www.youtube.com/shorts/abc123",
    // TODO: Add more YouTube Shorts URLs
  ],
};

/**
 * URL patterns for detecting provider type from a URL.
 */
export const PROVIDER_PATTERNS: Record<ProviderType, RegExp> = {
  dailymotion: /dailymotion\.com\/video\//i,
  loom: /loom\.com\/share\//i,
  "spotify-playlist": /open\.spotify\.com\/playlist\//i,
  "spotify-track": /open\.spotify\.com\/track\//i,
  vimeo: /vimeo\.com\/\d+/i,
  wistia: /wistia\.com\/medias\//i,
  youtube: /(?:youtube\.com\/watch|youtu\.be\/)/i,
  "youtube-shorts": /youtube\.com\/shorts\//i,
};

/**
 * Order matters - youtube-shorts must be checked before youtube.
 */
export const PROVIDER_CHECK_ORDER: readonly ProviderType[] = [
  "youtube-shorts",
  "youtube",
  "vimeo",
  "spotify-track",
  "spotify-playlist",
  "dailymotion",
  "loom",
  "wistia",
];
