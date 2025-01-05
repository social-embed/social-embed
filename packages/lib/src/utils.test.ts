// test/index.test.ts
import { describe, expect, it } from "vitest";
import { isValidUrl } from "./providers/generic"; // or wherever
import { convertUrlToEmbedUrl } from "./utils";

describe("utils test", () => {
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
