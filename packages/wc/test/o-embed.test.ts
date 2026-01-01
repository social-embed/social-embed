import { describe, expect, it } from "vitest";
import { expectShadowDomEventually, fixture, html } from "./utils";
import "../src/OEmbedElement";
import type { OEmbedElement } from "../src/OEmbedElement";

describe("o-embed", () => {
  it("is defined as a custom element", () => {
    expect(customElements.get("o-embed")).toBeDefined();
  });

  it("renders empty with no URL", async () => {
    const el = await fixture<HTMLElement>(html`<o-embed></o-embed>`);

    // The component should render an empty shadow DOM when no URL is provided
    expect(el.shadowRoot).toBeTruthy();

    // Check that the shadow DOM is effectively empty (no slot or iframe)
    const slot = el.shadowRoot?.querySelector("slot");
    expect(slot).toBeNull();

    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeNull();

    // Verify that the shadow DOM is empty or contains only comments
    const children = Array.from(el.shadowRoot?.children || []);
    expect(children.length).toBe(0);
  });

  it("shows error for unrecognized URL", async () => {
    const customUrl = "https://example.com/myembed/video1234";
    const el = await fixture(html`<o-embed url=${customUrl}></o-embed>`);

    // New behavior: unrecognized URLs show an error message, not a fallback iframe
    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeNull();

    // Check error message
    const errorText = el.shadowRoot?.textContent?.trim();
    expect(errorText).toContain("No provider found for");
  });

  it("renders an error message for invalid URLs", async () => {
    const invalidUrl = "not a valid url";
    const el = document.createElement("o-embed") as OEmbedElement;
    el.url = invalidUrl;
    document.body.appendChild(el);

    // Wait for component to render
    await expectShadowDomEventually(el, (shadow) => {
      return shadow.textContent?.includes("No provider found for") || false;
    });

    // Check error message content
    const errorText = el.shadowRoot?.textContent?.trim();
    expect(errorText).toContain("No provider found for");

    // The invalidUrl should appear in the error message
    // We need to check if it's part of the error message, removing any styling content
    const textWithoutStyles = errorText
      ?.replace(/:\s*host\s*\{[^}]*\}|iframe\s*\{[^}]*\}/g, "")
      .trim();
    expect(textWithoutStyles).toContain(invalidUrl);

    // Verify no iframe is rendered
    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeNull();

    document.body.removeChild(el);
  });

  it("respects custom width and height attributes", async () => {
    // Use a recognized URL to test width/height
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const customWidth = "800";
    const customHeight = "450";

    const el = await fixture(
      html`<o-embed
        url=${youtubeUrl}
        width=${customWidth}
        height=${customHeight}
      ></o-embed>`,
    );

    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute("width")).toBe(customWidth);
    expect(iframe?.getAttribute("height")).toBe(customHeight);
  });

  it("renders YouTube embed for YouTube URL", async () => {
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const el = document.createElement("o-embed") as OEmbedElement;
    el.url = youtubeUrl;
    document.body.appendChild(el);

    // Wait for component to render
    await expectShadowDomEventually(el, (shadow) => {
      return shadow.querySelector("iframe") !== null;
    });

    // Basic iframe checks
    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).not.toBeNull();
    // Privacy mode is enabled by default, so youtube-nocookie.com is used
    expect(iframe?.getAttribute("src")).toContain(
      "youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(iframe?.getAttribute("width")).toBe("560");
    expect(iframe?.getAttribute("height")).toBe("315");

    // Check for YouTube-specific attributes
    expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);

    document.body.removeChild(el);
  });

  it("renders Vimeo embed for Vimeo URL", async () => {
    const vimeoUrl = "https://vimeo.com/148751763";
    const el = await fixture(html`<o-embed url=${vimeoUrl}></o-embed>`);

    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeTruthy();

    // Check that the src contains vimeo embed URL format
    const src = iframe?.getAttribute("src");
    expect(src).toContain("player.vimeo.com/video/");
    expect(src).toContain("148751763");

    // Check for Vimeo-specific attributes
    const allowAttr = iframe?.getAttribute("allow");
    expect(allowAttr).toBeTruthy();
    if (allowAttr) {
      expect(allowAttr).toContain("autoplay");
    }

    expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
  });

  it("respects allowfullscreen attribute", async () => {
    const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    // Test with allowfullscreen set to false
    const el = document.createElement("o-embed") as OEmbedElement;
    el.url = youtubeUrl;
    el.allowfullscreen = false;
    document.body.appendChild(el);

    // Wait for component to render using Lit's updateComplete
    await el.updateComplete;

    // Verify the allowfullscreen attribute is not set
    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.hasAttribute("allowfullscreen")).toBe(false);

    // Now toggle to true
    el.allowfullscreen = true;

    // Wait for component to update using Lit's updateComplete
    await el.updateComplete;

    // Verify the allowfullscreen attribute is now set
    const updatedIframe = el.shadowRoot?.querySelector("iframe");
    expect(updatedIframe?.hasAttribute("allowfullscreen")).toBe(true);

    document.body.removeChild(el);
  });

  // New tests for Spotify
  describe("Spotify embedding", () => {
    it("renders Spotify track embed", async () => {
      const spotifyTrackUrl =
        "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      const el = await fixture(
        html`<o-embed url=${spotifyTrackUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains spotify embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("open.spotify.com/embed/track/");
      expect(src).toContain("4cOdK2wGLETKBW3PvgPWqT");

      // Check iframe attributes
      expect(iframe?.getAttribute("allowtransparency")).toBe("true");
    });

    it("renders Spotify album embed", async () => {
      const spotifyAlbumUrl =
        "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      const el = await fixture(
        html`<o-embed url=${spotifyAlbumUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains spotify embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("open.spotify.com/embed/album/");
      expect(src).toContain("1DFixLWuPkv3KT3TnV35m3");
    });

    it("renders Spotify playlist embed", async () => {
      const spotifyPlaylistUrl =
        "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
      const el = await fixture(
        html`<o-embed url=${spotifyPlaylistUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains spotify embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("open.spotify.com/embed/playlist/");
      expect(src).toContain("37i9dQZF1DXcBWIGoYBM5M");
    });

    it("applies spotify-size attribute", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      el.setAttribute("spotify-size", "large");
      document.body.appendChild(el);

      await el.updateComplete;

      // Check that large size results in 352px height for tracks
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("height")).toBe("352");

      document.body.removeChild(el);
    });

    it("applies spotify-theme attribute", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("spotify-theme", "dark");
      document.body.appendChild(el);

      await el.updateComplete;

      // Check that theme=0 is in the URL
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("theme=0");

      document.body.removeChild(el);
    });

    it("applies spotify-view attribute", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("spotify-view", "coverart");
      document.body.appendChild(el);

      await el.updateComplete;

      // Check that view=coverart is in the URL
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("view=coverart");

      document.body.removeChild(el);
    });

    it("applies spotify-start attribute for podcasts", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/episode/4cOdK2wGLETKBW3PvgPWqT";
      el.setAttribute("spotify-start", "120");
      document.body.appendChild(el);

      await el.updateComplete;

      // Check that t=120 is in the URL
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("t=120");

      document.body.removeChild(el);
    });

    it("ignores spotify attributes for non-Spotify URLs", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      el.setAttribute("spotify-theme", "dark");
      el.setAttribute("spotify-size", "large");
      document.body.appendChild(el);

      await el.updateComplete;

      // Spotify params should not appear in YouTube URL
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).not.toContain("theme=");
      expect(iframe?.getAttribute("src")).toContain("youtube-nocookie.com");

      document.body.removeChild(el);
    });

    it("applies provider-options escape hatch", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("provider-options", '{"theme": "light"}');
      document.body.appendChild(el);

      await el.updateComplete;

      // Check that theme=1 (light) is in the URL
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain("theme=1");

      document.body.removeChild(el);
    });

    it("combines multiple spotify attributes", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("spotify-theme", "dark");
      el.setAttribute("spotify-view", "coverart");
      el.setAttribute("spotify-size", "compact");
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      const src = iframe?.getAttribute("src");
      expect(src).toContain("theme=0");
      expect(src).toContain("view=coverart");
      // Compact coverart height is 80px
      expect(iframe?.getAttribute("height")).toBe("80");

      document.body.removeChild(el);
    });

    // Tests for computed CSS height (visual height)
    it("applies correct computed CSS height for spotify-size compact", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      el.setAttribute("spotify-size", "compact");
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("80px");

      document.body.removeChild(el);
    });

    it("applies correct computed CSS height for spotify-size large", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("spotify-size", "large");
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("500px");

      document.body.removeChild(el);
    });

    it("applies correct computed CSS height for spotify-view coverart", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      el.setAttribute("spotify-view", "coverart");
      document.body.appendChild(el);

      await el.updateComplete;

      // coverart default size is "normal" → 152px
      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("152px");

      document.body.removeChild(el);
    });

    it("applies legacy height attribute for Spotify", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
      el.setAttribute("height", "152");
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      // Both the attribute and computed CSS should be 152px
      expect(iframe.getAttribute("height")).toBe("152");
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("152px");

      document.body.removeChild(el);
    });

    it("auto-detects compact size for tracks", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      // No spotify-size set - should auto-detect compact for tracks
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      // Tracks default to compact (80px)
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("80px");

      document.body.removeChild(el);
    });

    it("auto-detects normal size for albums", async () => {
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3";
      // No spotify-size set - should auto-detect normal for albums
      document.body.appendChild(el);

      await el.updateComplete;

      const iframe = el.shadowRoot?.querySelector("iframe");
      if (!iframe) throw new Error("iframe not found");
      // Albums default to normal (352px)
      const computed = window.getComputedStyle(iframe);
      expect(computed.height).toBe("352px");

      document.body.removeChild(el);
    });
  });

  // Tests for DailyMotion
  describe("DailyMotion embedding", () => {
    it("renders DailyMotion embed for DailyMotion URL", async () => {
      const dailyMotionUrl = "https://www.dailymotion.com/video/x8a2ke3";
      const el = await fixture(html`<o-embed url=${dailyMotionUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains new geo.dailymotion.com endpoint
      const src = iframe?.getAttribute("src");
      expect(src).toContain("geo.dailymotion.com/player.html");
      expect(src).toContain("video=x8a2ke3");

      // Check iframe attributes
      expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
    });
  });

  // Tests for EdPuzzle
  describe("EdPuzzle embedding", () => {
    it("renders EdPuzzle embed for EdPuzzle URL", async () => {
      const edPuzzleUrl = "https://edpuzzle.com/media/60eebed0d6188041831a94d0";
      const el = await fixture(html`<o-embed url=${edPuzzleUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains edpuzzle embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("edpuzzle.com/embed/media/");
      expect(src).toContain("60eebed0d6188041831a94d0");
    });
  });

  // Tests for Wistia
  describe("Wistia embedding", () => {
    it("renders Wistia embed for Wistia URL", async () => {
      const wistiaUrl = "https://support.wistia.com/medias/e4a27b971d";
      const el = await fixture(html`<o-embed url=${wistiaUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains wistia embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("fast.wistia.net/embed/iframe/");
      expect(src).toContain("e4a27b971d");

      // Check iframe attributes
      expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
    });
  });

  // Tests for Loom
  describe("Loom embedding", () => {
    it("renders Loom embed for Loom URL", async () => {
      const loomUrl =
        "https://www.loom.com/share/3f0b152c0c324dc7bc0f965b0fd2f6d0";
      const el = await fixture(html`<o-embed url=${loomUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains loom embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("loom.com/embed/");
      expect(src).toContain("3f0b152c0c324dc7bc0f965b0fd2f6d0");

      // Check iframe attributes
      expect(iframe?.hasAttribute("allowfullscreen")).toBe(true);
    });
  });

  // Tests for dynamic behavior
  describe("Dynamic behavior", () => {
    it("updates embed when URL changes from one provider to another", async () => {
      // Start with YouTube
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeUrl;
      document.body.appendChild(el);

      // Wait for YouTube embed to render (privacy mode enabled, so youtube-nocookie.com)
      await expectShadowDomEventually(el, (shadow) => {
        const iframe = shadow.querySelector("iframe");
        return (
          iframe
            ?.getAttribute("src")
            ?.includes("youtube-nocookie.com/embed/") || false
        );
      });

      let iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain(
        "youtube-nocookie.com/embed/dQw4w9WgXcQ",
      );

      // Now change to Vimeo
      const vimeoUrl = "https://vimeo.com/148751763";
      el.url = vimeoUrl;

      // Wait for Vimeo embed to render
      await expectShadowDomEventually(el, (shadow) => {
        const iframe = shadow.querySelector("iframe");
        return (
          iframe?.getAttribute("src")?.includes("player.vimeo.com/video/") ||
          false
        );
      });

      // Verify iframe src has changed to Vimeo
      iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain(
        "player.vimeo.com/video/148751763",
      );

      document.body.removeChild(el);
    });

    it("updates embed when width and height change", async () => {
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeUrl;
      el.width = "560";
      el.height = "315";
      document.body.appendChild(el);

      // Wait for YouTube embed to render
      await expectShadowDomEventually(el, (shadow) => {
        const iframe = shadow.querySelector("iframe");
        return iframe !== null;
      });

      // Check initial dimensions
      let iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("width")).toBe("560");
      expect(iframe?.getAttribute("height")).toBe("315");

      // Change dimensions
      el.width = "640";
      el.height = "480";

      // Wait for iframe to update
      await expectShadowDomEventually(el, (shadow) => {
        const iframe = shadow.querySelector("iframe");
        return (
          iframe?.getAttribute("width") === "640" &&
          iframe?.getAttribute("height") === "480"
        );
      });

      // Verify dimensions have changed
      iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("width")).toBe("640");
      expect(iframe?.getAttribute("height")).toBe("480");

      document.body.removeChild(el);
    });
  });

  // Tests for CSS custom properties
  describe("CSS and styling", () => {
    it("applies CSS custom properties for iframe dimensions", async () => {
      // Create wrapper with custom CSS properties
      const wrapper = document.createElement("div");
      wrapper.style.setProperty("--social-embed-iframe-width", "400px");
      wrapper.style.setProperty("--social-embed-iframe-height", "300px");
      document.body.appendChild(wrapper);

      // Create the o-embed element inside the wrapper
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeUrl;
      wrapper.appendChild(el);

      // Wait for component to render
      await expectShadowDomEventually(el, (shadow) => {
        return shadow.querySelector("iframe") !== null;
      });

      // Get computed style of the iframe
      const iframe = el.shadowRoot?.querySelector("iframe");
      if (iframe) {
        const computedStyle = window.getComputedStyle(iframe);
        expect(computedStyle.width).toBe("400px");
        expect(computedStyle.height).toBe("300px");
      }

      // Clean up
      document.body.removeChild(wrapper);
    });

    it("handles percentage-based dimensions", async () => {
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeUrl;
      el.width = "100%";
      el.height = "100%";
      document.body.appendChild(el);

      // Wait for component to render
      await expectShadowDomEventually(el, (shadow) => {
        return shadow.querySelector("iframe") !== null;
      });

      // Check that percentage values are applied correctly
      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("width")).toBe("100%");
      expect(iframe?.getAttribute("height")).toBe("100%");

      document.body.removeChild(el);
    });
  });

  // Edge case tests
  describe("Edge cases", () => {
    it("handles YouTube URL with query parameters", async () => {
      const youtubeUrlWithParams =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=60s&feature=youtu.be";
      const el = await fixture(
        html`<o-embed url=${youtubeUrlWithParams}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted despite the query parameters
      // Privacy mode uses youtube-nocookie.com by default
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    });

    it("handles YouTube URL with fragment", async () => {
      const youtubeUrlWithFragment =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ#t=60s";
      const el = await fixture(
        html`<o-embed url=${youtubeUrlWithFragment}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted despite the fragment
      // Privacy mode uses youtube-nocookie.com by default
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    });

    it("handles YouTube shortened URL format", async () => {
      const youtubeShortUrl = "https://youtu.be/dQw4w9WgXcQ";
      const el = await fixture(
        html`<o-embed url=${youtubeShortUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted from the short URL
      // Privacy mode uses youtube-nocookie.com by default
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    });

    it("handles YouTube Shorts URL and uses portrait dimensions", async () => {
      const youtubeShortsUrl = "https://www.youtube.com/shorts/eWasNsSa42s";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeShortsUrl;
      document.body.appendChild(el);

      // Wait for component to render
      await expectShadowDomEventually(el, (shadow) => {
        return shadow.querySelector("iframe") !== null;
      });

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted (privacy mode uses -nocookie domain)
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube-nocookie.com/embed/eWasNsSa42s");

      // Shorts should use portrait dimensions (347x616)
      expect(iframe?.getAttribute("width")).toBe("347");
      expect(iframe?.getAttribute("height")).toBe("616");

      document.body.removeChild(el);
    });

    it("uses default landscape dimensions for regular YouTube videos", async () => {
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const el = await fixture(html`<o-embed url=${youtubeUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Regular YouTube should use landscape dimensions (560x315)
      expect(iframe?.getAttribute("width")).toBe("560");
      expect(iframe?.getAttribute("height")).toBe("315");
    });

    it("respects user-specified dimensions for Shorts URL", async () => {
      const youtubeShortsUrl = "https://www.youtube.com/shorts/eWasNsSa42s";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeShortsUrl;
      el.setAttribute("width", "400");
      el.setAttribute("height", "700");
      document.body.appendChild(el);

      // Wait for component to render
      await expectShadowDomEventually(el, (shadow) => {
        return shadow.querySelector("iframe") !== null;
      });

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // User-specified dimensions should be used even for Shorts
      expect(iframe?.getAttribute("width")).toBe("400");
      expect(iframe?.getAttribute("height")).toBe("700");

      document.body.removeChild(el);
    });

    it("respects explicitly-set default dimensions for Shorts URL", async () => {
      // Edge case: user explicitly sets 560x315 (the default) on a Shorts URL
      // Their explicit choice should be respected, not overridden with Shorts dimensions
      const youtubeShortsUrl = "https://www.youtube.com/shorts/eWasNsSa42s";
      const el = document.createElement("o-embed") as OEmbedElement;
      el.url = youtubeShortsUrl;
      el.setAttribute("width", "560");
      el.setAttribute("height", "315");
      document.body.appendChild(el);

      // Wait for component to render
      await expectShadowDomEventually(el, (shadow) => {
        return shadow.querySelector("iframe") !== null;
      });

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // User explicitly set 560x315, so those should be used even for Shorts
      expect(iframe?.getAttribute("width")).toBe("560");
      expect(iframe?.getAttribute("height")).toBe("315");

      document.body.removeChild(el);
    });

    it("handles Shorts URL with query parameters", async () => {
      const youtubeShortsUrl =
        "https://www.youtube.com/shorts/eWasNsSa42s?feature=share";
      const el = await fixture(
        html`<o-embed url=${youtubeShortsUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted despite query params (privacy mode uses -nocookie)
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube-nocookie.com/embed/eWasNsSa42s");

      // Should still use Shorts dimensions
      expect(iframe?.getAttribute("width")).toBe("347");
      expect(iframe?.getAttribute("height")).toBe("616");
    });

    it("uses Shorts dimensions in CSS fallback for Shorts URLs", async () => {
      const youtubeShortsUrl = "https://www.youtube.com/shorts/eWasNsSa42s";
      const el = await fixture(
        html`<o-embed url=${youtubeShortsUrl}></o-embed>`,
      );

      // Check the style tag in shadow DOM has correct CSS fallbacks
      const styleTag = el.shadowRoot?.querySelector("style");
      expect(styleTag?.textContent).toContain("347px");
      expect(styleTag?.textContent).toContain("616px");
      // Should NOT have the default landscape dimensions
      expect(styleTag?.textContent).not.toContain("560px");
      expect(styleTag?.textContent).not.toContain("315px");
    });

    it("gracefully handles undefined URL", async () => {
      // Test with empty string instead of undefined
      const el = await fixture(html`<o-embed url=""></o-embed>`);

      // The component should render an empty shadow DOM when URL is empty
      expect(el.shadowRoot).toBeTruthy();

      // Check that the shadow DOM is effectively empty (no slot or iframe)
      const slot = el.shadowRoot?.querySelector("slot");
      expect(slot).toBeNull();

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeNull();
    });
  });
});
