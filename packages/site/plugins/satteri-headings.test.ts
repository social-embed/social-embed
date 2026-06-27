// @vitest-environment node

import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { beforeAll, describe, expect, it } from "vitest";
import { satteriHeadingAnchors } from "./satteri-heading-anchors";
import { satteriSkipFirstHeading } from "./satteri-skip-first-heading";

// Drive the real Sätteri processor with our two hast plugins, in the same
// order astro.config.ts wires them, so the built-in heading-ids plugin runs
// last (reusing the ids we set and collecting the table of contents).
let processor: Awaited<ReturnType<typeof createSatteriMarkdownProcessor>>;

beforeAll(async () => {
  processor = await createSatteriMarkdownProcessor({
    hastPlugins: [satteriSkipFirstHeading, satteriHeadingAnchors],
  });
});

const render = (content: string, frontmatter: Record<string, unknown> = {}) =>
  processor.render(content, { frontmatter });

describe("satteriSkipFirstHeading", () => {
  it("drops the first h1 when skipMarkdownTitle is true", async () => {
    const { code, metadata } = await render("# Title\n\n## Section\n", {
      skipMarkdownTitle: true,
    });
    expect(code).not.toContain("Title");
    expect(code).toContain("Section");
    // The dropped title leaves no table-of-contents entry.
    expect(metadata.headings.map((h) => h.slug)).toEqual(["section"]);
  });

  it("keeps the first h1 by default", async () => {
    const { code } = await render("# Title\n\n## Section\n");
    expect(code).toContain("Title");
  });
});

describe("satteriHeadingAnchors", () => {
  it("sets a github-slugger id and appends a hover anchor", async () => {
    const { code, metadata } = await render("## Hello World!\n");
    expect(code).toContain('id="hello-world"');
    expect(code).toContain('<a class="anchor-link" href="#hello-world">');
    expect(code).toContain('class="anchor-icon"');
    // The anchor's `#` is CSS-only, so the ToC label stays clean.
    expect(metadata.headings).toEqual([
      { depth: 2, slug: "hello-world", text: "Hello World!" },
    ]);
  });

  it("de-duplicates repeated heading slugs", async () => {
    const { code } = await render("## Dup\n\n## Dup\n");
    expect(code).toContain('id="dup"');
    expect(code).toContain('id="dup-1"');
  });
});
