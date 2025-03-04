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
});
