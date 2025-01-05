import type { EmbedProvider } from "../provider";

/**
 * Detection and parsing for Edpuzzle URLs.
 *
 * [Edpuzzle's official embed docs](https://support.edpuzzle.com/hc/en-us/articles/360007260632-Can-I-embed-an-assignment-into-an-LMS-blog-or-website-)
 *
 * @module providers/edpuzzle
 */

/**
 * A regex pattern that matches an Edpuzzle media ID from a URL.
 *
 * @remarks
 * Matches IDs from URLs like:
 * `https://edpuzzle.com/media/606b413369971e424ec6021e`
 * `https://www.edpuzzle.com/media/606b413369971e424ec6021e`
 */
export const edPuzzleUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?edpuzzle.com[=/]media\/([-\w]+)/;

/**
 * Returns the EdPuzzle media ID from a given URL string.
 *
 * @param url - The shared EdPuzzle URL link (can be `undefined`).
 * @returns The extracted EdPuzzle ID if found, or an empty string otherwise.
 * @throws If `url` length exceeds 1000 characters (for security/performance reasons).
 *
 * @example
 * ```ts
 * const id = getEdPuzzleIdFromUrl("https://edpuzzle.com/media/606b413369971e424ec6021e");
 * console.log(id); // "606b413369971e424ec6021e"
 * ```
 */
export const getEdPuzzleIdFromUrl = (url: string | undefined): string => {
  if (url) {
    if (url?.length > 1000) {
      throw new Error("URL too long");
    }

    return url.match(edPuzzleUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Constructs a standard EdPuzzle embed URL from a given EdPuzzle media ID.
 *
 * @param edPuzzleId - The EdPuzzle ID to embed.
 * @returns An embeddable URL: `https://edpuzzle.com/embed/media/<edPuzzleId>`
 *
 * @example
 * ```ts
 * console.log(getEdPuzzleEmbedUrlFromId("606b413369971e424ec6021e"));
 * // "https://edpuzzle.com/embed/media/606b413369971e424ec6021e"
 * ```
 */
export const getEdPuzzleEmbedUrlFromId = (id: string): string =>
  `https://edpuzzle.com/embed/media/${id}`;

/**
 * A provider implementation for EdPuzzle, following the {@link EmbedProvider} interface.
 *
 * @remarks
 * It exports `canParseUrl`, `getIdFromUrl`, and `getEmbedUrlFromId` for
 * EdPuzzle-based media. Useful with `convertUrlToEmbedUrl` or custom logic.
 */
export const EdPuzzleProvider: EmbedProvider = {
  /** @inheritdoc */
  name: "EdPuzzle",
  /**
   * Checks if the given URL belongs to EdPuzzle.
   *
   * @param url - A string potentially matching EdPuzzle.
   * @returns `true` if EdPuzzle is recognized; otherwise `false`.
   */
  canParseUrl(url: string): boolean {
    return edPuzzleUrlRegex.test(url);
  },

  /**
   * Extracts the EdPuzzle ID from the recognized EdPuzzle URL.
   *
   * @param url - The EdPuzzle media URL.
   * @returns The extracted EdPuzzle ID.
   */
  getIdFromUrl(url: string): string {
    return getEdPuzzleIdFromUrl(url);
  },

  /**
   * Builds an embeddable EdPuzzle URL from the given media ID.
   *
   * @param id - The EdPuzzle media ID.
   * @returns A full embed URL (e.g. `https://edpuzzle.com/embed/media/<id>`).
   */
  getEmbedUrlFromId(id: string): string {
    return getEdPuzzleEmbedUrlFromId(id);
  },
};
