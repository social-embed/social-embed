import { convertUrlToEmbedUrl, getProviderFromUrl } from "@social-embed/lib";
import { z } from "zod";

export const ALLOWED_PROVIDERS = ["YouTube", "Vimeo", "Spotify"];

export const VALID_URL = "https://youtu.be/Bd8_vO5zrjo";
export const INVALID_URL = "https://example.com/not-supported";
export const MALFORMED_URL = "not-a-url";

export const embedUrlSchema = z.string().url("Must be a valid URL");

export type EmbedValidationResult =
  | { isValid: true; embedUrl: string; providerName: string }
  | { isValid: false; reason: string };

export function validateAndBuildEmbed(rawUrl: string): EmbedValidationResult {
  const parsed = embedUrlSchema.safeParse(rawUrl);
  if (!parsed.success) {
    return {
      isValid: false,
      reason: parsed.error.issues[0]?.message ?? "Invalid URL",
    };
  }

  const provider = getProviderFromUrl(parsed.data);
  if (provider === undefined) {
    return { isValid: false, reason: "URL is not a recognized provider" };
  }

  if (!ALLOWED_PROVIDERS.includes(provider.name)) {
    return {
      isValid: false,
      reason: `Provider "${provider.name}" is not in the allow list`,
    };
  }

  const embedUrl = convertUrlToEmbedUrl(parsed.data) || parsed.data;
  return { embedUrl, isValid: true, providerName: provider.name };
}
