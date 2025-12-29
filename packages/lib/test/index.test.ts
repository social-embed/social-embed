/**
 * Tests for MatcherRegistry and core functionality.
 *
 * Tests verify that the registry correctly matches URLs and generates
 * embed URLs for all supported providers.
 */

import { describe, expect, it } from "vitest";

import {
  convertUrlToEmbedUrl,
  getSpotifyDefaultSize,
  getSpotifyHeight,
  getSpotifyWidth,
  MatcherRegistry,
  renderOutput,
  SPOTIFY_HEIGHTS,
  SpotifyMatcher,
  YouTubeMatcher,
} from "../src";

// Note: defaultRegistry was removed in v2 - use MatcherRegistry.withDefaults()

describe("convertUrlToEmbedUrl (v1 backward compatibility)", () => {
  it("should convert YouTube URL to embed URL", () => {
    const result = convertUrlToEmbedUrl("https://youtu.be/FTQbiNvZqaY");
    expect(result).toBe("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
  });

  it("should convert Vimeo URL to embed URL", () => {
    const result = convertUrlToEmbedUrl("https://vimeo.com/134668506");
    expect(result).toBe("https://player.vimeo.com/video/134668506");
  });

  it("should return empty string for unrecognized URLs", () => {
    const result = convertUrlToEmbedUrl("https://example.com/video");
    expect(result).toBe("");
  });

  it("should return empty string for invalid input", () => {
    expect(convertUrlToEmbedUrl("")).toBe("");
    expect(convertUrlToEmbedUrl("not-a-url")).toBe("");
  });
});

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

describe("registry.isMatch", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return true when result matches the specified matcher", () => {
    const result = registry.match("https://youtu.be/FTQbiNvZqaY");
    expect(registry.isMatch(result, YouTubeMatcher)).toBe(true);
  });

  it("should narrow result type allowing access to typed data", () => {
    const result = registry.match("https://youtu.be/FTQbiNvZqaY");
    if (registry.isMatch(result, YouTubeMatcher)) {
      // After isMatch, result.data should be accessible
      expect(result.data.videoId).toBe("FTQbiNvZqaY");
    } else {
      throw new Error("Expected isMatch to return true");
    }
  });

  it("should return false when result is from a different matcher", () => {
    const result = registry.match("https://youtu.be/FTQbiNvZqaY");
    expect(registry.isMatch(result, SpotifyMatcher)).toBe(false);
  });

  it("should return false when match fails", () => {
    const result = registry.match("https://example.com/unknown");
    expect(registry.isMatch(result, YouTubeMatcher)).toBe(false);
    expect(registry.isMatch(result, SpotifyMatcher)).toBe(false);
  });

  it("should work with Spotify matcher", () => {
    const result = registry.match(
      "https://open.spotify.com/track/7Ca8EuTCyU3pjJR4TNOXqs",
    );
    expect(registry.isMatch(result, SpotifyMatcher)).toBe(true);
    if (registry.isMatch(result, SpotifyMatcher)) {
      expect(result.data.contentType).toBe("track");
      expect(result.data.id).toBe("7Ca8EuTCyU3pjJR4TNOXqs");
    }
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

    it("should handle youtube.com/shorts URLs", () => {
      expect(
        registry.toEmbedUrl("https://www.youtube.com/shorts/FTQbiNvZqaY"),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should handle Shorts URLs without www", () => {
      expect(
        registry.toEmbedUrl("https://youtube.com/shorts/FTQbiNvZqaY"),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should handle Shorts URLs without protocol", () => {
      expect(registry.toEmbedUrl("youtube.com/shorts/FTQbiNvZqaY")).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY",
      );
    });

    it("should handle Shorts URLs with query parameters", () => {
      expect(
        registry.toEmbedUrl(
          "https://www.youtube.com/shorts/FTQbiNvZqaY?feature=share",
        ),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
    });

    it("should add start parameter", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { start: 90 }),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?start=90");
    });

    it("should add end parameter", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { end: 180 }),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?end=180");
    });

    it("should add autoplay parameter", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { autoplay: true }),
      ).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?autoplay=1",
      );
    });

    it("should add mute parameter", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { mute: true }),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?mute=1");
    });

    it("should add loop parameter with playlist for single video", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { loop: true }),
      ).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?loop=1&playlist=FTQbiNvZqaY",
      );
    });

    it("should add controls=0 when controls is false", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", {
          controls: false,
        }),
      ).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?controls=0",
      );
    });

    it("should combine multiple parameters", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", {
          autoplay: true,
          end: 180,
          mute: true,
          start: 90,
        }),
      ).toEqual(
        "https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?start=90&end=180&autoplay=1&mute=1",
      );
    });

    it("should combine privacy=false with other parameters", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", {
          privacy: false,
          start: 60,
        }),
      ).toEqual("https://www.youtube.com/embed/FTQbiNvZqaY?start=60");
    });

    it("should floor decimal time values", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", { start: 90.7 }),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY?start=90");
    });

    it("should ignore start/end of 0", () => {
      expect(
        registry.toEmbedUrl("https://youtu.be/FTQbiNvZqaY", {
          end: 0,
          start: 0,
        }),
      ).toEqual("https://www.youtube-nocookie.com/embed/FTQbiNvZqaY");
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

    it("should use 100% width and 352px height by default for albums/playlists", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3");
      expect(output?.nodes[0]).toMatchObject({
        attributes: expect.objectContaining({
          height: "352",
          width: "100%",
        }),
        type: "iframe",
      });
    });

    it("should use compact 80px height for tracks", () => {
      const output = registry.toOutput("spotify:track:1w4etUoKfql47wtTFq031f");
      expect(output?.nodes[0]).toMatchObject({
        attributes: expect.objectContaining({
          height: "80",
          width: "100%",
        }),
        type: "iframe",
      });
    });
  });

  describe("DailyMotion", () => {
    it("should handle dailymotion.com URLs with new endpoint", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0"),
      ).toEqual("https://geo.dailymotion.com/player.html?video=x7znrd0");
    });

    it("should handle http URLs", () => {
      expect(
        registry.toEmbedUrl("http://dailymotion.com/video/x7znrd0"),
      ).toEqual("https://geo.dailymotion.com/player.html?video=x7znrd0");
    });

    it("should handle URLs without protocol", () => {
      expect(registry.toEmbedUrl("dailymotion.com/video/x7znrd0")).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0",
      );
    });

    it("should handle dai.ly short URLs", () => {
      expect(registry.toEmbedUrl("https://dai.ly/x7znrd0")).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0",
      );
    });

    it("should add mute parameter", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          mute: true,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0&mute=true",
      );
    });

    it("should add startTime parameter", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          startTime: 90,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0&startTime=90",
      );
    });

    it("should add loop parameter", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          loop: true,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0&loop=true",
      );
    });

    it("should combine multiple parameters", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          loop: true,
          mute: true,
          startTime: 60,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0&mute=true&startTime=60&loop=true",
      );
    });

    it("should use custom Player ID when provided", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          playerId: "xc394",
        }),
      ).toEqual("https://geo.dailymotion.com/player/xc394.html?video=x7znrd0");
    });

    it("should combine Player ID with other parameters", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          mute: true,
          playerId: "xc394",
          startTime: 30,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player/xc394.html?video=x7znrd0&mute=true&startTime=30",
      );
    });

    it("should floor decimal startTime values", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          startTime: 90.7,
        }),
      ).toEqual(
        "https://geo.dailymotion.com/player.html?video=x7znrd0&startTime=90",
      );
    });

    it("should ignore startTime of 0", () => {
      expect(
        registry.toEmbedUrl("https://www.dailymotion.com/video/x7znrd0", {
          startTime: 0,
        }),
      ).toEqual("https://geo.dailymotion.com/player.html?video=x7znrd0");
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

    it("should add autoplay parameter", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { autoplay: true }),
      ).toEqual("https://player.vimeo.com/video/134668506?autoplay=1");
    });

    it("should add muted parameter", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { muted: true }),
      ).toEqual("https://player.vimeo.com/video/134668506?muted=1");
    });

    it("should add loop parameter", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { loop: true }),
      ).toEqual("https://player.vimeo.com/video/134668506?loop=1");
    });

    it("should add background parameter", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", {
          background: true,
        }),
      ).toEqual("https://player.vimeo.com/video/134668506?background=1");
    });

    it("should add autopause=0 when autopause is false", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", {
          autopause: false,
        }),
      ).toEqual("https://player.vimeo.com/video/134668506?autopause=0");
    });

    it("should add controls=0 when controls is false", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { controls: false }),
      ).toEqual("https://player.vimeo.com/video/134668506?controls=0");
    });

    it("should add title=0 when title is false", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { title: false }),
      ).toEqual("https://player.vimeo.com/video/134668506?title=0");
    });

    it("should add byline=0 when byline is false", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { byline: false }),
      ).toEqual("https://player.vimeo.com/video/134668506?byline=0");
    });

    it("should add portrait=0 when portrait is false", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", { portrait: false }),
      ).toEqual("https://player.vimeo.com/video/134668506?portrait=0");
    });

    it("should combine multiple parameters", () => {
      expect(
        registry.toEmbedUrl("https://vimeo.com/134668506", {
          autoplay: true,
          byline: false,
          loop: true,
          muted: true,
          title: false,
        }),
      ).toEqual(
        "https://player.vimeo.com/video/134668506?autoplay=1&muted=1&loop=1&title=0&byline=0",
      );
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

    it("should add start time parameter", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          start: 80,
        }),
      ).toEqual(`${expectedUrl}?t=80s`);
    });

    it("should add autoplay parameter", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          autoplay: true,
        }),
      ).toEqual(`${expectedUrl}?autoplay=1`);
    });

    it("should add hideEmbedTopBar parameter", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          hideTopBar: true,
        }),
      ).toEqual(`${expectedUrl}?hideEmbedTopBar=true`);
    });

    it("should combine multiple parameters", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          autoplay: true,
          hideTopBar: true,
          start: 120,
        }),
      ).toEqual(`${expectedUrl}?t=120s&autoplay=1&hideEmbedTopBar=true`);
    });

    it("should floor decimal start times", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          start: 80.7,
        }),
      ).toEqual(`${expectedUrl}?t=80s`);
    });

    it("should ignore start of 0", () => {
      expect(
        registry.toEmbedUrl(`https://www.loom.com/share/${loomId}`, {
          start: 0,
        }),
      ).toEqual(expectedUrl);
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

    // Wistia option tests
    it("should support autoPlay option (camelCase)", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          autoPlay: true,
        }),
      ).toEqual(`${expectedUrl}?autoPlay=true`);
    });

    it("should support muted option", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          muted: true,
        }),
      ).toEqual(`${expectedUrl}?muted=true`);
    });

    it("should support playerColor option", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          playerColor: "ff69b4",
        }),
      ).toEqual(`${expectedUrl}?playerColor=ff69b4`);
    });

    it("should strip # from playerColor", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          playerColor: "#00ff00",
        }),
      ).toEqual(`${expectedUrl}?playerColor=00ff00`);
    });

    it("should support videoFoam option", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          videoFoam: true,
        }),
      ).toEqual(`${expectedUrl}?videoFoam=true`);
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          videoFoam: false,
        }),
      ).toEqual(`${expectedUrl}?videoFoam=false`);
    });

    it("should combine multiple Wistia options", () => {
      expect(
        registry.toEmbedUrl(`https://support.wistia.com/medias/${wistiaId}`, {
          autoPlay: true,
          muted: true,
          playerColor: "ff69b4",
        }),
      ).toEqual(`${expectedUrl}?autoPlay=true&muted=true&playerColor=ff69b4`);
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

  it("should render dangerouslySetHtml content directly", () => {
    const output = {
      nodes: [
        {
          content: "<blockquote>Test</blockquote>",
          type: "dangerouslySetHtml" as const,
        },
      ],
    };
    expect(renderOutput(output)).toBe("<blockquote>Test</blockquote>");
  });

  it("should handle mixed iframe and dangerouslySetHtml nodes", () => {
    const output = {
      nodes: [
        {
          attributes: { height: "315", width: "560" },
          src: "https://example.com/embed",
          type: "iframe" as const,
        },
        {
          content: "<div>Extra content</div>",
          type: "dangerouslySetHtml" as const,
        },
      ],
    };
    const html = renderOutput(output);
    expect(html).toContain("<iframe");
    expect(html).toContain("example.com/embed");
    expect(html).toContain("<div>Extra content</div>");
  });

  it("should return empty string for empty nodes array", () => {
    const output = { nodes: [] };
    expect(renderOutput(output)).toBe("");
  });
});

describe("registry.match", () => {
  const registry = MatcherRegistry.withDefaults();

  it("should return ok=true with matcher and data for valid URLs", () => {
    const result = registry.match("https://youtu.be/FTQbiNvZqaY");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matcher.name).toBe("YouTube");
      expect(result.data).toEqual({ videoId: "FTQbiNvZqaY" });
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

describe("Spotify utility functions", () => {
  describe("SPOTIFY_HEIGHTS", () => {
    it("should have correct height values for all content types", () => {
      expect(SPOTIFY_HEIGHTS.track).toEqual({
        compact: 80,
        large: 352,
        normal: 152,
      });
      expect(SPOTIFY_HEIGHTS.album).toEqual({
        compact: 152,
        large: 500,
        normal: 352,
      });
      expect(SPOTIFY_HEIGHTS.playlist).toEqual({
        compact: 152,
        large: 500,
        normal: 352,
      });
      expect(SPOTIFY_HEIGHTS.artist).toEqual({
        compact: 152,
        large: 500,
        normal: 352,
      });
      expect(SPOTIFY_HEIGHTS.show).toEqual({
        compact: 152,
        large: 352,
        normal: 232,
      });
      expect(SPOTIFY_HEIGHTS.episode).toEqual({
        compact: 152,
        large: 352,
        normal: 232,
      });
    });

    it("should have coverart and video dimensions", () => {
      expect(SPOTIFY_HEIGHTS.coverart).toEqual({
        compact: 80,
        large: 352,
        normal: 152,
      });
      expect(SPOTIFY_HEIGHTS.video).toEqual({ height: 351, width: 624 });
    });
  });

  describe("getSpotifyDefaultSize", () => {
    it("should return compact for tracks", () => {
      expect(getSpotifyDefaultSize("track")).toBe("compact");
    });

    it("should return normal for albums, playlists, artists", () => {
      expect(getSpotifyDefaultSize("album")).toBe("normal");
      expect(getSpotifyDefaultSize("playlist")).toBe("normal");
      expect(getSpotifyDefaultSize("artist")).toBe("normal");
    });

    it("should return normal for podcasts", () => {
      expect(getSpotifyDefaultSize("show")).toBe("normal");
      expect(getSpotifyDefaultSize("episode")).toBe("normal");
    });
  });

  describe("getSpotifyHeight", () => {
    it("should return auto-detected height without size", () => {
      expect(getSpotifyHeight("track")).toBe(80); // track defaults to compact
      expect(getSpotifyHeight("album")).toBe(352); // album defaults to normal
    });

    it("should return explicit size heights", () => {
      expect(getSpotifyHeight("track", "compact")).toBe(80);
      expect(getSpotifyHeight("track", "normal")).toBe(152);
      expect(getSpotifyHeight("track", "large")).toBe(352);
    });

    it("should return video height for video podcasts", () => {
      expect(getSpotifyHeight("episode", "normal", { video: true })).toBe(351);
      expect(getSpotifyHeight("show", "compact", { video: true })).toBe(351);
    });

    it("should return coverart heights for coverart view", () => {
      expect(getSpotifyHeight("album", "compact", { view: "coverart" })).toBe(
        80,
      );
      expect(getSpotifyHeight("album", "normal", { view: "coverart" })).toBe(
        152,
      );
      expect(getSpotifyHeight("album", "large", { view: "coverart" })).toBe(
        352,
      );
    });
  });

  describe("getSpotifyWidth", () => {
    it("should return 100% for standard embeds", () => {
      expect(getSpotifyWidth()).toBe("100%");
      expect(getSpotifyWidth({})).toBe("100%");
    });

    it("should return 624 for video podcasts", () => {
      expect(getSpotifyWidth({ video: true })).toBe(624);
    });
  });
});

describe("Spotify features", () => {
  const registry = MatcherRegistry.withDefaults();

  describe("size tiers", () => {
    it("should auto-detect compact size for tracks", () => {
      const output = registry.toOutput("spotify:track:1w4etUoKfql47wtTFq031f");
      expect(output?.nodes[0].attributes?.height).toBe("80");
    });

    it("should auto-detect normal size for albums", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3");
      expect(output?.nodes[0].attributes?.height).toBe("352");
    });

    it("should respect explicit size option", () => {
      const output = registry.toOutput("spotify:track:1w4etUoKfql47wtTFq031f", {
        size: "large",
      });
      expect(output?.nodes[0].attributes?.height).toBe("352");
    });

    it("should respect explicit height over size tier", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3", {
        height: 200,
        size: "compact",
      });
      expect(output?.nodes[0].attributes?.height).toBe("200");
    });
  });

  describe("theme", () => {
    it("should add dark theme param", () => {
      const url = registry.toEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3", {
        theme: "dark",
      });
      expect(url).toContain("theme=0");
    });

    it("should add light theme param", () => {
      const url = registry.toEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3", {
        theme: "light",
      });
      expect(url).toContain("theme=1");
    });

    it("should preserve theme from input URL", () => {
      const result = registry.match(
        "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3?theme=0",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual({
          contentType: "album",
          id: "1DFixLWuPkv3KT3TnV35m3",
          theme: "dark",
        });
      }
    });

    it("should pass through theme from input URL to embed", () => {
      const url = registry.toEmbedUrl(
        "https://open.spotify.com/track/1w4etUoKfql47wtTFq031f?theme=1",
      );
      expect(url).toContain("theme=1");
    });
  });

  describe("coverart view", () => {
    it("should add view=coverart param", () => {
      const url = registry.toEmbedUrl("spotify:album:1DFixLWuPkv3KT3TnV35m3", {
        view: "coverart",
      });
      expect(url).toContain("view=coverart");
    });

    it("should use coverart heights when view is coverart", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3", {
        size: "compact",
        view: "coverart",
      });
      expect(output?.nodes[0].attributes?.height).toBe("80");
    });
  });

  describe("video podcasts", () => {
    it("should detect /video suffix in URL", () => {
      const result = registry.match(
        "https://open.spotify.com/episode/1w4etUoKfql47wtTFq031f/video",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toEqual({
          contentType: "episode",
          id: "1w4etUoKfql47wtTFq031f",
          video: true,
        });
      }
    });

    it("should use fixed video dimensions", () => {
      const output = registry.toOutput(
        "https://open.spotify.com/episode/1w4etUoKfql47wtTFq031f/video",
      );
      expect(output?.nodes[0].attributes?.width).toBe("624");
      expect(output?.nodes[0].attributes?.height).toBe("351");
    });

    it("should not detect video for non-podcast content", () => {
      const result = registry.match(
        "https://open.spotify.com/track/1w4etUoKfql47wtTFq031f/video",
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.video).toBeUndefined();
      }
    });
  });

  describe("start time", () => {
    it("should add start time for episodes", () => {
      const url = registry.toEmbedUrl(
        "spotify:episode:1w4etUoKfql47wtTFq031f",
        { start: 120 },
      );
      expect(url).toContain("t=120");
    });

    it("should add start time for shows", () => {
      const url = registry.toEmbedUrl("spotify:show:1w4etUoKfql47wtTFq031f", {
        start: 60,
      });
      expect(url).toContain("t=60");
    });

    it("should ignore start time for non-podcast content", () => {
      const url = registry.toEmbedUrl("spotify:track:1w4etUoKfql47wtTFq031f", {
        start: 120,
      });
      expect(url).not.toContain("t=");
    });

    it("should floor decimal start times", () => {
      const url = registry.toEmbedUrl(
        "spotify:episode:1w4etUoKfql47wtTFq031f",
        { start: 90.7 },
      );
      expect(url).toContain("t=90");
    });
  });

  describe("enhanced iframe attributes", () => {
    it("should include loading=lazy", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3");
      expect(output?.nodes[0].attributes?.loading).toBe("lazy");
    });

    it("should include expanded allow permissions", () => {
      const output = registry.toOutput("spotify:album:1DFixLWuPkv3KT3TnV35m3");
      const allow = output?.nodes[0].attributes?.allow;
      expect(allow).toContain("autoplay");
      expect(allow).toContain("clipboard-write");
      expect(allow).toContain("encrypted-media");
      expect(allow).toContain("fullscreen");
      expect(allow).toContain("picture-in-picture");
    });
  });

  describe("SpotifyMatcher.toEmbedUrl", () => {
    it("should combine multiple options", () => {
      const url = SpotifyMatcher.toEmbedUrl(
        { contentType: "episode", id: "1w4etUoKfql47wtTFq031f" },
        { start: 30, theme: "dark", view: "coverart" },
      );
      expect(url).toContain("theme=0");
      expect(url).toContain("view=coverart");
      expect(url).toContain("t=30");
    });
  });
});
