/// <reference types="@vitest/browser/providers/playwright" />
import { describe, expect, it } from "vitest";
import { expectShadowDomToEqual, fixture, html } from "./utils";
import "../src/OEmbedElement";

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
});
