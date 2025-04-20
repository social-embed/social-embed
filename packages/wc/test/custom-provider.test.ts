/// <reference types="@vitest/browser/providers/playwright" />
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixture, html } from "./utils";
import "../src/OEmbedElement";
import { type EmbedProvider, getDefaultRegistry } from "@social-embed/lib";
import type { OEmbedElement } from "../src/OEmbedElement";

describe("o-embed with custom provider", () => {
  // Create a custom provider for testing
  const CustomProvider: EmbedProvider = {
    name: "CustomTest",
    canParseUrl(url: string) {
      return /customtest\.example\.com\/video\//.test(url);
    },
    getIdFromUrl(url: string) {
      return url.split("/").pop() || "";
    },
    getEmbedUrlFromId(id: string) {
      return `https://customtest.example.com/embed/${id}`;
    },
    // Add custom dimensions
    defaultDimensions: {
      width: "720",
      height: "480",
    },
    // Add custom iframe attributes
    iframeAttributes: {
      allowtransparency: "true",
      allow: "autoplay; encrypted-media",
    },
  };

  // Store the original providers to restore after tests
  let originalProviders: EmbedProvider[] = [];

  beforeAll(() => {
    // Save the original providers
    originalProviders = getDefaultRegistry().listProviders();

    // Register our custom provider
    getDefaultRegistry().register(CustomProvider);
  });

  afterAll(() => {
    // This is a simplified cleanup - in a real scenario, you might need
    // a more sophisticated approach to restore the original state
    const registry = getDefaultRegistry();

    // Clear and re-register original providers
    // Note: This is a simplification as there's no direct "clear" method
    for (const provider of originalProviders) {
      registry.register(provider);
    }
  });

  it("can register and use custom providers", async () => {
    // Create a simple test element
    const el = await fixture<OEmbedElement>(html`<o-embed></o-embed>`);

    // Verify the element exists
    expect(el).toBeTruthy();
    expect(el.tagName.toLowerCase()).toBe("o-embed");

    // Set the provider directly
    el.provider = CustomProvider;
    await el.updateComplete;
    el.url = "https://customtest.example.com/video/123";
    await el.updateComplete;

    // Verify the provider was set
    expect(el.provider).toStrictEqual(CustomProvider);
    expect(el.provider?.name).toBe("CustomTest");

    // Verify the provider's properties are accessible
    expect(el.provider?.defaultDimensions?.width).toBe("720");
    expect(el.provider?.defaultDimensions?.height).toBe("480");
    expect(el.provider?.iframeAttributes?.allowtransparency).toBe("true");
    expect(el.provider?.iframeAttributes?.allow).toBe(
      "autoplay; encrypted-media",
    );
    // Verify rendering of iframe for custom provider
    const shadow = el.shadowRoot;
    // Debug output
    // eslint-disable-next-line no-console
    console.log('provider:', el.provider);
    // eslint-disable-next-line no-console
    console.log('url:', el.url);
    // eslint-disable-next-line no-console
    console.log('shadowRoot.innerHTML:', shadow?.innerHTML);
    expect(shadow).toBeTruthy();
    const iframe = shadow?.querySelector("iframe");
    expect(iframe).toBeTruthy();
    if (!iframe) throw new Error("iframe not found in shadowRoot");
    expect(iframe.src).toBe("https://customtest.example.com/embed/123");
    expect(iframe.getAttribute("width")).toBe("720");
    expect(iframe.getAttribute("height")).toBe("480");
    expect(iframe.hasAttribute("allowtransparency")).toBe(true);
    expect(iframe.getAttribute("allow")).toBe("autoplay; encrypted-media");
  });
});
