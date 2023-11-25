/**
 * Detecting and parsing for Loom URLs.
 *
 * [Loom's Official embed documentation](https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604)
 *
 * @module providers/loom
 */

/*
 <div style="position: relative; padding-bottom: 61.224489795918366%; height: 0;"><iframe src="https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
 */

/**
 * Matches ID from URLs matching: https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604
 */
export const loomUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?[^/]*loom.com.*[=/]share\/([-\w]+)/;

/**
 * Return ID from shared link.
 *
 * @param url  Shared URL link.
 */
export const getLoomIdFromUrl = (url: string | undefined): string => {
  if (url) {
    return url.match(loomUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Return embed-friendly URL from ID.
 *
 * @param loomId ID of embed
 */
export const getLoomEmbedUrlFromId = (id: string): string =>
  `https://www.loom.com/embed/${id}`;
