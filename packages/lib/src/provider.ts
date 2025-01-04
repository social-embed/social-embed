/**
 * A typed interface for each Provider.
 *
 * - `name`: A human-readable name or enum entry (e.g., "YouTube", "Vimeo").
 * - `canParseUrl(url)`: Should return `true` if the URL belongs to this provider.
 * - `getIdFromUrl(url)`: Extracts the relevant ID(s) from the URL.
 * - `getEmbedUrlFromId(id, ...args)`: Builds an iframe-friendly embed URL from the extracted ID.
 */
export interface EmbedProvider {
  /** Name or enum for the provider (e.g. "YouTube") */
  readonly name: string;

  /** Return true if the provider can handle the given URL */
  canParseUrl(url: string): boolean;

  /** Extract ID(s) from the URL */
  getIdFromUrl(url: string): string | string[];

  /** Build the embed URL from the ID (and optionally other arguments) */
  getEmbedUrlFromId(id: string, ...args: unknown[]): string;
}
