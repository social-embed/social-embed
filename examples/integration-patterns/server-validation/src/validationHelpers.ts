import { convertUrlToEmbedUrl, getProviderFromUrl } from "@social-embed/lib";

export const INVALID_URL = "https://example.com/not-supported";
export const VALID_URL = "https://youtu.be/Bd8_vO5zrjo";

export type ValidEmbedResult = {
  isValid: true;
  providerName: string;
  embedUrl: string;
};

export type InvalidEmbedResult = {
  isValid: false;
  providerName: null;
  reason: string;
};

export type EmbedValidationResult = ValidEmbedResult | InvalidEmbedResult;

export function validateEmbedUrl(url: string): EmbedValidationResult {
  const provider = getProviderFromUrl(url);
  if (provider === undefined) {
    return {
      isValid: false,
      providerName: null,
      reason: "URL is not a recognized provider",
    };
  }
  const embedUrl = convertUrlToEmbedUrl(url) || url;
  return { embedUrl, isValid: true, providerName: provider.name };
}
