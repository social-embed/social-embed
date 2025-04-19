/**
 * A typed interface for each Provider.
 *
 * @remarks
 * Implement this interface for each service you want to support — for instance,
 * YouTube, Vimeo, or any custom embed provider.
 *
 * @public
 */
export interface EmbedProvider {
  /**
   * A unique, descriptive name for the provider (e.g. "YouTube").
   */
  readonly name: string;

  /**
   * Determines whether the provider can handle a particular URL string.
   *
   * @param url - The URL to analyze.
   * @returns `true` if this provider recognizes the URL, else `false`.
   */
  canParseUrl(url: string): boolean;

  /**
   * Extracts the relevant ID(s) from the URL.
   *
   * @param url - The URL to parse.
   * @returns A string or array of strings representing IDs or parameters needed
   *          to build the embed URL. For Spotify, for example, this might return
   *          `[id, type]`.
   */
  getIdFromUrl(url: string): string | string[];

  /**
   * Builds the embed URL from an ID plus optional arguments.
   *
   * @param id - The primary ID or key.
   * @param args - Optional extra arguments. For instance, Spotify may accept a `type` param (album, track, etc.).
   * @returns An iframe-friendly URL for embedding.
   */
  getEmbedUrlFromId(id: string, ...args: unknown[]): string;

  /**
   * Optional default dimensions for the provider's embed.
   * If not provided, the web component will use its default dimensions.
   *
   * @remarks
   * This is used by the web component to set appropriate dimensions for the iframe.
   */
  defaultDimensions?: {
    width: string;
    height: string;
  };

  /**
   * Optional additional iframe attributes for the provider's embed.
   *
   * @remarks
   * This is used by the web component to set additional attributes on the iframe.
   * For example, Spotify embeds need `allowtransparency="true" allow="encrypted-media"`.
   */
  iframeAttributes?: Record<string, string>;
}
