import { describe, expect, it } from "vitest";
import type { EmbedProvider } from "./provider";
import { YouTubeProvider } from "./providers/youtube";
import { EmbedProviderRegistry } from "./registry";

describe("EmbedProviderRegistry", () => {
  it("should register and retrieve a provider by name", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    // 1. Should retrieve the same provider instance by name
    const foundProvider = registry.getProviderByName("YouTube");
    expect(foundProvider).toBeDefined();
    expect(foundProvider?.name).toBe("YouTube");
  });

  it("should find the correct provider for a YouTube URL", () => {
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);

    const testUrl = "https://www.youtube.com/watch?v=FTQbiNvZqaY";
    const provider = registry.findProviderByUrl(testUrl);

    expect(provider).toBeDefined();
    expect(provider?.name).toBe("YouTube");

    // Check that getIdFromUrl works
    const id = provider?.getIdFromUrl(testUrl);
    expect(id).toBe("FTQbiNvZqaY");

    // Check embed URL construction
    const embedUrl = provider?.getEmbedUrlFromId("FTQbiNvZqaY");
    expect(embedUrl).toBe("https://www.youtube.com/embed/FTQbiNvZqaY");
  });

  it("should return undefined for an unknown URL", () => {
    const registry = new EmbedProviderRegistry();
    // No providers registered
    const testUrl = "https://example.com/unknown/video/12345";
    const provider = registry.findProviderByUrl(testUrl);

    expect(provider).toBeUndefined();
  });

  it("should support a custom provider", () => {
    // 1. Create a custom provider inline
    const MyCustomProvider: EmbedProvider = {
      canParseUrl(url: string) {
        // e.g. matches "https://mycustom.example.com/video/<id>"
        return /mycustom\.example\.com\/video\//.test(url);
      },
      getEmbedUrlFromId(id: string) {
        return `https://mycustom.example.com/embed/${id}`;
      },
      getIdFromUrl(url: string) {
        // e.g. last URL segment is the ID
        return url.split("/").pop() || "";
      },
      name: "MyCustom",
    };

    // 2. Create a new registry and register both YouTube + MyCustom
    const registry = new EmbedProviderRegistry();
    registry.register(YouTubeProvider);
    registry.register(MyCustomProvider);

    // 3. Confirm that MyCustomProvider is found by name
    const foundByName = registry.getProviderByName("MyCustom");
    expect(foundByName).toBeDefined();
    expect(foundByName?.name).toBe("MyCustom");

    // 4. Confirm the registry can parse a MyCustom URL
    const customUrl = "https://mycustom.example.com/video/xyz123";
    const foundByUrl = registry.findProviderByUrl(customUrl);
    expect(foundByUrl).toBeDefined();
    expect(foundByUrl?.name).toBe("MyCustom");

    // 5. Confirm ID and embed URL logic
    const extractedId = foundByUrl?.getIdFromUrl(customUrl);
    expect(extractedId).toBe("xyz123");

    const embedUrl = foundByUrl?.getEmbedUrlFromId("xyz123");
    expect(embedUrl).toBe("https://mycustom.example.com/embed/xyz123");
  });
});
