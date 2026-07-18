import { describe, expect, it } from "vitest";
import { INVALID_URL, VALID_URL, validateEmbedUrl } from "./validationHelpers";

describe("validateEmbedUrl", () => {
  it("accepts supported providers", () => {
    const result = validateEmbedUrl(VALID_URL);
    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(result.providerName).toBe("YouTube");
      expect(result.embedUrl).toContain("youtube.com/embed");
    }
  });

  it("rejects unsupported providers", () => {
    const result = validateEmbedUrl(INVALID_URL);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.providerName).toBeNull();
      expect(result.reason).toBe("URL is not a recognized provider");
    }
  });
});
