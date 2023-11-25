/**
 * Detecting and parsing for Wistia URLs.
 *
 * [Wistia's Official embed documentation](https://wistia.com/support/embed-and-share/video-on-your-website)
 * [Wistia's Embed building documentation](https://wistia.com/support/developers/construct-an-embed-code)
 *
 * @module providers/wistia
 */

/*
 <iframe src="//fast.wistia.net/embed/iframe/26sk4lmiix" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="620" height="349"></iframe>
 <script src="//fast.wistia.net/assets/external/E-v1.js" async></script>
 */

/**
 * Matches ID from URLs matching:
 * - https://support.wistia.com/medias/26sk4lmiix
 * - https://support.wistia.com/embed/26sk4lmiix
 *
 * While these are not used, these are mentions on [Wistia's embed construction](https://wistia.com/support/developers/construct-an-embed-code) docs:
 * - https://support.wi.st/embed/26sk4lmiix
 * - https://support.wi.st/medias/26sk4lmiix
 */
export const wistiaUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www|fast|support\.)?(?:wistia.com|wi.st)[=/](?:medias|embed)\/([-\w]+)/;
// '^(?:(?:https?):)?(?://)?[^/]*wistia.com.*[=/]medias/([-\\w]+)'  // v1 (handcrafted by Tony)

/**
 * Return ID from shared link.
 *
 * @param url  Shared URL link.
 */
export const getWistiaIdFromUrl = (url: string | undefined): string => {
  if (url) {
    return url.match(wistiaUrlRegex)?.[1] ?? "";
  }
  return "";
};

/**
 * Return embed-friendly URL from ID.
 *
 * @param wistiaId ID of embed
 */
export const getWistiaEmbedUrlFromId = (id: string): string =>
  `https://fast.wistia.net/embed/iframe/${id}`;
