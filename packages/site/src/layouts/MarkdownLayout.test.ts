// @vitest-environment node

import { loadRenderers } from "astro:container";
import { getContainerRenderer } from "@astrojs/react";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

import MarkdownLayout from "./MarkdownLayout.astro";

// Load React renderer for components that use client:load (e.g., SearchModal)
const renderers = await loadRenderers([getContainerRenderer()]);

// Container options with site URL for BaseLayout's canonical link
const CONTAINER_OPTIONS = {
  astroConfig: {
    site: "https://example.com",
  },
  renderers,
};

// Render options with URL context
const RENDER_OPTIONS_BASE = {
  request: new Request("https://example.com/test-page"),
};

describe("MarkdownLayout", () => {
  describe("skipMarkdownTitle", () => {
    it("adds skip-markdown-title class when skipMarkdownTitle is true", async () => {
      const container = await AstroContainer.create(CONTAINER_OPTIONS);
      const result = await container.renderToString(MarkdownLayout, {
        ...RENDER_OPTIONS_BASE,
        props: {
          frontmatter: {
            skipMarkdownTitle: true,
            title: "Test Title",
          },
        },
        slots: {
          default: "<h1>README Title</h1><p>Content</p>",
        },
      });

      // Should have the wrapper class that hides the h1
      expect(result).toContain('class="skip-markdown-title"');
      // Should still have the layout's h1 (Astro adds data-astro-cid-* attributes)
      expect(result).toMatch(/<h1[^>]*>Test Title<\/h1>/);
      // Should have the slotted h1 (CSS hides it, not removed)
      expect(result).toContain("<h1>README Title</h1>");
    });

    it("does NOT add skip-markdown-title class when skipMarkdownTitle is false", async () => {
      const container = await AstroContainer.create(CONTAINER_OPTIONS);
      const result = await container.renderToString(MarkdownLayout, {
        ...RENDER_OPTIONS_BASE,
        props: {
          frontmatter: {
            skipMarkdownTitle: false,
            title: "Test Title",
          },
        },
        slots: {
          default: "<h1>README Title</h1><p>Content</p>",
        },
      });

      // Should NOT have the wrapper class
      expect(result).not.toContain("skip-markdown-title");
    });

    it("does NOT add skip-markdown-title class when skipMarkdownTitle is undefined", async () => {
      const container = await AstroContainer.create(CONTAINER_OPTIONS);
      const result = await container.renderToString(MarkdownLayout, {
        ...RENDER_OPTIONS_BASE,
        props: {
          frontmatter: {
            title: "Test Title",
          },
        },
        slots: {
          default: "<h1>README Title</h1><p>Content</p>",
        },
      });

      // Should NOT have the wrapper class
      expect(result).not.toContain("skip-markdown-title");
    });
  });
});
