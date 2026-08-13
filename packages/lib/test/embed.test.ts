/**
 * Tests for Embed class rendering methods.
 */

import { describe, expect, it } from "vitest";

import { Embed, type EmbedOutput } from "../src";

// Sample iframe output for testing
const iframeOutput: EmbedOutput = {
  nodes: [
    {
      attributes: {
        allow: "accelerometer; autoplay; clipboard-write",
        height: "315",
        width: "560",
      },
      src: "https://www.youtube-nocookie.com/embed/abc123",
      type: "iframe",
    },
  ],
};

// Sample HTML output for testing
const htmlOutput: EmbedOutput = {
  nodes: [
    {
      content: "<blockquote>Tweet content</blockquote>",
      type: "dangerouslySetHtml",
    },
  ],
};

// Mixed output for testing
const mixedOutput: EmbedOutput = {
  nodes: [
    {
      attributes: { height: "315", width: "560" },
      src: "https://player.vimeo.com/video/123456",
      type: "iframe",
    },
    {
      content: "<div class='caption'>Video caption</div>",
      type: "dangerouslySetHtml",
    },
  ],
};

describe("Embed class", () => {
  describe("constructor", () => {
    it("should store provider name", () => {
      const embed = new Embed("YouTube", { videoId: "abc123" }, iframeOutput);
      expect(embed.provider).toBe("YouTube");
    });

    it("should store parsed data", () => {
      const data = { videoId: "abc123" };
      const embed = new Embed("YouTube", data, iframeOutput);
      expect(embed.data).toEqual(data);
    });

    it("should store nodes from output", () => {
      const embed = new Embed("YouTube", {}, iframeOutput);
      expect(embed.nodes).toHaveLength(1);
      expect(embed.nodes[0].type).toBe("iframe");
    });
  });

  describe("toHtml()", () => {
    it("should render iframe node to HTML string", () => {
      const embed = new Embed("YouTube", { videoId: "abc123" }, iframeOutput);
      const html = embed.toHtml();

      expect(html).toContain("<iframe");
      expect(html).toContain("</iframe>");
      expect(html).toContain(
        'src="https://www.youtube-nocookie.com/embed/abc123"',
      );
      expect(html).toContain('width="560"');
      expect(html).toContain('height="315"');
    });

    it("should render dangerouslySetHtml content directly", () => {
      const embed = new Embed("Twitter", {}, htmlOutput);
      const html = embed.toHtml();

      expect(html).toBe("<blockquote>Tweet content</blockquote>");
    });

    it("should render mixed nodes joined by newlines", () => {
      const embed = new Embed("Vimeo", {}, mixedOutput);
      const html = embed.toHtml();

      expect(html).toContain("<iframe");
      expect(html).toContain("vimeo.com");
      expect(html).toContain("<div class='caption'>Video caption</div>");
      expect(html).toContain("\n");
    });

    it("should return empty string for empty nodes", () => {
      const embed = new Embed("Empty", {}, { nodes: [] });
      expect(embed.toHtml()).toBe("");
    });
  });

  describe("toUrl()", () => {
    it("should return src from first iframe node", () => {
      const embed = new Embed("YouTube", { videoId: "abc123" }, iframeOutput);
      const url = embed.toUrl();

      expect(url).toBe("https://www.youtube-nocookie.com/embed/abc123");
    });

    it("should return undefined for HTML-only embeds", () => {
      const embed = new Embed("Twitter", {}, htmlOutput);
      expect(embed.toUrl()).toBeUndefined();
    });

    it("should return first iframe URL for mixed nodes", () => {
      const embed = new Embed("Vimeo", {}, mixedOutput);
      expect(embed.toUrl()).toBe("https://player.vimeo.com/video/123456");
    });

    it("should return undefined for empty nodes", () => {
      const embed = new Embed("Empty", {}, { nodes: [] });
      expect(embed.toUrl()).toBeUndefined();
    });
  });

  describe("toNodes()", () => {
    it("should return the nodes array", () => {
      const embed = new Embed("YouTube", {}, iframeOutput);
      const nodes = embed.toNodes();

      expect(nodes).toBe(embed.nodes);
      expect(nodes).toHaveLength(1);
    });

    it("should return all nodes for mixed output", () => {
      const embed = new Embed("Vimeo", {}, mixedOutput);
      const nodes = embed.toNodes();

      expect(nodes).toHaveLength(2);
      expect(nodes[0].type).toBe("iframe");
      expect(nodes[1].type).toBe("dangerouslySetHtml");
    });
  });

  describe("toData()", () => {
    it("should return EmbedData structure", () => {
      const embed = new Embed("YouTube", {}, iframeOutput);
      const data = embed.toData();

      expect(data.nodes).toEqual(iframeOutput.nodes);
    });

    it("should include scripts if present", () => {
      const outputWithScripts: EmbedOutput = {
        nodes: htmlOutput.nodes,
        scripts: [{ src: "https://example.com/embed.js" }],
      };
      const embed = new Embed("Twitter", {}, outputWithScripts);
      const data = embed.toData();

      expect(data.scripts).toEqual(outputWithScripts.scripts);
    });
  });
});
