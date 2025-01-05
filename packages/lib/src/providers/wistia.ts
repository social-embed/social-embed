import type { EmbedProvider } from "../provider";

/**
 * Detecting and parsing for Wistia URLs.
 *
 * [Wistia's Official embed documentation](https://wistia.com/support/embed-and-share/video-on-your-website)
 * [Wistia's Embed building documentation](https://wistia.com/support/developers/construct-an-embed-code)
 *
 * @module providers/wistia
 */

/*
  Example embed code from Wistia might be:

  <iframe
    src="//fast.wistia.net/embed/iframe/26sk4lmiix"
    allowtransparency="true"
    frameborder="0"
    scrolling="no"
    class="wistia_embed"
    name="wistia_embed"
    allowfullscreen
    mozallowfullscreen
    webkitallowfullscreen
    oallowfullscreen
    msallowfullscreen
    width="620"
    height="349"
  ></iframe>
  <script src="//fast.wistia.net/assets/external/E-v1.js" async></script>
*/

/**
 * Regex pattern to match Wistia media IDs from URL formats such as:
 *
 * - `https://support.wistia.com/medias/26sk4lmiix`
 * - `https://support.wistia.com/embed/26sk4lmiix`
 *
 * @remarks
 * While the library doesn’t explicitly handle them, [Wistia's embed docs](https://wistia.com/support/developers/construct-an-embed-code)
 * also mention variants like:
 * - `https://support.wi.st/embed/26sk4lmiix`
 * - `https://support.wi.st/medias/26sk4lmiix`
 */
export const wistiaUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www|fast|support\.)?(?:wistia.com|wi.st)[=/](?:medias|embed)\/([-\w]+)/;

/**
 * Extracts the Wistia media ID from a given URL string.
 *
 * @param url - The shared Wistia link (can be `undefined`).
 * @returns The extracted Wistia media ID, or an empty string if none found.
 * @throws If `url` length is >1000 (a safeguard).
 *
 * @example
 * ```ts
 * const wistiaId = getWistiaIdFromUrl("https://support.wistia.com/medias/26sk4lmiix");
 * console.log(wistiaId); // "26sk4lmiix"
 * ```
 */
export const getWistiaIdFromUrl = (url: string | undefined): string => {
  if (url) {
    if (url.length > 1000) {
      throw new Error("URL too long");
    }
    return url.match(wistiaUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Constructs a Wistia embed URL from a media ID.
 *
 * @param wistiaId - The Wistia ID.
 * @returns A URL suitable for embedding in an `<iframe>`.
 *
 * @example
 * ```ts
 * console.log(getWistiaEmbedUrlFromId("26sk4lmiix"));
 * // "https://fast.wistia.net/embed/iframe/26sk4lmiix"
 * ```
 */
export const getWistiaEmbedUrlFromId = (id: string): string =>
  `https://fast.wistia.net/embed/iframe/${id}`;

/**
 * A provider implementation for Wistia, following the {@link EmbedProvider} interface.
 */
export const WistiaProvider: EmbedProvider = {
  /** @inheritdoc */
  name: "Wistia",

  /**
   * Checks if a URL is recognized as a Wistia link by testing the pattern {@link wistiaUrlRegex}.
   *
   * @param url - The string to test.
   * @returns `true` if it matches Wistia patterns, otherwise `false`.
   */
  canParseUrl(url: string) {
    return wistiaUrlRegex.test(url);
  },

  /**
   * Extracts the Wistia media ID from a recognized Wistia URL.
   *
   * @param url - The shared Wistia link.
   * @returns The extracted Wistia ID (e.g. `"26sk4lmiix"`).
   */
  getIdFromUrl(url: string) {
    return getWistiaIdFromUrl(url);
  },

  /**
   * Constructs a Wistia embed URL given a media ID.
   *
   * @param id - The Wistia media ID.
   * @returns An `<iframe>`-friendly URL (e.g. `https://fast.wistia.net/embed/iframe/<id>`).
   */
  getEmbedUrlFromId(id: string) {
    return getWistiaEmbedUrlFromId(id);
  },
};
