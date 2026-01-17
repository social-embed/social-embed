import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { VFile } from "vfile";
import { describe, expect, it } from "vitest";

import { rehypeSkipFirstHeading } from "./rehype-skip-first-heading";

// Helper to create a processor with frontmatter simulation
function createProcessor(frontmatter: Record<string, unknown> = {}) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(() => {
      // Simulate Astro's frontmatter injection into VFile
      return (_tree, file: VFile) => {
        file.data.astro = { frontmatter };
      };
    })
    .use(rehypeSkipFirstHeading)
    .use(rehypeStringify);
}

describe("rehypeSkipFirstHeading", () => {
  describe("when skipMarkdownTitle is true", () => {
    it("removes the first h1 from content", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "# Main Title\n\nSome paragraph text.\n\n## Section";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<p>Some paragraph text.</p>
        <h2>Section</h2>"
      `);
    });

    it("only removes the FIRST h1, preserves subsequent h1s", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "# First Title\n\n# Second Title\n\n# Third Title";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<h1>Second Title</h1>
        <h1>Third Title</h1>"
      `);
    });

    it("preserves all other heading levels", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "# Title\n\n## H2\n\n### H3\n\n#### H4";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<h2>H2</h2>
        <h3>H3</h3>
        <h4>H4</h4>"
      `);
    });

    it("handles content with no h1 (no-op)", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "## Just an H2\n\nParagraph.";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<h2>Just an H2</h2>
        <p>Paragraph.</p>"
      `);
    });

    it("handles empty content", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });

      const result = await processor.process("");

      expect(result.toString()).toMatchInlineSnapshot(`""`);
    });
  });

  describe("when skipMarkdownTitle is false", () => {
    it("preserves all headings including h1", async () => {
      const processor = createProcessor({ skipMarkdownTitle: false });
      const markdown = "# Main Title\n\n## Section";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<h1>Main Title</h1>
        <h2>Section</h2>"
      `);
    });
  });

  describe("when skipMarkdownTitle is not set", () => {
    it("preserves all headings (default behavior)", async () => {
      const processor = createProcessor({});
      const markdown = "# Main Title\n\n## Section";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`
        "<h1>Main Title</h1>
        <h2>Section</h2>"
      `);
    });
  });

  describe("when frontmatter is missing entirely", () => {
    it("preserves all headings", async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSkipFirstHeading)
        .use(rehypeStringify);

      const markdown = "# Title";
      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`"<h1>Title</h1>"`);
    });
  });

  describe("edge cases", () => {
    it("handles h1 with inline formatting", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "# **Bold** and *italic* title\n\nContent.";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`"<p>Content.</p>"`);
    });

    it("handles h1 with code spans", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown = "# `<o-embed>` Web Component\n\nContent.";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`"<p>Content.</p>"`);
    });

    it("handles h1 with links", async () => {
      const processor = createProcessor({ skipMarkdownTitle: true });
      const markdown =
        "# Check out [our docs](https://example.com)\n\nContent.";

      const result = await processor.process(markdown);

      expect(result.toString()).toMatchInlineSnapshot(`"<p>Content.</p>"`);
    });
  });
});
