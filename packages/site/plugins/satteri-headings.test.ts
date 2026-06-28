// @vitest-environment node

import {
  createSatteriMarkdownProcessor,
  satteriHeadingIdsPlugin,
} from "@astrojs/markdown-satteri";
import { mdxToJs } from "satteri";
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

  it("removes only the first h1, keeps later ones", async () => {
    const { code } = await render("# First\n\n# Second\n", {
      skipMarkdownTitle: true,
    });
    expect(code).not.toContain("First");
    expect(code).toContain("Second");
  });

  it("ignores nested h1s before the first root h1", async () => {
    const { code, metadata } = await render(
      "> # Note\n\n# Title\n\n## Section\n",
      {
        skipMarkdownTitle: true,
      },
    );
    expect(code).toContain("Note");
    expect(code).not.toContain("Title");
    expect(code).toContain("Section");
    expect(metadata.headings.map((h) => h.slug)).toEqual(["note", "section"]);
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

  it("preserves frontmatter-resolved MDX heading slugs", async () => {
    const astro = {
      frontmatter: { title: "The Frontmatter Title" },
      headings: [],
      localImagePaths: new Set<string>(),
      remoteImagePaths: new Set<string>(),
    };

    await mdxToJs("# {frontmatter.title}\n\n## frontmatter.title\n", {
      data: { astro },
      hastPlugins: [satteriHeadingAnchors, satteriHeadingIdsPlugin()],
      jsxImportSource: "astro",
    });

    expect(astro.headings.map(({ slug, text }) => ({ slug, text }))).toEqual([
      { slug: "the-frontmatter-title", text: "The Frontmatter Title" },
      { slug: "frontmattertitle", text: "frontmatter.title" },
    ]);
  });
});
