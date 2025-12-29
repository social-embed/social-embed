/**
 * Tests for browser module convenience functions.
 *
 * These test the Tier 1 zero-config API exported from @social-embed/lib/browser.
 */

import { afterEach, describe, expect, it } from "vitest";

import { defineIframeMatcher } from "../src";
import {
  defaultStore,
  Embed,
  match,
  register,
  toEmbed,
  toEmbedUrl,
  unregister,
} from "../src/browser";

// Test matcher for registration tests
const TestMatcher = defineIframeMatcher({
  domains: ["browser-test.example.com"],
  embedUrl: (id) => `https://browser-test.example.com/embed/${id}`,
  name: "BrowserTest",
  patterns: [/browser-test\.example\.com\/v\/(\w+)/],
});

describe("browser convenience functions", () => {
  // Clean up after each test to avoid polluting other tests
  afterEach(() => {
    if (defaultStore.has("BrowserTest")) {
      unregister("BrowserTest");
    }
  });

  describe("defaultStore", () => {
    it("should be a RegistryStore instance", () => {
      expect(defaultStore).toBeDefined();
      expect(defaultStore.current).toBeDefined();
    });

    it("should have built-in matchers", () => {
      expect(defaultStore.has("YouTube")).toBe(true);
      expect(defaultStore.has("Spotify")).toBe(true);
      expect(defaultStore.has("Vimeo")).toBe(true);
    });
  });

  describe("toEmbedUrl()", () => {
    it("should convert YouTube URL to embed URL", () => {
      const url = toEmbedUrl("https://youtu.be/FTQbiNvZqaY");
      expect(url).toBe("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should convert Spotify URL to embed URL", () => {
      const url = toEmbedUrl(
        "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
      );
      expect(url).toContain("open.spotify.com/embed/track");
    });

    it("should return undefined for unknown URLs", () => {
      const url = toEmbedUrl("https://example.com/unknown");
      expect(url).toBeUndefined();
    });
  });

  describe("toEmbed()", () => {
    it("should return Embed instance for valid URL", () => {
      const embed = toEmbed("https://youtu.be/FTQbiNvZqaY");

      expect(embed).toBeInstanceOf(Embed);
    });

    it("should return Embed with working toUrl()", () => {
      const embed = toEmbed("https://youtu.be/FTQbiNvZqaY");

      expect(embed?.toUrl()).toContain("youtube-nocookie.com/embed");
    });

    it("should return Embed with working toHtml()", () => {
      const embed = toEmbed("https://youtu.be/FTQbiNvZqaY");

      expect(embed?.toHtml()).toContain("<iframe");
      expect(embed?.toHtml()).toContain("</iframe>");
    });

    it("should return Embed with working toNodes()", () => {
      const embed = toEmbed("https://youtu.be/FTQbiNvZqaY");

      expect(embed?.toNodes()).toHaveLength(1);
      expect(embed?.toNodes()[0].type).toBe("iframe");
    });

    it("should return undefined for unknown URLs", () => {
      const embed = toEmbed("https://example.com/unknown");
      expect(embed).toBeUndefined();
    });
  });

  describe("match()", () => {
    it("should return successful result for known URL", () => {
      const result = match("https://youtu.be/FTQbiNvZqaY");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.matcher.name).toBe("YouTube");
      }
    });

    it("should return failed result for unknown URL", () => {
      const result = match("https://example.com/unknown");

      expect(result.ok).toBe(false);
    });
  });

  describe("register()", () => {
    it("should add matcher to defaultStore", () => {
      expect(defaultStore.has("BrowserTest")).toBe(false);

      register(TestMatcher);

      expect(defaultStore.has("BrowserTest")).toBe(true);
    });

    it("should accept options with priority", () => {
      register(TestMatcher, { priority: 10 });

      expect(defaultStore.has("BrowserTest")).toBe(true);
    });

    it("should make registered matcher available for matching", () => {
      register(TestMatcher);

      const result = match("https://browser-test.example.com/v/test123");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.matcher.name).toBe("BrowserTest");
      }
    });
  });

  describe("unregister()", () => {
    it("should remove matcher from defaultStore", () => {
      register(TestMatcher);
      expect(defaultStore.has("BrowserTest")).toBe(true);

      unregister("BrowserTest");

      expect(defaultStore.has("BrowserTest")).toBe(false);
    });

    it("should be no-op for non-existent matcher", () => {
      const sizeBefore = defaultStore.size;

      unregister("NonExistentMatcher");

      expect(defaultStore.size).toBe(sizeBefore);
    });
  });
});
