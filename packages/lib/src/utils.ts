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
 * Finds the first provider (in the default registry) that can handle the given URL.
 */
export function getProviderFromUrl(url: string): EmbedProvider | undefined {
  if (!url) return undefined;
  return defaultRegistry.findProviderByUrl(url);
}

/**
 * Convert a recognized media URL into its iframe-friendly embed URL, or return an empty string if no match.
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
