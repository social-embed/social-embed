import { describe, expect, it } from "vitest";
import {
  createShareableUrl,
  DEFAULT_STATE,
  decodeLibState,
  encodeLibState,
  type LibPlaygroundState,
} from "./libPlaygroundState";

describe("libPlaygroundState", () => {
  describe("encodeLibState", () => {
    it("returns empty string for default state", () => {
      expect(encodeLibState(DEFAULT_STATE)).toBe("");
    });

    it("encodes URL when different from default", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        url: "https://vimeo.com/123456",
      };
      const encoded = encodeLibState(state);
      expect(encoded).toBeTruthy();

      // Verify it decodes correctly
      const decoded = decodeLibState(encoded);
      expect(decoded.url).toBe("https://vimeo.com/123456");
    });

    it("encodes provider filter when not 'all'", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        providerFilter: "youtube",
      };
      const encoded = encodeLibState(state);
      expect(encoded).toBeTruthy();

      const decoded = decodeLibState(encoded);
      expect(decoded.providerFilter).toBe("youtube");
    });

    it("encodes lib source when not default", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        libSource: "esm-sh",
      };
      const encoded = encodeLibState(state);
      expect(encoded).toBeTruthy();

      const decoded = decodeLibState(encoded);
      expect(decoded.libSource).toBe("esm-sh");
    });

    it("encodes seed when present", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        seed: "se-12345",
      };
      const encoded = encodeLibState(state);
      expect(encoded).toBeTruthy();

      const decoded = decodeLibState(encoded);
      expect(decoded.seed).toBe("se-12345");
    });

    it("encodes all fields together", () => {
      const state: LibPlaygroundState = {
        libSource: "unpkg",
        providerFilter: "spotify-track",
        seed: "se-999",
        url: "https://open.spotify.com/track/abc123",
      };
      const encoded = encodeLibState(state);
      const decoded = decodeLibState(encoded);

      expect(decoded).toEqual(state);
    });
  });

  describe("decodeLibState", () => {
    it("returns default state for empty string", () => {
      expect(decodeLibState("")).toEqual(DEFAULT_STATE);
    });

    it("returns default state for invalid base64", () => {
      expect(decodeLibState("not-valid-base64!!!")).toEqual(DEFAULT_STATE);
    });

    it("returns default state for invalid JSON", () => {
      const invalidJson = btoa("not json");
      expect(decodeLibState(invalidJson)).toEqual(DEFAULT_STATE);
    });

    it("handles missing optional fields", () => {
      const minimal = btoa(JSON.stringify({ v: 1 }));
      const decoded = decodeLibState(minimal);
      expect(decoded.url).toBe(DEFAULT_STATE.url);
      expect(decoded.providerFilter).toBe("all");
      expect(decoded.libSource).toBe("local");
      expect(decoded.seed).toBeUndefined();
    });

    it("rejects invalid lib source", () => {
      const invalid = btoa(JSON.stringify({ src: "invalid-source", v: 1 }));
      const decoded = decodeLibState(invalid);
      expect(decoded.libSource).toBe("local"); // Falls back to default
    });

    it("handles version mismatch gracefully", () => {
      const wrongVersion = btoa(
        JSON.stringify({ u: "https://example.com", v: 999 }),
      );
      const decoded = decodeLibState(wrongVersion);
      expect(decoded).toEqual(DEFAULT_STATE);
    });
  });

  describe("round-trip encoding", () => {
    it("preserves state through encode/decode cycle", () => {
      const states: LibPlaygroundState[] = [
        { ...DEFAULT_STATE, url: "https://youtu.be/abc" },
        { ...DEFAULT_STATE, providerFilter: "vimeo" },
        { ...DEFAULT_STATE, libSource: "jsdelivr" },
        { ...DEFAULT_STATE, seed: "se-42" },
        {
          libSource: "esm-sh-gh",
          providerFilter: "dailymotion",
          seed: "se-100",
          url: "https://dailymotion.com/video/x123",
        },
      ];

      for (const original of states) {
        const encoded = encodeLibState(original);
        if (encoded) {
          const decoded = decodeLibState(encoded);
          expect(decoded).toEqual(original);
        }
      }
    });
  });

  describe("createShareableUrl", () => {
    it("returns base URL for default state", () => {
      const url = createShareableUrl(
        DEFAULT_STATE,
        "https://example.com/lib/playground/",
      );
      expect(url).toBe("https://example.com/lib/playground/");
    });

    it("appends state param for non-default state", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        url: "https://vimeo.com/123",
      };
      const url = createShareableUrl(
        state,
        "https://example.com/lib/playground/",
      );
      expect(url).toContain("?state=");
    });

    it("uses default base URL when not provided", () => {
      const state: LibPlaygroundState = {
        ...DEFAULT_STATE,
        providerFilter: "youtube",
      };
      const url = createShareableUrl(state);
      expect(url).toContain("/lib/playground/");
      expect(url).toContain("?state=");
    });
  });
});
