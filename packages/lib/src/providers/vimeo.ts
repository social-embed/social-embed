import type { EmbedProvider } from "../provider";

/**
 * A regex pattern that matches Vimeo video URLs.
 *
 * @remarks
 * Credit: [Stack Overflow](https://stackoverflow.com/a/50777192) (2021-03-14: modified / fixed to ignore unused groups).
 * This pattern handles optional protocols (`https?://`), optional subdomains (`www.`, `player.`), and various Vimeo URL structures:
 * - `vimeo.com/channels/…`
 * - `vimeo.com/groups/…/videos/…`
 * - `vimeo.com/video/…`
 * - `vimeo.com/…`
 */
export const vimeoUrlRegex =
  /(?:(?:https?):)?(?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

/**
 * Extracts the numeric Vimeo video ID from a given URL.
 *
 * @param url - The Vimeo URL string.
 * @returns The extracted numeric ID, or an empty string if no match is found.
 *
 * @example
 * ```ts
 * const vimeoId = getVimeoIdFromUrl("https://vimeo.com/channels/staffpicks/134668506");
 * console.log(vimeoId); // "134668506"
 * ```
 */
export const getVimeoIdFromUrl = (url: string): string =>
  url.match(vimeoUrlRegex)?.[1] ?? "";

/**
 * Constructs an embeddable Vimeo URL from the given numeric video ID.
 *
 * @param id - The numeric Vimeo ID.
 * @returns A URL suitable for embedding in an `<iframe>`.
 *
 * @example
 * ```ts
 * const embedUrl = getVimeoEmbedUrlFromId("134668506");
 * console.log(embedUrl); // "https://player.vimeo.com/video/134668506"
 * ```
 */
export const getVimeoEmbedUrlFromId = (id: string): string =>
  `https://player.vimeo.com/video/${id}`;

/**
 * A provider implementation for Vimeo, conforming to the {@link EmbedProvider} interface.
 *
 * @remarks
 * - `canParseUrl()` uses {@link vimeoUrlRegex} to detect Vimeo URLs.
 * - `getIdFromUrl()` extracts the numeric ID from recognized Vimeo links.
 * - `getEmbedUrlFromId()` builds an embeddable `<iframe>` URL for Vimeo.
 */
export const VimeoProvider: EmbedProvider = {
  /**
   * Determines if the given URL matches the Vimeo pattern.
   *
   * @param url - The URL string to test.
   * @returns `true` if the URL is recognized as Vimeo; otherwise `false`.
   */
  canParseUrl(url: string) {
    return vimeoUrlRegex.test(url);
  },

  /**
   * Builds an embeddable Vimeo URL from a numeric video ID.
   *
   * @param id - The numeric Vimeo ID.
   * @returns A fully embeddable URL for use in `<iframe src="...">`.
   */
  getEmbedUrlFromId(id: string) {
    return getVimeoEmbedUrlFromId(id);
  },

  /**
   * Extracts the Vimeo video ID from a recognized URL.
   *
   * @param url - The Vimeo URL.
   * @returns The numeric video ID.
   */
  getIdFromUrl(url: string) {
    return getVimeoIdFromUrl(url);
  },
  /** @inheritdoc */
  name: "Vimeo",
};
