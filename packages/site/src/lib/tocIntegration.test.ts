// @vitest-environment node
/**
 * Tests that MDX overview pages properly export getHeadings from imported markdown.
 *
 * This verifies the runtime behavior of the getHeadings export pattern that
 * mdxMarkdownImports.test.ts checks statically. By directly importing the MDX
 * modules, we confirm that getHeadings is callable and returns actual headings.
 */
import { describe, expect, it } from "vitest";

describe("ToC Integration", () => {
  it("/wc/ overview exports getHeadings with README headings", async () => {
    // Dynamic import to test the actual module export
    const wcIndex = await import("../content/docs/wc/00-index.mdx");

    // Verify getHeadings is exported (the core pattern we're testing)
    expect(wcIndex.getHeadings).toBeDefined();
    expect(typeof wcIndex.getHeadings).toBe("function");

    // Call getHeadings and verify it returns headings from the README
    const headings = wcIndex.getHeadings();
    expect(headings.length).toBeGreaterThan(5);

    // Verify specific headings from wc/README.md
    const headingTexts = headings.map(
      (h: { depth: number; slug: string; text: string }) => h.text,
    );
    expect(headingTexts).toContain("Quick Start");
    expect(headingTexts).toContain("Key Features");
  });

  it("/lib/ overview exports getHeadings with README headings", async () => {
    // Dynamic import to test the actual module export
    const libIndex = await import("../content/docs/lib/00-index.mdx");

    // Verify getHeadings is exported (the core pattern we're testing)
    expect(libIndex.getHeadings).toBeDefined();
    expect(typeof libIndex.getHeadings).toBe("function");

    // Call getHeadings and verify it returns headings from the README
    const headings = libIndex.getHeadings();
    expect(headings.length).toBeGreaterThan(5);

    // Verify specific headings from lib/README.md
    const headingTexts = headings.map(
      (h: { depth: number; slug: string; text: string }) => h.text,
    );
    expect(headingTexts).toContain("Quick Start");
    expect(headingTexts).toContain("Key Features");
  });
});
