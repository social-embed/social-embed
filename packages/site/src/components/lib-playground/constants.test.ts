import { describe, expect, it } from "vitest";
import {
  DEFAULT_LIB_SOURCE,
  getAllProviderTypes,
  getProviderDisplayInfo,
  getProviderFilterOptions,
  getUrlPoolForFilter,
  LIB_SOURCE_ORDER,
  LIB_SOURCES,
  PROVIDER_CHECK_ORDER,
  PROVIDER_DISPLAY,
  type ProviderFilter,
  URL_POOLS,
} from "./constants";

describe("constants", () => {
  describe("PROVIDER_DISPLAY", () => {
    it("has display info for all provider types", () => {
      for (const provider of PROVIDER_CHECK_ORDER) {
        expect(PROVIDER_DISPLAY[provider]).toBeDefined();
        expect(PROVIDER_DISPLAY[provider].name).toBeTruthy();
        expect(PROVIDER_DISPLAY[provider].icon).toBeTruthy();
        expect(PROVIDER_DISPLAY[provider].colorClass).toBeTruthy();
      }
    });

    it("has correct structure for YouTube", () => {
      expect(PROVIDER_DISPLAY.youtube).toEqual({
        colorClass: "text-red-600 dark:text-red-400",
        icon: "▶️",
        name: "YouTube",
      });
    });

    it("has correct structure for Spotify Track", () => {
      expect(PROVIDER_DISPLAY["spotify-track"]).toEqual({
        colorClass: "text-green-600 dark:text-green-400",
        icon: "🎵",
        name: "Spotify Track",
      });
    });
  });

  describe("LIB_SOURCES", () => {
    it("has all source types defined", () => {
      for (const sourceType of LIB_SOURCE_ORDER) {
        expect(LIB_SOURCES[sourceType]).toBeDefined();
        expect(LIB_SOURCES[sourceType].label).toBeTruthy();
        expect(LIB_SOURCES[sourceType].description).toBeTruthy();
      }
    });

    it("local source has null urlPattern", () => {
      expect(LIB_SOURCES.local.urlPattern).toBeNull();
    });

    it("CDN sources have URL patterns", () => {
      expect(LIB_SOURCES["esm-sh"].urlPattern).toContain("esm.sh");
      expect(LIB_SOURCES.unpkg.urlPattern).toContain("unpkg.com");
      expect(LIB_SOURCES.jsdelivr.urlPattern).toContain("jsdelivr.net");
    });

    it("esm-sh-gh source includes GitHub path", () => {
      expect(LIB_SOURCES["esm-sh-gh"].urlPattern).toContain("esm.sh/gh/");
    });
  });

  describe("DEFAULT_LIB_SOURCE", () => {
    it("defaults to local", () => {
      expect(DEFAULT_LIB_SOURCE).toBe("local");
    });
  });

  describe("getAllProviderTypes", () => {
    it("returns all provider types", () => {
      const types = getAllProviderTypes();
      expect(types).toContain("youtube");
      expect(types).toContain("spotify-track");
      expect(types).toContain("vimeo");
      expect(types.length).toBeGreaterThan(0);
    });

    it("matches PROVIDER_CHECK_ORDER", () => {
      expect(getAllProviderTypes()).toEqual(PROVIDER_CHECK_ORDER);
    });
  });

  describe("getProviderFilterOptions", () => {
    it("includes all option first", () => {
      const options = getProviderFilterOptions();
      expect(options[0]).toBe("all");
    });

    it("includes all provider types", () => {
      const options = getProviderFilterOptions();
      for (const provider of PROVIDER_CHECK_ORDER) {
        expect(options).toContain(provider);
      }
    });
  });

  describe("getProviderDisplayInfo", () => {
    it("returns display info for specific provider", () => {
      const info = getProviderDisplayInfo("youtube");
      expect(info.name).toBe("YouTube");
      expect(info.icon).toBe("▶️");
    });

    it("returns fallback for 'all' filter", () => {
      const info = getProviderDisplayInfo("all");
      expect(info.name).toBe("All Providers");
      expect(info.icon).toBe("🌐");
    });
  });

  describe("getUrlPoolForFilter", () => {
    it("returns specific provider URLs", () => {
      const urls = getUrlPoolForFilter("youtube");
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) {
        // Match both youtube.com and youtu.be domains
        expect(url).toMatch(/youtube|youtu\.be/i);
      }
    });

    it("returns combined URLs for 'all' filter", () => {
      const allUrls = getUrlPoolForFilter("all");
      const youtubeUrls = getUrlPoolForFilter("youtube");
      const vimeoUrls = getUrlPoolForFilter("vimeo");

      expect(allUrls.length).toBeGreaterThan(youtubeUrls.length);
      expect(allUrls.length).toBeGreaterThan(vimeoUrls.length);

      // Should contain URLs from multiple providers
      expect(allUrls.some((url) => url.includes("youtube"))).toBe(true);
      expect(allUrls.some((url) => url.includes("vimeo"))).toBe(true);
    });

    it("returns empty array for unknown provider", () => {
      const urls = getUrlPoolForFilter("unknown-provider" as ProviderFilter);
      expect(urls).toEqual([]);
    });
  });

  describe("URL_POOLS integrity", () => {
    it("all pools have at least one URL", () => {
      for (const provider of PROVIDER_CHECK_ORDER) {
        expect(URL_POOLS[provider].length).toBeGreaterThan(0);
      }
    });

    it("all URLs are valid HTTP(S) URLs", () => {
      for (const provider of PROVIDER_CHECK_ORDER) {
        for (const url of URL_POOLS[provider]) {
          expect(url).toMatch(/^https?:\/\//);
        }
      }
    });
  });
});
