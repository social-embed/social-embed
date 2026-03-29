import { getProviderFromUrl } from "@social-embed/lib";

export const INVALID_URL = "https://example.com/not-supported";
export const VALID_URL = "https://youtu.be/Bd8_vO5zrjo";

export function validateEmbedUrl(url: string) {
  const provider = getProviderFromUrl(url);
  return {
    isValid: provider !== undefined,
    providerName: provider?.name ?? null,
  };
}
