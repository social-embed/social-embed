import type { EmbedProvider } from "../provider";

/**
 * Regex matcher for YouTube URLs.
 *
 * @remarks
 * This pattern captures the 11-character YouTube video ID from multiple formats:
 * - `https://www.youtube.com/watch?v=...`
 * - `https://www.youtube.com/shorts/...` (YouTube Shorts)
 * - `https://youtu.be/...`
 * - Variants with or without `www.` / `-nocookie`
 *
 * **Credit**: [Stack Overflow](https://stackoverflow.com/a/42442074) (modified to support Shorts)
 */
export const youTubeUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)(?:\/(?:watch\?v=|shorts\/)?)?([a-zA-Z0-9_-]{11})(?:[?&#]|$)/;

/**
 * Regex to detect YouTube Shorts URLs specifically.
 */
export const youTubeShortsRegex = /youtube\.com\/shorts\//i;

/**
 * Checks if a URL is a YouTube Shorts URL.
 *
 * @param url - The URL to check.
 * @returns `true` if the URL is a YouTube Shorts URL, `false` otherwise.
 *
 * @example
 * ```ts
 * isYouTubeShortsUrl("https://www.youtube.com/shorts/eWasNsSa42s"); // true
 * isYouTubeShortsUrl("https://www.youtube.com/watch?v=abc123"); // false
 * ```
 */
export const isYouTubeShortsUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return youTubeShortsRegex.test(url);
};

/**
 * Default dimensions for YouTube Shorts embeds (9:16 portrait aspect ratio).
 *
 * @remarks
 * YouTube Shorts are vertical videos with a 9:16 aspect ratio.
 * These dimensions provide a good default for embedding Shorts.
 */
export const YOUTUBE_SHORTS_DIMENSIONS = {
  height: 616,
  width: 347,
} as const;

/**
 * Extracts an 11-character YouTube video ID from a given URL string.
 *
 * @param url - The string potentially representing a YouTube link (can be `undefined`).
 * @returns The extracted video ID, or an empty string if no match is found.
 *
 * @example
 * ```ts
 * // With a watch URL:
 * getYouTubeIdFromUrl("https://www.youtube.com/watch?v=FTQbiNvZqaY"); // "FTQbiNvZqaY"
 *
 * // With a shortlink:
 * getYouTubeIdFromUrl("https://youtu.be/FTQbiNvZqaY"); // "FTQbiNvZqaY"
 *
 * // With a Shorts URL:
 * getYouTubeIdFromUrl("https://www.youtube.com/shorts/eWasNsSa42s"); // "eWasNsSa42s"
 * ```
 *
 * @remarks
 * If `url` is `undefined` or not a valid YouTube link, returns an empty string.
 */
export const getYouTubeIdFromUrl = (url: string | undefined): string => {
  if (url) {
    // credit: https://stackoverflow.com/a/42442074
    return url.match(youTubeUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Constructs a YouTube embed URL from a 11-character video ID.
 *
 * @param id - The YouTube video ID.
 * @returns An embeddable URL in the form `https://www.youtube.com/embed/<id>`.
 *
 * @example
 * ```ts
 * console.log(getYouTubeEmbedUrlFromId("FTQbiNvZqaY"));
 * // "https://www.youtube.com/embed/FTQbiNvZqaY"
 * ```
 */
export const getYouTubeEmbedUrlFromId = (id: string | undefined): string => {
  return `https://www.youtube.com/embed/${id}`;
};

/**
 * A provider implementation for YouTube, satisfying the {@link EmbedProvider} interface.
 *
 * @remarks
 * - `canParseUrl()` detects if a URL belongs to YouTube using {@link youTubeUrlRegex}.
 * - `getIdFromUrl()` extracts the YouTube video ID (11 chars).
 * - `getEmbedUrlFromId()` builds a playable embed URL.
 */
export const YouTubeProvider: EmbedProvider = {
  /**
   * Determines if a given URL is recognized as a YouTube link.
   *
   * @param url - The string to evaluate.
   * @returns `true` if the URL matches YouTube patterns; otherwise `false`.
   */
  canParseUrl(url: string) {
    return youTubeUrlRegex.test(url);
  },

  /**
   * Builds a full YouTube embed URL (e.g. `https://www.youtube.com/embed/<id>`).
   *
   * @param id - The 11-char YouTube video ID.
   * @returns A fully embeddable `<iframe>` URL for YouTube.
   */
  getEmbedUrlFromId(id: string) {
    return getYouTubeEmbedUrlFromId(id);
  },

  /**
   * Extracts the 11-char YouTube ID from a recognized YouTube URL.
   *
   * @param url - The potential YouTube link.
   * @returns The extracted video ID or an empty string if none found.
   */
  getIdFromUrl(url: string) {
    return getYouTubeIdFromUrl(url);
  },
  /** @inheritdoc */
  name: "YouTube",
};
