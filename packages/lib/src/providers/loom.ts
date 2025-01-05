import type { EmbedProvider } from "../provider";

/**
 * Detecting and parsing for Loom URLs.
 *
 * [Loom's Official embed documentation](https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604)
 *
 * @module providers/loom
 */

/*
  A sample embed code from Loom might look like:

  <div style="position: relative; padding-bottom: 61.224489795918366%; height: 0;">
    <iframe
      src="https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    </iframe>
  </div>
*/

/**
 * Matches an ID from Loom URLs that look like:
 * `https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604`
 *
 * @remarks
 * This pattern allows for:
 * - Optional protocol (e.g. `https://`)
 * - Optional `www.`
 * - `loom.com/share/`
 * - A capture group of letters, digits, dashes, or underscores.
 *
 * @example
 * ```ts
 * // Matches:
 * //   https://loom.com/share/e883f70b219a49f6ba7fbeac71a72604
 * //   https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604
 * ```
 */
export const loomUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?loom.com[=/]share\/([-\w]+)/;

/**
 * Returns the Loom video ID from a shared link.
 *
 * @param url - A Loom share URL (or `undefined`).
 * @returns The extracted Loom video ID if found, otherwise an empty string.
 * @throws If `url` length exceeds 1000 characters (a safety guard).
 *
 * @example
 * ```ts
 * const loomId = getLoomIdFromUrl("loom.com/share/e883f70b219a49f6ba7fbeac71a72604");
 * console.log(loomId); // "e883f70b219a49f6ba7fbeac71a72604"
 * ```
 */
export const getLoomIdFromUrl = (url: string | undefined): string => {
  if (url) {
    if (url.length > 1000) {
      throw new Error("URL too long");
    }
    return url.match(loomUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Constructs an embeddable Loom URL from a Loom video ID.
 *
 * @param loomId - The Loom video ID to embed.
 * @returns A URL suitable for use in an `<iframe src="...">`.
 *
 * @example
 * ```ts
 * console.log(getLoomEmbedUrlFromId("e883f70b219a49f6ba7fbeac71a72604"));
 * // "https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604"
 * ```
 */
export const getLoomEmbedUrlFromId = (id: string): string =>
  `https://www.loom.com/embed/${id}`;

/**
 * A provider implementation for Loom, adhering to the {@link EmbedProvider} interface.
 */
export const LoomProvider: EmbedProvider = {
  /** @inheritdoc */
  name: "Loom",

  /**
   * Returns `true` if the provided URL matches the Loom share pattern.
   *
   * @param url - The URL to test for Loom compatibility.
   * @returns `true` if Loom recognized; otherwise `false`.
   */
  canParseUrl(url: string): boolean {
    return loomUrlRegex.test(url);
  },

  /**
   * Extracts the Loom video ID from a recognized Loom URL.
   *
   * @param url - The shared Loom link.
   * @returns The parsed Loom video ID.
   */
  getIdFromUrl(url: string): string {
    return getLoomIdFromUrl(url);
  },

  /**
   * Builds an embeddable Loom URL from a given Loom video ID.
   *
   * @param id - The Loom ID (e.g. `"e883f70b219a49f6ba7fbeac71a72604"`).
   * @returns The final embed URL (e.g. `https://www.loom.com/embed/<id>`).
   */
  getEmbedUrlFromId(id: string): string {
    return getLoomEmbedUrlFromId(id);
  },
};
