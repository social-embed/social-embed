import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { isValidUrl } from "./providers/generic"; // or wherever
import { YouTubeProvider } from "./providers/youtube";
import { convertUrlToEmbedUrl, internalRegistry } from "./utils";

describe("utils test", () => {
  beforeEach(() => {
    // Register the YouTube provider for testing
    internalRegistry.register(YouTubeProvider);
  });

  it("should convert recognized URLs", () => {
    const result = convertUrlToEmbedUrl("https://youtu.be/abc123xyz00");
    expect(result).toMatch(/youtube\.com\/embed/);
  });

  it("should return empty for unknown", () => {
    const result = convertUrlToEmbedUrl("https://example.com/unknown");
    expect(result).toBe("");
  });

  it("should detect valid URLs", () => {
    expect(isValidUrl("https://apple.com")).toBe(true);
  });
});
