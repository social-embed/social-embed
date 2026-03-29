// @vitest-environment node
/**
 * Tests that MDX overview pages export getHeadings with appropriate content.
 *
 * Overview pages were rewritten with dedicated content (no longer importing
 * READMEs). These tests verify the pages still export callable getHeadings
 * functions and return headings matching the new content structure.
 */
import { describe, expect, it } from "vitest";

describe("ToC Integration", () => {
  it("/wc/ overview exports getHeadings with overview headings", async () => {
    const wcIndex = await import("../content/docs/wc/00-index.mdx");

    expect(wcIndex.getHeadings).toBeDefined();
    expect(typeof wcIndex.getHeadings).toBe("function");

    const headings = wcIndex.getHeadings();
    expect(headings.length).toBeGreaterThan(0);

    const headingTexts = headings.map(
      (h: { depth: number; slug: string; text: string }) => h.text,
    );
    expect(headingTexts).toContain("Key features");
    expect(headingTexts).toContain("What to read next");
  });

  it("/lib/ overview exports getHeadings with overview headings", async () => {
    const libIndex = await import("../content/docs/lib/00-index.mdx");

    expect(libIndex.getHeadings).toBeDefined();
    expect(typeof libIndex.getHeadings).toBe("function");

    const headings = libIndex.getHeadings();
    expect(headings.length).toBeGreaterThan(0);

    const headingTexts = headings.map(
      (h: { depth: number; slug: string; text: string }) => h.text,
    );
    expect(headingTexts).toContain("Key features");
    expect(headingTexts).toContain("What to read next");
  });
});
