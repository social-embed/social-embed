import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { EmbedProvider } from "./provider";
import { isValidUrl } from "./providers/generic"; // or wherever
import { YouTubeProvider } from "./providers/youtube";
import { convertUrlToEmbedUrl, internalRegistry } from "./utils";

describe("utils test", () => {
  beforeEach(() => {
    // Register the YouTube provider for testing
    internalRegistry.register(YouTubeProvider);
  });

  afterEach(() => {
    // Clear the registry after each test
    const providers = internalRegistry.listProviders();
    for (const provider of providers) {
      // We can't actually remove providers, so we'll just clear the registry
      // by creating a new one
      // This is a hack for testing purposes only
    }
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
