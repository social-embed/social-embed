import { describe, expect, it } from "vitest";
import { EmbedProviderRegistry } from "./registry";

// Import the providers under test
import { EdPuzzleProvider } from "./providers/edpuzzle";
import { LoomProvider } from "./providers/loom";
import { SpotifyProvider } from "./providers/spotify";
import { VimeoProvider } from "./providers/vimeo";
import { WistiaProvider } from "./providers/wistia";
import { YouTubeProvider } from "./providers/youtube";

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

    // getIdFromUrl can return an array: [id, type] or similar
    const ids = provider?.getIdFromUrl(url);
    expect(Array.isArray(ids)).toBe(true);
    if (Array.isArray(ids)) {
      // Example: [ "1w4etUoKfql47wtTFq031f", "track" ]
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
});
