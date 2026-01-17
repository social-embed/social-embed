// @vitest-environment node

import { readFile } from "node:fs/promises";
import { glob } from "glob";
import { describe, expect, it } from "vitest";

describe("MDX files importing markdown", () => {
  it("do not require manual getHeadings re-export (plugin handles it)", async () => {
    const mdxFiles = await glob("src/content/docs/**/*.mdx", {
      absolute: true,
      cwd: process.cwd(),
    });

    const filesWithMarkdownImports: string[] = [];

    for (const filePath of mdxFiles) {
      const content = await readFile(filePath, "utf-8");

      // Check if file imports from a .md file
      const markdownImportMatch = content.match(
        /import\s+(\w+).*from\s+['"]([^'"]+\.md)['"]/,
      );

      if (markdownImportMatch) {
        const relativePath = filePath.replace(`${process.cwd()}/`, "");
        filesWithMarkdownImports.push(relativePath);

        // Verify NO manual re-export (plugin handles this automatically)
        const hasManualExport = /export\s*\{\s*getHeadings\s*\}/.test(content);
        expect(
          hasManualExport,
          `${relativePath} has manual getHeadings re-export which is no longer needed.\n` +
            "  The vite-plugin-mdx-merge-headings plugin handles this automatically.\n" +
            "  Remove: export { getHeadings };",
        ).toBe(false);
      }
    }

    // Sanity check: we should have found at least some MDX files importing markdown
    expect(
      filesWithMarkdownImports.length,
      "Expected to find MDX files importing .md files",
    ).toBeGreaterThan(0);
  });
});
