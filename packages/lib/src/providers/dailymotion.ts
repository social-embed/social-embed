import type { EmbedProvider } from "../provider";

/**
 * A regular expression for matching DailyMotion video links.
 *
 * @remarks
 * This pattern handles optional protocols (`http`/`https`), optional `www.`, and
 * either `dailymotion.com/video/` (which may also have `/embed` in it) or `dai.ly/`.
 * It also supports an optional `?playlist=<id>` segment.
 *
 * **Credit**: [Stack Overflow](https://stackoverflow.com/a/50644701) (2021-03-14: Support `?playlist`)
 *
 * @example
 * ```
 * // Matches e.g. "https://www.dailymotion.com/video/x7znrd0"
 * // Also matches "dailymotion.com/embed/video/x7znrd0"
 * ```
 */
export const dailyMotionUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/;

/**
 * Extracts a DailyMotion video ID from a given URL string.
 *
 * @param url - The URL that may match DailyMotion patterns.
 * @returns The extracted DailyMotion video ID, or an empty string if none found.
 *
 * @example
 * ```ts
 * const dmId = getDailyMotionIdFromUrl("https://www.dailymotion.com/video/x7znrd0");
 * console.log(dmId); // "x7znrd0"
 * ```
 */
export const getDailyMotionIdFromUrl = (url: string): string => {
  return url.match(dailyMotionUrlRegex)?.[1] ?? "";
};

/**
 * Constructs an embeddable DailyMotion URL from the given ID.
 *
 * @param id - The DailyMotion video ID.
 * @returns A URL suitable for embedding in an `<iframe>`.
 *
 * @example
 * ```ts
 * console.log(getDailyMotionEmbedFromId("x7znrd0"));
 * // "https://www.dailymotion.com/embed/video/x7znrd0"
 * ```
 */
export const getDailyMotionEmbedFromId = (id: string): string => {
  // Additional query parameters like `?autoplay=1` may be appended if desired.
  return `https://www.dailymotion.com/embed/video/${id}`;
};

/**
 * A provider implementation for detecting and building embed URLs for DailyMotion videos.
 *
 * @remarks
 * This object satisfies the {@link EmbedProvider} interface, allowing usage in a registry or
 * with `convertUrlToEmbedUrl()`.
 */
export const DailyMotionProvider: EmbedProvider = {
  /**
   * Checks whether a given URL matches the DailyMotion pattern.
   *
   * @param url - The URL to test for DailyMotion compatibility.
   * @returns `true` if the URL belongs to DailyMotion, otherwise `false`.
   */
  canParseUrl(url: string): boolean {
    return dailyMotionUrlRegex.test(url);
  },

  /**
   * Builds an embed URL for a given DailyMotion ID.
   *
   * @param id - The DailyMotion video ID.
   * @returns A fully embeddable iframe URL for DailyMotion.
   */
  getEmbedUrlFromId(id: string): string {
    return getDailyMotionEmbedFromId(id);
  },

  /**
   * Extracts the ID from a recognized DailyMotion URL.
   *
   * @param url - The DailyMotion URL string.
   * @returns The video ID found in the URL.
   */
  getIdFromUrl(url: string): string {
    return getDailyMotionIdFromUrl(url);
  },
  /** @inheritdoc */
  name: "DailyMotion",
};
