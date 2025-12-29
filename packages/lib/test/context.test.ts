/**
 * Tests for context utilities.
 *
 * These test the URL parsing, domain matching, and MatchInput facade
 * exported from @social-embed/lib.
 */

import { describe, expect, it } from "vitest";

import {
  createContext,
  createMatchInput,
  getBaseDomain,
  getQueryParam,
  hostMatches,
} from "../src";

describe("createContext()", () => {
  describe("standard URLs", () => {
    it("should parse standard HTTPS URL", () => {
      const result = createContext("https://youtube.com/watch?v=abc123");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.host).toBe("youtube.com");
        expect(result.value.scheme).toBe("https");
        expect(result.value.parsed.pathname).toBe("/watch");
        expect(result.value.parsed.searchParams?.get("v")).toBe("abc123");
      }
    });

    it("should parse URL with subdomain", () => {
      const result = createContext("https://open.spotify.com/track/xyz");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.host).toBe("open.spotify.com");
        expect(result.value.parsed.pathname).toBe("/track/xyz");
      }
    });

    it("should preserve hash fragment", () => {
      const result = createContext("https://example.com/page#section");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.parsed.hash).toBe("#section");
      }
    });
  });

  describe("Spotify URI format", () => {
    it("should parse spotify:track:id URI", () => {
      const result = createContext("spotify:track:abc123");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scheme).toBe("spotify");
        expect(result.value.host).toBeUndefined();
        expect(result.value.raw).toBe("spotify:track:abc123");
      }
    });

    it("should parse spotify:album:id URI", () => {
      const result = createContext("spotify:album:xyz789");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scheme).toBe("spotify");
      }
    });
  });

  describe("edge cases", () => {
    it("should return error for empty string", () => {
      const result = createContext("");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("PARSE_ERROR");
        expect(result.error.message).toContain("non-empty string");
      }
    });

    it("should return error for URL exceeding max length", () => {
      const longUrl = `https://example.com/${"a".repeat(2100)}`;
      const result = createContext(longUrl);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("PARSE_ERROR");
        expect(result.error.message).toContain("too long");
      }
    });

    it("should handle URL without protocol via regex fallback", () => {
      // This tests the regex fallback path when URL API fails
      const result = createContext("//example.com/path");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.host).toBe("example.com");
      }
    });
  });
});

describe("getBaseDomain()", () => {
  it("should extract base domain from subdomain", () => {
    expect(getBaseDomain("open.spotify.com")).toBe("spotify.com");
    expect(getBaseDomain("www.youtube.com")).toBe("youtube.com");
    expect(getBaseDomain("player.vimeo.com")).toBe("vimeo.com");
  });

  it("should return bare domain unchanged", () => {
    expect(getBaseDomain("youtube.com")).toBe("youtube.com");
    expect(getBaseDomain("vimeo.com")).toBe("vimeo.com");
  });

  it("should handle multi-level subdomains", () => {
    expect(getBaseDomain("api.v2.example.com")).toBe("example.com");
  });

  it("should return undefined for null or undefined", () => {
    expect(getBaseDomain(null)).toBeUndefined();
    expect(getBaseDomain(undefined)).toBeUndefined();
  });

  it("should normalize to lowercase", () => {
    expect(getBaseDomain("WWW.YOUTUBE.COM")).toBe("youtube.com");
    expect(getBaseDomain("Open.Spotify.Com")).toBe("spotify.com");
  });
});

describe("hostMatches()", () => {
  it("should match exact domain", () => {
    const ctx = createContext("https://youtube.com/watch");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["youtube.com"])).toBe(true);
    }
  });

  it("should match subdomain against base domain", () => {
    const ctx = createContext("https://open.spotify.com/track/abc");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["spotify.com"])).toBe(true);
    }
  });

  it("should match against multiple domains", () => {
    const ctx = createContext("https://youtu.be/abc123");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["youtube.com", "youtu.be"])).toBe(true);
    }
  });

  it("should not match unrelated domains", () => {
    const ctx = createContext("https://vimeo.com/123456");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["youtube.com", "youtu.be"])).toBe(false);
    }
  });

  it("should be case-insensitive", () => {
    const ctx = createContext("https://YOUTUBE.COM/watch");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["youtube.com"])).toBe(true);
    }
  });

  it("should return false if host is missing", () => {
    const ctx = createContext("spotify:track:abc");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(hostMatches(ctx.value, ["spotify.com"])).toBe(false);
    }
  });
});

describe("getQueryParam()", () => {
  it("should return existing parameter value", () => {
    const ctx = createContext("https://youtube.com/watch?v=abc123");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(getQueryParam(ctx.value, "v")).toBe("abc123");
    }
  });

  it("should return undefined for missing parameter", () => {
    const ctx = createContext("https://youtube.com/watch?v=abc123");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(getQueryParam(ctx.value, "nonexistent")).toBeUndefined();
    }
  });

  it("should return empty string for param with empty value", () => {
    const ctx = createContext("https://example.com/page?empty=&filled=value");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(getQueryParam(ctx.value, "empty")).toBe("");
      expect(getQueryParam(ctx.value, "filled")).toBe("value");
    }
  });

  it("should handle URL-encoded values", () => {
    const ctx = createContext("https://example.com?msg=hello%20world");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      expect(getQueryParam(ctx.value, "msg")).toBe("hello world");
    }
  });
});

describe("createMatchInput()", () => {
  it("should provide url property", () => {
    const ctx = createContext("https://youtube.com/watch?v=abc123");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      const input = createMatchInput(ctx.value);
      expect(input.url).toBe("https://youtube.com/watch?v=abc123");
    }
  });

  it("should provide hostname property", () => {
    const ctx = createContext("https://open.spotify.com/track/xyz");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      const input = createMatchInput(ctx.value);
      expect(input.hostname).toBe("open.spotify.com");
    }
  });

  it("should provide pathname property", () => {
    const ctx = createContext("https://vimeo.com/channels/staffpicks/123");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      const input = createMatchInput(ctx.value);
      expect(input.pathname).toBe("/channels/staffpicks/123");
    }
  });

  it("should provide scheme property", () => {
    const ctx = createContext("spotify:track:abc");
    expect(ctx.ok).toBe(true);
    if (ctx.ok) {
      const input = createMatchInput(ctx.value);
      expect(input.scheme).toBe("spotify");
    }
  });

  describe("getParam()", () => {
    it("should return query parameter value", () => {
      const ctx = createContext("https://youtube.com/watch?v=abc&t=30");
      expect(ctx.ok).toBe(true);
      if (ctx.ok) {
        const input = createMatchInput(ctx.value);
        expect(input.getParam("v")).toBe("abc");
        expect(input.getParam("t")).toBe("30");
      }
    });

    it("should return null for missing parameter", () => {
      const ctx = createContext("https://youtube.com/watch?v=abc");
      expect(ctx.ok).toBe(true);
      if (ctx.ok) {
        const input = createMatchInput(ctx.value);
        expect(input.getParam("missing")).toBeNull();
      }
    });
  });

  describe("getPathSegment()", () => {
    it("should return path segment by index", () => {
      const ctx = createContext("https://example.com/users/123/profile");
      expect(ctx.ok).toBe(true);
      if (ctx.ok) {
        const input = createMatchInput(ctx.value);
        expect(input.getPathSegment(0)).toBe("users");
        expect(input.getPathSegment(1)).toBe("123");
        expect(input.getPathSegment(2)).toBe("profile");
      }
    });

    it("should return null for out-of-bounds index", () => {
      const ctx = createContext("https://example.com/users/123");
      expect(ctx.ok).toBe(true);
      if (ctx.ok) {
        const input = createMatchInput(ctx.value);
        expect(input.getPathSegment(5)).toBeNull();
      }
    });

    it("should handle empty path segments", () => {
      const ctx = createContext("https://vimeo.com/video/123");
      expect(ctx.ok).toBe(true);
      if (ctx.ok) {
        const input = createMatchInput(ctx.value);
        // Leading slash is filtered out
        expect(input.getPathSegment(0)).toBe("video");
        expect(input.getPathSegment(1)).toBe("123");
      }
    });
  });
});
