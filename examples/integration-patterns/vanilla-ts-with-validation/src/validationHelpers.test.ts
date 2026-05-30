import { describe, expect, it } from "vitest";
import {
  ALLOWED_PROVIDERS,
  INVALID_URL,
  MALFORMED_URL,
  VALID_URL,
  validateAndBuildEmbed,
} from "./validationHelpers";

describe("validateAndBuildEmbed", () => {
  it("accepts a URL from an allowed provider", () => {
    const result = validateAndBuildEmbed(VALID_URL);
    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(ALLOWED_PROVIDERS).toContain(result.providerName);
      expect(result.embedUrl).toContain("youtube.com/embed");
    }
  });

  it("rejects a URL from an unrecognized provider", () => {
    const result = validateAndBuildEmbed(INVALID_URL);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.reason).toBe("URL is not a recognized provider");
    }
  });

  it("rejects a malformed URL before hitting the provider check", () => {
    const result = validateAndBuildEmbed(MALFORMED_URL);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.reason).toBe("Must be a valid URL");
    }
  });
});
