import { describe, expect, it } from "vitest";
import {
  applySeededUrls,
  canRandomize,
  detectEmbeds,
  detectProvider,
  generateReactiveUpdates,
  selectUrlForProvider,
} from "./urlReplacer";

describe("detectProvider", () => {
  it("detects YouTube URLs", () => {
    expect(detectProvider("https://www.youtube.com/watch?v=abc")).toBe(
      "youtube",
    );
    expect(detectProvider("https://youtu.be/abc")).toBe("youtube");
    expect(detectProvider("https://youtube.com/watch?v=xyz")).toBe("youtube");
  });

  it("detects YouTube Shorts URLs", () => {
    expect(detectProvider("https://www.youtube.com/shorts/abc123")).toBe(
      "youtube-shorts",
    );
    expect(detectProvider("https://youtube.com/shorts/xyz")).toBe(
      "youtube-shorts",
    );
  });

  it("detects Vimeo URLs", () => {
    expect(detectProvider("https://vimeo.com/123456")).toBe("vimeo");
    expect(detectProvider("https://www.vimeo.com/789")).toBe("vimeo");
  });

  it("detects Spotify track URLs", () => {
    expect(
      detectProvider("https://open.spotify.com/track/7Ca8EuTCyU3pjJR4TNOXqs"),
    ).toBe("spotify-track");
  });

  it("detects Spotify playlist URLs", () => {
    expect(
      detectProvider(
        "https://open.spotify.com/playlist/37i9dQZF1DZ06evO0AI4xi",
      ),
    ).toBe("spotify-playlist");
  });

  it("detects DailyMotion URLs", () => {
    expect(detectProvider("https://www.dailymotion.com/video/x7znrd0")).toBe(
      "dailymotion",
    );
  });

  it("detects Loom URLs", () => {
    expect(
      detectProvider(
        "https://www.loom.com/share/6670e3eba3c84dc09ada8306c7138075",
      ),
    ).toBe("loom");
  });

  it("detects Wistia URLs", () => {
    expect(detectProvider("https://support.wistia.com/medias/26sk4lmiix")).toBe(
      "wistia",
    );
  });

  it("returns null for unknown URLs", () => {
    expect(detectProvider("https://example.com/video")).toBe(null);
    expect(detectProvider("https://google.com")).toBe(null);
  });
});

describe("detectEmbeds", () => {
  it("finds single o-embed element", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=abc"></o-embed>';
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(1);
    expect(embeds[0].url).toBe("https://youtube.com/watch?v=abc");
    expect(embeds[0].provider).toBe("youtube");
    expect(embeds[0].index).toBe(0);
    expect(embeds[0].selector).toBe("o-embed:nth-of-type(1)");
  });

  it("finds multiple o-embed elements", () => {
    const html = `
      <o-embed url="https://youtube.com/watch?v=a"></o-embed>
      <o-embed url="https://vimeo.com/123"></o-embed>
    `;
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(2);
    expect(embeds[0].provider).toBe("youtube");
    expect(embeds[1].provider).toBe("vimeo");
    expect(embeds[0].selector).toBe("o-embed:nth-of-type(1)");
    expect(embeds[1].selector).toBe("o-embed:nth-of-type(2)");
  });

  it("handles single quotes", () => {
    const html = "<o-embed url='https://youtube.com/watch?v=abc'></o-embed>";
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(1);
    expect(embeds[0].quote).toBe("'");
  });

  it("handles double quotes", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=abc"></o-embed>';
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(1);
    expect(embeds[0].quote).toBe('"');
  });

  it("handles embeds without url attribute", () => {
    const html = '<o-embed src="test"></o-embed>';
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(0);
  });

  it("handles mixed embeds with and without provider", () => {
    const html = `
      <o-embed url="https://youtube.com/watch?v=a"></o-embed>
      <o-embed url="https://unknown.com/video"></o-embed>
    `;
    const embeds = detectEmbeds(html);
    expect(embeds).toHaveLength(2);
    expect(embeds[0].provider).toBe("youtube");
    expect(embeds[1].provider).toBe(null);
  });
});

describe("selectUrlForProvider", () => {
  it("returns deterministic URL for same seed", () => {
    const url1 = selectUrlForProvider("youtube", "test-seed");
    const url2 = selectUrlForProvider("youtube", "test-seed");
    expect(url1).toBe(url2);
  });

  it("returns a valid URL from the pool", () => {
    const url = selectUrlForProvider("youtube", "any-seed");
    expect(url).toMatch(/youtube\.com/);
  });
});

describe("generateReactiveUpdates", () => {
  it("generates updates for embeds with providers", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const updates = generateReactiveUpdates(html, "seed-1");
    expect(updates).toHaveLength(1);
    expect(updates[0].selector).toBe("o-embed:nth-of-type(1)");
    expect(updates[0].attribute).toBe("url");
  });

  it("skips embeds without providers", () => {
    const html = '<o-embed url="https://unknown.com/video"></o-embed>';
    const updates = generateReactiveUpdates(html, "seed-1");
    expect(updates).toHaveLength(0);
  });

  it("generates deterministic updates", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const updates1 = generateReactiveUpdates(html, "seed-1");
    const updates2 = generateReactiveUpdates(html, "seed-1");
    expect(updates1[0].value).toBe(updates2[0].value);
  });
});

describe("applySeededUrls", () => {
  it("replaces URLs in HTML", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const result = applySeededUrls(html, "seed-1");
    expect(result.html).not.toBe(html);
    expect(result.html).toContain("o-embed");
    expect(result.html).toContain("url=");
  });

  it("preserves quote style", () => {
    const htmlDouble =
      '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const htmlSingle =
      "<o-embed url='https://youtube.com/watch?v=a'></o-embed>";

    const resultDouble = applySeededUrls(htmlDouble, "seed-1");
    const resultSingle = applySeededUrls(htmlSingle, "seed-1");

    expect(resultDouble.html).toContain('url="');
    expect(resultSingle.html).toContain("url='");
  });

  it("returns matching updates array", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const result = applySeededUrls(html, "seed-1");
    expect(result.updates).toHaveLength(1);
  });

  it("produces deterministic results", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    const result1 = applySeededUrls(html, "seed-1");
    const result2 = applySeededUrls(html, "seed-1");
    expect(result1.html).toBe(result2.html);
  });
});

describe("canRandomize", () => {
  it("returns true when embeds have providers", () => {
    const html = '<o-embed url="https://youtube.com/watch?v=a"></o-embed>';
    expect(canRandomize(html)).toBe(true);
  });

  it("returns false when no embeds have providers", () => {
    const html = '<o-embed url="https://unknown.com/video"></o-embed>';
    expect(canRandomize(html)).toBe(false);
  });

  it("returns false for empty HTML", () => {
    expect(canRandomize("")).toBe(false);
  });

  it("returns true when at least one embed has provider", () => {
    const html = `
      <o-embed url="https://unknown.com/video"></o-embed>
      <o-embed url="https://youtube.com/watch?v=a"></o-embed>
    `;
    expect(canRandomize(html)).toBe(true);
  });
});
