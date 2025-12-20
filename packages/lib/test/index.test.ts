/**
 * Tests for MatcherRegistry and core functionality.
 *
 * Tests verify that the registry correctly matches URLs and generates
 * embed URLs for all supported providers.
 */

import { describe, expect, it } from "vitest";

import { MatcherRegistry, renderOutput } from "../src";

describe("MatcherRegistry", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should be defined", () => {
    expect(registry).toBeDefined();
    expect(registry.size).toBeGreaterThan(0);
  });

  it("should list all registered matchers", () => {
    const matchers = registry.list();
    expect(matchers).toBeInstanceOf(Array);
    expect(matchers.length).toBeGreaterThan(0);
    expect(matchers.some((m) => m.name === "YouTube")).toBe(true);
  });
});

describe("registry.toEmbedUrl", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return undefined for invalid URLs", () => {
    expect(registry.toEmbedUrl("notaurl")).toBeUndefined();
    expect(registry.toEmbedUrl("https://unknown-site.com")).toBeUndefined();
  });

  describe("YouTube", () => {
    it("should handle youtube.com/watch URLs", () => {
      expect(
        registry.toEmbedUrl("https://www.youtube.com/watch?v=FTQbiNvZqaY"),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should handle youtu.be short URLs", () => {
      expect(registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY")).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY",
      );
    });

    it("should handle URLs without protocol", () => {
      expect(registry.toEmbedUrl("youtu.be/FTQbiNvZqaY")).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY",
      );
    });

    it("should respect privacy=false option", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { privacy: false }),
      ).toEqual("https://www.youtube.com/embed/FTQbiNvZqaY");
    });
  });

  describe("Spotify", () => {
    it("should handle spotify: URIs for albums", () => {
      expect(
        registry.toEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3"),
      ).toEqual("https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3");
    });

    it("should handle spotify: URIs for tracks", () => {
      expect(
        registry.toEmbedUrl("spotify:track:1w4etUoKfql47wtTFq031f"),
      ).toEqual("https://open.spotify.com/embed/track/1w4etUoKfql47wtTFq031f");
    });

    it("should handle open.spotify.com URLs", () => {
      expect(
        registry.toEmbedUrl(
          "https://open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC",
        ),
      ).toEqual("https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC");
    });

    it("should handle URLs without protocol", () => {
      expect(
        registry.toEmbedUrl("open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC"),
      ).toEqual("https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC");
    });

    it("should strip query parameters", () => {
      expect(
        registry.toEmbedUrl(
          "https://open.spotify.com/track/7Ca8EuTCyU3pjJR4TNOXqs?si=_AayG1M6SkiRSomgoM_Vxg",
        ),
      ).toEqual("https://open.spotify.com/embed/track/7Ca8EuTCyU3pjJR4TNOXqs");
    });
  });

  describe("DailyMotion", () => {
    it("should handle dailymotion.com URLs", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0"),
      ).toEqual("https://www.dailymotion.com/embed/video/x7znrd0");
    });

    it("should handle http URLs", () => {
      expect(
        registry.toEmbedUrl("http://dailymotion.com/video/x7znrd0"),
      ).toEqual("https://www.dailymotion.com/embed/video/x7znrd0");
    });

    it("should handle URLs without protocol", () => {
      expect(registry.toEmbedUrl("dailymotion.com/video/x7znrd0")).toEqual(
        "https://www.dailymotion.com/embed/video/x7znrd0",
      );
    });
  });

  describe("Vimeo", () => {
    it("should handle vimeo.com URLs", () => {
      expect(registry.toEmbedUrl("https://vimeo.com/134668506")).toEqual(
        "https://player.vimeo.com/video/134668506",
      );
    });

    it("should handle channel URLs", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/channels/staffpicks/134668506"),
      ).toEqual("https://player.vimeo.com/video/134668506");
    });

    it("should handle URLs without protocol", () => {
      expect(
        registry.toEmbedUrl("vimeo.com/channels/staffpicks/134668506"),
      ).toEqual("https://player.vimeo.com/video/134668506");
    });
  });

  describe("Loom", () => {
    const loomId = "e883f70b219a49f6ba7fbeac71a72604";
    const expectedUrl = `https://www.loom.com/embed/${loomId}`;

    it("should handle loom.com/share URLs", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle URLs without www", () => {
      expect(registry.toEmbedUrl(`https://loom.com/share/${loomId}`)).toEqual(
        expectedUrl,
      );
    });

    it("should handle URLs without protocol", () => {
      expect(registry.toEmbedUrl(`loom.com/share/${loomId}`)).toEqual(
        expectedUrl,
      );
    });
  });

  describe("EdPuzzle", () => {
    const edPuzzleId = "606b413369971e424ec6021e";
    const expectedUrl = `https://edpuzzle.com/embed/media/${edPuzzleId}`;

    it("should handle edpuzzle.com/media URLs", () => {
      expect(
        registry.toEmbedUrl(`https://edpuzzle.com/media/${edPuzzleId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle URLs with www", () => {
      expect(
        registry.toEmbedUrl(`https://www.edpuzzle.com/media/${edPuzzleId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle URLs without protocol", () => {
      expect(registry.toEmbedUrl(`edpuzzle.com/media/${edPuzzleId}`)).toEqual(
        expectedUrl,
      );
    });
  });

  describe("Wistia", () => {
    const wistiaId = "26sk4lmiix";
    const expectedUrl = `https://fast.wistia.net/embed/iframe/${wistiaId}`;

    it("should handle wistia.com/medias URLs", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle wistia.com/embed URLs", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/embed/${wistiaId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle wi.st/medias URLs", () => {
      expect(
        registry.toEmbedUrl(`https://support.wi.st/medias/${wistiaId}`),
      ).toEqual(expectedUrl);
    });

    it("should handle wi.st/embed URLs", () => {
      expect(
        registry.toEmbedUrl(`https://support.wi.st/embed/${wistiaId}`),
      ).toEqual(expectedUrl);
    });
  });
});

describe("registry.toOutput", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return undefined for invalid URLs", () => {
    expect(registry.toOutput("notaurl")).toBeUndefined();
  });

  it("should return EmbedOutput with iframe node", () => {
    const output = registry.toOutput("https://youtu.be/FTQbiNvZqaY");
    expect(output).toBeDefined();
    expect(output?.nodes).toHaveLength(1);
    expect(output?.nodes[0].type).toBe("iframe");
  });

  it("should respect width/height options", () => {
    const output = registry.toOutput("https://youtu.be/FTQbiNvZqaY", {
      height: 450,
      width: 800,
    });
    expect(output?.nodes[0]).toMatchObject({
      attributes: expect.objectContaining({
        height: "450",
        width: "800",
      }),
      type: "iframe",
    });
  });
});

describe("renderOutput", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return empty string for undefined output", () => {
    expect(renderOutput(undefined)).toBe("");
  });

  it("should render iframe HTML", () => {
    const output = registry.toOutput("https://youtu.be/FTQbiNvZqaY");
    const html = renderOutput(output);
    expect(html).toContain("<iframe");
    expect(html).toContain("youtube-nocookie.com/embed/FTQbiNvZqaY");
    expect(html).toContain("</iframe>");
  });
});

describe("registry.match", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return ok=true with matcher and data for valid URLs", () => {
    const result = registry.match("https://youtu.be/FTQbiNvZqaY");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matcher.name).toBe("YouTube");
      expect(result.data).toEqual({ id: "FTQbiNvZqaY" });
    }
  });

  it("should return ok=false for invalid URLs", () => {
    const result = registry.match("https://unknown-site.com");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NO_MATCH");
    }
  });

  it("should handle Spotify data with content type", () => {
    // Spotify IDs are always 22 characters
    const spotifyId = "1w4etUoKfql47wtTFq031f";
    const result = registry.match(`spotify:track:${spotifyId}`);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matcher.name).toBe("Spotify");
      expect(result.data).toEqual({ contentType: "track", id: spotifyId });
    }
  });
});
