import { defaultRegistry } from "./index"; // or import from "./registry"
import type { EmbedProvider } from "./provider";

export const isString = (val: unknown): val is string => {
  return typeof val === "string";
};

export const isRegExp = (val: unknown): val is RegExp => {
  return val instanceof RegExp;
};

/**
 * Factory to create regex matchers
 *
 * @param regex Regular expression or string pattern to match
 */
export const matcher =
  (regex: RegExp | string): ((value: string) => boolean) =>
  (value: string) => {
    if (value?.length > 1000) {
      throw new Error("URL too long");
    }
    return isString(value) && !isRegExp(regex)
      ? value.includes(regex)
      : new RegExp(regex).test(value);
  };

/**
 * Returns the first registered provider that can handle a given URL.
 *
 * @remarks
 * Internally calls {@link EmbedProviderRegistry.findProviderByUrl}.
 * Returns `undefined` if no known provider matches.
 *
 * @param url - The URL to check.
 */
export function getProviderFromUrl(url: string): EmbedProvider | undefined {
  if (!url) return undefined;
  return defaultRegistry.findProviderByUrl(url);
}

/**
 * Converts a recognized media URL to an embeddable iframe-friendly URL.
 *
 * @remarks
 * - If the URL is recognized, calls the provider’s `getIdFromUrl()` and `getEmbedUrlFromId()`.
 * - If no provider is found, returns an empty string.
 *
 * @param url - The user-supplied media URL (e.g., a YouTube link).
 * @returns The embeddable URL string (e.g., `https://www.youtube.com/embed/...`) or an empty string.
 */
export function convertUrlToEmbedUrl(url: string): string {
  const provider = getProviderFromUrl(url);
  if (!provider) return "";

  const rawId = provider.getIdFromUrl(url);

  if (Array.isArray(rawId)) {
    // e.g., in Spotify’s case -> [id, type]
    const [id, ...rest] = rawId;
    if (!id) return "";
    return provider.getEmbedUrlFromId(id, ...rest);
  }
  return provider.getEmbedUrlFromId(rawId);
}
