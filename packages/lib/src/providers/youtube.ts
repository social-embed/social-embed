import type { EmbedProvider } from "../provider";

/**
 * Regex matcher for YouTube URLs.
 *
 * @remarks
 * This pattern captures the 11-character YouTube video ID from multiple formats:
 * - `https://www.youtube.com/watch?v=...`
 * - `https://youtu.be/...`
 * - Variants with or without `www.` / `-nocookie`
 *
 * **Credit**: [Stack Overflow](https://stackoverflow.com/a/42442074)
 */
export const youTubeUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?.com|youtu.be)(?:\/watch\?v)?[=/]([a-zA-Z0-9_-]{11})(?:\\?|=|&|$)/;

/**
 * Extracts an 11-character YouTube video ID from a given URL string.
 *
 * @param url - The string potentially representing a YouTube link (can be `undefined`).
 * @returns The extracted video ID, or an empty string if no match is found.
 *
 * @example
 * ```ts
 * // With a watch URL:
 * const videoId = getYouTubeIdFromUrl("https://www.youtube.com/watch?v=FTQbiNvZqaY");
 * console.log(videoId); // "FTQbiNvZqaY"
 *
 * // With a shortlink:
 * const shortId = getYouTubeIdFromUrl("https://youtu.be/FTQbiNvZqaY");
 * console.log(shortId); // "FTQbiNvZqaY"
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
  /** @inheritdoc */
  name: "YouTube",

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
   * Extracts the 11-char YouTube ID from a recognized YouTube URL.
   *
   * @param url - The potential YouTube link.
   * @returns The extracted video ID or an empty string if none found.
   */
  getIdFromUrl(url: string) {
    return getYouTubeIdFromUrl(url);
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
};
