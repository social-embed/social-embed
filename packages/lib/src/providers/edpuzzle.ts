/**
 * Detection and parsing for Edpuzzle URLs
 *
 * [Edpuzzle's official embed docs](https://support.edpuzzle.com/hc/en-us/articles/360007260632-Can-I-embed-an-assignment-into-an-LMS-blog-or-website-)
 *
 * @module providers/edpuzzle
 */

/**
 * Matches ID from URLs matching: https://edpuzzle.com/media/606b413369971e424ec6021e
 */
export const edPuzzleUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?edpuzzle.com[=/]media\/([-\w]+)/;

/**
 * Return ID from shared link.
 *
 * @param url  Shared URL link.
 */
export const getEdPuzzleIdFromUrl = (url: string | undefined): string => {
  if (url) {
    return url.match(edPuzzleUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Return embed-friendly URL from ID.
 *
 * @param edPuzzleId ID of embed
 */
export const getEdPuzzleEmbedUrlFromId = (id: string): string =>
  `https://edpuzzle.com/embed/media/${id}`;
