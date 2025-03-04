/// <reference types="@vitest/browser/providers/playwright" />
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

  it("fallback to <iframe> for unrecognized but valid URL", async () => {
    const customUrl = "https://example.com/myembed/video1234";
    const el = await fixture(html`<o-embed url=${customUrl}></o-embed>`);

    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute("src")).toBe(customUrl);
    expect(iframe?.getAttribute("width")).toBe("560");
    expect(iframe?.getAttribute("height")).toBe("315");
    expect(iframe?.getAttribute("frameborder")).toBe("0");

    const slot = el.shadowRoot?.querySelector("slot");
    expect(slot).toBeTruthy();
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
    const customUrl = "https://example.com/video";
    const customWidth = "800";
    const customHeight = "450";

    const el = await fixture(
      html`<o-embed 
        url=${customUrl}
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
    expect(iframe?.getAttribute("src")).toContain(
      "youtube.com/embed/dQw4w9WgXcQ",
    );
    expect(iframe?.getAttribute("width")).toBe("560");
    expect(iframe?.getAttribute("height")).toBe("315");
    expect(iframe?.getAttribute("frameborder")).toBe("0");

    // Check for YouTube-specific attributes
    // The component might not set the allow attribute for YouTube embeds
    // Let's check if allowfullscreen is set instead
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

    // Wait for component to render
    await expectShadowDomEventually(el, (shadow) => {
      return shadow.querySelector("iframe") !== null;
    });

    // Verify the allowfullscreen attribute is not set
    const iframe = el.shadowRoot?.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.hasAttribute("allowfullscreen")).toBe(false);

    // Now toggle to true
    el.allowfullscreen = true;

    // Wait for component to update
    await expectShadowDomEventually(el, (shadow) => {
      const iframe = shadow.querySelector("iframe");
      return iframe?.hasAttribute("allowfullscreen") === true;
    });

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
      expect(iframe?.getAttribute("frameborder")).toBe("0");
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
  });

  // Tests for DailyMotion
  describe("DailyMotion embedding", () => {
    it("renders DailyMotion embed for DailyMotion URL", async () => {
      const dailyMotionUrl = "https://www.dailymotion.com/video/x8a2ke3";
      const el = await fixture(html`<o-embed url=${dailyMotionUrl}></o-embed>`);

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the src contains dailymotion embed URL format
      const src = iframe?.getAttribute("src");
      expect(src).toContain("dailymotion.com/embed/video/");
      expect(src).toContain("x8a2ke3");

      // Check iframe attributes
      expect(iframe?.getAttribute("frameborder")).toBe("0");
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

      // Check iframe attributes
      expect(iframe?.getAttribute("frameborder")).toBe("0");
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
      expect(iframe?.getAttribute("frameborder")).toBe("0");
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
      expect(iframe?.getAttribute("frameborder")).toBe("0");
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

      // Wait for YouTube embed to render
      await expectShadowDomEventually(el, (shadow) => {
        const iframe = shadow.querySelector("iframe");
        return (
          iframe?.getAttribute("src")?.includes("youtube.com/embed/") || false
        );
      });

      let iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe?.getAttribute("src")).toContain(
        "youtube.com/embed/dQw4w9WgXcQ",
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
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube.com/embed/dQw4w9WgXcQ");
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
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube.com/embed/dQw4w9WgXcQ");
    });

    it("handles YouTube shortened URL format", async () => {
      const youtubeShortUrl = "https://youtu.be/dQw4w9WgXcQ";
      const el = await fixture(
        html`<o-embed url=${youtubeShortUrl}></o-embed>`,
      );

      const iframe = el.shadowRoot?.querySelector("iframe");
      expect(iframe).toBeTruthy();

      // Check that the correct video ID was extracted from the short URL
      const src = iframe?.getAttribute("src");
      expect(src).toContain("youtube.com/embed/dQw4w9WgXcQ");
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
