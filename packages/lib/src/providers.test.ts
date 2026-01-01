import { describe, expect, it } from "vitest";
// Import the providers under test
import { EdPuzzleProvider } from "./providers/edpuzzle";
import { LoomProvider } from "./providers/loom";
import { SpotifyProvider } from "./providers/spotify";
import { VimeoProvider } from "./providers/vimeo";
import { WistiaProvider } from "./providers/wistia";
import {
  isYouTubeShortsUrl,
  YOUTUBE_SHORTS_DIMENSIONS,
  YouTubeProvider,
} from "./providers/youtube";
import { EmbedProviderRegistry } from "./registry";

describe("EdPuzzleProvider", () => {
  it("should detect and parse EdPuzzle URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(EdPuzzleProvider);

    // Example EdPuzzle URL
    const url = "https://edpuzzle.com/media/606b413369971e424ec6021e";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("EdPuzzle");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("606b413369971e424ec6021e");

    const embedUrl = provider?.getEmbedUrlFromId("606b413369971e424ec6021e");
    expect(embedUrl).toBe(
      "https://edpuzzle.com/embed/media/606b413369971e424ec6021e",
    );
  });

  it("should return undefined for non-EdPuzzle links", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(EdPuzzleProvider);

    const unknownUrl = "https://example.com/something/else";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });
});

describe("LoomProvider", () => {
  it("should detect and parse Loom URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(LoomProvider);

    // Example Loom URL
    const url = "https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Loom");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("e883f70b219a49f6ba7fbeac71a72604");

    const embedUrl = provider?.getEmbedUrlFromId(
      "e883f70b219a49f6ba7fbeac71a72604",
    );
    expect(embedUrl).toBe(
      "https://www.loom.com/embed/e883f70b219a49f6ba7fbeac71a72604",
    );
  });

  it("should return undefined for non-Loom links", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(LoomProvider);

    const unknownUrl = "https://example.com/foo/bar";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });
});

describe("SpotifyProvider", () => {
  it("should detect and parse Spotify track URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    // Example Spotify track URL
    const url =
      "https://open.spotify.com/track/1w4etUoKfql47wtTFq031f?si=_AayG1M6SkiRSomgoM_Vxg";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      // Expect [id, type] => ["1w4etUoKfql47wtTFq031f", "track"]
      expect(ids[0]).toBe("1w4etUoKfql47wtTFq031f");
      expect(ids[1]).toBe("track");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/track/1w4etUoKfql47wtTFq031f",
      );
    }
  });

  it("should detect and parse Spotify album URIs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const spotifyUri = "spotify:album:1DFixLWuPkv3KT3TnV35m3";
    const provider = registry.findProviderByUrl(spotifyUri);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(spotifyUri);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("1DFixLWuPkv3KT3TnV35m3");
      expect(ids[1]).toBe("album");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
      );
    }
  });

  it("should detect and parse Spotify playlist URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const url = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("37i9dQZF1DXcBWIGoYBM5M");
      expect(ids[1]).toBe("playlist");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
      );
    }
  });

  it("should detect and parse Spotify artist URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const url = "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("1Xyo4u8uXC1ZmMpatF05PJ");
      expect(ids[1]).toBe("artist");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/artist/1Xyo4u8uXC1ZmMpatF05PJ",
      );
    }
  });

  it("should detect and parse Spotify show URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const url = "https://open.spotify.com/show/5YEXv3C5fnMA3lFzNim4Ya";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("5YEXv3C5fnMA3lFzNim4Ya");
      expect(ids[1]).toBe("show");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/show/5YEXv3C5fnMA3lFzNim4Ya",
      );
    }
  });

  it("should detect and parse Spotify episode URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const url = "https://open.spotify.com/episode/4XplJhQEj1Qp6QzrbA5sYk";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("4XplJhQEj1Qp6QzrbA5sYk");
      expect(ids[1]).toBe("episode");

      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/episode/4XplJhQEj1Qp6QzrbA5sYk",
      );
    }
  });

  it("should support custom query parameters for a track URL", () => {
    // Example of passing them in the embed (though typically you'd append them to the generated URL)
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const trackUrl = "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P";
    const provider = registry.findProviderByUrl(trackUrl);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Spotify");

    const ids = provider?.getIdFromUrl(trackUrl);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      expect(ids[0]).toBe("7ouMYWpwJ422jRcDASZB7P");
      expect(ids[1]).toBe("track");

      // Suppose you supply custom query params. Typically you'd do:
      // `embedUrl + "?theme=0&width=300&height=380"`.
      // Here, we'll just confirm the base embed is correct:
      const embedUrl = provider?.getEmbedUrlFromId(ids[0], ids[1]);
      expect(embedUrl).toBe(
        "https://open.spotify.com/embed/track/7ouMYWpwJ422jRcDASZB7P",
      );
      // Then you'd manually append "?theme=0&width=300&height=380"
      // in your code if desired.
    }
  });

  it("should return undefined for non-Spotify links", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(SpotifyProvider);

    const unknownUrl = "https://example.com/album/1DFixLWuPkv3KT3TnV35m3";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });
});

describe("VimeoProvider", () => {
  it("should detect and parse Vimeo URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(VimeoProvider);

    // Example Vimeo URL
    const url = "https://vimeo.com/channels/staffpicks/134668506";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Vimeo");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("134668506");

    const embedUrl = provider?.getEmbedUrlFromId("134668506");
    expect(embedUrl).toBe("https://player.vimeo.com/video/134668506");
  });

  it("should return undefined for non-Vimeo links", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(VimeoProvider);

    const unknownUrl = "https://example.com/my-video/999999";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });
});

describe("WistiaProvider", () => {
  it("should detect and parse Wistia URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(WistiaProvider);

    // Example Wistia URL
    const url = "https://support.wistia.com/medias/26sk4lmiix";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("Wistia");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("26sk4lmiix");

    const embedUrl = provider?.getEmbedUrlFromId("26sk4lmiix");
    expect(embedUrl).toBe("https://fast.wistia.net/embed/iframe/26sk4lmiix");
  });

  it("should return undefined for non-Wistia links", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(WistiaProvider);

    const unknownUrl = "https://example.com/medias/26sk4lmiix";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });
});

describe("YouTubeProvider", () => {
  it("should detect and parse a standard YouTube watch URL", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    const url = "https://www.youtube.com/watch?v=9bZkp7q19f0";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("YouTube");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("9bZkp7q19f0");

    const embedUrl = provider?.getEmbedUrlFromId("9bZkp7q19f0");
    expect(embedUrl).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });

  it("should detect and parse a shortened youtu.be URL", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    const url = "https://youtu.be/9bZkp7q19f0";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("YouTube");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("9bZkp7q19f0");

    const embedUrl = provider?.getEmbedUrlFromId("9bZkp7q19f0");
    expect(embedUrl).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });

  it("should detect partial youtu.be without https:// prefix", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    const url = "youtu.be/9bZkp7q19f0";
    const provider = registry.findProviderByUrl(url);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("YouTube");

    const id = provider?.getIdFromUrl(url);
    expect(id).toBe("9bZkp7q19f0");

    const embedUrl = provider?.getEmbedUrlFromId("9bZkp7q19f0");
    expect(embedUrl).toBe("https://www.youtube.com/embed/9bZkp7q19f0");
  });

  it("should return undefined for unknown URLs", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    const unknownUrl = "https://example.com/video/abcdef";
    const provider = registry.findProviderByUrl(unknownUrl);

    expect(provider).toBeUndefined();
  });

  describe("YouTube Shorts support", () => {
    it("should detect and parse YouTube Shorts URLs", () => {
      const registry = new EmbedProviderRegistry();
      registry.register(YouTubeProvider);

      const url = "https://www.youtube.com/shorts/eWasNsSa42s";
      const provider = registry.findProviderByUrl(url);

      expect(provider).toBeDefined();
      expect(provider?.name).toBe("YouTube");

      const id = provider?.getIdFromUrl(url);
      expect(id).toBe("eWasNsSa42s");

      const embedUrl = provider?.getEmbedUrlFromId("eWasNsSa42s");
      expect(embedUrl).toBe("https://www.youtube.com/embed/eWasNsSa42s");
    });

    it("should detect Shorts URL without www prefix", () => {
      const registry = new EmbedProviderRegistry();
      registry.register(YouTubeProvider);

      const url = "https://youtube.com/shorts/eWasNsSa42s";
      const provider = registry.findProviderByUrl(url);

      expect(provider).toBeDefined();
      expect(provider?.getIdFromUrl(url)).toBe("eWasNsSa42s");
    });

    it("should detect Shorts URL with query parameters", () => {
      const registry = new EmbedProviderRegistry();
      registry.register(YouTubeProvider);

      const url = "https://www.youtube.com/shorts/eWasNsSa42s?feature=share";
      const provider = registry.findProviderByUrl(url);

      expect(provider).toBeDefined();
      expect(provider?.getIdFromUrl(url)).toBe("eWasNsSa42s");
    });

    it("should detect Shorts URL with youtube-nocookie domain", () => {
      const registry = new EmbedProviderRegistry();
      registry.register(YouTubeProvider);

      const url = "https://www.youtube-nocookie.com/shorts/eWasNsSa42s";
      const provider = registry.findProviderByUrl(url);

      expect(provider).toBeDefined();
      expect(provider?.getIdFromUrl(url)).toBe("eWasNsSa42s");
    });
  });

  describe("isYouTubeShortsUrl helper", () => {
    it("should return true for Shorts URLs", () => {
      expect(
        isYouTubeShortsUrl("https://www.youtube.com/shorts/eWasNsSa42s"),
      ).toBe(true);
      expect(isYouTubeShortsUrl("https://youtube.com/shorts/abc123def45")).toBe(
        true,
      );
      expect(
        isYouTubeShortsUrl(
          "https://www.youtube.com/shorts/eWasNsSa42s?feature=share",
        ),
      ).toBe(true);
    });

    it("should return false for regular YouTube URLs", () => {
      expect(
        isYouTubeShortsUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
      ).toBe(false);
      expect(isYouTubeShortsUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(false);
      expect(
        isYouTubeShortsUrl("https://www.youtube.com/embed/dQw4w9WgXcQ"),
      ).toBe(false);
    });

    it("should return false for undefined or empty input", () => {
      expect(isYouTubeShortsUrl(undefined)).toBe(false);
      expect(isYouTubeShortsUrl("")).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(
        isYouTubeShortsUrl("https://www.YOUTUBE.com/shorts/eWasNsSa42s"),
      ).toBe(true);
      expect(
        isYouTubeShortsUrl("https://www.youtube.com/SHORTS/eWasNsSa42s"),
      ).toBe(true);
    });
  });

  describe("YOUTUBE_SHORTS_DIMENSIONS constant", () => {
    it("should have correct portrait aspect ratio dimensions (9:16)", () => {
      expect(YOUTUBE_SHORTS_DIMENSIONS.width).toBe(347);
      expect(YOUTUBE_SHORTS_DIMENSIONS.height).toBe(616);

      // Verify approximate 9:16 aspect ratio
      const aspectRatio =
        YOUTUBE_SHORTS_DIMENSIONS.width / YOUTUBE_SHORTS_DIMENSIONS.height;
      expect(aspectRatio).toBeCloseTo(9 / 16, 1);
    });
  });
});
