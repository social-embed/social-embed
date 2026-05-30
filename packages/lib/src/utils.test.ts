import { beforeEach, describe, expect, it } from "vitest";

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

  it("should reject javascript: URIs", () => {
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
  });

  it("should reject data: URIs", () => {
    expect(isValidUrl("data:text/html,<h1>hi</h1>")).toBe(false);
  });

  it("should accept https: URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("should accept http: URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });
});
