import { describe, expect, it } from "vitest";
import { INVALID_URL, validateEmbedUrl, VALID_URL } from "./validationHelpers";

describe("validateEmbedUrl", () => {
  it("accepts supported providers", () => {
    expect(validateEmbedUrl(VALID_URL)).toEqual({
      isValid: true,
      providerName: "YouTube",
    });
  });

  it("rejects unsupported providers", () => {
    expect(validateEmbedUrl(INVALID_URL)).toEqual({
      isValid: false,
      providerName: null,
    });
  });
});
